import { PayDueRecord } from '../types';
import { MOCK_PAY_DUES } from '../data/mockData';

const PAY_DUES_KEY = 'aurelle_pay_dues';

export const payDueService = {
  getAll: (): PayDueRecord[] => {
    const data = localStorage.getItem(PAY_DUES_KEY);
    if (data) {
      try {
        return JSON.parse(data);
      } catch (e) {
        console.error(e);
      }
    }
    localStorage.setItem(PAY_DUES_KEY, JSON.stringify(MOCK_PAY_DUES));
    return MOCK_PAY_DUES;
  },

  findByQuery: (query: string): PayDueRecord | undefined => {
    if (!query || typeof query !== 'string') return undefined;
    const cleaned = query.trim().toLowerCase();
    if (!cleaned) return undefined;

    const queryDigits = cleaned.replace(/\D/g, '');
    const records = payDueService.getAll();

    return records.find((r) => {
      // 1. Exact or partial bill number
      const bill = r.billNumber.toLowerCase();
      if (bill === cleaned || bill.includes(cleaned)) return true;

      // 2. Order summary reference (e.g. AUR-9842 or 9842)
      const order = r.orderSummary.toLowerCase();
      if (order.includes(cleaned)) return true;

      // 3. Record internal ID
      if (r.id.toLowerCase() === cleaned) return true;

      // 4. Customer Phone with flexible digit matching
      const recordDigits = r.customerPhone.replace(/\D/g, '');
      if (queryDigits.length >= 4) {
        if (recordDigits === queryDigits || recordDigits.endsWith(queryDigits) || queryDigits.endsWith(recordDigits)) {
          return true;
        }
      }
      if (r.customerPhone.includes(cleaned)) return true;

      // 5. Customer Email
      if (r.customerEmail && r.customerEmail.toLowerCase().includes(cleaned)) return true;

      // 6. Customer Name
      if (r.customerName && r.customerName.toLowerCase().includes(cleaned)) return true;

      return false;
    });
  },

  verifyRecord: async (query: string): Promise<{ success: boolean; record?: PayDueRecord; error?: string }> => {
    if (!query || !query.trim()) {
      return { success: false, error: 'Please enter a valid Invoice ID, Order No., or registered Mobile No.' };
    }

    const trimmed = query.trim();
    if (trimmed.length < 3) {
      return { success: false, error: 'Reference must be at least 3 characters long.' };
    }

    // Small async verification latency to allow UI feedback and avoid instant flash
    await new Promise((resolve) => setTimeout(resolve, 450));

    const found = payDueService.findByQuery(trimmed);
    if (!found) {
      return {
        success: false,
        error: `No matching record found for "${trimmed}". Please check the reference on your purchase bill.`,
      };
    }

    return { success: true, record: found };
  },

  recordPayment: (recordId: string, amount: number, paymentMode: string): PayDueRecord => {
    const records = payDueService.getAll();
    const target = records.find((r) => r.id === recordId);
    if (!target) throw new Error('Record not found');

    const newAmountPaid = target.amountPaid + amount;
    const newBalance = Math.max(0, target.totalAmount - newAmountPaid);
    const newStatus = newBalance === 0 ? 'PAID' : 'PARTIALLY_PAID';

    const newPaymentReceipt = {
      id: 'pay-' + Date.now(),
      amount,
      date: new Date().toISOString().split('T')[0],
      paymentMode,
      receiptNumber: `AUR-RCP-${Math.floor(100000 + Math.random() * 900000)}`,
    };

    target.amountPaid = newAmountPaid;
    target.balanceDue = newBalance;
    target.status = newStatus;
    target.paymentsHistory = [newPaymentReceipt, ...target.paymentsHistory];

    localStorage.setItem(PAY_DUES_KEY, JSON.stringify(records));
    return target;
  },

  createRecord: (newRecord: Omit<PayDueRecord, 'id' | 'paymentsHistory'>): PayDueRecord => {
    const records = payDueService.getAll();
    const created: PayDueRecord = {
      ...newRecord,
      id: 'pd-' + Date.now(),
      paymentsHistory: [],
    };
    records.unshift(created);
    localStorage.setItem(PAY_DUES_KEY, JSON.stringify(records));
    return created;
  },
};
