import React, { useState, useEffect } from 'react';
import { Sparkles, Check, ArrowRight, ShieldCheck, Calendar, CreditCard, ChevronDown, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { schemeService } from '../services/schemeService';
import { Scheme, SchemeEnrollment } from '../types';
import { useApp } from '../contexts/AppContext';

export const SchemePage: React.FC = () => {
  const { formatINR, user, showToast } = useApp();
  const schemes = schemeService.getSchemes();
  const [enrollments, setEnrollments] = useState<SchemeEnrollment[]>(() => schemeService.getEnrollments());

  const [activeTab, setActiveTab] = useState<'schemes' | 'my-enrollments'>('schemes');
  const [selectedScheme, setSelectedScheme] = useState<Scheme>(schemes[0]);
  const [monthlyAmount, setMonthlyAmount] = useState<number>(schemes[0].minAmount);
  const [enrollModalOpen, setEnrollModalOpen] = useState(false);

  // Form
  const [enrollName, setEnrollName] = useState(user?.name || 'Madhurima Sharma');
  const [enrollEmail, setEnrollEmail] = useState(user?.email || 'madhurima@example.com');
  const [enrollPhone, setEnrollPhone] = useState(user?.phone || '+91 98765 43210');

  useEffect(() => {
    if (user) {
      if (user.name) setEnrollName(user.name);
      if (user.email) setEnrollEmail(user.email);
      if (user.phone) setEnrollPhone(user.phone);
    }
  }, [user]);

  const totalCustomerContribution = monthlyAmount * (selectedScheme.durationMonths - 1);
  const aurelleBonus = monthlyAmount;
  const totalMaturityValue = totalCustomerContribution + aurelleBonus;

  const handleEnrollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = schemeService.enroll({
        schemeId: selectedScheme.id,
        monthlyAmount,
        customerName: enrollName,
        customerEmail: enrollEmail,
        customerPhone: enrollPhone,
      });
      setEnrollments(schemeService.getEnrollments());
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
      alert(err.message || 'Error enrolling');
    }
  };

  const handlePayInstallment = (enrollmentId: string) => {
    try {
      const updated = schemeService.payInstallment(enrollmentId, 'UPI Digital Mandate');
      setEnrollments([...schemeService.getEnrollments()]);
      showToast(`Installment #${updated.installmentsPaid} remitted successfully!`, 'success');
    } catch (err: any) {
      alert(err.message);
    }
  };

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
            Plan your dream gold & diamond acquisitions with structured monthly deposits and guaranteed patron bonuses from Aurelle.
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
                {enrollments.length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-[#18140F] text-[#D8B47A] text-[10px]">
                    {enrollments.length}
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
                        + {scheme.bonusPercentage}% Bonus
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
                      <span>You Pay (10 Months):</span>
                      <strong className="text-white">{formatINR(totalCustomerContribution)}</strong>
                    </div>
                    <div className="flex justify-between text-[#10B981]">
                      <span>Aurelle Contribution (11th Month):</span>
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
            {enrollments.length === 0 ? (
              <div className="text-center py-16 bg-[#120F0B] border border-[#241F18] rounded-2xl p-8">
                <Sparkles className="w-12 h-12 text-[#D8B47A] mx-auto mb-3" />
                <h3 className="font-serif-luxury text-2xl font-bold text-white mb-2">
                  No Active Scheme Enrolled
                </h3>
                <p className="text-xs text-gray-400 max-w-sm mx-auto mb-6">
                  Begin your precious metal journey today with as little as ₹5,000/month.
                </p>
                <button
                  onClick={() => setActiveTab('schemes')}
                  className="px-6 py-2.5 rounded-lg bg-[#D8B47A] text-[#090806] text-xs font-bold uppercase tracking-wider"
                >
                  Browse Available Schemes
                </button>
              </div>
            ) : (
              enrollments.map((enr) => (
                <div
                  key={enr.id}
                  className="bg-[#120F0B] border border-[#2B2319] rounded-2xl p-6 space-y-6"
                >
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-4 border-b border-[#241F18] gap-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-400">Folio #{enr.id}</span>
                      <h3 className="font-serif-luxury text-xl font-bold text-white">{enr.schemeName}</h3>
                      <p className="text-xs text-gray-400 mt-0.5">Patron: {enr.customerName} ({enr.customerPhone})</p>
                    </div>

                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/40 self-start sm:self-auto">
                      {enr.status}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-gray-400">Installments Completed:</span>
                      <span className="font-bold text-[#D8B47A]">
                        {enr.installmentsPaid} of {enr.tenureMonths - 1} Months Paid
                      </span>
                    </div>
                    <div className="w-full bg-[#1C1712] rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-[#D8B47A] h-full rounded-full transition-all duration-500"
                        style={{ width: `${(enr.installmentsPaid / (enr.tenureMonths - 1)) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div className="p-3 rounded-xl bg-[#18140F] border border-[#241F18]">
                      <span className="text-gray-400 block text-[10px] uppercase">Monthly Deposit</span>
                      <span className="text-sm font-bold text-white mt-0.5">{formatINR(enr.monthlyAmount)}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#18140F] border border-[#241F18]">
                      <span className="text-gray-400 block text-[10px] uppercase">Accumulated Total</span>
                      <span className="text-sm font-bold text-[#34D399] mt-0.5">{formatINR(enr.monthlyAmount * enr.installmentsPaid)}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#18140F] border border-[#241F18]">
                      <span className="text-gray-400 block text-[10px] uppercase">Next Due Date</span>
                      <span className="text-sm font-bold text-white mt-0.5">{enr.nextDueDate}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#18140F] border border-[#241F18]">
                      <span className="text-gray-400 block text-[10px] uppercase">Maturity Date</span>
                      <span className="text-sm font-bold text-[#D8B47A] mt-0.5">{enr.maturityDate}</span>
                    </div>
                  </div>

                  {/* Remit Next Installment Button */}
                  {enr.status === 'ACTIVE' && enr.installmentsPaid < enr.tenureMonths - 1 && (
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => handlePayInstallment(enr.id)}
                        className="px-6 py-2.5 rounded-lg bg-[#D8B47A] hover:bg-[#EBD5A8] text-[#090806] text-xs font-bold uppercase tracking-wider flex items-center gap-2"
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>Pay Installment #{enr.installmentsPaid + 1} ({formatINR(enr.monthlyAmount)})</span>
                      </button>
                    </div>
                  )}

                  {/* Payment Records Accordion */}
                  <div className="pt-4 border-t border-[#241F18]">
                    <h5 className="text-xs uppercase font-bold text-gray-400 mb-3">Installment Receipts Log</h5>
                    <div className="space-y-2">
                      {enr.paymentsHistory.map((p) => (
                        <div
                          key={p.installmentNo}
                          className="bg-[#18140F] border border-[#241F18] rounded-lg p-2.5 flex justify-between items-center text-xs"
                        >
                          <div>
                            <span className="font-semibold text-white">Month #{p.installmentNo} Paid</span>
                            <span className="text-gray-400 text-[11px] ml-2">Receipt: {p.receiptNo} • {p.paidDate}</span>
                          </div>
                          <span className="font-bold text-[#34D399]">{formatINR(p.amount)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Enrollment Modal */}
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
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-[#D8B47A] hover:bg-[#1E1912] focus:outline-none focus:ring-2 focus:ring-[#D8B47A] text-xl font-light leading-none"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleEnrollSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-gray-400 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={enrollName}
                  onChange={(e) => setEnrollName(e.target.value)}
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
                    className="w-full bg-[#18140F] border border-[#2B2319] rounded p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-gray-400 block mb-1">Mobile Phone (for OTP & alerts)</label>
                  <input
                    type="tel"
                    required
                    value={enrollPhone}
                    onChange={(e) => setEnrollPhone(e.target.value)}
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
                  <span>Initial Installment due now:</span>
                  <span className="font-bold text-white">{formatINR(monthlyAmount)}</span>
                </div>
                <div className="flex justify-between text-[#34D399]">
                  <span>Bonus contributed by Aurelle:</span>
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
