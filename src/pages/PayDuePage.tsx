import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  CreditCard, 
  ShieldCheck, 
  CheckCircle2, 
  Receipt, 
  AlertCircle, 
  Calendar,
  Lock,
  Printer,
  Sparkles,
  QrCode,
  ArrowRight,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { payDueService } from '../services/payDueService';
import { PayDueRecord } from '../types';
import { useApp } from '../contexts/AppContext';

export const PayDuePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { formatINR, showToast, user, isAdmin } = useApp();

  const initialSearch = searchParams.get('search') || '';
  const [query, setQuery] = useState(initialSearch);
  const [contactCheck, setContactCheck] = useState('');
  const [record, setRecord] = useState<PayDueRecord | undefined>(undefined);
  const [maskedRecord, setMaskedRecord] = useState<Partial<PayDueRecord> | undefined>(undefined);
  const [requiresContact, setRequiresContact] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState<string | null>(null);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  // Payment modal state
  const [payAmount, setPayAmount] = useState<number>(0);
  const [paymentMode, setPaymentMode] = useState<'UPI' | 'CARD' | 'NET_BANKING'>('UPI');
  const [isProcessing, setIsProcessing] = useState(false);
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [latestReceipt, setLatestReceipt] = useState<{ receiptNumber: string; amount: number; date: string } | null>(null);

  // Close modal on Escape key press (unless payment is processing)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && payModalOpen && !isProcessing) {
        setPayModalOpen(false);
      }
    };
    if (payModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [payModalOpen, isProcessing]);

  useEffect(() => {
    if (initialSearch) {
      handleVerifyRecord(initialSearch);
    }
  }, [initialSearch]);

  const handleVerifyRecord = async (searchVal: string, contactVal?: string) => {
    const trimmed = (searchVal || '').trim();
    if (!trimmed) {
      setVerificationError('Please enter a valid Invoice ID (e.g. AUR-INV-2026-8941) or registered mobile number.');
      setVerificationSuccess(null);
      setRecord(undefined);
      setMaskedRecord(undefined);
      return;
    }

    setIsVerifying(true);
    setVerificationError(null);
    setVerificationSuccess(null);
    setHasSearched(true);

    try {
      const activeContact = contactVal !== undefined ? contactVal : contactCheck;
      const result = await payDueService.verifyRecord(trimmed, activeContact, user, isAdmin);

      if (result.success && result.record && result.verified) {
        setRecord(result.record);
        setMaskedRecord(undefined);
        setRequiresContact(false);
        setPayAmount(result.record.balanceDue);
        setVerificationSuccess(`Record successfully verified with Aurelle Guild Registry for ${result.record.billNumber}`);
        showToast(`Record verified: ${result.record.billNumber}`, 'success');
      } else if (result.success && result.requiresContact) {
        setMaskedRecord(result.maskedRecord);
        setRecord(result.record);
        setRequiresContact(true);
        setVerificationError(null);
      } else {
        setRecord(undefined);
        setMaskedRecord(undefined);
        setRequiresContact(false);
        setVerificationError(result.error || `No verified invoice found matching "${trimmed}". Please check the reference on your bill.`);
      }
    } catch (e: any) {
      setRecord(undefined);
      setMaskedRecord(undefined);
      setVerificationError(e.message || 'Verification service error. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handlePaySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!record) return;
    if (payAmount <= 0 || payAmount > record.balanceDue) {
      alert(`Please enter a valid amount between ₹1 and ${formatINR(record.balanceDue)}`);
      return;
    }

    setIsProcessing(true);
    try {
      // Record payment against verified database
      const updated = await payDueService.recordPayment(record.id, payAmount, paymentMode, false);
      setRecord({ ...updated });
      setPayModalOpen(false);

      const generatedReceipt = updated.paymentsHistory[0];
      setLatestReceipt({
        receiptNumber: generatedReceipt.receiptNumber,
        amount: generatedReceipt.amount,
        date: generatedReceipt.date,
      });

      showToast(`Payment of ${formatINR(payAmount)} verified & recorded!`, 'success');

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D8B47A', '#10B981', '#F7F1E7'],
        });
      } catch {}
    } catch (err: any) {
      alert(err.message || 'Payment processing error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090806] text-[#F7F1E7] py-12 text-left">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-xs uppercase font-bold tracking-widest text-[#D8B47A]">
            CUSTOMER PAYMENT & STATUS VERIFICATION
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-white mt-1">
            Check & Pay Outstanding Dues
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-2 max-w-lg mx-auto">
            Look up verified jewellery purchase invoices, inspect partial payments, and settle balances with instant digital receipts.
          </p>
        </div>

        {/* Search Input Box */}
        <div className="bg-[#120F0B] border border-[#2B2319] rounded-2xl p-6 mb-8 shadow-xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!isVerifying) {
                handleVerifyRecord(query);
              }
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Enter Invoice / Bill No (e.g. AUR-INV-2026-8941) or Registered Mobile"
                value={query}
                disabled={isVerifying}
                onChange={(e) => {
                  setQuery(e.target.value);
                  if (verificationError) setVerificationError(null);
                }}
                className="w-full bg-[#18140F] border border-[#2C2720] rounded-xl pl-11 pr-4 py-3 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#D8B47A] disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              id="verify-record-btn"
              data-testid="verify-record-btn"
              disabled={isVerifying}
              className="px-8 py-3 rounded-xl bg-[#D8B47A] hover:bg-[#EBD5A8] text-[#090806] text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-[#D8B47A]/15 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer flex-shrink-0"
            >
              {isVerifying ? (
                <>
                  <span className="w-4 h-4 border-2 border-[#090806] border-t-transparent rounded-full animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify Record</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Pill buttons */}
          <div className="mt-3 flex items-center gap-2 text-xs text-gray-400 flex-wrap">
            <span>Quick sample bills:</span>
            <button
              type="button"
              disabled={isVerifying}
              onClick={() => {
                setQuery('AUR-INV-2026-8941');
                setContactCheck('9876543210');
                handleVerifyRecord('AUR-INV-2026-8941', '9876543210');
              }}
              className="text-[#D8B47A] hover:underline disabled:opacity-50 font-mono text-[11px]"
            >
              AUR-INV-2026-8941 (Partially Paid)
            </button>
            <span>•</span>
            <button
              type="button"
              disabled={isVerifying}
              onClick={() => {
                setQuery('AUR-INV-2026-9023');
                setContactCheck('9123456789');
                handleVerifyRecord('AUR-INV-2026-9023', '9123456789');
              }}
              className="text-[#D8B47A] hover:underline disabled:opacity-50 font-mono text-[11px]"
            >
              AUR-INV-2026-9023 (Pending)
            </button>
          </div>

          {/* Verification Feedback Alerts */}
          {verificationSuccess && (
            <div className="mt-4 p-3.5 rounded-xl bg-[#10B981]/10 border border-[#10B981]/40 text-[#34D399] text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <div>
                <strong className="block font-semibold">Verification Successful</strong>
                <span>{verificationSuccess}</span>
              </div>
            </div>
          )}

          {verificationError && (
            <div className="mt-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
              <div>
                <strong className="block font-semibold">Verification Notice</strong>
                <span>{verificationError}</span>
              </div>
            </div>
          )}

          {/* Secondary Challenge for unauthenticated inquiries */}
          {requiresContact && maskedRecord && (
            <div className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 space-y-3">
              <div className="flex items-start gap-2.5">
                <Lock className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-white text-sm">Customer Privacy Challenge</h5>
                  <p className="text-gray-300 mt-0.5">
                    Invoice <span className="font-mono font-bold text-white">{maskedRecord.billNumber}</span> identified for patron <strong className="text-white">{maskedRecord.customerName}</strong>.
                    To view complete invoice financials and proceed to settlement, enter the registered mobile number (or last 4 digits):
                  </p>
                </div>
              </div>

              <div className="flex gap-2 pt-1 max-w-md">
                <input
                  type="text"
                  placeholder="Registered Mobile / Last 4 Digits"
                  value={contactCheck}
                  onChange={(e) => setContactCheck(e.target.value)}
                  className="flex-1 bg-[#18140F] border border-amber-500/40 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
                />
                <button
                  type="button"
                  onClick={() => handleVerifyRecord(query, contactCheck)}
                  disabled={isVerifying}
                  className="px-4 py-2 rounded-lg bg-[#D8B47A] text-[#090806] font-bold uppercase tracking-wider text-xs hover:bg-[#EBD5A8]"
                >
                  Confirm & Unlock
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Verified Record Card */}
        {record && (
          <div className="space-y-6">
            {/* Audit Seal Banner */}
            <div
              className={`p-4 rounded-xl border text-xs flex items-start gap-3 shadow-md ${
                record.status === 'PAID'
                  ? 'bg-[#10B981]/10 border-[#10B981]/40 text-[#34D399]'
                  : record.status === 'PARTIALLY_PAID'
                  ? 'bg-[#F59E0B]/10 border-[#F59E0B]/40 text-[#FBBF24]'
                  : 'bg-rose-500/10 border-rose-500/40 text-rose-300'
              }`}
            >
              <ShieldCheck className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-sm tracking-wide text-white">
                  {record.status === 'PAID'
                    ? 'VERIFIED & RECONCILED INVOICE (100% SETTLED)'
                    : record.status === 'PARTIALLY_PAID'
                    ? 'PARTIALLY VERIFIED INVOICE (RECONCILED PAYMENTS)'
                    : 'UNSETTLED INVOICE / PAYMENT PENDING'}
                </h5>
                <p className="mt-1 text-xs opacity-90">
                  {record.status === 'PAID'
                    ? `All payments totalling ${formatINR(record.totalAmount)} have been verified and reconciled with the Aurelle Guild Ledger.`
                    : record.status === 'PARTIALLY_PAID'
                    ? `Verified payments of ${formatINR(record.amountPaid)} recorded. An outstanding balance of ${formatINR(record.balanceDue)} remains due by ${record.dueDate}.`
                    : `Full payment of ${formatINR(record.totalAmount)} is due by ${record.dueDate}. Settle balance to confirm boutique collection.`}
                </p>
              </div>
            </div>

            {/* Main Record Card */}
            <div className="bg-[#120F0B] border border-[#2B2319] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
              {/* Top Row: Invoice ID, Date & Status */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-6 border-b border-[#241F18] gap-3">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block mb-1">
                    Official Boutique Bill Number
                  </span>
                  <h3 className="font-mono text-xl sm:text-2xl font-bold text-white">
                    {record.billNumber}
                  </h3>
                  <span className="text-xs text-gray-400 mt-1 block">
                    Customer: <strong className="text-white">{record.customerName}</strong> ({record.customerPhone})
                  </span>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block mb-1">
                    Settlement Status
                  </span>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                      record.status === 'PAID'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : record.status === 'PARTIALLY_PAID'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    }`}
                  >
                    {record.status}
                  </span>
                  <span className="text-xs text-gray-400 block mt-1 font-mono">
                    Due: {record.dueDate}
                  </span>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-[#18140F] border border-[#221C15] rounded-xl p-4 text-xs text-gray-300">
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block mb-1">
                  Bespoke Jewellery Item(s)
                </span>
                <p className="font-medium text-white text-sm">{record.orderSummary}</p>
              </div>

              {/* Amounts Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#18140F] border border-[#221C15] rounded-xl p-4">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block">
                    Total Billed Amount
                  </span>
                  <span className="font-serif-luxury text-xl sm:text-2xl font-bold text-white mt-1 block">
                    {formatINR(record.totalAmount)}
                  </span>
                </div>

                <div className="bg-[#18140F] border border-[#221C15] rounded-xl p-4">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block">
                    Amount Already Paid
                  </span>
                  <span className="font-serif-luxury text-xl sm:text-2xl font-bold text-emerald-400 mt-1 block">
                    {formatINR(record.amountPaid)}
                  </span>
                </div>

                <div className="bg-[#18140F] border border-[#D8B47A]/40 rounded-xl p-4">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#D8B47A] block">
                    Outstanding Balance Due
                  </span>
                  <span className="font-serif-luxury text-xl sm:text-2xl font-extrabold text-[#D8B47A] mt-1 block">
                    {formatINR(record.balanceDue)}
                  </span>
                </div>
              </div>

              {/* Action Buttons: Pay Balance Now */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                {record.balanceDue > 0 ? (
                  <button
                    type="button"
                    onClick={() => {
                      setPayAmount(record.balanceDue);
                      setPayModalOpen(true);
                    }}
                    className="flex-1 py-3.5 px-6 rounded-xl bg-[#D8B47A] hover:bg-[#EBD5A8] text-[#090806] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Pay Balance Now ({formatINR(record.balanceDue)})</span>
                  </button>
                ) : (
                  <div className="flex-1 py-3 px-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Invoice Fully Settled (Zero Balance)</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="py-3 px-6 rounded-xl bg-[#18140F] hover:bg-[#221C15] border border-[#2B2319] text-gray-300 hover:text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                >
                  <Printer className="w-4 h-4 text-[#D8B47A]" />
                  <span>Print Receipt</span>
                </button>
              </div>

              {/* Transaction History Table */}
              <div className="pt-4 border-t border-[#241F18]">
                <h4 className="font-serif-luxury text-base font-bold text-white mb-3">
                  Verified Payment Receipts History ({record.paymentsHistory.length})
                </h4>

                {record.paymentsHistory.length === 0 ? (
                  <p className="text-xs text-gray-500 italic">No payments have been recorded for this invoice yet.</p>
                ) : (
                  <div className="bg-[#18140F] border border-[#221C15] rounded-xl overflow-hidden">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="border-b border-[#241F18] bg-[#14100C] text-gray-400 uppercase text-[10px] tracking-wider">
                          <th className="p-3">Receipt No.</th>
                          <th className="p-3">Date</th>
                          <th className="p-3">Payment Mode</th>
                          <th className="p-3 text-right">Amount Settled</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#221C15] text-gray-300">
                        {record.paymentsHistory.map((pmt) => (
                          <tr key={pmt.id} className="hover:bg-[#1C1711] transition-colors">
                            <td className="p-3 font-mono text-[#D8B47A] font-semibold">{pmt.receiptNumber}</td>
                            <td className="p-3 font-mono text-gray-400">{pmt.date}</td>
                            <td className="p-3">{pmt.paymentMode}</td>
                            <td className="p-3 text-right font-serif-luxury text-white font-bold">
                              {formatINR(pmt.amount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Pay Balance Modal */}
        {payModalOpen && record && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto overscroll-contain animate-in fade-in duration-200"
            onClick={() => {
              if (!isProcessing) setPayModalOpen(false);
            }}
            role="dialog"
            aria-modal="true"
          >
            <div
              className="relative bg-[#120F0B] border border-[#D8B47A]/50 rounded-2xl max-w-lg w-full p-4 sm:p-7 text-left shadow-2xl my-auto max-h-[92vh] overflow-y-auto overscroll-contain"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => {
                  if (!isProcessing) setPayModalOpen(false);
                }}
                disabled={isProcessing}
                aria-label="Close modal"
                className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 w-9 h-9 rounded-full bg-[#18140F] hover:bg-[#251E17] text-gray-400 hover:text-white flex items-center justify-center text-xl font-light disabled:opacity-40 transition-colors"
              >
                ×
              </button>

              <div className="mb-4 sm:mb-5 pb-3 border-b border-[#241F18] pr-8">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#D8B47A]">
                  SECURE PAYMENT DISPATCH
                </span>
                <h3 className="font-serif-luxury text-lg sm:text-xl font-bold text-white mt-0.5 break-words">
                  Settle Due Balance: {record.billNumber}
                </h3>
              </div>

              {/* Gateway Notice Banner */}
              <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2.5">
                <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="text-[11px] sm:text-xs">
                  <strong>Boutique Payment Clearing:</strong> Payments recorded here instantly reconcile your account balance, register in your customer ledger, and issue an official receipt.
                </div>
              </div>

              <form onSubmit={handlePaySubmit} className="space-y-4 text-xs">
                <div>
                  <label className="text-gray-300 block mb-1 font-medium">Remittance Amount (₹)</label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min={1}
                      max={record.balanceDue}
                      value={payAmount}
                      onChange={(e) => setPayAmount(parseInt(e.target.value) || 0)}
                      className="w-full bg-[#18140F] border border-[#2C2720] focus:border-[#D8B47A] rounded-xl p-3 pr-28 sm:pr-36 text-white font-bold text-base focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setPayAmount(record.balanceDue)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] sm:text-[10px] text-[#D8B47A] uppercase font-bold tracking-wider hover:underline bg-[#221B14] px-2 py-1 rounded"
                    >
                      Pay Full Due
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-gray-300 block mb-1 font-medium">Select Payment Method</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMode('UPI')}
                      className={`p-3 rounded-xl border flex sm:flex-col items-center justify-start sm:justify-center gap-2.5 sm:gap-1 transition-all ${
                        paymentMode === 'UPI'
                          ? 'bg-[#D8B47A]/15 border-[#D8B47A] text-[#D8B47A]'
                          : 'bg-[#18140F] border-[#2C2720] text-gray-400 hover:text-white'
                      }`}
                    >
                      <QrCode className="w-5 h-5 flex-shrink-0" />
                      <span className="font-semibold block text-[11px]">UPI / QR</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMode('CARD')}
                      className={`p-3 rounded-xl border flex sm:flex-col items-center justify-start sm:justify-center gap-2.5 sm:gap-1 transition-all ${
                        paymentMode === 'CARD'
                          ? 'bg-[#D8B47A]/15 border-[#D8B47A] text-[#D8B47A]'
                          : 'bg-[#18140F] border-[#2C2720] text-gray-400 hover:text-white'
                      }`}
                    >
                      <CreditCard className="w-5 h-5 flex-shrink-0" />
                      <span className="font-semibold block text-[11px]">Credit Card</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMode('NET_BANKING')}
                      className={`p-3 rounded-xl border flex sm:flex-col items-center justify-start sm:justify-center gap-2.5 sm:gap-1 transition-all ${
                        paymentMode === 'NET_BANKING'
                          ? 'bg-[#D8B47A]/15 border-[#D8B47A] text-[#D8B47A]'
                          : 'bg-[#18140F] border-[#2C2720] text-gray-400 hover:text-white'
                      }`}
                    >
                      <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                      <span className="font-semibold block text-[11px]">Net Banking</span>
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-3.5 rounded-xl bg-[#D8B47A] hover:bg-[#EBD5A8] text-[#090806] font-bold uppercase tracking-wider text-xs transition-colors shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isProcessing ? (
                      <>
                        <span className="w-4 h-4 border-2 border-[#090806] border-t-transparent rounded-full animate-spin" />
                        <span>Confirming Payment Settlement...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Confirm & Settle {formatINR(payAmount)}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
