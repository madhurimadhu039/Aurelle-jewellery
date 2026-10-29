import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Check, 
  ArrowRight, 
  ShieldCheck, 
  Calendar, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle, 
  Printer, 
  X, 
  Lock, 
  Building2, 
  FileText, 
  Search,
  Clock,
  ExternalLink,
  ShieldAlert,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { schemeService } from '../services/schemeService';
import { Scheme, SchemeEnrollment, SchemePaymentReceipt } from '../types';
import { useApp } from '../contexts/AppContext';

export const SchemePage: React.FC = () => {
  const { formatINR, user, isAdmin, showToast } = useApp();
  const schemes = schemeService.getSchemes();

  // Enrollments loaded based on user authentication / admin status
  const [enrollments, setEnrollments] = useState<SchemeEnrollment[]>(() => 
    schemeService.getEnrollments(user, isAdmin)
  );

  const [activeTab, setActiveTab] = useState<'schemes' | 'my-enrollments'>('schemes');
  const [selectedScheme, setSelectedScheme] = useState<Scheme>(schemes[0]);
  const [monthlyAmount, setMonthlyAmount] = useState<number>(schemes[0].minAmount);
  const [enrollModalOpen, setEnrollModalOpen] = useState(false);

  // Admin filter query
  const [adminSearchQuery, setAdminSearchQuery] = useState('');

  // Payment Modal State
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [activeEnrollmentForPayment, setActiveEnrollmentForPayment] = useState<SchemeEnrollment | null>(null);
  const [paymentMode, setPaymentMode] = useState<string>('UPI Transfer (Instant Settlement)');
  const [transactionRef, setTransactionRef] = useState<string>('');
  const [testScenario, setTestScenario] = useState<'success' | 'failure' | 'pending' | 'cancelled' | 'duplicate'>('success');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Receipt Modal State
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState<{
    receipt: SchemePaymentReceipt;
    enrollment: SchemeEnrollment;
  } | null>(null);

  // Enrollment Form
  const [enrollName, setEnrollName] = useState(user?.name || '');
  const [enrollEmail, setEnrollEmail] = useState(user?.email || '');
  const [enrollPhone, setEnrollPhone] = useState(user?.phone || '');

  // Reload enrollments whenever user or admin state changes
  useEffect(() => {
    setEnrollments(schemeService.getEnrollments(user, isAdmin));
    if (user) {
      if (user.name) setEnrollName(user.name);
      if (user.email) setEnrollEmail(user.email);
      if (user.phone) setEnrollPhone(user.phone);
    }
  }, [user, isAdmin]);

  const activeSchemesCount = enrollments.filter((e) => e.status === 'ACTIVE').length;

  const totalCustomerContribution = monthlyAmount * (selectedScheme.durationMonths - 1);
  const aurelleBonus = monthlyAmount;
  const totalMaturityValue = totalCustomerContribution + aurelleBonus;

  const handleEnrollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = schemeService.enroll({
        schemeId: selectedScheme.id,
        monthlyAmount,
        customerName: enrollName.trim(),
        customerEmail: enrollEmail.trim(),
        customerPhone: enrollPhone.trim(),
        customerUid: user?.uid,
      });

      setEnrollments(schemeService.getEnrollments(user, isAdmin));
      setEnrollModalOpen(false);
      setActiveTab('my-enrollments');
      showToast(`Enrolled successfully in ${selectedScheme.name}!`, 'success');

      try {
        confetti({
          particleCount: 75,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D8B47A', '#F7F1E7', '#34D399'],
        });
      } catch {}
    } catch (err: any) {
      alert(err.message || 'Error enrolling in scheme');
    }
  };

  const openPaymentModal = (enr: SchemeEnrollment) => {
    setActiveEnrollmentForPayment(enr);
    setPaymentError(null);
    setTransactionRef('');
    setTestScenario('success');
    setPaymentMode('UPI Transfer (Instant Settlement)');
    setPaymentModalOpen(true);
  };

  const handleExecutePayment = async () => {
    if (!activeEnrollmentForPayment) return;
    setPaymentError(null);
    setIsProcessingPayment(true);

    try {
      const result = await schemeService.verifyAndPayInstallment({
        enrollmentId: activeEnrollmentForPayment.id,
        paymentMode,
        transactionRef: transactionRef.trim() || `UTR-${Date.now().toString().slice(-8)}`,
        amount: activeEnrollmentForPayment.monthlyAmount,
        testScenario,
        user,
      });

      // Refresh enrollments from data layer
      const updatedList = schemeService.getEnrollments(user, isAdmin);
      setEnrollments(updatedList);
      const updatedActive = updatedList.find((e) => e.id === activeEnrollmentForPayment.id) || result.enrollment;
      setActiveEnrollmentForPayment(updatedActive);

      if (result.status === 'SUCCESS' && result.receipt) {
        setPaymentModalOpen(false);
        setActiveReceipt({
          receipt: result.receipt,
          enrollment: updatedActive,
        });
        setReceiptModalOpen(true);
        showToast(result.message, 'success');

        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#D8B47A', '#F7F1E7', '#10B981'],
          });
        } catch {}
      } else if (result.status === 'PENDING') {
        setPaymentModalOpen(false);
        showToast(result.message, 'info');
      }
    } catch (err: any) {
      setPaymentError(err.message || 'Payment verification failed.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const openReceiptModal = (receipt: SchemePaymentReceipt, enrollment: SchemeEnrollment) => {
    setActiveReceipt({ receipt, enrollment });
    setReceiptModalOpen(true);
  };

  // Filter for Admin Search
  const filteredEnrollments = enrollments.filter((e) => {
    if (!adminSearchQuery.trim()) return true;
    const q = adminSearchQuery.trim().toLowerCase();
    return (
      e.id.toLowerCase().includes(q) ||
      e.customerName.toLowerCase().includes(q) ||
      e.customerPhone.includes(q) ||
      e.schemeName.toLowerCase().includes(q)
    );
  });

  const gatewayDiagnostic = schemeService.getGatewayDiagnostic();

  return (
    <div className="min-h-screen bg-[#090806] text-[#F7F1E7] py-10 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-10">
          <span className="text-xs uppercase font-bold tracking-widest text-[#D8B47A]">
            AURELLE JEWELLERY SAVINGS INITIATIVE
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-1">
            Jewellery Savings Schemes
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-2 max-w-xl mx-auto">
            Plan your gold and diamond acquisitions with structured monthly deposits and guaranteed patron bonuses from Aurelle.
          </p>

          {/* Tab Switcher */}
          <div className="flex justify-center mt-6">
            <div className="p-1 bg-[#120F0B] border border-[#2B2319] rounded-xl flex gap-1">
              <button
                onClick={() => setActiveTab('schemes')}
                className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  activeTab === 'schemes'
                    ? 'bg-[#D8B47A] text-[#090806] shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Browse Schemes
              </button>
              <button
                onClick={() => setActiveTab('my-enrollments')}
                className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                  activeTab === 'my-enrollments'
                    ? 'bg-[#D8B47A] text-[#090806] shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <span>My Active Schemes</span>
                {activeSchemesCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-[#18140F] text-[#D8B47A] text-[10px] font-extrabold">
                    {activeSchemesCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {activeTab === 'schemes' ? (
          <div className="space-y-12">
            {/* Scheme Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {schemes.map((scheme) => (
                <div
                  key={scheme.id}
                  className={`bg-[#120F0B] border rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all ${
                    selectedScheme.id === scheme.id
                      ? 'border-[#D8B47A] shadow-[0_0_30px_rgba(216,180,122,0.15)]'
                      : 'border-[#262018] hover:border-[#D8B47A]/50'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#D8B47A] bg-[#1E1912] px-2.5 py-1 rounded border border-[#D8B47A]/30">
                        {scheme.durationMonths} Months Tenure
                      </span>
                      <span className="text-xs font-bold text-[#10B981]">
                        + {scheme.bonusPercentage}% Patron Bonus
                      </span>
                    </div>

                    <h3 className="font-serif-luxury text-2xl font-bold text-white mb-1">
                      {scheme.name}
                    </h3>
                    <p className="text-xs text-[#D1C7BA] mb-6">{scheme.tagline}</p>

                    {/* Benefits List */}
                    <div className="space-y-2.5 mb-6 text-xs text-gray-300">
                      {scheme.benefits.map((b, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-[#D8B47A] flex-shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[#241F18] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-gray-400 block uppercase">Starting from</span>
                      <span className="text-base font-bold text-white">{formatINR(scheme.minAmount)}/month</span>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedScheme(scheme);
                        setMonthlyAmount(scheme.minAmount);
                        setEnrollModalOpen(true);
                      }}
                      className="px-6 py-2.5 rounded-lg bg-[#D8B47A] hover:bg-[#EBD5A8] text-[#090806] text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-[#D8B47A]/15"
                    >
                      Enrol Now →
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Interactive Scheme Maturity Simulator */}
            <div className="bg-[#120F0B] border border-[#2B2319] rounded-2xl p-6 sm:p-10">
              <div className="max-w-2xl mx-auto text-center mb-8">
                <span className="text-xs uppercase font-bold tracking-widest text-[#D8B47A]">
                  SCHEME MATURITY SIMULATOR
                </span>
                <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-white mt-1">
                  Calculate Your Jewellery Savings Return
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-4xl mx-auto">
                <div className="space-y-5">
                  <div>
                    <label className="text-xs uppercase font-semibold text-gray-400 block mb-2">
                      Select Monthly Contribution:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {selectedScheme.monthlyOptions.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setMonthlyAmount(opt)}
                          className={`py-2 text-center text-xs font-semibold rounded-lg border transition-all ${
                            monthlyAmount === opt
                              ? 'bg-[#D8B47A] text-[#090806] border-[#D8B47A]'
                              : 'bg-[#18140F] text-gray-300 border-[#2B2319]'
                          }`}
                        >
                          {formatINR(opt)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#16120D] border border-[#241F18] text-xs text-gray-400 space-y-2">
                    <div className="flex justify-between">
                      <span>Scheme Selected:</span>
                      <strong className="text-white">{selectedScheme.name}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>You Pay ({selectedScheme.durationMonths - 1} Months):</span>
                      <strong className="text-white">{formatINR(totalCustomerContribution)}</strong>
                    </div>
                    <div className="flex justify-between text-[#10B981]">
                      <span>Aurelle Guaranteed Bonus (Month #{selectedScheme.durationMonths}):</span>
                      <strong>+{formatINR(aurelleBonus)}</strong>
                    </div>
                  </div>
                </div>

                {/* Return Result Card */}
                <div className="bg-gradient-to-br from-[#1C160E] to-[#120F0B] border border-[#D8B47A]/50 rounded-2xl p-6 text-center shadow-xl">
                  <span className="text-xs uppercase font-bold tracking-wider text-gray-400">
                    Total Redemption Value on Maturity
                  </span>
                  <div className="text-3xl sm:text-4xl font-extrabold text-[#D8B47A] my-3">
                    {formatINR(totalMaturityValue)}
                  </div>
                  <p className="text-xs text-[#D1C7BA] mb-6">
                    Redeemable for any BIS Hallmarked Gold, Solitaire Diamond, or Polki creation at Aurelle boutiques with zero making charges up to 18%.
                  </p>
                  <button
                    onClick={() => setEnrollModalOpen(true)}
                    className="w-full py-3 rounded-xl bg-[#D8B47A] text-[#090806] text-xs font-bold uppercase tracking-wider hover:bg-[#EBD5A8]"
                  >
                    Start Scheme with {formatINR(monthlyAmount)}/mo
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* My Enrollments Tab */
          <div className="space-y-6">
            
            {/* Admin Toolbar / Security Banner */}
            {isAdmin ? (
              <div className="bg-[#16120D] border border-[#D8B47A]/40 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#D8B47A]" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Aurelle Treasury Admin Portal: Viewing All Patron Scheme Folios
                  </span>
                </div>
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={adminSearchQuery}
                    onChange={(e) => setAdminSearchQuery(e.target.value)}
                    placeholder="Search patron, phone, or folio..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#0F0D0A] border border-[#2B2319] text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D8B47A]"
                  />
                </div>
              </div>
            ) : !user ? (
              <div className="bg-[#1A150E] border border-[#D8B47A]/30 rounded-xl p-4 flex items-start gap-3">
                <Info className="w-5 h-5 text-[#D8B47A] flex-shrink-0 mt-0.5" />
                <div className="text-xs text-[#D1C7BA] space-y-1">
                  <strong className="text-white block font-medium">Guest Demonstration Mode</strong>
                  <span>
                    You are currently browsing the public demonstration portfolio. To view and manage your genuine personal savings scheme folio, please sign in to your Aurelle patron account.
                  </span>
                </div>
              </div>
            ) : null}

            {filteredEnrollments.length === 0 ? (
              <div className="text-center py-16 bg-[#120F0B] border border-[#241F18] rounded-2xl p-8">
                <Sparkles className="w-12 h-12 text-[#D8B47A] mx-auto mb-3" />
                <h3 className="font-serif-luxury text-2xl font-bold text-white mb-2">
                  No Active Scheme Enrolled
                </h3>
                <p className="text-xs text-gray-400 max-w-sm mx-auto mb-6">
                  Begin your precious metal savings journey today with as little as ₹5,000/month.
                </p>
                <button
                  onClick={() => setActiveTab('schemes')}
                  className="px-6 py-2.5 rounded-lg bg-[#D8B47A] text-[#090806] text-xs font-bold uppercase tracking-wider"
                >
                  Browse Available Schemes
                </button>
              </div>
            ) : (
              filteredEnrollments.map((enr) => {
                const stats = schemeService.calculateEnrollmentStats(enr);
                const successfulReceipts = (enr.paymentsHistory || []).filter(
                  (p) => p.status === 'SUCCESS' || !p.status
                );
                const pendingReceipts = (enr.paymentsHistory || []).filter(
                  (p) => p.status === 'PENDING'
                );

                return (
                  <div
                    key={enr.id}
                    className="bg-[#120F0B] border border-[#2B2319] rounded-2xl p-6 space-y-6"
                  >
                    {/* Top Row: Folio details & Demo Specimen Badge */}
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-4 border-b border-[#241F18] gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase font-bold text-gray-400">
                            Folio #{enr.id}
                          </span>
                          {enr.isSampleData && (
                            <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-950/80 border border-amber-600/50 text-amber-300">
                              Demo Specimen (Sample Data)
                            </span>
                          )}
                        </div>
                        <h3 className="font-serif-luxury text-xl font-bold text-white mt-0.5">
                          {enr.schemeName}
                        </h3>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Patron: <strong className="text-gray-300">{enr.customerName}</strong> ({enr.customerPhone})
                        </p>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                          enr.status === 'ACTIVE'
                            ? 'bg-[#10B981]/20 text-[#34D399] border-[#10B981]/40'
                            : 'bg-[#D8B47A]/20 text-[#D8B47A] border-[#D8B47A]/40'
                        }`}>
                          {enr.status}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between text-xs mb-2">
                        <span className="text-gray-400">Installments Progress:</span>
                        <span className="font-bold text-[#D8B47A]">
                          {stats.verifiedInstallmentsCount} of {enr.tenureMonths - 1} Months Paid
                          {stats.isFullyPaid && ' (Fully Contributed)'}
                        </span>
                      </div>
                      <div className="w-full bg-[#1C1712] rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-[#D8B47A] h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(100, (stats.verifiedInstallmentsCount / (enr.tenureMonths - 1)) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Details Grid: Verified Calculations */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                      <div className="p-3 rounded-xl bg-[#18140F] border border-[#241F18]">
                        <span className="text-gray-400 block text-[10px] uppercase">Monthly Deposit</span>
                        <span className="text-sm font-bold text-white mt-0.5">
                          {formatINR(enr.monthlyAmount)}
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-[#18140F] border border-[#241F18]">
                        <span className="text-gray-400 block text-[10px] uppercase">Accumulated Total</span>
                        <span className="text-sm font-bold text-[#34D399] mt-0.5">
                          {formatINR(stats.accumulatedTotal)}
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-[#18140F] border border-[#241F18]">
                        <span className="text-gray-400 block text-[10px] uppercase">Next Due Date</span>
                        <span className="text-sm font-bold text-white mt-0.5">
                          {stats.isFullyPaid ? 'Matured' : enr.nextDueDate}
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-[#18140F] border border-[#241F18]">
                        <span className="text-gray-400 block text-[10px] uppercase">Maturity Date</span>
                        <span className="text-sm font-bold text-[#D8B47A] mt-0.5">
                          {enr.maturityDate}
                        </span>
                      </div>
                    </div>

                    {/* Pay Installment Action Bar */}
                    {enr.status === 'ACTIVE' && !stats.isFullyPaid && (
                      <div className="p-4 rounded-xl bg-gradient-to-r from-[#1E1810] to-[#120F0B] border border-[#D8B47A]/30 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-[#D8B47A] block">
                            Installment #{stats.nextInstallmentNumber} Due
                          </span>
                          <p className="text-xs text-gray-300 mt-0.5">
                            Due on or before <strong className="text-white">{enr.nextDueDate}</strong>
                          </p>
                        </div>

                        <button
                          onClick={() => openPaymentModal(enr)}
                          className="px-6 py-2.5 rounded-lg bg-[#D8B47A] hover:bg-[#EBD5A8] text-[#090806] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#D8B47A]/15 cursor-pointer transition-all hover:scale-[1.02]"
                        >
                          <CreditCard className="w-4 h-4" />
                          <span>Pay Installment #{stats.nextInstallmentNumber} ({formatINR(enr.monthlyAmount)})</span>
                        </button>
                      </div>
                    )}

                    {stats.isFullyPaid && (
                      <div className="p-4 rounded-xl bg-[#0F1E16] border border-[#10B981]/40 flex items-center gap-3">
                        <CheckCircle2 className="w-6 h-6 text-[#10B981] flex-shrink-0" />
                        <div className="text-xs text-gray-300">
                          <strong className="text-white block font-medium">Scheme Installments Complete!</strong>
                          <span>
                            You have completed all {enr.tenureMonths - 1} patron installments. Your 100% Aurelle Bonus of {formatINR(stats.aurelleBonus)} will be added on {enr.maturityDate}. Total maturity value: <strong className="text-[#D8B47A]">{formatINR(stats.maturityValue)}</strong>.
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Pending Installments Alert if any */}
                    {pendingReceipts.length > 0 && (
                      <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-600/30 flex items-center gap-2.5 text-xs text-amber-200">
                        <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                        <span>
                          {pendingReceipts.length} installment payment(s) pending inter-bank clearinghouse settlement. Installment count will update once verified.
                        </span>
                      </div>
                    )}

                    {/* Payment History & Receipts Log */}
                    <div className="pt-4 border-t border-[#241F18]">
                      <div className="flex justify-between items-center mb-3">
                        <h5 className="text-xs uppercase font-bold text-gray-400">
                          Verified Installment Receipts Log ({successfulReceipts.length} Settled)
                        </h5>
                      </div>

                      <div className="space-y-2">
                        {enr.paymentsHistory && enr.paymentsHistory.length > 0 ? (
                          enr.paymentsHistory.map((p, idx) => (
                            <div
                              key={p.receiptNo || idx}
                              className="bg-[#18140F] border border-[#241F18] rounded-lg p-3 flex flex-col sm:flex-row justify-between sm:items-center gap-2 text-xs"
                            >
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-white">
                                    Month #{p.installmentNo}
                                  </span>
                                  <span className={`text-[10px] uppercase font-bold px-1.5 py-0.2 rounded border ${
                                    p.status === 'PENDING'
                                      ? 'bg-amber-950/60 text-amber-300 border-amber-700/50'
                                      : 'bg-[#10B981]/20 text-[#34D399] border-[#10B981]/40'
                                  }`}>
                                    {p.status || 'SUCCESS'}
                                  </span>
                                  <span className="text-[11px] text-gray-400">
                                    {p.paidDate}
                                  </span>
                                </div>
                                <div className="text-[11px] text-gray-400">
                                  Receipt: <span className="text-gray-300">{p.receiptNo}</span>
                                  {p.transactionRef && (
                                    <> • Ref: <span className="text-[#D8B47A] font-mono">{p.transactionRef}</span></>
                                  )}
                                  <> • {p.mode}</>
                                </div>
                              </div>

                              <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#221B13]">
                                <span className="font-bold text-[#34D399] text-sm">
                                  {formatINR(p.amount)}
                                </span>
                                <button
                                  onClick={() => openReceiptModal(p, enr)}
                                  className="px-3 py-1 rounded bg-[#241F18] hover:bg-[#322A20] text-gray-200 hover:text-white text-[11px] font-medium flex items-center gap-1.5 transition-colors"
                                >
                                  <FileText className="w-3.5 h-3.5 text-[#D8B47A]" />
                                  <span>View Receipt</span>
                                </button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-gray-500 italic">No payments recorded yet.</p>
                        )}
                      </div>
                    </div>

                  </div>
                );
              })
            )}

          </div>
        )}

      </div>

      {/* ======================================================== */}
      {/* 1. INSTALLMENT PAYMENT & VERIFICATION MODAL */}
      {/* ======================================================== */}
      {paymentModalOpen && activeEnrollmentForPayment && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isProcessingPayment) {
              setPaymentModalOpen(false);
            }
          }}
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[#120F0B] border border-[#D8B47A]/50 rounded-2xl max-w-xl w-full p-6 text-left shadow-2xl max-h-[92vh] overflow-y-auto space-y-5">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#241F18]">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#D8B47A] tracking-wider block">
                  AURELLE TREASURY MANDATE
                </span>
                <h3 className="font-serif-luxury text-lg font-bold text-white">
                  Remit Scheme Installment
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPaymentModalOpen(false)}
                disabled={isProcessingPayment}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#1E1912]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scheme & Folio Particulars */}
            <div className="p-4 rounded-xl bg-[#18140F] border border-[#241F18] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Patron:</span>
                <strong className="text-white">{activeEnrollmentForPayment.customerName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Scheme &amp; Folio:</span>
                <span className="text-gray-200">
                  {activeEnrollmentForPayment.schemeName} ({activeEnrollmentForPayment.id})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Installment Due:</span>
                <span className="text-[#D8B47A] font-bold">
                  Month #{activeEnrollmentForPayment.installmentsPaid + 1} of {activeEnrollmentForPayment.tenureMonths - 1}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Due Date:</span>
                <span className="text-white">{activeEnrollmentForPayment.nextDueDate}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#221B13] text-sm">
                <span className="font-semibold text-gray-300">Amount Due:</span>
                <strong className="text-[#34D399] font-extrabold text-base">
                  {formatINR(activeEnrollmentForPayment.monthlyAmount)}
                </strong>
              </div>
            </div>

            {/* Gateway Diagnostic Notice */}
            <div className={`p-3 rounded-xl border text-xs ${
              gatewayDiagnostic.isConfigured
                ? 'bg-[#0E1A14] border-[#10B981]/40 text-[#A7F3D0]'
                : 'bg-[#1C160C] border-[#D8B47A]/30 text-[#EBD5A8]'
            }`}>
              <div className="flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-[#D8B47A] flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <strong className="block text-white font-medium">
                    {gatewayDiagnostic.isConfigured
                      ? 'Production Gateway Active'
                      : 'Payment Gateway Integration Notice'}
                  </strong>
                  <p className="text-[11px] leading-relaxed text-gray-300">
                    {gatewayDiagnostic.statusNotice}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="text-xs uppercase font-semibold text-gray-400 block">
                Select Remittance Channel:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {[
                  'UPI Transfer (Instant Settlement)',
                  'Bank NEFT / RTGS Remittance',
                  'IMPS Instant Transfer',
                  'In-Boutique POS Counter Remittance',
                ].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setPaymentMode(mode)}
                    className={`p-2.5 rounded-lg border text-left font-medium transition-all ${
                      paymentMode === mode
                        ? 'bg-[#D8B47A] text-[#090806] border-[#D8B47A]'
                        : 'bg-[#18140F] text-gray-300 border-[#2B2319]'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Beneficiary Details & Reference Input */}
            <div className="p-4 rounded-xl bg-[#0F0D0A] border border-[#241F18] space-y-3 text-xs">
              <div className="flex items-center gap-2 text-gray-400 font-semibold uppercase text-[10px] tracking-wider">
                <Building2 className="w-3.5 h-3.5 text-[#D8B47A]" />
                <span>Aurelle Bullion Treasury Account (Beneficiary Details)</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-300">
                <div>Bank: <strong className="text-white">HDFC Bank Ltd.</strong></div>
                <div>Account: <strong className="text-white">50200088991122</strong></div>
                <div>IFSC: <strong className="text-white">HDFC0000060</strong></div>
                <div>UPI VPA: <strong className="text-[#D8B47A]">aurellejewellery@hdfcbank</strong></div>
              </div>

              <div className="pt-2 border-t border-[#221B13]">
                <label className="block text-gray-400 mb-1 text-xs">
                  Enter Bank UTR / UPI Reference / Transaction Ref <span className="text-[#D8B47A]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={transactionRef}
                  onChange={(e) => setTransactionRef(e.target.value)}
                  placeholder="e.g. UTR-20261029-847291 or UPI/630129847192"
                  className="w-full bg-[#18140F] border border-[#2B2319] rounded-lg p-2.5 text-white font-mono text-xs focus:outline-none focus:border-[#D8B47A]"
                />
                <span className="text-[10px] text-gray-500 block mt-1">
                  Required for duplicate prevention &amp; reconciliation against the bullion ledger.
                </span>
              </div>
            </div>

            {/* QA Test Mode Simulator Controls */}
            <div className="p-3 rounded-xl bg-[#16120D] border border-[#2B2319] space-y-2 text-xs">
              <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block">
                QA Verification &amp; Test Suite
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 text-[11px]">
                {[
                  { id: 'success', label: 'Success' },
                  { id: 'failure', label: 'Bank Failure' },
                  { id: 'pending', label: 'Pending' },
                  { id: 'cancelled', label: 'Cancelled' },
                  { id: 'duplicate', label: 'Duplicate' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setTestScenario(s.id as any);
                      if (s.id === 'duplicate') {
                        setTransactionRef('UPI/260901/784102'); // Existing recorded ref
                      } else if (!transactionRef) {
                        setTransactionRef(`UTR-2026-${Math.floor(100000 + Math.random() * 900000)}`);
                      }
                    }}
                    className={`py-1.5 px-2 rounded border text-center font-medium ${
                      testScenario === s.id
                        ? 'bg-[#D8B47A]/30 text-[#D8B47A] border-[#D8B47A]'
                        : 'bg-[#120F0B] text-gray-400 border-[#221B13]'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Error Display */}
            {paymentError && (
              <div className="p-3 rounded-lg bg-red-950/60 border border-red-700/50 flex items-start gap-2.5 text-xs text-red-200">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <span>{paymentError}</span>
              </div>
            )}

            {/* Modal Actions */}
            <div className="pt-3 border-t border-[#241F18] flex justify-between items-center">
              <button
                type="button"
                onClick={() => setPaymentModalOpen(false)}
                disabled={isProcessingPayment}
                className="text-xs text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecutePayment}
                disabled={isProcessingPayment}
                className="px-6 py-2.5 rounded-lg bg-[#D8B47A] hover:bg-[#EBD5A8] text-[#090806] text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{isProcessingPayment ? 'Verifying with Treasury...' : 'Verify & Remit Installment'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. OFFICIAL VERIFIED SCHEME PAYMENT RECEIPT MODAL */}
      {/* ======================================================== */}
      {receiptModalOpen && activeReceipt && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setReceiptModalOpen(false);
          }}
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[#120F0B] border border-[#D8B47A]/60 rounded-2xl max-w-lg w-full p-6 sm:p-8 text-left shadow-2xl max-h-[92vh] overflow-y-auto space-y-6">
            
            {/* Printable Receipt Box */}
            <div id="aurelle-printable-receipt" className="space-y-6">
              
              {/* Header Crest */}
              <div className="text-center pb-4 border-b border-[#2B2319] space-y-1">
                <span className="font-serif-luxury text-2xl font-normal tracking-[0.25em] text-[#F7F1E7] block">
                  AURELLE
                </span>
                <span className="text-[8px] uppercase tracking-[0.4em] text-[#D8B47A] block font-medium">
                  JEWELLERY &bull; BULLION TREASURY
                </span>
                <p className="text-[10px] text-gray-400 tracking-wider uppercase pt-1">
                  Official Savings Scheme Remittance Receipt
                </p>
              </div>

              {/* Status & Receipt Number */}
              <div className="flex justify-between items-center text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Receipt Number</span>
                  <strong className="text-white font-mono text-sm">{activeReceipt.receipt.receiptNo}</strong>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                  activeReceipt.receipt.status === 'PENDING'
                    ? 'bg-amber-950/60 text-amber-300 border-amber-600/50'
                    : 'bg-[#10B981]/20 text-[#34D399] border-[#10B981]/40'
                }`}>
                  {activeReceipt.receipt.status || 'VERIFIED & SETTLED'}
                </span>
              </div>

              {/* Receipt Details Table */}
              <div className="bg-[#16120D] border border-[#241F18] rounded-xl p-4 text-xs space-y-2.5">
                <div className="flex justify-between">
                  <span className="text-gray-400">Patron Name:</span>
                  <strong className="text-white">{activeReceipt.enrollment.customerName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Patron Mobile:</span>
                  <span className="text-gray-300">{activeReceipt.enrollment.customerPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Folio Number:</span>
                  <span className="font-mono text-[#D8B47A]">{activeReceipt.enrollment.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Scheme Name:</span>
                  <span className="text-white">{activeReceipt.enrollment.schemeName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Installment Number:</span>
                  <strong className="text-white">
                    Month #{activeReceipt.receipt.installmentNo} of {activeReceipt.enrollment.tenureMonths - 1}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Payment Channel:</span>
                  <span className="text-gray-300">{activeReceipt.receipt.mode}</span>
                </div>
                {activeReceipt.receipt.transactionRef && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Bank Ref / UTR:</span>
                    <span className="font-mono text-[#D8B47A] text-[11px]">
                      {activeReceipt.receipt.transactionRef}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-400">Verified Date:</span>
                  <span className="text-gray-300">{activeReceipt.receipt.paidDate}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#2B2319] text-sm">
                  <span className="font-bold text-white">Amount Remitted:</span>
                  <strong className="text-[#34D399] font-extrabold text-base">
                    {formatINR(activeReceipt.receipt.amount)}
                  </strong>
                </div>
              </div>

              {/* Security Seal & Disclaimer */}
              <div className="p-3 rounded-lg bg-[#0E0C09] border border-[#241F18] text-[10px] text-gray-400 space-y-1">
                <div className="flex items-center gap-1.5 text-[#D8B47A] font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Aurelle Hallmarking Guild Verification</span>
                </div>
                <p>
                  This computer-generated receipt serves as authentic proof of installment remittance and has been reconciled with the customer ledger. Redeemable towards BIS Hallmarked Gold &amp; Diamond jewellery.
                </p>
              </div>

            </div>

            {/* Receipt Modal Footer Buttons */}
            <div className="pt-4 border-t border-[#241F18] flex justify-between items-center">
              <button
                type="button"
                onClick={() => setReceiptModalOpen(false)}
                className="text-xs text-gray-400 hover:text-white"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-5 py-2 rounded-lg bg-[#D8B47A] hover:bg-[#EBD5A8] text-[#090806] text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save Receipt</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. SCHEME ENROLLMENT MODAL */}
      {/* ======================================================== */}
      {enrollModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setEnrollModalOpen(false);
          }}
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[#120F0B] border border-[#D8B47A]/40 rounded-2xl max-w-lg w-full p-6 text-left shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#241F18] mb-4">
              <div>
                <h3 className="font-display-luxury text-base font-bold text-white">
                  ENROL IN {selectedScheme.name.toUpperCase()}
                </h3>
                <p className="text-xs text-gray-400">{selectedScheme.tagline}</p>
              </div>
              <button 
                type="button"
                onClick={() => setEnrollModalOpen(false)} 
                aria-label="Close dialog"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-[#D8B47A] hover:bg-[#1E1912]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEnrollSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-gray-400 block mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  value={enrollName}
                  onChange={(e) => setEnrollName(e.target.value)}
                  placeholder="e.g. Madhurima Sharma"
                  className="w-full bg-[#18140F] border border-[#2B2319] rounded p-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400 block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={enrollEmail}
                    onChange={(e) => setEnrollEmail(e.target.value)}
                    placeholder="patron@example.com"
                    className="w-full bg-[#18140F] border border-[#2B2319] rounded p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-gray-400 block mb-1">Mobile Phone</label>
                  <input
                    type="tel"
                    required
                    value={enrollPhone}
                    onChange={(e) => setEnrollPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-[#18140F] border border-[#2B2319] rounded p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-400 block mb-1">Monthly Contribution Amount</label>
                <div className="grid grid-cols-3 gap-2">
                  {selectedScheme.monthlyOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setMonthlyAmount(opt)}
                      className={`p-2 rounded text-center border font-medium ${
                        monthlyAmount === opt
                          ? 'bg-[#D8B47A] text-[#090806] border-[#D8B47A]'
                          : 'bg-[#18140F] text-gray-300 border-[#2B2319]'
                      }`}
                    >
                      {formatINR(opt)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#18140F] border border-[#241F18] text-gray-400 space-y-1">
                <div className="flex justify-between">
                  <span>Initial Installment due at enrollment:</span>
                  <span className="font-bold text-white">{formatINR(monthlyAmount)}</span>
                </div>
                <div className="flex justify-between text-[#34D399]">
                  <span>Guaranteed Aurelle Bonus ({selectedScheme.durationMonths}th month):</span>
                  <span>+{formatINR(monthlyAmount)}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-[#241F18] flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setEnrollModalOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-[#D8B47A] text-[#090806] font-bold uppercase tracking-wider hover:bg-[#EBD5A8]"
                >
                  Authorize Enrollment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
