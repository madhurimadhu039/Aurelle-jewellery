import { collection, doc, getDocs, setDoc, deleteDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { Scheme, SchemeEnrollment } from '../types';
import { MOCK_SCHEMES } from '../data/mockData';
import { ledgerService } from './ledgerService';

const SCHEMES_KEY = 'aurelle_schemes';
const ENROLLMENTS_KEY = 'aurelle_scheme_enrollments';

export const schemeService = {
  getSchemes(): Scheme[] {
    const data = localStorage.getItem(SCHEMES_KEY);
    if (data) {
      try {
        return JSON.parse(data);
      } catch (e) {
        console.error(e);
      }
    }
    localStorage.setItem(SCHEMES_KEY, JSON.stringify(MOCK_SCHEMES));
    return MOCK_SCHEMES;
  },

  async fetchSchemesFromFirestore(): Promise<Scheme[]> {
    if (isFirebaseConfigured && db) {
      try {
        const snap = await getDocs(collection(db, 'schemes'));
        if (!snap.empty) {
          const remote: Scheme[] = [];
          snap.forEach((d) => remote.push({ id: d.id, ...(d.data() as any) }));
          localStorage.setItem(SCHEMES_KEY, JSON.stringify(remote));
          return remote;
        }
      } catch (e) {
        console.warn('Could not read schemes from Firestore:', e);
      }
    }
    return schemeService.getSchemes();
  },

  async saveScheme(scheme: Scheme): Promise<Scheme> {
    const schemes = schemeService.getSchemes();
    const existingIndex = schemes.findIndex((s) => s.id === scheme.id);
    if (existingIndex >= 0) {
      schemes[existingIndex] = scheme;
    } else {
      schemes.unshift(scheme);
    }
    localStorage.setItem(SCHEMES_KEY, JSON.stringify(schemes));

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'schemes', scheme.id), scheme, { merge: true });
      } catch (e) {
        console.warn('Error syncing scheme to Firestore:', e);
      }
    }
    return scheme;
  },

  async deleteScheme(id: string): Promise<void> {
    const schemes = schemeService.getSchemes().filter((s) => s.id !== id);
    localStorage.setItem(SCHEMES_KEY, JSON.stringify(schemes));

    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, 'schemes', id));
      } catch (e) {
        console.warn('Error deleting scheme from Firestore:', e);
      }
    }
  },

  getEnrollments(filterCustomer?: string): SchemeEnrollment[] {
    const data = localStorage.getItem(ENROLLMENTS_KEY);
    let enrollments: SchemeEnrollment[] = [];
    if (data) {
      try {
        enrollments = JSON.parse(data);
      } catch (e) {
        console.error(e);
      }
    } else {
      const defaultEnrollment: SchemeEnrollment[] = [
        {
          id: 'enr-901',
          schemeId: 'swarna-nidhi-11',
          schemeName: 'Swarna Nidhi Savings Scheme',
          customerName: 'Madhurima Sharma',
          customerEmail: 'madhurima@example.com',
          customerPhone: '9876543210',
          monthlyAmount: 10000,
          tenureMonths: 11,
          installmentsPaid: 2,
          startDate: '2026-09-01',
          nextDueDate: '2026-11-10',
          maturityDate: '2027-08-01',
          status: 'ACTIVE',
          paymentsHistory: [
            {
              installmentNo: 1,
              amount: 10000,
              paidDate: '2026-09-01',
              receiptNo: 'SCH-REC-01',
              mode: 'UPI',
            },
            {
              installmentNo: 2,
              amount: 10000,
              paidDate: '2026-10-01',
              receiptNo: 'SCH-REC-02',
              mode: 'Net Banking',
            },
          ],
        },
      ];
      enrollments = defaultEnrollment;
      localStorage.setItem(ENROLLMENTS_KEY, JSON.stringify(enrollments));
    }

    if (filterCustomer) {
      const cleaned = filterCustomer.trim().toLowerCase();
      const digits = cleaned.replace(/\D/g, '');
      return enrollments.filter((e) => {
        if (e.customerEmail && e.customerEmail.toLowerCase() === cleaned) return true;
        if (e.customerPhone && digits.length >= 4 && e.customerPhone.replace(/\D/g, '').endsWith(digits)) return true;
        if (e.customerName && e.customerName.toLowerCase().includes(cleaned)) return true;
        return false;
      });
    }

    return enrollments;
  },

  enroll(details: {
    schemeId: string;
    monthlyAmount: number;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
  }): SchemeEnrollment {
    const schemes = schemeService.getSchemes();
    const scheme = schemes.find((s) => s.id === details.schemeId);
    if (!scheme) throw new Error('Scheme not found');

    const enrollments = schemeService.getEnrollments();
    const today = new Date();
    const maturity = new Date();
    maturity.setMonth(maturity.getMonth() + scheme.durationMonths);

    const receiptNo = `SCH-${Math.floor(10000 + Math.random() * 90000)}`;
    const todayStr = today.toISOString().split('T')[0];

    const newEnrollment: SchemeEnrollment = {
      id: 'enr-' + Date.now(),
      schemeId: scheme.id,
      schemeName: scheme.name,
      customerName: details.customerName,
      customerEmail: details.customerEmail,
      customerPhone: details.customerPhone,
      monthlyAmount: details.monthlyAmount,
      tenureMonths: scheme.durationMonths,
      installmentsPaid: 1,
      startDate: todayStr,
      nextDueDate: new Date(today.getFullYear(), today.getMonth() + 1, 10).toISOString().split('T')[0],
      maturityDate: maturity.toISOString().split('T')[0],
      status: 'ACTIVE',
      paymentsHistory: [
        {
          installmentNo: 1,
          amount: details.monthlyAmount,
          paidDate: todayStr,
          receiptNo,
          mode: 'Initial Digital Mandate / UPI',
        },
      ],
    };

    enrollments.unshift(newEnrollment);
    localStorage.setItem(ENROLLMENTS_KEY, JSON.stringify(enrollments));

    if (isFirebaseConfigured && db) {
      try {
        setDoc(doc(db, 'scheme_enrollments', newEnrollment.id), newEnrollment).catch(() => {});
      } catch {}
    }

    // Register installment remittance in customer ledger
    try {
      ledgerService.addEntry({
        date: todayStr,
        refNumber: receiptNo,
        type: 'SCHEME_INSTALLMENT',
        description: `Installment #1 for ${scheme.name}`,
        debit: 0,
        credit: details.monthlyAmount,
        customerName: details.customerName,
        customerPhone: details.customerPhone,
      });
    } catch {}

    return newEnrollment;
  },

  payInstallment(enrollmentId: string, paymentMode: string): SchemeEnrollment {
    const enrollments = schemeService.getEnrollments();
    const target = enrollments.find((e) => e.id === enrollmentId);
    if (!target) throw new Error('Enrollment not found');

    const nextInstallmentNo = target.installmentsPaid + 1;
    const todayStr = new Date().toISOString().split('T')[0];
    const receiptNo = `SCH-PAY-${Math.floor(100000 + Math.random() * 900000)}`;

    target.installmentsPaid = nextInstallmentNo;
    target.paymentsHistory.push({
      installmentNo: nextInstallmentNo,
      amount: target.monthlyAmount,
      paidDate: todayStr,
      receiptNo,
      mode: paymentMode,
    });

    if (target.installmentsPaid >= target.tenureMonths - 1) {
      target.status = 'COMPLETED';
    }

    localStorage.setItem(ENROLLMENTS_KEY, JSON.stringify(enrollments));

    if (isFirebaseConfigured && db) {
      try {
        setDoc(doc(db, 'scheme_enrollments', target.id), target, { merge: true }).catch(() => {});
      } catch {}
    }

    // Register in Customer Ledger
    try {
      ledgerService.addEntry({
        date: todayStr,
        refNumber: receiptNo,
        type: 'SCHEME_INSTALLMENT',
        description: `Installment #${nextInstallmentNo} for ${target.schemeName}`,
        debit: 0,
        credit: target.monthlyAmount,
        customerName: target.customerName,
        customerPhone: target.customerPhone,
      });
    } catch {}

    return target;
  },
};
