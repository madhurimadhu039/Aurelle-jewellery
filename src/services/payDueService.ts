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
    const cleaned = query.trim().toLowerCase();
    const records = payDueService.getAll();
    return records.find(
      (r) =>
        r.billNumber.toLowerCase() === cleaned ||
        r.customerPhone.includes(cleaned) ||
        r.customerEmail.toLowerCase() === cleaned
    );
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
