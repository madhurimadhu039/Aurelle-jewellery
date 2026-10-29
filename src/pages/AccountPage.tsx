import React, { useState, useEffect } from 'react';
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
  ShieldAlert,
  Package,
  Clock,
  CheckCircle2,
  Lock,
  Eye,
  EyeOff,
  LogOut,
  Edit2,
  Save,
  KeyRound
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { orderService } from '../services/orderService';
import { authService } from '../services/authService';
import { Order } from '../types';

export const AccountPage: React.FC = () => {
  const { user, isAdmin, loginCustomer, registerCustomer, logout, updateUser, formatINR, showToast } = useApp();

  // Auth form states for unauthenticated visitors
  const [authTab, setAuthTab] = useState<'signin' | 'register'>('signin');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);

  // Registration fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // Account views when signed in
  const [activeAccountTab, setActiveAccountTab] = useState<'overview' | 'orders' | 'profile'>('overview');
  const [orders, setOrders] = useState<Order[]>([]);

  // Profile edit fields
  const [editingProfile, setEditingProfile] = useState(false);
  const [profName, setProfName] = useState(user?.name || '');
  const [profPhone, setProfPhone] = useState(user?.phone || '');
  const [profStreet, setProfStreet] = useState(user?.addresses?.[0]?.street || '');
  const [profCity, setProfCity] = useState(user?.addresses?.[0]?.city || '');
  const [profState, setProfState] = useState(user?.addresses?.[0]?.state || 'Maharashtra');
  const [profPincode, setProfPincode] = useState(user?.addresses?.[0]?.pincode || '');

  // Is authenticated: user exists and is not the guest dummy
  const isAuthenticated = Boolean(user && user.uid && user.uid !== 'patron-guest-demo');

  useEffect(() => {
    if (user) {
      setProfName(user.name || '');
      setProfPhone(user.phone || '');
      if (user.addresses && user.addresses.length > 0) {
        setProfStreet(user.addresses[0].street || '');
        setProfCity(user.addresses[0].city || '');
        setProfState(user.addresses[0].state || 'Maharashtra');
        setProfPincode(user.addresses[0].pincode || '');
      }
      // Load orders for this customer
      const customerOrders = orderService.getAll(user.email);
      setOrders(customerOrders);
    }
  }, [user]);

  // Handle Customer Sign In
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingAuth(true);
    setAuthError(null);
    try {
      await loginCustomer(loginEmail.trim(), loginPassword);
      setLoginPassword('');
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoadingAuth(false);
    }
  };

  // Handle Customer Registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (regPassword !== regConfirmPassword) {
      setAuthError('Passwords do not match');
      return;
    }
    if (regPassword.length < 6) {
      setAuthError('Password must be at least 6 characters long');
      return;
    }

    setLoadingAuth(true);
    setAuthError(null);
    try {
      await registerCustomer(regName.trim(), regEmail.trim(), regPassword, regPhone.trim());
      setRegPassword('');
      setRegConfirmPassword('');
    } catch (err: any) {
      setAuthError(err.message || 'Registration failed.');
    } finally {
      setLoadingAuth(false);
    }
  };



  // Handle Profile Update
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUser({
        name: profName.trim(),
        phone: profPhone.trim(),
        addresses: [
          {
            street: profStreet.trim(),
            city: profCity.trim(),
            state: profState.trim(),
            pincode: profPincode.trim(),
          },
        ],
      });
      setEditingProfile(false);
      showToast('Patron profile updated successfully', 'success');
    } catch (err: any) {
      alert(err.message || 'Error updating profile');
    }
  };

  return (
    <div className="min-h-screen bg-[#090806] text-[#F7F1E7] selection:bg-[#D8B47A]/30 selection:text-[#D8B47A] py-12 text-left">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="text-xs text-gray-500 mb-6">
          <Link to="/" className="hover:text-white">Home</Link>
          <span className="mx-2 text-gray-700">/</span>
          <span className="text-[#D8B47A]">My Account</span>
        </nav>

        {!isAuthenticated ? (
          /* ========================================================= */
          /* UNAUTHENTICATED PATRON LOGIN & REGISTRATION PORTAL */
          /* ========================================================= */
          <div className="max-w-md mx-auto">
            {/* Direct Return to Store link since Navbar is hidden on signup page */}
            <div className="mb-4 flex items-center justify-between text-xs">
              <Link to="/" className="text-[#D8B47A] hover:underline flex items-center gap-1.5 font-medium">
                ← Return to Aurelle Boutique
              </Link>
              <span className="text-[11px] text-gray-500 font-serif-luxury tracking-widest">
                AURELLE
              </span>
            </div>

            <div className="bg-[#120F0B] border border-[#2B2319] rounded-2xl p-6 sm:p-8 shadow-2xl">
              {/* Wordmark */}
              <div className="text-center mb-6">
                <span className="font-serif-luxury text-2xl tracking-[0.25em] text-[#F7F1E7] block leading-tight">
                  AURELLE
                </span>
                <span className="text-[9px] uppercase tracking-[0.35em] text-[#D8B47A] block font-medium mt-1">
                  PATRON PORTAL & IDENTITY
                </span>
              </div>

              {/* Auth Tab Switcher (Sign In & Register only — Reset removed) */}
              <div className="flex border-b border-[#241F18] mb-6">
                <button
                  type="button"
                  onClick={() => { setAuthTab('signin'); setAuthError(null); setAuthSuccess(null); }}
                  className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider text-center border-b-2 transition-colors ${
                    authTab === 'signin' ? 'border-[#D8B47A] text-[#D8B47A]' : 'border-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthTab('register'); setAuthError(null); setAuthSuccess(null); }}
                  className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider text-center border-b-2 transition-colors ${
                    authTab === 'register' ? 'border-[#D8B47A] text-[#D8B47A]' : 'border-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  Register
                </button>
              </div>

            {/* Feedback Notifications */}
            {authError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/40 text-rose-300 text-xs">
                {authError}
              </div>
            )}
            {authSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{authSuccess}</span>
              </div>
            )}

            {/* Tab 1: Sign In */}
            {authTab === 'signin' && (
              <form onSubmit={handleSignIn} className="space-y-4 text-xs">
                <div>
                  <label className="text-gray-300 block mb-1 font-medium">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="patron@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full bg-[#18140F] border border-[#2B2319] focus:border-[#D8B47A] rounded-xl px-3.5 py-2.5 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-gray-300 block mb-1 font-medium">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full bg-[#18140F] border border-[#2B2319] focus:border-[#D8B47A] rounded-xl px-3.5 py-2.5 pr-10 text-white focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[11px] pt-1">
                  <span className="text-gray-400">Encrypted Firebase Auth</span>
                </div>

                <button
                  type="submit"
                  disabled={loadingAuth}
                  className="w-full py-3 rounded-xl bg-[#D8B47A] hover:bg-[#EBD5A8] text-[#090806] font-bold uppercase tracking-wider text-xs transition-colors shadow-lg disabled:opacity-50 mt-2"
                >
                  {loadingAuth ? 'Verifying Patron...' : 'Sign In to Account'}
                </button>

                {/* Quick Demo Access */}
                <div className="pt-4 border-t border-[#241F18] text-center">
                  <span className="text-[11px] text-gray-500 block mb-2">Or quick sign in with registered patron:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginEmail('patron@aurelle.com');
                      setLoginPassword('patron123');
                    }}
                    className="text-[11px] text-[#D8B47A] hover:underline font-mono"
                  >
                    Load Patron: patron@aurelle.com
                  </button>
                </div>
              </form>
            )}

            {/* Tab 2: Register */}
            {authTab === 'register' && (
              <form onSubmit={handleRegister} className="space-y-3.5 text-xs">
                <div>
                  <label className="text-gray-300 block mb-1 font-medium">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Radhika Apte"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full bg-[#18140F] border border-[#2B2319] focus:border-[#D8B47A] rounded-xl px-3.5 py-2.5 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-gray-300 block mb-1 font-medium">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="radhika@example.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full bg-[#18140F] border border-[#2B2319] focus:border-[#D8B47A] rounded-xl px-3.5 py-2.5 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-gray-300 block mb-1 font-medium">Mobile Number</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full bg-[#18140F] border border-[#2B2319] focus:border-[#D8B47A] rounded-xl px-3.5 py-2.5 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-gray-300 block mb-1 font-medium">Create Password (min. 6 characters)</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full bg-[#18140F] border border-[#2B2319] focus:border-[#D8B47A] rounded-xl px-3.5 py-2.5 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-gray-300 block mb-1 font-medium">Confirm Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    className="w-full bg-[#18140F] border border-[#2B2319] focus:border-[#D8B47A] rounded-xl px-3.5 py-2.5 text-white focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loadingAuth}
                  className="w-full py-3 rounded-xl bg-[#D8B47A] hover:bg-[#EBD5A8] text-[#090806] font-bold uppercase tracking-wider text-xs transition-colors shadow-lg disabled:opacity-50 mt-2"
                >
                  {loadingAuth ? 'Creating Patron Account...' : 'Register Patron Profile'}
                </button>
              </form>
            )}
            </div>
          </div>
        ) : (
          /* ========================================================= */
          /* AUTHENTICATED PATRON DASHBOARD */
          /* ========================================================= */
          <div>
            {/* Profile Card Header */}
            <div className="bg-[#120F0B] border border-[#241F18] rounded-2xl p-6 sm:p-8 mb-8 flex flex-col sm:flex-row justify-between sm:items-center gap-6 shadow-xl">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[#18140F] border border-[#D8B47A]/50 flex items-center justify-center text-[#D8B47A] text-2xl font-serif">
                  {user?.name ? user.name.charAt(0) : 'P'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#D8B47A]">
                      AURELLE PRIVILEGE PATRON
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  </div>
                  <h1 className="font-serif-luxury text-2xl sm:text-3xl font-normal text-white mt-0.5">
                    {user?.name || 'Valued Patron'}
                  </h1>
                  <p className="text-xs text-gray-400 font-light mt-0.5">
                    {user?.email} {user?.phone ? `• ${user.phone}` : ''}
                  </p>
                </div>
              </div>

              {/* Status and Action Buttons */}
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <span className="text-[10px] text-gray-400 block uppercase">Authorization</span>
                  <span className={`text-xs font-bold uppercase ${isAdmin ? 'text-[#D8B47A]' : 'text-emerald-400'}`}>
                    {isAdmin ? 'Guild Administrator' : 'Verified Patron'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => logout()}
                  className="px-4 py-2 rounded-full border border-gray-700 hover:border-rose-400 text-xs text-gray-300 hover:text-rose-400 transition-colors flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>

            {/* Dashboard Sub-Tabs */}
            <div className="flex items-center gap-2 border-b border-[#241F18] mb-8 overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => setActiveAccountTab('overview')}
                className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap ${
                  activeAccountTab === 'overview'
                    ? 'border-[#D8B47A] text-[#D8B47A]'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                Services & Portals
              </button>
              <button
                type="button"
                onClick={() => setActiveAccountTab('orders')}
                className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  activeAccountTab === 'orders'
                    ? 'border-[#D8B47A] text-[#D8B47A]'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>My Orders ({orders.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveAccountTab('profile')}
                className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  activeAccountTab === 'profile'
                    ? 'border-[#D8B47A] text-[#D8B47A]'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Profile & Delivery Details</span>
              </button>
            </div>

            {/* Sub-Tab 1: Services Overview */}
            {activeAccountTab === 'overview' && (
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
                      Verify invoice balances for custom creations or pending store dues, and download verified receipts.
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

                {/* 6. Admin Control Center (if authorized) */}
                {isAdmin && (
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
            )}

            {/* Sub-Tab 2: Orders History */}
            {activeAccountTab === 'orders' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-serif-luxury text-xl font-bold text-white">Your Jewellery Acquisition History</h3>
                  <span className="text-xs text-gray-400">{orders.length} orders recorded</span>
                </div>

                {orders.length === 0 ? (
                  <div className="bg-[#120F0B] border border-[#241F18] rounded-2xl p-8 text-center space-y-3">
                    <Package className="w-10 h-10 text-gray-500 mx-auto" />
                    <h4 className="text-base font-semibold text-white">No Orders Placed Yet</h4>
                    <p className="text-xs text-gray-400 max-w-sm mx-auto">
                      Explore our handcrafted masterworks and acquire your first heirloom piece.
                    </p>
                    <Link
                      to="/shop"
                      className="inline-block px-6 py-2.5 rounded-full bg-[#D8B47A] hover:bg-[#EBD5A8] text-[#090806] text-xs font-bold uppercase tracking-wider mt-2 transition-colors"
                    >
                      Explore Collection
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((ord) => (
                      <div
                        key={ord.id}
                        className="bg-[#120F0B] border border-[#241F18] rounded-2xl p-5 sm:p-6 space-y-4 shadow-lg"
                      >
                        {/* Order Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1C1712] pb-3 text-xs">
                          <div>
                            <span className="text-gray-400">Order Number: </span>
                            <span className="font-mono font-bold text-white">{ord.orderNumber}</span>
                            <span className="text-gray-600 mx-2">•</span>
                            <span className="text-gray-400 font-mono">
                              {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                              {ord.status}
                            </span>
                            <span className="font-serif-luxury font-bold text-sm text-[#D8B47A]">
                              {formatINR(ord.total)}
                            </span>
                          </div>
                        </div>

                        {/* Order Items List */}
                        <div className="divide-y divide-[#18140F]">
                          {ord.items.map((it, idx) => (
                            <div key={idx} className="py-2.5 flex items-center justify-between gap-4 text-xs">
                              <div className="flex items-center gap-3">
                                <img
                                  src={it.image}
                                  alt={it.name}
                                  className="w-12 h-12 object-cover rounded-lg bg-[#18140F]"
                                />
                                <div>
                                  <h5 className="font-medium text-white">{it.name}</h5>
                                  <span className="text-[11px] text-gray-400">
                                    SKU: {it.sku} • {it.purity} • Qty: {it.quantity}
                                  </span>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="text-white font-semibold">{formatINR(it.price * it.quantity)}</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Order Footer */}
                        <div className="border-t border-[#1C1712] pt-3 flex flex-col sm:flex-row justify-between text-[11px] text-gray-400 gap-2">
                          <div>
                            <span>Delivery to: </span>
                            <span className="text-gray-300">
                              {ord.customer.address}, {ord.customer.city} {ord.customer.pincode}
                            </span>
                          </div>
                          <div>
                            <span>Settled via: </span>
                            <span className="text-[#D8B47A] font-semibold">{ord.paymentMethod}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Sub-Tab 3: Profile & Delivery Details */}
            {activeAccountTab === 'profile' && (
              <div className="bg-[#120F0B] border border-[#241F18] rounded-2xl p-6 sm:p-8 max-w-2xl shadow-xl">
                <div className="flex justify-between items-center mb-6 pb-3 border-b border-[#241F18]">
                  <div>
                    <h3 className="font-serif-luxury text-xl font-bold text-white">Patron Information & Addresses</h3>
                    <p className="text-xs text-gray-400">Personal details used for boutique invoices and insured deliveries.</p>
                  </div>
                  {!editingProfile && (
                    <button
                      type="button"
                      onClick={() => setEditingProfile(true)}
                      className="px-3 py-1.5 rounded-lg border border-[#D8B47A]/50 text-[#D8B47A] text-xs font-semibold flex items-center gap-1.5 hover:bg-[#1E1912]"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit Details</span>
                    </button>
                  )}
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-400 block mb-1">Full Name</label>
                      <input
                        type="text"
                        disabled={!editingProfile}
                        value={profName}
                        onChange={(e) => setProfName(e.target.value)}
                        className="w-full bg-[#18140F] border border-[#2C2720] rounded-xl px-3 py-2 text-white disabled:opacity-60"
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 block mb-1">Registered Email (Identity)</label>
                      <input
                        type="email"
                        disabled
                        value={user?.email || ''}
                        className="w-full bg-[#18140F] border border-[#2C2720] rounded-xl px-3 py-2 text-gray-400 cursor-not-allowed opacity-60"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-gray-400 block mb-1">Contact Mobile Number</label>
                    <input
                      type="tel"
                      disabled={!editingProfile}
                      value={profPhone}
                      onChange={(e) => setProfPhone(e.target.value)}
                      className="w-full bg-[#18140F] border border-[#2C2720] rounded-xl px-3 py-2 text-white disabled:opacity-60"
                    />
                  </div>

                  <div className="pt-2 border-t border-[#1C1712]">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#D8B47A] block mb-2">
                      Primary Insured Delivery Address
                    </span>
                    <div className="space-y-3">
                      <div>
                        <label className="text-gray-400 block mb-1">Street / Apartment / Landmark</label>
                        <input
                          type="text"
                          disabled={!editingProfile}
                          placeholder="e.g. 14B, Altamount Road, Cumballa Hill"
                          value={profStreet}
                          onChange={(e) => setProfStreet(e.target.value)}
                          className="w-full bg-[#18140F] border border-[#2C2720] rounded-xl px-3 py-2 text-white disabled:opacity-60"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="text-gray-400 block mb-1">City</label>
                          <input
                            type="text"
                            disabled={!editingProfile}
                            value={profCity}
                            onChange={(e) => setProfCity(e.target.value)}
                            className="w-full bg-[#18140F] border border-[#2C2720] rounded-xl px-3 py-2 text-white disabled:opacity-60"
                          />
                        </div>
                        <div>
                          <label className="text-gray-400 block mb-1">State</label>
                          <input
                            type="text"
                            disabled={!editingProfile}
                            value={profState}
                            onChange={(e) => setProfState(e.target.value)}
                            className="w-full bg-[#18140F] border border-[#2C2720] rounded-xl px-3 py-2 text-white disabled:opacity-60"
                          />
                        </div>
                        <div>
                          <label className="text-gray-400 block mb-1">Pincode</label>
                          <input
                            type="text"
                            disabled={!editingProfile}
                            value={profPincode}
                            onChange={(e) => setProfPincode(e.target.value)}
                            className="w-full bg-[#18140F] border border-[#2C2720] rounded-xl px-3 py-2 text-white disabled:opacity-60"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {editingProfile && (
                    <div className="flex gap-3 pt-3">
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-[#D8B47A] hover:bg-[#EBD5A8] text-[#090806] font-bold uppercase tracking-wider text-xs transition-colors flex items-center gap-1.5"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save Address & Profile</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingProfile(false)}
                        className="px-4 py-2.5 rounded-xl border border-gray-700 text-gray-300 hover:text-white text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </form>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
