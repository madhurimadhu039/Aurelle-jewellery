import { LedgerEntry } from '../types';
import { MOCK_LEDGER_ENTRIES } from '../data/mockData';

const LEDGER_KEY = 'aurelle_customer_ledger';

export const ledgerService = {
  getEntries: (): LedgerEntry[] => {
    const data = localStorage.getItem(LEDGER_KEY);
    if (data) {
      try {
        return JSON.parse(data);
      } catch (e) {
        console.error(e);
      }
    }
    localStorage.setItem(LEDGER_KEY, JSON.stringify(MOCK_LEDGER_ENTRIES));
    return MOCK_LEDGER_ENTRIES;
  },

  addEntry: (entry: Omit<LedgerEntry, 'id'>): LedgerEntry => {
    const entries = ledgerService.getEntries();
    const newEntry: LedgerEntry = {
      ...entry,
      id: 'led-' + Date.now(),
    };
    entries.unshift(newEntry);
    localStorage.setItem(LEDGER_KEY, JSON.stringify(entries));
    return newEntry;
  },

  calculateBalance: (): { totalDebit: number; totalCredit: number; netBalance: number } => {
    const entries = ledgerService.getEntries();
    const totalDebit = entries.reduce((sum, item) => sum + item.debit, 0);
    const totalCredit = entries.reduce((sum, item) => sum + item.credit, 0);
    return {
      totalDebit,
      totalCredit,
      netBalance: totalDebit - totalCredit,
    };
  },
};
