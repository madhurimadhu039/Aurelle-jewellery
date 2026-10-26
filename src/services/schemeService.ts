import { Scheme, SchemeEnrollment } from '../types';
import { MOCK_SCHEMES } from '../data/mockData';

const SCHEMES_KEY = 'aurelle_schemes';
const ENROLLMENTS_KEY = 'aurelle_scheme_enrollments';

export const schemeService = {
  getSchemes: (): Scheme[] => {
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

  getEnrollments: (): SchemeEnrollment[] => {
    const data = localStorage.getItem(ENROLLMENTS_KEY);
    if (data) {
      try {
        return JSON.parse(data);
      } catch (e) {
        console.error(e);
      }
    }
    // Default demo enrollment
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
    localStorage.setItem(ENROLLMENTS_KEY, JSON.stringify(defaultEnrollment));
    return defaultEnrollment;
  },

  enroll: (details: {
    schemeId: string;
    monthlyAmount: number;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
  }): SchemeEnrollment => {
    const schemes = schemeService.getSchemes();
    const scheme = schemes.find((s) => s.id === details.schemeId);
    if (!scheme) throw new Error('Scheme not found');

    const enrollments = schemeService.getEnrollments();
    const today = new Date();
    const maturity = new Date();
    maturity.setMonth(maturity.getMonth() + scheme.durationMonths);

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
      startDate: today.toISOString().split('T')[0],
      nextDueDate: new Date(today.getFullYear(), today.getMonth() + 1, 10).toISOString().split('T')[0],
      maturityDate: maturity.toISOString().split('T')[0],
      status: 'ACTIVE',
      paymentsHistory: [
        {
          installmentNo: 1,
          amount: details.monthlyAmount,
          paidDate: today.toISOString().split('T')[0],
          receiptNo: `SCH-${Math.floor(10000 + Math.random() * 90000)}`,
          mode: 'Initial Digital Mandate / UPI',
        },
      ],
    };

    enrollments.unshift(newEnrollment);
    localStorage.setItem(ENROLLMENTS_KEY, JSON.stringify(enrollments));
    return newEnrollment;
  },

  payInstallment: (enrollmentId: string, paymentMode: string): SchemeEnrollment => {
    const enrollments = schemeService.getEnrollments();
    const target = enrollments.find((e) => e.id === enrollmentId);
    if (!target) throw new Error('Enrollment not found');

    const nextInstallmentNo = target.installmentsPaid + 1;
    target.installmentsPaid = nextInstallmentNo;
    target.paymentsHistory.push({
      installmentNo: nextInstallmentNo,
      amount: target.monthlyAmount,
      paidDate: new Date().toISOString().split('T')[0],
      receiptNo: `SCH-PAY-${Math.floor(100000 + Math.random() * 900000)}`,
      mode: paymentMode,
    });

    if (target.installmentsPaid >= target.tenureMonths - 1) {
      target.status = 'COMPLETED';
    }

    localStorage.setItem(ENROLLMENTS_KEY, JSON.stringify(enrollments));
    return target;
  },
};
