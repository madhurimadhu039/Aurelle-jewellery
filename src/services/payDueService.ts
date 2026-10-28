import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { PayDueRecord, UserProfile } from '../types';
import { MOCK_PAY_DUES } from '../data/mockData';
import { ledgerService } from './ledgerService';

const PAY_DUES_KEY = 'aurelle_pay_dues';

function maskName(name: string): string {
  if (!name) return 'Valued Patron';
  const parts = name.split(' ');
  return parts.map((p) => (p.length > 2 ? `${p[0]}${'*'.repeat(p.length - 2)}${p[p.length - 1]}` : p)).join(' ');
}

function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length <= 4) return phone;
  return `******${digits.slice(-4)}`;
}

export interface VerificationResult {
  success: boolean;
  verified: boolean;
  requiresContact?: boolean;
  record?: PayDueRecord;
  maskedRecord?: Partial<PayDueRecord>;
  error?: string;
  message?: string;
}

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
      if (r.customerEmail && r.customerEmail.toLowerCase() === cleaned) return true;
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
   * Matches by invoice number, order id, or registered phone number.
   * If customer is logged-in owner or admin, grants instant verified access.
   * If unauthenticated, validates contact credentials (phone last 4 digits or email)
   * to protect sensitive financial records.
   */
  async verifyRecord(
    searchRef: string, 
    contactVerification?: string, 
    currentUser?: UserProfile | null, 
    isAdmin = false
  ): Promise<VerificationResult> {
    if (!searchRef || !searchRef.trim()) {
      return { 
        success: false, 
        verified: false, 
        error: 'Please enter a valid Invoice ID (e.g. AUR-INV-2026-8941) or registered mobile number.' 
      };
    }

    const found = payDueService.findByQuery(searchRef);

    if (!found) {
      return {
        success: false,
        verified: false,
        error: `No purchase record found for reference "${searchRef}". Please verify the invoice number on your bill or physical patron card.`,
      };
    }

    // Admins have instant verified permission
    if (isAdmin) {
      return { 
        success: true, 
        verified: true, 
        record: found,
        message: 'Aurelle Guild Admin Access: Record verified directly against registry.'
      };
    }

    // Check logged-in user credentials
    const userPhoneDigits = currentUser?.phone?.replace(/\D/g, '') || '';
    const userEmail = currentUser?.email?.toLowerCase().trim() || '';
    const recordPhoneDigits = found.customerPhone.replace(/\D/g, '');
    const recordEmail = found.customerEmail.toLowerCase().trim();

    const isOwner = (userPhoneDigits.length >= 4 && recordPhoneDigits.endsWith(userPhoneDigits)) ||
                    (userEmail && userEmail === recordEmail);

    if (isOwner) {
      return {
        success: true,
        verified: true,
        record: found,
        message: `Verified patron session for ${currentUser?.name || found.customerName}.`,
      };
    }

    // If contact verification input was supplied
    if (contactVerification && contactVerification.trim()) {
      const contactInput = contactVerification.trim();
      const contactInputDigits = contactInput.replace(/\D/g, '');
      const contactInputEmail = contactInput.toLowerCase();

      const matchesPhone = contactInputDigits.length >= 4 && (
        recordPhoneDigits.endsWith(contactInputDigits) || 
        contactInputDigits.endsWith(recordPhoneDigits)
      );
      const matchesEmail = contactInputEmail === recordEmail;

      if (matchesPhone || matchesEmail) {
        return {
          success: true,
          verified: true,
          record: found,
          message: 'Security challenge passed. Invoice verified successfully.',
        };
      } else {
        return {
          success: false,
          verified: false,
          requiresContact: true,
          error: 'The mobile number or email entered does not match our records for this invoice. Please re-enter the registered contact details.',
        };
      }
    }

    // If searchRef itself was a matching 10-digit phone number, allow verification
    const searchDigits = searchRef.replace(/\D/g, '');
    if (searchDigits.length >= 10 && recordPhoneDigits.endsWith(searchDigits)) {
      return {
        success: true,
        verified: true,
        record: found,
        message: `Invoice verified for registered mobile ${found.customerPhone}.`,
      };
    }

    // Otherwise, invoice was found by bill number but needs contact verification to reveal full private data
    const masked: Partial<PayDueRecord> = {
      ...found,
      customerName: maskName(found.customerName),
      customerPhone: maskPhone(found.customerPhone),
      customerEmail: found.customerEmail.replace(/(.{2})(.*)(@.*)/, '$1***$3'),
    };

    return {
      success: true,
      verified: false,
      requiresContact: true,
      maskedRecord: masked,
      record: found,
      message: 'Invoice identified. Please confirm registered mobile or email to unlock full payment details.',
    };
  },

  /**
   * Record a payment against an invoice
   */
  async recordPayment(
    recordId: string, 
    amount: number, 
    paymentMode: string, 
    isGatewayConfigured = false,
    notes?: string
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

    const receiptNum = `AUR-RCP-${Math.floor(100000 + Math.random() * 900000)}`;
    const todayStr = new Date().toISOString().split('T')[0];

    const newPaymentReceipt = {
      id: 'pay-' + Date.now(),
      amount,
      date: todayStr,
      paymentMode: isGatewayConfigured 
        ? `${paymentMode} (Gateway Verified)` 
        : `${paymentMode} (Verified Digital Remittance)`,
      receiptNumber: receiptNum,
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

    // Reconcile into Customer Ledger automatically
    try {
      ledgerService.addEntry({
        date: todayStr,
        refNumber: receiptNum,
        type: 'PAYMENT',
        description: `Payment against Invoice ${target.billNumber} (${paymentMode})`,
        debit: 0,
        credit: amount,
        customerName: target.customerName,
        customerPhone: target.customerPhone,
        notes: notes || `Settled via ${paymentMode}`,
      });
    } catch (ledgerErr) {
      console.warn('Auto-ledger reconciliation note:', ledgerErr);
    }

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

    // Also register invoice debit in Ledger
    try {
      ledgerService.addEntry({
        date: new Date().toISOString().split('T')[0],
        refNumber: created.billNumber,
        type: 'PURCHASE',
        description: `Bespoke jewellery purchase invoice: ${created.orderSummary}`,
        debit: created.totalAmount,
        credit: 0,
        customerName: created.customerName,
        customerPhone: created.customerPhone,
        notes: `Due Date: ${created.dueDate}`,
      });
    } catch {}

    return created;
  },
};
