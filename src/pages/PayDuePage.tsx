import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, CreditCard, ShieldCheck, CheckCircle2, Receipt, AlertCircle, Calendar } from 'lucide-react';
import confetti from 'canvas-confetti';
import { payDueService } from '../services/payDueService';
import { PayDueRecord } from '../types';
import { useApp } from '../contexts/AppContext';

export const PayDuePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { formatINR, showToast } = useApp();

  const initialSearch = searchParams.get('search') || 'AUR-INV-2026-8941';
  const [query, setQuery] = useState(initialSearch);
  const [record, setRecord] = useState<PayDueRecord | undefined>(undefined);
  const [hasSearched, setHasSearched] = useState(false);
  const [payAmount, setPayAmount] = useState<number>(0);
  const [paymentMode, setPaymentMode] = useState('UPI');
  const [isProcessing, setIsProcessing] = useState(false);
  const [payModalOpen, setPayModalOpen] = useState(false);

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
      handleSearch(initialSearch);
    }
  }, [initialSearch]);

  const handleSearch = (searchVal: string) => {
    setHasSearched(true);
    const found = payDueService.findByQuery(searchVal);
    setRecord(found);
    if (found) {
      setPayAmount(found.balanceDue);
    }
  };

  const handlePaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!record) return;
    if (payAmount <= 0 || payAmount > record.balanceDue) {
      alert('Please enter a valid amount up to outstanding balance.');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      try {
        const updated = payDueService.recordPayment(record.id, payAmount, paymentMode);
        setRecord({ ...updated });
        setPayModalOpen(false);
        setIsProcessing(false);
        showToast(`Payment of ${formatINR(payAmount)} received successfully!`, 'success');

        try {
          confetti({
            particleCount: 70,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#D8B47A', '#10B981', '#F7F1E7'],
          });
        } catch {
          // safe
        }
      } catch (err: any) {
        setIsProcessing(false);
        alert(err.message || 'Payment error');
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#090806] text-[#F7F1E7] py-10 text-left">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-xs uppercase font-bold tracking-widest text-[#D8B47A]">
            CUSTOMER PAYMENT PORTAL
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-white mt-1">
            Check & Pay Outstanding Dues
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-2 max-w-lg mx-auto">
            Look up verified jewellery purchase invoices, view partial payments, and settle balances with instant digital receipts.
          </p>
        </div>

        {/* Search Input Box */}
        <div className="bg-[#120F0B] border border-[#2B2319] rounded-2xl p-6 mb-8 shadow-xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch(query);
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                required
                placeholder="Enter Invoice / Bill No (e.g. AUR-INV-2026-8941) or Mobile No"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-[#18140F] border border-[#2C2720] rounded-xl pl-11 pr-4 py-3 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#D8B47A]"
              />
            </div>
            <button
              type="submit"
              className="px-8 py-3 rounded-xl bg-[#D8B47A] hover:bg-[#EBD5A8] text-[#090806] text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-[#D8B47A]/15"
            >
              Verify Record
            </button>
          </form>

          {/* Quick Demo Pill buttons */}
          <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
            <span>Quick sample bills:</span>
            <button
              type="button"
              onClick={() => {
                setQuery('AUR-INV-2026-8941');
                handleSearch('AUR-INV-2026-8941');
              }}
              className="text-[#D8B47A] hover:underline"
            >
              AUR-INV-2026-8941 (Partially Paid)
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => {
                setQuery('AUR-INV-2026-9023');
                handleSearch('AUR-INV-2026-9023');
              }}
              className="text-[#D8B47A] hover:underline"
            >
              AUR-INV-2026-9023 (Pending)
            </button>
          </div>
        </div>

        {/* Search Result Record Display */}
        {record ? (
          <div className="space-y-6">
            {/* Main Bill Card */}
            <div className="bg-[#120F0B] border border-[#2B2319] rounded-2xl p-6 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-4 border-b border-[#241F18] gap-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400">Invoice Reference</span>
                  <h3 className="font-mono text-base font-bold text-white">{record.billNumber}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Item: {record.orderSummary}</p>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                      record.status === 'PAID'
                        ? 'bg-[#10B981]/20 text-[#34D399] border-[#10B981]/40'
                        : record.status === 'PARTIALLY_PAID'
                        ? 'bg-[#F59E0B]/20 text-[#FBBF24] border-[#F59E0B]/40'
                        : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    }`}
                  >
                    {record.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Amounts Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-5 border-b border-[#241F18]">
                <div className="bg-[#18140F] border border-[#241F18] rounded-xl p-4">
                  <span className="text-xs text-gray-400 block">Total Invoice Amount</span>
                  <div className="text-lg font-bold text-white mt-1">{formatINR(record.totalAmount)}</div>
                </div>

                <div className="bg-[#18140F] border border-[#241F18] rounded-xl p-4">
                  <span className="text-xs text-gray-400 block">Amount Paid to Date</span>
                  <div className="text-lg font-bold text-[#34D399] mt-1">{formatINR(record.amountPaid)}</div>
                </div>

                <div className="bg-[#18140F] border border-[#241F18] rounded-xl p-4">
                  <span className="text-xs text-gray-400 block">Outstanding Balance Due</span>
                  <div className="text-lg font-extrabold text-[#D8B47A] mt-1">{formatINR(record.balanceDue)}</div>
                </div>
              </div>

              {/* Customer details & Due date */}
              <div className="py-4 flex flex-col sm:flex-row justify-between sm:items-center text-xs text-gray-400 gap-2">
                <div>
                  Customer: <strong className="text-white">{record.customerName}</strong> ({record.customerPhone})
                </div>
                <div className="flex items-center gap-1.5 text-gray-300">
                  <Calendar className="w-4 h-4 text-[#D8B47A]" />
                  <span>Due by: <strong className="text-white">{record.dueDate}</strong></span>
                </div>
              </div>

              {/* Action Button */}
              {record.balanceDue > 0 ? (
                <div className="pt-2">
                  <button
                    onClick={() => setPayModalOpen(true)}
                    className="w-full py-3.5 rounded-xl bg-[#D8B47A] hover:bg-[#EBD5A8] text-[#090806] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-[#D8B47A]/15 transition-all"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Pay Balance Now ({formatINR(record.balanceDue)})</span>
                  </button>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-[#10B981]/10 border border-[#10B981]/30 text-[#34D399] text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                  <span>This invoice has been fully settled. No balance is currently due.</span>
                </div>
              )}
            </div>

            {/* Payment Receipts History */}
            <div className="bg-[#120F0B] border border-[#2B2319] rounded-2xl p-6">
              <h4 className="text-xs uppercase font-bold tracking-wider text-[#D8B47A] mb-4 flex items-center gap-2">
                <Receipt className="w-4 h-4" />
                <span>Verified Payment Receipts History</span>
              </h4>

              {record.paymentsHistory.length === 0 ? (
                <p className="text-xs text-gray-500 py-4 text-center">No payment receipts recorded yet for this invoice.</p>
              ) : (
                <div className="space-y-3">
                  {record.paymentsHistory.map((receipt) => (
                    <div
                      key={receipt.id}
                      className="bg-[#18140F] border border-[#241F18] rounded-xl p-3.5 flex flex-col sm:flex-row justify-between sm:items-center text-xs gap-2"
                    >
                      <div>
                        <span className="font-mono font-semibold text-white">{receipt.receiptNumber}</span>
                        <div className="text-gray-400 text-[11px] mt-0.5">
                          {receipt.date} • Mode: {receipt.paymentMode}
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="text-sm font-bold text-[#34D399]">{formatINR(receipt.amount)}</span>
                        <button
                          type="button"
                          onClick={() => alert(`Receipt ${receipt.receiptNumber} printed: ₹${receipt.amount} paid on ${receipt.date}`)}
                          className="px-2.5 py-1 text-[11px] rounded bg-[#241E17] text-[#D8B47A] border border-[#D8B47A]/30 hover:bg-[#D8B47A] hover:text-black"
                        >
                          Print Receipt
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          hasSearched && (
            <div className="bg-[#120F0B] border border-[#2B2319] rounded-2xl p-8 text-center text-xs text-gray-400">
              <AlertCircle className="w-8 h-8 text-rose-400 mx-auto mb-2" />
              <p className="text-sm text-white font-semibold">No record found matching &quot;{query}&quot;</p>
              <p className="mt-1">Please verify the bill or order reference and try again.</p>
            </div>
          )
        )}
      </div>

      {/* Pay Online Modal */}
      {payModalOpen && record && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md transition-opacity"
          onClick={() => {
            if (!isProcessing) setPayModalOpen(false);
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="pay-modal-title"
        >
          <div
            className="relative bg-[#120F0B] border border-[#D8B47A]/40 rounded-2xl max-w-md w-full p-6 text-left shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top-Right Close Button with proper multiplication sign × */}
            <button
              type="button"
              id="close-pay-modal-btn"
              onClick={() => {
                if (!isProcessing) setPayModalOpen(false);
              }}
              disabled={isProcessing}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#1A1510] hover:bg-[#251E17] text-[#D8B47A] hover:text-white border border-[#D8B47A]/30 flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed z-20 group focus:outline-none focus:ring-2 focus:ring-[#D8B47A]/50"
              aria-label="Close popup"
              title="Close (Esc)"
            >
              <span className="text-2xl font-light leading-none select-none group-hover:scale-110 transition-transform" aria-hidden="true">
                &times;
              </span>
            </button>

            {/* Header */}
            <div className="pr-10 mb-4">
              <h3 id="pay-modal-title" className="font-serif-luxury text-base sm:text-lg font-bold text-white tracking-wide">
                SETTLE OUTSTANDING PAYMENT
              </h3>
              <p className="text-xs text-[#D8B47A] font-mono mt-0.5">Invoice: {record.billNumber}</p>
            </div>

            {isProcessing && (
              <div className="mb-4 p-2.5 rounded-lg bg-[#D8B47A]/10 border border-[#D8B47A]/30 text-xs text-[#D8B47A] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#D8B47A] animate-ping" />
                <span>Processing bank gateway reconciliation... Please do not close.</span>
              </div>
            )}

            <form onSubmit={handlePaySubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-gray-400 block mb-1">Payment Amount (₹)</label>
                <input
                  type="number"
                  min="1"
                  max={record.balanceDue}
                  required
                  disabled={isProcessing}
                  value={payAmount}
                  onChange={(e) => setPayAmount(parseInt(e.target.value) || 0)}
                  className="w-full bg-[#18140F] border border-[#2B2319] rounded p-2.5 text-sm font-bold text-white focus:outline-none focus:border-[#D8B47A] disabled:opacity-50"
                />
                <span className="text-[11px] text-gray-500 mt-1 block">
                  Remaining balance after payment: {formatINR(Math.max(0, record.balanceDue - payAmount))}
                </span>
              </div>

              <div>
                <label className="text-gray-400 block mb-1">Select Payment Gateway</label>
                <div className="grid grid-cols-3 gap-2">
                  {['UPI', 'Card', 'Net Banking'].map((m) => (
                    <button
                      key={m}
                      type="button"
                      disabled={isProcessing}
                      onClick={() => setPaymentMode(m)}
                      className={`p-2 rounded text-center border font-medium transition-colors ${
                        paymentMode === m
                          ? 'bg-[#D8B47A] text-[#090806] border-[#D8B47A]'
                          : 'bg-[#18140F] text-gray-300 border-[#2B2319] hover:border-[#D8B47A]/40'
                      } disabled:opacity-50`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#241F18] flex justify-between items-center">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => setPayModalOpen(false)}
                  className="text-gray-400 hover:text-white disabled:opacity-40"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing || payAmount <= 0}
                  className="px-6 py-2.5 rounded-lg bg-[#D8B47A] text-[#090806] font-bold uppercase tracking-wider hover:bg-[#EBD5A8] disabled:opacity-50 shadow-lg transition-all"
                >
                  {isProcessing ? 'Processing Payment...' : `Confirm Payment of ${formatINR(payAmount)}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
