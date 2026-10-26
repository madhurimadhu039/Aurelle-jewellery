import React from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  BookOpen, 
  CreditCard, 
  Sparkles, 
  ShieldCheck, 
  Layers, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export const AccountPage: React.FC = () => {
  const { user, switchRole, formatINR } = useApp();

  return (
    <div className="min-h-screen bg-[#090806] text-[#F7F1E7] selection:bg-[#D8B47A]/30 selection:text-[#D8B47A] py-14 text-left">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="text-xs text-gray-500 mb-4">
          <Link to="/" className="hover:text-white">Home</Link>
          <span className="mx-2 text-gray-700">/</span>
          <span className="text-[#D8B47A]">My Account</span>
        </nav>

        {/* Profile Card Header */}
        <div className="bg-[#120F0B] border border-[#241F18] rounded-2xl p-6 sm:p-8 mb-8 flex flex-col sm:flex-row justify-between sm:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#18140F] border border-[#D8B47A]/50 flex items-center justify-center text-[#D8B47A] text-2xl font-serif">
              {user.name.charAt(0)}
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#D8B47A]">
                REGISTERED AURELLE PATRON
              </span>
              <h1 className="font-serif-luxury text-2xl sm:text-3xl font-normal text-white mt-0.5">
                {user.name}
              </h1>
              <p className="text-xs text-gray-400 font-light mt-0.5">
                {user.email} • {user.phone || '+91 98765 43210'}
              </p>
            </div>
          </div>

          {/* Role Mode pill */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] text-gray-400 block uppercase">Current Access Role</span>
              <span className="text-xs font-bold text-[#D8B47A] uppercase">{user.role}</span>
            </div>
            <button
              onClick={() => switchRole(user.role === 'customer' ? 'admin' : 'customer')}
              className="px-4 py-2 rounded-full border border-[#D8B47A]/50 text-xs text-[#D8B47A] hover:bg-[#D8B47A] hover:text-[#090806] transition-colors"
            >
              Switch to {user.role === 'customer' ? 'Admin' : 'Customer'} Mode
            </button>
          </div>
        </div>

        {/* Main Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* 1. Heirloom Passport */}
          <Link
            to="/passport"
            className="bg-[#120F0B] border border-[#241F18] rounded-2xl p-6 hover:border-[#D8B47A]/60 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-full bg-[#18140F] border border-[#D8B47A]/40 flex items-center justify-center text-[#D8B47A] mb-4 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5 stroke-[1.5]" />
              </div>
              <h3 className="font-serif-luxury text-xl font-normal text-white group-hover:text-[#D8B47A] transition-colors">
                Heirloom Passport™
              </h3>
              <p className="text-xs text-[#A69C8E] mt-2 font-light leading-relaxed">
                View your registered jewellery certificates, BIS Hallmark HUIDs, and guild maintenance logs.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#1C1712] flex items-center text-xs font-semibold text-white group-hover:text-[#D8B47A]">
              <span>View Passport Record</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </Link>

          {/* 2. Jewellery Schemes */}
          <Link
            to="/schemes"
            className="bg-[#120F0B] border border-[#241F18] rounded-2xl p-6 hover:border-[#D8B47A]/60 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-full bg-[#18140F] border border-[#D8B47A]/40 flex items-center justify-center text-[#D8B47A] mb-4 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 stroke-[1.5]" />
              </div>
              <h3 className="font-serif-luxury text-xl font-normal text-white group-hover:text-[#D8B47A] transition-colors">
                Jewellery Savings Schemes
              </h3>
              <p className="text-xs text-[#A69C8E] mt-2 font-light leading-relaxed">
                Track active 10+1 Swarna Nidhi monthly installments, view maturity dates, and remit payments.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#1C1712] flex items-center text-xs font-semibold text-white group-hover:text-[#D8B47A]">
              <span>Manage Schemes</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </Link>

          {/* 3. Pay Due Portal */}
          <Link
            to="/pay-due"
            className="bg-[#120F0B] border border-[#241F18] rounded-2xl p-6 hover:border-[#D8B47A]/60 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-full bg-[#18140F] border border-[#D8B47A]/40 flex items-center justify-center text-[#D8B47A] mb-4 group-hover:scale-105 transition-transform">
                <CreditCard className="w-5 h-5 stroke-[1.5]" />
              </div>
              <h3 className="font-serif-luxury text-xl font-normal text-white group-hover:text-[#D8B47A] transition-colors">
                Pay Outstanding Due
              </h3>
              <p className="text-xs text-[#A69C8E] mt-2 font-light leading-relaxed">
                Check invoice balances for custom orders or pending store dues, and download verified receipts.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#1C1712] flex items-center text-xs font-semibold text-white group-hover:text-[#D8B47A]">
              <span>Check Due Status</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </Link>

          {/* 4. Customer Ledger */}
          <Link
            to="/ledger"
            className="bg-[#120F0B] border border-[#241F18] rounded-2xl p-6 hover:border-[#D8B47A]/60 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-full bg-[#18140F] border border-[#D8B47A]/40 flex items-center justify-center text-[#D8B47A] mb-4 group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5 stroke-[1.5]" />
              </div>
              <h3 className="font-serif-luxury text-xl font-normal text-white group-hover:text-[#D8B47A] transition-colors">
                My Ledger Statement
              </h3>
              <p className="text-xs text-[#A69C8E] mt-2 font-light leading-relaxed">
                Complete debits, credits, and running balance history with instant printable statements.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#1C1712] flex items-center text-xs font-semibold text-white group-hover:text-[#D8B47A]">
              <span>View Statement</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </Link>

          {/* 5. Add Existing Jewellery */}
          <Link
            to="/add-existing"
            className="bg-[#120F0B] border border-[#241F18] rounded-2xl p-6 hover:border-[#D8B47A]/60 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-full bg-[#18140F] border border-[#D8B47A]/40 flex items-center justify-center text-[#D8B47A] mb-4 group-hover:scale-105 transition-transform">
                <Layers className="w-5 h-5 stroke-[1.5]" />
              </div>
              <h3 className="font-serif-luxury text-xl font-normal text-white group-hover:text-[#D8B47A] transition-colors">
                Add Existing / Exchange
              </h3>
              <p className="text-xs text-[#A69C8E] mt-2 font-light leading-relaxed">
                Register ancestral pieces or older store bills for appraisal and old-gold exchange credits.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#1C1712] flex items-center text-xs font-semibold text-white group-hover:text-[#D8B47A]">
              <span>Submit Piece</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </Link>

          {/* 6. Admin Control (if admin) */}
          {user.role === 'admin' && (
            <Link
              to="/admin"
              className="bg-[#1A150F] border border-[#D8B47A]/50 rounded-2xl p-6 hover:border-[#D8B47A] transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-full bg-[#D8B47A]/20 border border-[#D8B47A] flex items-center justify-center text-[#D8B47A] mb-4">
                  <ShieldAlert className="w-5 h-5 stroke-[1.5]" />
                </div>
                <h3 className="font-serif-luxury text-xl font-normal text-[#D8B47A]">
                  Admin Control Centre
                </h3>
                <p className="text-xs text-gray-300 mt-2 font-light leading-relaxed">
                  Manage product catalogue, update live bullion market rates, and review customer submissions.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-[#2C2319] flex items-center text-xs font-semibold text-[#D8B47A]">
                <span>Launch Admin Suite</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </Link>
          )}

        </div>

      </div>
    </div>
  );
};
