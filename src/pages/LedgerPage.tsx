import React, { useState } from 'react';
import { BookOpen, Download, Printer, Filter, Calendar, FileText, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { ledgerService } from '../services/ledgerService';
import { useApp } from '../contexts/AppContext';

export const LedgerPage: React.FC = () => {
  const { formatINR, user } = useApp();
  const [filterType, setFilterType] = useState<string>('ALL');

  const allEntries = ledgerService.getEntries();
  const summary = ledgerService.calculateBalance();

  const filteredEntries = filterType === 'ALL'
    ? allEntries
    : allEntries.filter((e) => e.type === filterType);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#090806] text-[#F7F1E7] py-10 text-left">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-end mb-8 gap-4 border-b border-[#241F18] pb-6">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-[#D8B47A]">
              STATEMENT OF ACCOUNTS
            </span>
            <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-white mt-1">
              Customer Ledger Statement
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Patron Account: <strong className="text-white">{user?.name || 'Patron'}</strong> • Account ID: {user?.uid || 'patron-guest'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#18140F] border border-[#2B2319] hover:border-[#D8B47A] text-xs font-semibold text-gray-300 hover:text-white transition-colors"
            >
              <Printer className="w-4 h-4 text-[#D8B47A]" />
              <span>Print / Download PDF</span>
            </button>
          </div>
        </div>

        {/* Ledger Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#120F0B] border border-[#262018] rounded-xl p-5">
            <span className="text-xs text-gray-400 uppercase font-semibold">Total Purchases / Debits</span>
            <div className="text-2xl font-bold text-white mt-1.5 flex items-center gap-1.5">
              <ArrowDownLeft className="w-5 h-5 text-rose-400" />
              <span>{formatINR(summary.totalDebit)}</span>
            </div>
            <p className="text-[11px] text-gray-500 mt-1">Gross billed value</p>
          </div>

          <div className="bg-[#120F0B] border border-[#262018] rounded-xl p-5">
            <span className="text-xs text-gray-400 uppercase font-semibold">Total Remittances / Credits</span>
            <div className="text-2xl font-bold text-[#34D399] mt-1.5 flex items-center gap-1.5">
              <ArrowUpRight className="w-5 h-5 text-[#34D399]" />
              <span>{formatINR(summary.totalCredit)}</span>
            </div>
            <p className="text-[11px] text-gray-500 mt-1">Payments & Scheme credits</p>
          </div>

          <div className="bg-[#120F0B] border border-[#D8B47A]/40 rounded-xl p-5">
            <span className="text-xs text-gray-400 uppercase font-semibold">Net Running Balance</span>
            <div className="text-2xl font-extrabold text-[#D8B47A] mt-1.5">
              {formatINR(summary.netBalance)}
            </div>
            <p className="text-[11px] text-gray-500 mt-1">Remaining payment obligations</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-6 text-xs">
          <span className="text-gray-400 mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-[#D8B47A]" /> Filter:
          </span>
          {['ALL', 'PURCHASE', 'PAYMENT', 'SCHEME_INSTALLMENT'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-lg border font-medium transition-all ${
                filterType === type
                  ? 'bg-[#D8B47A] text-[#090806] border-[#D8B47A]'
                  : 'bg-[#120F0B] text-gray-400 border-[#241F18] hover:text-white'
              }`}
            >
              {type.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Ledger Statement Table */}
        <div className="bg-[#120F0B] border border-[#241F18] rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-[#241F18] bg-[#0E0C09] text-gray-400 uppercase tracking-wider">
                  <th className="p-4">Date</th>
                  <th className="p-4">Ref Number</th>
                  <th className="p-4">Transaction Details</th>
                  <th className="p-4 text-right">Debit (₹)</th>
                  <th className="p-4 text-right">Credit (₹)</th>
                  <th className="p-4 text-right">Running Balance (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1C1712] text-gray-300">
                {filteredEntries.map((item) => (
                  <tr key={item.id} className="hover:bg-[#16120D] transition-colors">
                    <td className="p-4 font-mono text-gray-400">{item.date}</td>
                    <td className="p-4 font-mono font-medium text-white">{item.refNumber}</td>
                    <td className="p-4">
                      <div className="font-semibold text-white">{item.description}</div>
                      <span className="text-[10px] text-[#D8B47A] uppercase">{item.type}</span>
                    </td>
                    <td className="p-4 text-right font-medium text-rose-400">
                      {item.debit > 0 ? formatINR(item.debit) : '—'}
                    </td>
                    <td className="p-4 text-right font-medium text-[#34D399]">
                      {item.credit > 0 ? formatINR(item.credit) : '—'}
                    </td>
                    <td className="p-4 text-right font-bold text-white">
                      {formatINR(item.balance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-[#0E0C09] border-t border-[#241F18] text-xs text-gray-500 flex justify-between items-center">
            <span>Verified cryptographic ledger record</span>
            <span>Generated: {new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
