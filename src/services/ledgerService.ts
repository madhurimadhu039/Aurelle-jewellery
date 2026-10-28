import { 
  collection, 
  doc, 
  getDocs, 
  setDoc 
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { LedgerEntry } from '../types';
import { MOCK_LEDGER_ENTRIES } from '../data/mockData';

const LEDGER_KEY = 'aurelle_customer_ledger';

export const ledgerService = {
  getEntries(filterCustomerId?: string): LedgerEntry[] {
    const data = localStorage.getItem(LEDGER_KEY);
    let entries: LedgerEntry[] = [];
    if (data) {
      try {
        entries = JSON.parse(data);
      } catch (e) {
        console.error(e);
        entries = MOCK_LEDGER_ENTRIES;
      }
    } else {
      entries = MOCK_LEDGER_ENTRIES;
      localStorage.setItem(LEDGER_KEY, JSON.stringify(entries));
    }

    if (filterCustomerId) {
      const cleaned = filterCustomerId.trim().toLowerCase();
      const digits = cleaned.replace(/\D/g, '');
      return entries.filter((e) => {
        if (e.customerId && e.customerId.toLowerCase() === cleaned) return true;
        if (e.customerPhone && digits.length >= 4 && e.customerPhone.replace(/\D/g, '').endsWith(digits)) return true;
        if (e.customerName && e.customerName.toLowerCase().includes(cleaned)) return true;
        return false;
      });
    }

    return entries;
  },

  async fetchFromFirestore(): Promise<LedgerEntry[]> {
    if (isFirebaseConfigured && db) {
      try {
        const snap = await getDocs(collection(db, 'ledgers'));
        if (!snap.empty) {
          const remote: LedgerEntry[] = [];
          snap.forEach((d) => remote.push({ id: d.id, ...(d.data() as any) }));
          localStorage.setItem(LEDGER_KEY, JSON.stringify(remote));
          return remote;
        }
      } catch (e) {
        console.warn('Could not read ledgers from Firestore:', e);
      }
    }
    return ledgerService.getEntries();
  },

  addEntry(entry: Omit<LedgerEntry, 'id' | 'balance'> & { balance?: number }): LedgerEntry {
    const entries = ledgerService.getEntries();
    
    // Calculate running balance
    const lastBalance = entries.length > 0 ? entries[0].balance : 0;
    const computedBalance = entry.balance ?? (lastBalance + (entry.debit || 0) - (entry.credit || 0));

    const newEntry: LedgerEntry = {
      ...entry,
      id: 'led-' + Date.now(),
      balance: computedBalance,
    };

    entries.unshift(newEntry);
    localStorage.setItem(LEDGER_KEY, JSON.stringify(entries));

    if (isFirebaseConfigured && db) {
      try {
        setDoc(doc(db, 'ledgers', newEntry.id), newEntry).catch(() => {});
      } catch {}
    }

    return newEntry;
  },

  calculateBalance(filterCustomerId?: string): { totalDebit: number; totalCredit: number; netBalance: number } {
    const entries = ledgerService.getEntries(filterCustomerId);
    const totalDebit = entries.reduce((sum, item) => sum + item.debit, 0);
    const totalCredit = entries.reduce((sum, item) => sum + item.credit, 0);
    return {
      totalDebit,
      totalCredit,
      netBalance: totalDebit - totalCredit,
    };
  },
};
