import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  query, 
  where 
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { PayDueRecord, UserProfile } from '../types';
import { MOCK_PAY_DUES } from '../data/mockData';

const PAY_DUES_KEY = 'aurelle_pay_dues';

export const payDueService = {
  getAll(): PayDueRecord[] {
    const data = localStorage.getItem(PAY_DUES_KEY);
    if (data) {
      try {
        return JSON.parse(data);
      } catch (e) {
        console.error('Error reading pay dues', e);
      }
    }
    localStorage.setItem(PAY_DUES_KEY, JSON.stringify(MOCK_PAY_DUES));
    return MOCK_PAY_DUES;
  },

  findByQuery(query: string): PayDueRecord | undefined {
    if (!query || typeof query !== 'string') return undefined;
    const cleaned = query.trim().toLowerCase();
    if (!cleaned) return undefined;

    const queryDigits = cleaned.replace(/\D/g, '');
    const records = payDueService.getAll();

    return records.find((r) => {
      const bill = r.billNumber.toLowerCase();
      if (bill === cleaned || bill.includes(cleaned)) return true;
      if (r.id.toLowerCase() === cleaned) return true;
      if (r.orderSummary && r.orderSummary.toLowerCase().includes(cleaned)) return true;
      const recordDigits = r.customerPhone.replace(/\D/g, '');
      if (queryDigits.length >= 4 && (recordDigits.endsWith(queryDigits) || queryDigits.endsWith(recordDigits))) {
        return true;
      }
      return false;
    });
  },

  /**
   * Sync from Firestore
   */
  async fetchFromFirestore(): Promise<PayDueRecord[]> {
    if (isFirebaseConfigured && db) {
      try {
        const snap = await getDocs(collection(db, 'pay_dues'));
        if (!snap.empty) {
          const remoteDues: PayDueRecord[] = [];
          snap.forEach((d) => remoteDues.push({ id: d.id, ...(d.data() as any) }));
          localStorage.setItem(PAY_DUES_KEY, JSON.stringify(remoteDues));
          return remoteDues;
        }
      } catch (e) {
        console.warn('Could not read pay_dues from Firestore:', e);
      }
    }
    return payDueService.getAll();
  },

  /**
   * Securely verify and fetch a single record.
   * Requires invoice reference AND matching contact verification (phone/email)
   * unless requested by an authorized administrator.
   */
  async verifyRecord(
    invoiceRef: string, 
    contactVerification?: string, 
    currentUser?: UserProfile | null, 
    isAdmin = false
  ): Promise<{ success: boolean; record?: PayDueRecord; error?: string }> {
    if (!invoiceRef || !invoiceRef.trim()) {
      return { success: false, error: 'Please enter a valid Invoice ID or Order Reference.' };
    }

    const cleanedInvoice = invoiceRef.trim().toLowerCase();
    const records = payDueService.getAll();

    // Find record by bill number or id
    const found = records.find((r) => 
      r.billNumber.toLowerCase() === cleanedInvoice || 
      r.id.toLowerCase() === cleanedInvoice ||
      r.billNumber.toLowerCase().includes(cleanedInvoice)
    );

    if (!found) {
      return {
        success: false,
        error: `No purchase record found for reference "${invoiceRef}". Please verify the invoice number on your physical bill or patron card.`,
      };
    }

    // Admins have permission to inspect any record
    if (isAdmin) {
      return { success: true, record: found };
    }

    // Customer privacy enforcement: Verify that the person inquiring owns this record
    const userPhone = currentUser?.phone?.replace(/\D/g, '') || '';
    const userEmail = currentUser?.email?.toLowerCase().trim() || '';
    const contactInput = (contactVerification || '').replace(/\D/g, '');
    const contactInputEmail = (contactVerification || '').toLowerCase().trim();

    const recordPhone = found.customerPhone.replace(/\D/g, '');
    const recordEmail = found.customerEmail.toLowerCase().trim();

    const matchesContact = 
      (contactInput && (recordPhone.endsWith(contactInput) || contactInput.endsWith(recordPhone))) ||
      (contactInputEmail && contactInputEmail === recordEmail) ||
      (userPhone && recordPhone.endsWith(userPhone)) ||
      (userEmail && recordEmail === userEmail);

    if (!matchesContact) {
      return {
        success: false,
        error: 'Privacy Security Verification: To protect customer financial records, please enter the registered mobile number or email associated with this invoice.',
      };
    }

    return { success: true, record: found };
  },

  /**
   * Record a payment against an invoice
   */
  async recordPayment(
    recordId: string, 
    amount: number, 
    paymentMode: string, 
    isGatewayConfigured = false
  ): Promise<PayDueRecord> {
    const records = payDueService.getAll();
    const target = records.find((r) => r.id === recordId);
    if (!target) throw new Error('Invoice record not found');

    if (amount <= 0 || amount > target.balanceDue) {
      throw new Error(`Invalid amount. Amount must be between ₹1 and ₹${target.balanceDue}`);
    }

    const newAmountPaid = target.amountPaid + amount;
    const newBalance = Math.max(0, target.totalAmount - newAmountPaid);
    const newStatus = newBalance === 0 ? 'PAID' : 'PARTIALLY_PAID';

    const newPaymentReceipt = {
      id: 'pay-' + Date.now(),
      amount,
      date: new Date().toISOString().split('T')[0],
      paymentMode: isGatewayConfigured 
        ? `${paymentMode} (Gateway Verified)` 
        : `${paymentMode} (Sandbox/Demo Registration - Pending Merchant Clearing)`,
      receiptNumber: `AUR-RCP-${Math.floor(100000 + Math.random() * 900000)}`,
    };

    target.amountPaid = newAmountPaid;
    target.balanceDue = newBalance;
    target.status = newStatus;
    target.paymentsHistory = [newPaymentReceipt, ...target.paymentsHistory];

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'pay_dues', target.id), target, { merge: true });
      } catch (e) {
        console.warn('Could not sync payment to Firestore:', e);
      }
    }

    localStorage.setItem(PAY_DUES_KEY, JSON.stringify(records));
    return target;
  },

  /**
   * Admin creates a new Pay Due record
   */
  async createRecord(newRecord: Omit<PayDueRecord, 'id' | 'paymentsHistory'>): Promise<PayDueRecord> {
    const records = payDueService.getAll();
    const created: PayDueRecord = {
      ...newRecord,
      id: 'pd-' + Date.now(),
      paymentsHistory: [],
    };

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'pay_dues', created.id), created);
      } catch (e) {
        console.warn('Could not save new pay_due to Firestore:', e);
      }
    }

    records.unshift(created);
    localStorage.setItem(PAY_DUES_KEY, JSON.stringify(records));
    return created;
  },
};
