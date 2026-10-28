import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldAlert, 
  Package, 
  TrendingUp, 
  CreditCard, 
  Users, 
  Plus, 
  Trash2, 
  Edit, 
  Check, 
  CheckCircle2, 
  X, 
  Layers,
  Lock,
  Eye,
  EyeOff,
  LogOut,
  AlertTriangle,
  Upload,
  Sparkles,
  RefreshCw,
  Sliders,
  Database,
  ShieldCheck,
  Clock,
  Radio
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { productService } from '../services/productService';
import { payDueService } from '../services/payDueService';
import { rateService } from '../services/rateService';
import { schemeService } from '../services/schemeService';
import { ledgerService } from '../services/ledgerService';
import { Product, PayDueRecord, ExistingJewellerySubmission, Scheme, SchemeEnrollment, LedgerEntry } from '../types';
import { MOCK_SUBMISSIONS } from '../data/mockData';

export const AdminPage: React.FC = () => {
  const { 
    user, 
    isAdmin, 
    loginAdmin, 
    logout, 
    rates, 
    formatINR, 
    showToast 
  } = useApp();

  // Admin login form states (shown when unauthenticated)
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Tabs
  const [activeTab, setActiveTab] = useState<'products' | 'rates' | 'dues' | 'schemes' | 'ledger' | 'submissions'>('products');

  // Products state (includes unpublished)
  const [products, setProducts] = useState<Product[]>(() => productService.getAll(true));
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Product form fields
  const [prodName, setProdName] = useState('');
  const [prodSku, setProdSku] = useState('');
  const [prodPrice, setProdPrice] = useState(95000);
  const [prodCategory, setProdCategory] = useState('Rings');
  const [prodPurity, setProdPurity] = useState('18K');
  const [prodWeight, setProdWeight] = useState(4.2);
  const [prodStock, setProdStock] = useState(5);
  const [prodImageUrl, setProdImageUrl] = useState('');
  const [prodDescription, setProdDescription] = useState('');
  const [prodStyle, setProdStyle] = useState('Artisan Contemporary');
  const [prodPublished, setProdPublished] = useState(true);
  const [formIsDirty, setFormIsDirty] = useState(false);
  const [savingProduct, setSavingProduct] = useState(false);

  // Modal ref for accessibility
  const modalRef = useRef<HTMLDivElement>(null);

  // Bullion rates provider & override management
  const [providerConfig, setProviderConfig] = useState(() => rateService.getProviderConfig());
  const [edit22k, setEdit22k] = useState(rates.gold22k);
  const [edit24k, setEdit24k] = useState(rates.gold24k);
  const [editSilver, setEditSilver] = useState(rates.silver1g);
  const [overrideReason, setOverrideReason] = useState(rates.overrideReason || '');
  const [updatingRates, setUpdatingRates] = useState(false);
  const [refreshingProvider, setRefreshingProvider] = useState(false);
  const [savingConfig, setSavingConfig] = useState(false);

  useEffect(() => {
    setEdit22k(rates.gold22k);
    setEdit24k(rates.gold24k);
    setEditSilver(rates.silver1g);
    if (rates.overrideReason) {
      setOverrideReason(rates.overrideReason);
    }
  }, [rates]);

  // Pay Dues
  const [payDues, setPayDues] = useState<PayDueRecord[]>(() => payDueService.getAll());
  const [newBillNumber, setNewBillNumber] = useState('');
  const [newBillCustomer, setNewBillCustomer] = useState('');
  const [newBillPhone, setNewBillPhone] = useState('');
  const [newBillTotal, setNewBillTotal] = useState(150000);
  const [newBillItem, setNewBillItem] = useState('');

  // Submissions
  const [submissions, setSubmissions] = useState<ExistingJewellerySubmission[]>(() => {
    const saved = localStorage.getItem('aurelle_existing_submissions');
    return saved ? JSON.parse(saved) : MOCK_SUBMISSIONS;
  });

  // Schemes State
  const [schemes, setSchemes] = useState<Scheme[]>(() => schemeService.getSchemes());
  const [enrollments, setEnrollments] = useState<SchemeEnrollment[]>(() => schemeService.getEnrollments());
  const [schemeModalOpen, setSchemeModalOpen] = useState(false);
  const [editingSchemeId, setEditingSchemeId] = useState<string | null>(null);
  const [schName, setSchName] = useState('');
  const [schTagline, setSchTagline] = useState('');
  const [schDuration, setSchDuration] = useState(11);
  const [schMinAmount, setSchMinAmount] = useState(5000);
  const [schBonusPercent, setSchBonusPercent] = useState(100);
  const [schBenefits, setSchBenefits] = useState('100% 11th Month Aurelle Bonus, Zero Making Charges up to 18%, Complimentary BIS Assaying');
  const [schTerms, setSchTerms] = useState('10 monthly deposits required, Redeemable across gold and diamond collections, Non-transferable folio');

  // Customer Ledger State
  const [ledgerEntries, setLedgerEntries] = useState<LedgerEntry[]>(() => ledgerService.getEntries());
  const [ledgerCustomerFilter, setLedgerCustomerFilter] = useState('');
  const [ledgerModalOpen, setLedgerModalOpen] = useState(false);
  const [ledCustomer, setLedCustomer] = useState('');
  const [ledPhone, setLedPhone] = useState('');
  const [ledRef, setLedRef] = useState('');
  const [ledType, setLedType] = useState<'PURCHASE' | 'PAYMENT' | 'REFUND' | 'ADJUSTMENT'>('ADJUSTMENT');
  const [ledDebit, setLedDebit] = useState(0);
  const [ledCredit, setLedCredit] = useState(0);
  const [ledDesc, setLedDesc] = useState('');
  const [ledNotes, setLedNotes] = useState('');

  // Listen to keyboard Escape key when modal is open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && productModalOpen) {
        handleCloseModal();
      }
    };
    if (productModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [productModalOpen, formIsDirty]);

  // Keep rates in sync when context rates change
  useEffect(() => {
    setEdit22k(rates.gold22k);
    setEdit24k(rates.gold24k);
    setEditSilver(rates.silver1g);
  }, [rates]);

  // Handle Admin Sign In
  const handleAdminSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);

    try {
      await loginAdmin(adminEmail.trim(), adminPassword);
      setAdminPassword('');
      showToast('Aurelle Guild Admin Suite unlocked', 'success');
    } catch (err: any) {
      setLoginError(err.message || 'Authentication failed. Please check administrator credentials.');
      showToast('Access Denied', 'error');
    } finally {
      setLoginLoading(false);
    }
  };

  // Open modal for new piece
  const handleOpenNewProduct = () => {
    setEditingProductId(null);
    setProdName('');
    setProdSku(`AUR-SKU-${Math.floor(1000 + Math.random() * 9000)}`);
    setProdPrice(95000);
    setProdCategory('Rings');
    setProdPurity('18K');
    setProdWeight(4.2);
    setProdStock(5);
    setProdImageUrl('https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80');
    setProdDescription('Handcrafted luxury creation with verified purity assay and artisan finish.');
    setProdStyle('Artisan Contemporary');
    setProdPublished(true);
    setFormIsDirty(false);
    setProductModalOpen(true);
  };

  // Open modal for editing existing piece
  const handleOpenEditProduct = (prod: Product) => {
    setEditingProductId(prod.id);
    setProdName(prod.name);
    setProdSku(prod.sku);
    setProdPrice(prod.price);
    setProdCategory(prod.category);
    setProdPurity(prod.purity);
    setProdWeight(prod.weightGrams);
    setProdStock(prod.stock);
    setProdImageUrl(prod.images[0] || '');
    setProdDescription(prod.description);
    setProdStyle(prod.style);
    setProdPublished(prod.isPublished !== false);
    setFormIsDirty(false);
    setProductModalOpen(true);
  };

  // Safe Close Modal with unsaved changes verification
  const handleCloseModal = () => {
    if (formIsDirty) {
      const confirmClose = window.confirm(
        'You have unsaved changes to this jewellery creation. Are you sure you wish to close without saving?'
      );
      if (!confirmClose) return;
    }
    setProductModalOpen(false);
    setEditingProductId(null);
    setFormIsDirty(false);
  };

  // Save product (Add or Edit)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim()) {
      alert('Product name is required');
      return;
    }
    if (prodPrice <= 0) {
      alert('Product price must be greater than zero');
      return;
    }

    setSavingProduct(true);
    try {
      const existing = editingProductId ? productService.getById(editingProductId) : null;
      const productPayload: Product = {
        id: editingProductId || ('aur-custom-' + Date.now()),
        name: prodName.trim(),
        sku: prodSku.trim() || `AUR-SKU-${Math.floor(1000 + Math.random() * 9000)}`,
        category: prodCategory as any,
        description: prodDescription.trim() || 'Handcrafted fine jewellery from Aurelle Guild Masterworks.',
        price: Number(prodPrice),
        images: prodImageUrl.trim() ? [prodImageUrl.trim()] : [
          'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80'
        ],
        material: `${prodPurity} Solid Gold`,
        purity: prodPurity as any,
        weightGrams: Number(prodWeight),
        stock: Number(prodStock),
        style: prodStyle,
        occasion: existing?.occasion || ['Luxury Daily', 'Anniversary'],
        isFeatured: existing?.isFeatured ?? true,
        isPublished: prodPublished,
        rating: existing?.rating ?? 5.0,
        reviewsCount: existing?.reviewsCount ?? 1,
        certification: existing?.certification || 'BIS 916 Guaranteed',
      };

      await productService.saveProduct(productPayload);
      setProducts(productService.getAll(true));
      setFormIsDirty(false);
      setProductModalOpen(false);
      showToast(
        editingProductId 
          ? `Product "${productPayload.name}" updated successfully` 
          : `New piece "${productPayload.name}" published to vault!`, 
        'success'
      );
    } catch (err: any) {
      alert('Error saving product: ' + err.message);
    } finally {
      setSavingProduct(false);
    }
  };

  // Toggle publish / unpublish
  const handleTogglePublish = async (id: string) => {
    const updated = await productService.togglePublish(id);
    setProducts(productService.getAll(true));
    if (updated) {
      showToast(
        updated.isPublished 
          ? `"${updated.name}" is now Published to Store` 
          : `"${updated.name}" moved to Unpublished / Vault Draft`,
        'info'
      );
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id: string, name: string) => {
    if (window.confirm(`Permanently remove "${name}" from the product catalogue?`)) {
      await productService.deleteProduct(id);
      setProducts(productService.getAll(true));
      showToast('Product removed from catalogue', 'info');
    }
  };

  // Manual Live Feed Refresh
  const handleRefreshLiveFeed = async () => {
    setRefreshingProvider(true);
    try {
      const res = await rateService.refreshLiveRates(true);
      showToast(`Bullion feed updated: ${res.message}`, 'success');
    } catch (err: any) {
      showToast('Failed to refresh bullion feed: ' + (err?.message || err), 'error');
    } finally {
      setRefreshingProvider(false);
    }
  };

  // Save Provider Configuration
  const handleSaveProviderConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingConfig(true);
    try {
      const saved = rateService.setProviderConfig(providerConfig);
      setProviderConfig(saved);
      showToast('Bullion provider configuration saved successfully', 'success');
    } catch (err: any) {
      showToast('Failed to save provider configuration: ' + (err?.message || err), 'error');
    } finally {
      setSavingConfig(false);
    }
  };

  // Enforce Manual Rate Override
  const handleEnforceOverride = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!overrideReason.trim()) {
      showToast('Mandatory audit reason required to enforce a manual rate override.', 'error');
      return;
    }
    setUpdatingRates(true);
    try {
      await rateService.setManualOverride({
        gold22k: Number(edit22k),
        gold24k: Number(edit24k),
        silver1g: Number(editSilver),
        reason: overrideReason.trim(),
        adminName: user?.name || user?.email || 'Authorized Administrator',
      });
      showToast('Manual bullion override broadcast across system', 'success');
    } catch (err: any) {
      showToast('Failed to enforce override: ' + (err?.message || err), 'error');
    } finally {
      setUpdatingRates(false);
    }
  };

  // Clear Manual Rate Override
  const handleClearOverride = async () => {
    if (window.confirm('Resume automatic live bullion feed and discard manual overrides?')) {
      setUpdatingRates(true);
      try {
        await rateService.clearManualOverride();
        setOverrideReason('');
        showToast('Manual override revoked. Automatic live feed resumed.', 'info');
      } catch (err: any) {
        showToast('Error revoking override: ' + (err?.message || err), 'error');
      } finally {
        setUpdatingRates(false);
      }
    }
  };

  // Create Pay Due
  const handleCreatePayDue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBillCustomer.trim() || !newBillPhone.trim()) {
      alert('Customer name and phone number are required');
      return;
    }

    try {
      await payDueService.createRecord({
        billNumber: newBillNumber || `AUR-INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        customerName: newBillCustomer.trim(),
        customerPhone: newBillPhone.trim(),
        customerEmail: 'patron@example.com',
        totalAmount: Number(newBillTotal),
        amountPaid: 0,
        balanceDue: Number(newBillTotal),
        dueDate: new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString().split('T')[0],
        status: 'PENDING',
        orderSummary: newBillItem.trim() || 'Fine Jewellery Order',
      });
      setPayDues(payDueService.getAll());
      showToast('Customer invoice created successfully', 'success');
      setNewBillCustomer('');
      setNewBillPhone('');
      setNewBillItem('');
      setNewBillNumber('');
    } catch (err: any) {
      alert('Error creating invoice: ' + err.message);
    }
  };

  // Scheme Handlers
  const handleOpenNewScheme = () => {
    setEditingSchemeId(null);
    setSchName('');
    setSchTagline('Exclusive Monthly Savings Initiative');
    setSchDuration(11);
    setSchMinAmount(5000);
    setSchBonusPercent(100);
    setSchemeModalOpen(true);
  };

  const handleOpenEditScheme = (s: Scheme) => {
    setEditingSchemeId(s.id);
    setSchName(s.name);
    setSchTagline(s.tagline);
    setSchDuration(s.durationMonths);
    setSchMinAmount(s.minAmount);
    setSchBonusPercent(s.bonusPercentage);
    setSchBenefits(s.benefits.join(', '));
    setSchTerms(s.terms.join(', '));
    setSchemeModalOpen(true);
  };

  const handleSaveScheme = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schName.trim()) {
      alert('Scheme name is required');
      return;
    }
    const payload: Scheme = {
      id: editingSchemeId || ('scheme-' + Date.now()),
      name: schName.trim(),
      tagline: schTagline.trim() || 'Exclusive Monthly Savings Initiative',
      durationMonths: Number(schDuration),
      minAmount: Number(schMinAmount),
      monthlyOptions: [schMinAmount, schMinAmount * 2, schMinAmount * 4, schMinAmount * 10],
      bonusPercentage: Number(schBonusPercent),
      benefits: schBenefits.split(',').map((b) => b.trim()).filter(Boolean),
      terms: schTerms.split(',').map((t) => t.trim()).filter(Boolean),
    };
    await schemeService.saveScheme(payload);
    setSchemes(schemeService.getSchemes());
    setSchemeModalOpen(false);
    showToast(`Scheme "${payload.name}" saved successfully`, 'success');
  };

  const handleDeleteScheme = async (id: string, name: string) => {
    if (window.confirm(`Delete savings scheme "${name}"?`)) {
      await schemeService.deleteScheme(id);
      setSchemes(schemeService.getSchemes());
      showToast('Scheme deleted', 'info');
    }
  };

  const handleAdminRecordSchemePayment = (enrollmentId: string) => {
    try {
      const updated = schemeService.payInstallment(enrollmentId, 'In-Boutique Certified Remittance');
      setEnrollments([...schemeService.getEnrollments()]);
      setLedgerEntries(ledgerService.getEntries());
      showToast(`Installment #${updated.installmentsPaid} recorded for ${updated.customerName}`, 'success');
    } catch (e: any) {
      alert(e.message);
    }
  };

  // Ledger Handlers
  const handleSaveLedgerEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ledCustomer.trim()) {
      alert('Customer name is required');
      return;
    }
    if (!ledNotes.trim()) {
      alert('Mandatory audit notes required for ledger adjustments');
      return;
    }
    ledgerService.addEntry({
      date: new Date().toISOString().split('T')[0],
      refNumber: ledRef.trim() || `AUD-ADJ-${Math.floor(100000 + Math.random() * 900000)}`,
      type: ledType,
      description: ledDesc.trim() || `Administrative ${ledType} adjustment`,
      debit: Number(ledDebit) || 0,
      credit: Number(ledCredit) || 0,
      customerName: ledCustomer.trim(),
      customerPhone: ledPhone.trim(),
      auditAdmin: user?.name || user?.email || 'Authorized Administrator',
      notes: ledNotes.trim(),
    });
    setLedgerEntries(ledgerService.getEntries());
    setLedgerModalOpen(false);
    setLedCustomer('');
    setLedPhone('');
    setLedRef('');
    setLedDebit(0);
    setLedCredit(0);
    setLedDesc('');
    setLedNotes('');
    showToast('Customer ledger entry verified and recorded', 'success');
  };

  // Assay Approval with automatic exchange credit to customer ledger
  const handleApproveSubmissionWithCredit = (sub: ExistingJewellerySubmission) => {
    const valuationStr = window.prompt(
      `Enter verified assay exchange valuation for ${sub.customerName}'s ${sub.metalType} (${sub.estimatedWeightGrams}g):`,
      '125000'
    );
    if (!valuationStr) return;
    const valuation = parseInt(valuationStr);
    if (isNaN(valuation) || valuation <= 0) {
      alert('Invalid valuation amount entered.');
      return;
    }

    const updated = submissions.map((s) =>
      s.id === sub.id ? { ...s, status: 'VERIFIED' as const, staffNotes: `Assay Verified: Valuation ₹${valuation.toLocaleString('en-IN')}` } : s
    );
    setSubmissions(updated);
    localStorage.setItem('aurelle_existing_submissions', JSON.stringify(updated));

    // Register exchange credit in Customer Ledger
    ledgerService.addEntry({
      date: new Date().toISOString().split('T')[0],
      refNumber: `EXC-ASSAY-${sub.id.slice(-6).toUpperCase()}`,
      type: 'ADJUSTMENT',
      description: `Old-Gold Exchange Credit: ${sub.metalType} (${sub.estimatedWeightGrams}g)`,
      debit: 0,
      credit: valuation,
      customerName: sub.customerName,
      customerPhone: sub.phone,
      auditAdmin: user?.name || 'Assay Desk Master',
      notes: `Purity Assay Verified: ${sub.description}`,
    });
    setLedgerEntries(ledgerService.getEntries());

    showToast(`Assay verified and credit of ₹${valuation.toLocaleString('en-IN')} added to ${sub.customerName}'s ledger!`, 'success');
  };

  // Update Submission Status
  const handleUpdateSubmissionStatus = (id: string, newStatus: ExistingJewellerySubmission['status']) => {
    const updated = submissions.map((sub) => 
      sub.id === id ? { ...sub, status: newStatus } : sub
    );
    setSubmissions(updated);
    localStorage.setItem('aurelle_existing_submissions', JSON.stringify(updated));
    showToast(`Submission status updated to ${newStatus}`, 'success');
  };

  // =========================================================
  // 1. SECURE ACCESS CONTROL CHECK
  // If user is NOT an authorized administrator, render ONLY the secure sign-in portal.
  // =========================================================
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#090806] text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-[#120F0B] border border-[#D8B47A]/40 rounded-3xl p-8 sm:p-10 shadow-2xl relative text-left">
          
          {/* Guild Emblem & Title */}
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#241F18]">
            <div className="w-12 h-12 rounded-2xl bg-[#1C1710] border border-[#D8B47A]/50 flex items-center justify-center text-[#D8B47A]">
              <Lock className="w-6 h-6 stroke-[1.5]" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#D8B47A] block">
                SECURITY CHECKPOINT
              </span>
              <h2 className="font-serif-luxury text-2xl font-bold text-white">
                Admin Control Center
              </h2>
            </div>
          </div>

          <p className="text-xs text-gray-400 mb-6 leading-relaxed">
            Restricted to authorized Aurelle Guild Administrators and Boutique Managers. Ordinary customer accounts cannot access catalogue administration, bullion master configuration, or customer invoices.
          </p>

          {loginError && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-200 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleAdminSignIn} className="space-y-4 text-xs">
            <div>
              <label className="text-gray-300 block mb-1.5 font-medium tracking-wide">
                Guild Administrator Email
              </label>
              <input
                type="email"
                required
                placeholder="admin@aurelle.com"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full bg-[#18140F] border border-[#2B2319] focus:border-[#D8B47A] rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-gray-300 block mb-1.5 font-medium tracking-wide">
                Master Security Key / Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full bg-[#18140F] border border-[#2B2319] focus:border-[#D8B47A] rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-white"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3.5 rounded-xl bg-[#D8B47A] hover:bg-[#EBD5A8] text-[#090806] font-bold uppercase tracking-wider text-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loginLoading ? (
                  <span>Verifying Credentials...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Authenticate & Access Vault</span>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-4 border-t border-[#1C1712] text-center">
            <span className="text-[11px] text-gray-500">
              Not an administrator?{' '}
              <a href="/" className="text-[#D8B47A] hover:underline">
                Return to Customer Boutique
              </a>
            </span>
          </div>

        </div>
      </div>
    );
  }

  // =========================================================
  // 2. AUTHORIZED GUILD ADMIN SUITE
  // Only rendered when isAdmin === true
  // =========================================================
  return (
    <div className="min-h-screen bg-[#090806] text-[#F7F1E7] py-10 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Admin Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-6 border-b border-[#241F18] mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-[#D8B47A]/20 border border-[#D8B47A]/50 text-[10px] uppercase font-bold tracking-widest text-[#D8B47A]">
                AUTHENTICATED GUILD ADMINISTRATOR
              </span>
              <span className="text-xs text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Session Active
              </span>
            </div>
            <h1 className="font-serif-luxury text-3xl font-bold text-white mt-1">
              Aurelle Guild Admin Suite
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Logged in as {user?.name || 'Administrator'} ({user?.email})
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => logout()}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#18140F] border border-rose-500/40 hover:border-rose-400 text-xs font-semibold text-rose-300 hover:text-white transition-colors"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span>Sign Out of Admin Suite</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 border-b border-[#241F18] pb-4 mb-8 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'products'
                ? 'bg-[#D8B47A] text-[#090806]'
                : 'text-gray-400 hover:text-white bg-[#120F0B]'
            }`}
          >
            Product Catalogue ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('rates')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'rates'
                ? 'bg-[#D8B47A] text-[#090806]'
                : 'text-gray-400 hover:text-white bg-[#120F0B]'
            }`}
          >
            Bullion Market Rates
          </button>
          <button
            onClick={() => setActiveTab('dues')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'dues'
                ? 'bg-[#D8B47A] text-[#090806]'
                : 'text-gray-400 hover:text-white bg-[#120F0B]'
            }`}
          >
            Pay Due Invoices ({payDues.length})
          </button>
          <button
            onClick={() => setActiveTab('schemes')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'schemes'
                ? 'bg-[#D8B47A] text-[#090806]'
                : 'text-gray-400 hover:text-white bg-[#120F0B]'
            }`}
          >
            Savings Schemes ({schemes.length})
          </button>
          <button
            onClick={() => setActiveTab('ledger')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'ledger'
                ? 'bg-[#D8B47A] text-[#090806]'
                : 'text-gray-400 hover:text-white bg-[#120F0B]'
            }`}
          >
            Customer Ledger ({ledgerEntries.length})
          </button>
          <button
            onClick={() => setActiveTab('submissions')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'submissions'
                ? 'bg-[#D8B47A] text-[#090806]'
                : 'text-gray-400 hover:text-white bg-[#120F0B]'
            }`}
          >
            Jewellery Appraisals ({submissions.length})
          </button>
        </div>

        {/* Tab 1: Products */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-serif-luxury text-xl font-bold text-white">Catalogue & Inventory Vault</h3>
                <p className="text-xs text-gray-400">Add, edit, publish, unpublish, and manage pieces visible to customers.</p>
              </div>
              <button
                onClick={handleOpenNewProduct}
                className="px-4 py-2 rounded-lg bg-[#D8B47A] text-[#090806] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-[#EBD5A8] transition-colors"
              >
                <Plus className="w-4 h-4" /> Add New Creation
              </button>
            </div>

            <div className="bg-[#120F0B] border border-[#241F18] rounded-2xl overflow-hidden shadow-xl">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#241F18] bg-[#0E0C09] text-gray-400 uppercase tracking-wider">
                    <th className="p-4">Piece</th>
                    <th className="p-4">SKU</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Purity & Weight</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1C1712] text-gray-300">
                  {products.map((p) => {
                    const isPub = p.isPublished !== false;
                    return (
                      <tr key={p.id} className="hover:bg-[#16120D] transition-colors">
                        <td className="p-4 flex items-center gap-3">
                          <img 
                            src={p.images[0] || '/images/bracelet-1.jpg'} 
                            alt={p.name} 
                            className="w-10 h-10 rounded-lg object-cover bg-black border border-[#2A231A]" 
                          />
                          <div>
                            <span className="font-semibold text-white block">{p.name}</span>
                            <span className="text-[10px] text-gray-400">{p.material}</span>
                          </div>
                        </td>
                        <td className="p-4 font-mono text-gray-400">{p.sku}</td>
                        <td className="p-4">{p.category}</td>
                        <td className="p-4 font-bold text-[#D8B47A]">{p.purity} ({p.weightGrams}g)</td>
                        <td className="p-4 font-bold text-white">{formatINR(p.price)}</td>
                        <td className="p-4">
                          <button
                            onClick={() => handleTogglePublish(p.id)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-colors ${
                              isPub 
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20' 
                                : 'bg-gray-800/50 text-gray-400 border-gray-700 hover:bg-gray-800'
                            }`}
                            title="Click to toggle publish status"
                          >
                            {isPub ? 'Published' : 'Vault Draft'}
                          </button>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                            p.stock > 0 
                              ? 'bg-emerald-500/10 text-emerald-400' 
                              : 'bg-rose-500/10 text-rose-400'
                          }`}>
                            {p.stock > 0 ? `${p.stock} in vault` : 'Out of stock'}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => handleOpenEditProduct(p)}
                            className="p-1.5 text-gray-400 hover:text-[#D8B47A] rounded hover:bg-[#1E1912]"
                            title="Edit Piece"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id, p.name)}
                            className="p-1.5 text-gray-400 hover:text-red-400 rounded hover:bg-[#1E1912]"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Bullion Rates Suite */}
        {activeTab === 'rates' && (
          <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#D8B47A] block mb-1">
                  BULLION BENCHMARK & PRICING ENGINE
                </span>
                <h3 className="font-serif-luxury text-2xl font-bold text-white">
                  Gold & Silver Master Controls
                </h3>
                <p className="text-xs text-gray-400 mt-1 max-w-2xl">
                  Inspect the live market data feed, configure approved bullion data providers, test manual updates, and enforce audited rate overrides with strict backend synchronization.
                </p>
              </div>

              <button
                type="button"
                onClick={handleRefreshLiveFeed}
                disabled={refreshingProvider}
                className="px-4 py-2.5 rounded-xl bg-[#D8B47A] hover:bg-[#EBD5A8] text-[#090806] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${refreshingProvider ? 'animate-spin' : ''}`} />
                {refreshingProvider ? 'Connecting to Provider...' : 'Check Provider for Updates Now'}
              </button>
            </div>

            {/* Live Telemetry Card */}
            <div className="bg-[#120F0B] border border-[#2B2319] rounded-2xl p-6 sm:p-8 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-[#241F18]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#1C1710] border border-[#D8B47A]/40 flex items-center justify-center text-[#D8B47A]">
                    <Radio className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-serif-luxury text-lg font-bold text-white">Live Feed Telemetry</h4>
                    <span className="text-[11px] text-gray-400">Current bullion benchmark broadcast to store calculators & items</span>
                  </div>
                </div>

                {/* Freshness Badge */}
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${
                    rates.rateStatus === 'current'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : rates.rateStatus === 'override'
                      ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                      : rates.rateStatus === 'delayed'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${
                      rates.rateStatus === 'current' ? 'bg-emerald-400 animate-ping' :
                      rates.rateStatus === 'override' ? 'bg-purple-400' :
                      rates.rateStatus === 'delayed' ? 'bg-amber-400' : 'bg-rose-400'
                    }`} />
                    {rates.rateStatus === 'current' && 'Live Market Active'}
                    {rates.rateStatus === 'override' && 'Admin Override Enforced'}
                    {rates.rateStatus === 'delayed' && 'Market Closed / Delayed'}
                    {rates.rateStatus === 'stale' && 'Offline Snapshot Cached'}
                  </span>
                </div>
              </div>

              {/* Rate Metrics 3-Col */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                <div className="p-4 rounded-xl bg-[#0E0C09] border border-[#221C15]">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">22K Standard Gold</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#1C1710] text-[#D8B47A] border border-[#D8B47A]/30">91.6% Hallmark</span>
                  </div>
                  <div className="font-serif-luxury text-2xl font-bold text-white mb-1">
                    {formatINR(rates.gold22k)}
                    <span className="text-xs font-normal text-gray-400 ml-1">/ gram</span>
                  </div>
                  <div className="text-[11px] text-gray-400 flex justify-between">
                    <span>8g Sovereign (Pavan):</span>
                    <span className="text-[#D8B47A] font-semibold">{formatINR(rates.gold22k * 8)}</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#0E0C09] border border-[#D8B47A]/40 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-[#D8B47A]/5 rounded-bl-full pointer-events-none" />
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#D8B47A]">24K Pure Bullion</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#D8B47A]/10 text-[#D8B47A] border border-[#D8B47A]/40 font-bold">99.9% Fine</span>
                  </div>
                  <div className="font-serif-luxury text-2xl font-bold text-[#EBD5A8] mb-1">
                    {formatINR(rates.gold24k)}
                    <span className="text-xs font-normal text-gray-400 ml-1">/ gram</span>
                  </div>
                  <div className="text-[11px] text-gray-400 flex justify-between">
                    <span>10g Pure Bar:</span>
                    <span className="text-[#EBD5A8] font-semibold">{formatINR(rates.gold24k * 10)}</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#0E0C09] border border-[#221C15]">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Pure Silver</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#1C1710] text-gray-300 border border-gray-700">999 Fine</span>
                  </div>
                  <div className="font-serif-luxury text-2xl font-bold text-white mb-1">
                    {formatINR(rates.silver1g)}
                    <span className="text-xs font-normal text-gray-400 ml-1">/ gram</span>
                  </div>
                  <div className="text-[11px] text-gray-400 flex justify-between">
                    <span>1 Kilogram Bar:</span>
                    <span className="text-gray-200 font-semibold">{formatINR(Math.round(rates.silver1g * 1000))}</span>
                  </div>
                </div>
              </div>

              {/* Feed Metadata Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#1C1712] text-xs text-gray-400">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-gray-500 block mb-0.5">Active Source / Provider</span>
                  <span className="text-gray-200 font-medium">{rates.provider || 'Live Indian Bullion Exchange'}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-gray-500 block mb-0.5">Last Synchronized</span>
                  <span className="text-gray-200 font-medium">{rates.dateFormatted} • {rates.timeFormatted}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-gray-500 block mb-0.5">Operating Mode</span>
                  <span className={`font-semibold ${rates.isManualOverride ? 'text-purple-300' : 'text-emerald-400'}`}>
                    {rates.isManualOverride ? 'Manual Override Active' : 'Automatic Live Exchange'}
                  </span>
                </div>
              </div>
            </div>

            {/* 2-Column Section: Configuration & Manual Override */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Card 2: Approved Provider Configuration */}
              <div className="bg-[#120F0B] border border-[#2B2319] rounded-2xl p-6 sm:p-7 shadow-xl">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#241F18]">
                  <div className="w-8 h-8 rounded-lg bg-[#1C1710] border border-[#D8B47A]/30 flex items-center justify-center text-[#D8B47A]">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-serif-luxury text-base font-bold text-white">Provider Settings</h4>
                    <span className="text-[10px] text-gray-400">Configure upstream bullion rates supplier</span>
                  </div>
                </div>

                <form onSubmit={handleSaveProviderConfig} className="space-y-4 text-xs">
                  <div>
                    <label className="text-gray-300 block mb-1 font-medium">Approved Data Provider</label>
                    <select
                      value={providerConfig.providerId}
                      onChange={(e) => setProviderConfig({ ...providerConfig, providerId: e.target.value as any })}
                      className="w-full bg-[#18140F] border border-[#2C2720] rounded-lg p-2.5 text-xs text-white"
                    >
                      <option value="auto-bullion">
                        Automated Bullion Exchange Feed (Global Spot converted to INR/g)
                      </option>
                      <option value="goldapi">
                        GoldAPI.io (Live Spot Feed with API Key)
                      </option>
                      <option value="ibja-benchmark">
                        IBJA Benchmark Snapshot (Indian Bullion & Jewellers Association)
                      </option>
                    </select>
                    <p className="text-[10px] text-gray-500 mt-1">
                      Automated exchange feed fetches live spot rates and converts troy ounces directly to grams in INR.
                    </p>
                  </div>

                  {providerConfig.providerId === 'goldapi' && (
                    <div>
                      <label className="text-gray-300 block mb-1 font-medium">GoldAPI Key (Optional / Personal)</label>
                      <input
                        type="password"
                        placeholder="goldapi-xxxxxxxxxxxxxxxxx"
                        value={providerConfig.apiKey || ''}
                        onChange={(e) => setProviderConfig({ ...providerConfig, apiKey: e.target.value })}
                        className="w-full bg-[#18140F] border border-[#2C2720] rounded-lg p-2.5 text-xs text-white font-mono"
                      />
                      <p className="text-[10px] text-gray-500 mt-1">
                        Stored securely in application config and never exposed to public customer sessions.
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="text-gray-300 block mb-1 font-medium">Auto-Refresh Cadence</label>
                    <select
                      value={providerConfig.autoRefreshMinutes}
                      onChange={(e) => setProviderConfig({ ...providerConfig, autoRefreshMinutes: Number(e.target.value) })}
                      className="w-full bg-[#18140F] border border-[#2C2720] rounded-lg p-2.5 text-xs text-white"
                    >
                      <option value={15}>Every 15 minutes (High Frequency)</option>
                      <option value={30}>Every 30 minutes (Recommended Standard)</option>
                      <option value={60}>Every 60 minutes (Conservative Rate Limits)</option>
                      <option value={120}>Every 2 hours (Low Bandwidth)</option>
                    </select>
                    <p className="text-[10px] text-gray-500 mt-1">
                      Requests are cached to prevent redundant upstream API quota consumption.
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={savingConfig}
                      className="w-full py-2.5 rounded-lg bg-[#1C1710] hover:bg-[#251E15] text-[#D8B47A] border border-[#D8B47A]/50 text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
                    >
                      {savingConfig ? 'Saving Settings...' : 'Save Provider Settings'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Card 3: Manual Rate Override & Audit Protocol */}
              <div className="bg-[#120F0B] border border-[#2B2319] rounded-2xl p-6 sm:p-7 shadow-xl">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#241F18]">
                  <div className="w-8 h-8 rounded-lg bg-[#1C1710] border border-[#D8B47A]/30 flex items-center justify-center text-[#D8B47A]">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-serif-luxury text-base font-bold text-white">Manual Rate Override</h4>
                    <span className="text-[10px] text-gray-400">Strictly audited boutique rate adjustment</span>
                  </div>
                </div>

                {/* If override is currently active, show banner */}
                {rates.isManualOverride && (
                  <div className="mb-4 p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/40 text-xs text-purple-200">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold uppercase tracking-wider text-[10px] text-purple-300">
                        Active Override in Effect
                      </span>
                      <button
                        type="button"
                        onClick={handleClearOverride}
                        className="text-[10px] underline font-bold text-purple-300 hover:text-white"
                      >
                        Revoke & Resume Live Feed
                      </button>
                    </div>
                    <p className="text-[11px] text-purple-200/90 mb-1">
                      <strong>Reason:</strong> {rates.overrideReason || 'Admin Manual Override'}
                    </p>
                    <p className="text-[10px] text-purple-400">
                      Applied by {rates.overrideAdmin || 'Administrator'} on {rates.overrideAt || rates.lastUpdated}
                    </p>
                  </div>
                )}

                <form onSubmit={handleEnforceOverride} className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-gray-300 block mb-1 font-medium">22K Gold (₹/g)</label>
                      <input
                        type="number"
                        required
                        value={edit22k}
                        onChange={(e) => setEdit22k(parseInt(e.target.value) || 0)}
                        className="w-full bg-[#18140F] border border-[#2C2720] rounded-lg p-2 text-sm font-bold text-white"
                      />
                    </div>
                    <div>
                      <label className="text-gray-300 block mb-1 font-medium">24K Gold (₹/g)</label>
                      <input
                        type="number"
                        required
                        value={edit24k}
                        onChange={(e) => setEdit24k(parseInt(e.target.value) || 0)}
                        className="w-full bg-[#18140F] border border-[#2C2720] rounded-lg p-2 text-sm font-bold text-[#D8B47A]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-gray-300 block mb-1 font-medium">Silver 999 (₹/g)</label>
                    <input
                      type="number"
                      step="0.5"
                      required
                      value={editSilver}
                      onChange={(e) => setEditSilver(parseFloat(e.target.value) || 0)}
                      className="w-full bg-[#18140F] border border-[#2C2720] rounded-lg p-2 text-sm font-bold text-white"
                    />
                  </div>

                  <div>
                    <label className="text-gray-300 block mb-1 font-medium flex items-center justify-between">
                      <span>Reason for Override (Mandatory Audit Log)</span>
                      <span className="text-[10px] text-[#D8B47A]">* Required</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Festival market surge, Boutique spot hedge..."
                      value={overrideReason}
                      onChange={(e) => setOverrideReason(e.target.value)}
                      className="w-full bg-[#18140F] border border-[#2C2720] rounded-lg p-2.5 text-xs text-white"
                    />
                    <p className="text-[10px] text-gray-500 mt-1">
                      This audit explanation is stamped onto the snapshot and visible in the admin telemetry log.
                    </p>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      disabled={updatingRates}
                      className="flex-1 py-2.5 rounded-lg bg-[#D8B47A] hover:bg-[#EBD5A8] text-[#090806] text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
                    >
                      {updatingRates ? 'Applying Override...' : 'Enforce Manual Override'}
                    </button>

                    {rates.isManualOverride && (
                      <button
                        type="button"
                        onClick={handleClearOverride}
                        disabled={updatingRates}
                        className="px-3 py-2.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold uppercase tracking-wider transition-colors"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </form>
              </div>

            </div>
          </div>
        )}

        {/* Tab 3: Pay Dues Management */}
        {activeTab === 'dues' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Existing Dues List */}
              <div className="lg:col-span-2 space-y-4">
                <h3 className="font-serif-luxury text-xl font-bold text-white">Outstanding Customer Invoices</h3>
                <div className="space-y-3">
                  {payDues.map((due) => (
                    <div
                      key={due.id}
                      className="bg-[#120F0B] border border-[#241F18] rounded-xl p-4 text-xs flex justify-between items-center"
                    >
                      <div>
                        <span className="font-mono font-bold text-white">{due.billNumber}</span>
                        <p className="text-gray-400 mt-0.5">{due.customerName} ({due.customerPhone})</p>
                        <p className="text-[11px] text-gray-500">{due.orderSummary} • Due: {due.dueDate}</p>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-extrabold text-[#D8B47A]">{formatINR(due.balanceDue)} Due</span>
                        <div className="text-[11px] text-gray-400 mt-0.5">Total: {formatINR(due.totalAmount)}</div>
                        <span className={`text-[10px] font-bold uppercase ${due.status === 'PAID' ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {due.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Create Due Form */}
              <div className="bg-[#120F0B] border border-[#2B2319] rounded-2xl p-6 text-xs h-fit">
                <h4 className="font-serif-luxury text-lg font-bold text-white mb-4">Record New Due Invoice</h4>
                <form onSubmit={handleCreatePayDue} className="space-y-3">
                  <div>
                    <label className="text-gray-400 block mb-1">Customer Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vikramaditya Roy"
                      value={newBillCustomer}
                      onChange={(e) => setNewBillCustomer(e.target.value)}
                      className="w-full bg-[#18140F] border border-[#2C2720] rounded p-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 block mb-1">Mobile Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="98XXXXXXXX"
                      value={newBillPhone}
                      onChange={(e) => setNewBillPhone(e.target.value)}
                      className="w-full bg-[#18140F] border border-[#2C2720] rounded p-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 block mb-1">Total Amount (₹)</label>
                    <input
                      type="number"
                      required
                      value={newBillTotal}
                      onChange={(e) => setNewBillTotal(parseInt(e.target.value) || 0)}
                      className="w-full bg-[#18140F] border border-[#2C2720] rounded p-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 block mb-1">Jewellery Description</label>
                    <input
                      type="text"
                      placeholder="e.g. 22K Gold Antique Choker"
                      value={newBillItem}
                      onChange={(e) => setNewBillItem(e.target.value)}
                      className="w-full bg-[#18140F] border border-[#2C2720] rounded p-2 text-white"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-lg bg-[#D8B47A] text-[#090806] font-bold uppercase tracking-wider mt-2 hover:bg-[#EBD5A8]"
                  >
                    Generate Customer Invoice
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Schemes Management */}
        {activeTab === 'schemes' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h3 className="font-serif-luxury text-xl font-bold text-white">Jewellery Savings Schemes Suite</h3>
                <p className="text-xs text-gray-400">Configure scheme duration, bonus terms, and monitor customer installment folios.</p>
              </div>
              <button
                type="button"
                onClick={handleOpenNewScheme}
                className="px-4 py-2 rounded-lg bg-[#D8B47A] text-[#090806] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-[#EBD5A8] transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Scheme</span>
              </button>
            </div>

            {/* Configured Schemes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {schemes.map((s) => (
                <div key={s.id} className="bg-[#120F0B] border border-[#241F18] rounded-xl p-5 space-y-3 text-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-serif-luxury text-base font-bold text-white">{s.name}</h4>
                      <p className="text-[11px] text-[#D8B47A] font-medium">{s.tagline}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditScheme(s)}
                        className="p-1.5 text-gray-400 hover:text-[#D8B47A] rounded hover:bg-[#1E1912]"
                        title="Edit Scheme"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteScheme(s.id, s.name)}
                        className="p-1.5 text-gray-400 hover:text-rose-400 rounded hover:bg-[#1E1912]"
                        title="Delete Scheme"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 bg-[#0E0C09] p-3 rounded-lg border border-[#1C1712] text-center">
                    <div>
                      <span className="text-[10px] text-gray-500 uppercase block">Duration</span>
                      <strong className="text-white text-xs">{s.durationMonths} Months</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 uppercase block">Min Deposit</span>
                      <strong className="text-[#D8B47A] text-xs">{formatINR(s.minAmount)}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 uppercase block">Guild Bonus</span>
                      <strong className="text-emerald-400 text-xs">{s.bonusPercentage}% (1 Month)</strong>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-gray-400 block mb-1">Patron Benefits:</span>
                    <ul className="list-disc list-inside text-[11px] text-gray-300 space-y-0.5">
                      {s.benefits.slice(0, 3).map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            {/* Active Enrollments Table */}
            <div className="space-y-3 pt-4">
              <h4 className="font-serif-luxury text-lg font-bold text-white">Active Customer Scheme Folios ({enrollments.length})</h4>
              <div className="bg-[#120F0B] border border-[#241F18] rounded-xl overflow-hidden shadow-xl">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-[#241F18] bg-[#0E0C09] text-gray-400 uppercase text-[10px] tracking-wider">
                      <th className="p-3.5">Folio / Patron</th>
                      <th className="p-3.5">Scheme</th>
                      <th className="p-3.5">Monthly Amount</th>
                      <th className="p-3.5">Installments Paid</th>
                      <th className="p-3.5">Next Due</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">In-Store Remittance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1C1712] text-gray-300">
                    {enrollments.map((enr) => (
                      <tr key={enr.id} className="hover:bg-[#16120D] transition-colors">
                        <td className="p-3.5">
                          <span className="font-mono font-bold text-[#D8B47A] block">{enr.id}</span>
                          <span className="font-medium text-white">{enr.customerName}</span>
                          <span className="text-[10px] text-gray-500 block">{enr.customerPhone}</span>
                        </td>
                        <td className="p-3.5">{enr.schemeName}</td>
                        <td className="p-3.5 font-bold text-white">{formatINR(enr.monthlyAmount)}</td>
                        <td className="p-3.5">
                          <span className="font-semibold text-emerald-400">{enr.installmentsPaid}</span> / {enr.tenureMonths} Paid
                        </td>
                        <td className="p-3.5 font-mono text-gray-400">{enr.nextDueDate}</td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            {enr.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            type="button"
                            onClick={() => handleAdminRecordSchemePayment(enr.id)}
                            className="px-2.5 py-1 rounded bg-[#D8B47A]/20 text-[#D8B47A] hover:bg-[#D8B47A] hover:text-[#090806] font-semibold text-[10px] transition-colors"
                          >
                            + Record Payment
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Customer Ledger & Statements */}
        {activeTab === 'ledger' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h3 className="font-serif-luxury text-xl font-bold text-white">Customer Accounts Ledger & Audit Statements</h3>
                <p className="text-xs text-gray-400">Inspect verified debits, payments, exchange credits, and record audited adjustments.</p>
              </div>
              <button
                type="button"
                onClick={() => setLedgerModalOpen(true)}
                className="px-4 py-2 rounded-lg bg-[#D8B47A] text-[#090806] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-[#EBD5A8] transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Record Ledger Adjustment</span>
              </button>
            </div>

            {/* Filter by Customer */}
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Filter by Customer Name or Mobile..."
                value={ledgerCustomerFilter}
                onChange={(e) => setLedgerCustomerFilter(e.target.value)}
                className="bg-[#120F0B] border border-[#241F18] rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 w-72 focus:outline-none focus:border-[#D8B47A]"
              />
              {ledgerCustomerFilter && (
                <button
                  type="button"
                  onClick={() => setLedgerCustomerFilter('')}
                  className="text-xs text-gray-400 hover:text-white underline"
                >
                  Clear Filter
                </button>
              )}
            </div>

            {/* Ledger Statements Table */}
            <div className="bg-[#120F0B] border border-[#241F18] rounded-2xl overflow-hidden shadow-xl">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-[#241F18] bg-[#0E0C09] text-gray-400 uppercase text-[10px] tracking-wider">
                    <th className="p-3.5">Date</th>
                    <th className="p-3.5">Ref No.</th>
                    <th className="p-3.5">Customer</th>
                    <th className="p-3.5">Transaction Type</th>
                    <th className="p-3.5">Description</th>
                    <th className="p-3.5 text-right">Debit (₹)</th>
                    <th className="p-3.5 text-right">Credit (₹)</th>
                    <th className="p-3.5 text-right">Running Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1C1712] text-gray-300">
                  {ledgerEntries
                    .filter((e) => {
                      if (!ledgerCustomerFilter) return true;
                      const term = ledgerCustomerFilter.toLowerCase();
                      return (
                        (e.customerName && e.customerName.toLowerCase().includes(term)) ||
                        (e.customerPhone && e.customerPhone.includes(term)) ||
                        e.refNumber.toLowerCase().includes(term)
                      );
                    })
                    .map((item) => (
                      <tr key={item.id} className="hover:bg-[#16120D] transition-colors">
                        <td className="p-3.5 font-mono text-gray-400">{item.date}</td>
                        <td className="p-3.5 font-mono text-[#D8B47A] font-semibold">{item.refNumber}</td>
                        <td className="p-3.5">
                          <span className="font-semibold text-white block">{item.customerName || 'Boutique Patron'}</span>
                          {item.customerPhone && <span className="text-[10px] text-gray-500">{item.customerPhone}</span>}
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            item.type === 'PURCHASE' ? 'bg-rose-500/10 text-rose-300' :
                            item.type === 'PAYMENT' ? 'bg-emerald-500/10 text-emerald-300' :
                            item.type === 'SCHEME_INSTALLMENT' ? 'bg-amber-500/10 text-amber-300' :
                            'bg-purple-500/10 text-purple-300'
                          }`}>
                            {item.type}
                          </span>
                        </td>
                        <td className="p-3.5 max-w-xs">{item.description}</td>
                        <td className="p-3.5 text-right text-rose-300 font-medium">
                          {item.debit > 0 ? formatINR(item.debit) : '—'}
                        </td>
                        <td className="p-3.5 text-right text-emerald-400 font-medium">
                          {item.credit > 0 ? formatINR(item.credit) : '—'}
                        </td>
                        <td className="p-3.5 text-right font-serif-luxury font-bold text-white">
                          {formatINR(item.balance)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Submissions (Existing Jewellery Appraisals) */}
        {activeTab === 'submissions' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-serif-luxury text-xl font-bold text-white">Customer Appraisals & Exchange Submissions</h3>
              <p className="text-xs text-gray-400">Review submitted ancestral heirlooms, bills, and assign valuation or verification status.</p>
            </div>

            <div className="bg-[#120F0B] border border-[#241F18] rounded-2xl overflow-hidden shadow-xl">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#241F18] bg-[#0E0C09] text-gray-400 uppercase tracking-wider">
                    <th className="p-4">Customer</th>
                    <th className="p-4">Piece Description</th>
                    <th className="p-4">Metal & Weight</th>
                    <th className="p-4">Original Bill</th>
                    <th className="p-4">Submitted Date</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Appraisal Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1C1712] text-gray-300">
                  {submissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-[#16120D] transition-colors">
                      <td className="p-4">
                        <span className="font-semibold text-white block">{sub.customerName}</span>
                        <span className="text-[10px] text-gray-400">{sub.phone}</span>
                      </td>
                      <td className="p-4 max-w-xs">{sub.description}</td>
                      <td className="p-4 text-[#D8B47A] font-semibold">{sub.metalType} • {sub.estimatedWeightGrams}g</td>
                      <td className="p-4">
                        {sub.hasBill ? (
                          <span className="text-emerald-400 font-medium">Verified Bill: {sub.billNumber || 'Attached'}</span>
                        ) : (
                          <span className="text-gray-500">No Bill (Vintage)</span>
                        )}
                      </td>
                      <td className="p-4 text-gray-400 font-mono">{sub.submittedAt}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          sub.status === 'VERIFIED'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : sub.status === 'REJECTED'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        }`}>
                          {sub.status}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        {sub.status !== 'VERIFIED' && (
                          <>
                            <button
                              onClick={() => handleApproveSubmissionWithCredit(sub)}
                              className="px-2.5 py-1 rounded bg-[#D8B47A] text-[#090806] hover:bg-[#EBD5A8] font-bold text-[10px] transition-colors"
                              title="Appraise piece and add exchange credit to customer ledger"
                            >
                              Appraise & Credit Ledger
                            </button>
                            <button
                              onClick={() => handleUpdateSubmissionStatus(sub.id, 'VERIFIED')}
                              className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500 hover:text-black font-semibold text-[10px]"
                            >
                              Mark Verified
                            </button>
                          </>
                        )}
                        {sub.status !== 'REJECTED' && (
                          <button
                            onClick={() => handleUpdateSubmissionStatus(sub.id, 'REJECTED')}
                            className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-white font-semibold text-[10px]"
                          >
                            Reject
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* =========================================================
          4. SCHEME CONFIGURATION MODAL
      ========================================================= */}
      {schemeModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          onClick={() => setSchemeModalOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-[#120F0B] border border-[#D8B47A]/50 rounded-2xl max-w-lg w-full p-6 text-left shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSchemeModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#1A1510] text-[#D8B47A] hover:text-white border border-[#D8B47A]/30 flex items-center justify-center text-xl"
            >
              &times;
            </button>
            <h3 className="font-serif-luxury text-lg font-bold text-white mb-4">
              {editingSchemeId ? 'EDIT SAVINGS SCHEME' : 'CONFIGURE NEW SAVINGS SCHEME'}
            </h3>
            <form onSubmit={handleSaveScheme} className="space-y-3.5 text-xs">
              <div>
                <label className="text-gray-300 block mb-1">Scheme Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Swarna Nidhi 10+1 Gold Savings"
                  value={schName}
                  onChange={(e) => setSchName(e.target.value)}
                  className="w-full bg-[#18140F] border border-[#2B2319] rounded-lg p-2.5 text-white"
                />
              </div>
              <div>
                <label className="text-gray-300 block mb-1">Tagline / Subtext</label>
                <input
                  type="text"
                  placeholder="e.g. Exclusive 1-Month Guild Bonus"
                  value={schTagline}
                  onChange={(e) => setSchTagline(e.target.value)}
                  className="w-full bg-[#18140F] border border-[#2B2319] rounded-lg p-2.5 text-white"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-gray-300 block mb-1">Tenure (Months)</label>
                  <input
                    type="number"
                    required
                    value={schDuration}
                    onChange={(e) => setSchDuration(parseInt(e.target.value) || 11)}
                    className="w-full bg-[#18140F] border border-[#2B2319] rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-gray-300 block mb-1">Min Deposit (₹)</label>
                  <input
                    type="number"
                    required
                    value={schMinAmount}
                    onChange={(e) => setSchMinAmount(parseInt(e.target.value) || 5000)}
                    className="w-full bg-[#18140F] border border-[#2B2319] rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-gray-300 block mb-1">Bonus %</label>
                  <input
                    type="number"
                    required
                    value={schBonusPercent}
                    onChange={(e) => setSchBonusPercent(parseInt(e.target.value) || 100)}
                    className="w-full bg-[#18140F] border border-[#2B2319] rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="text-gray-300 block mb-1">Patron Benefits (Comma separated)</label>
                <input
                  type="text"
                  value={schBenefits}
                  onChange={(e) => setSchBenefits(e.target.value)}
                  className="w-full bg-[#18140F] border border-[#2B2319] rounded-lg p-2.5 text-white"
                />
              </div>
              <div>
                <label className="text-gray-300 block mb-1">Scheme Terms (Comma separated)</label>
                <input
                  type="text"
                  value={schTerms}
                  onChange={(e) => setSchTerms(e.target.value)}
                  className="w-full bg-[#18140F] border border-[#2B2319] rounded-lg p-2.5 text-white"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSchemeModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-[#2B2319] text-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-[#D8B47A] text-[#090806] font-bold uppercase tracking-wider"
                >
                  Save Scheme
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          5. CUSTOMER LEDGER ADJUSTMENT MODAL
      ========================================================= */}
      {ledgerModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          onClick={() => setLedgerModalOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-[#120F0B] border border-[#D8B47A]/50 rounded-2xl max-w-lg w-full p-6 text-left shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLedgerModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#1A1510] text-[#D8B47A] hover:text-white border border-[#D8B47A]/30 flex items-center justify-center text-xl"
            >
              &times;
            </button>
            <h3 className="font-serif-luxury text-lg font-bold text-white mb-4">
              RECORD AUDITED CUSTOMER LEDGER ADJUSTMENT
            </h3>
            <form onSubmit={handleSaveLedgerEntry} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-300 block mb-1">Customer Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Madhurima Sharma"
                    value={ledCustomer}
                    onChange={(e) => setLedCustomer(e.target.value)}
                    className="w-full bg-[#18140F] border border-[#2B2319] rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-gray-300 block mb-1">Customer Mobile</label>
                  <input
                    type="tel"
                    placeholder="98XXXXXXXX"
                    value={ledPhone}
                    onChange={(e) => setLedPhone(e.target.value)}
                    className="w-full bg-[#18140F] border border-[#2B2319] rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-300 block mb-1">Transaction Type</label>
                  <select
                    value={ledType}
                    onChange={(e) => setLedType(e.target.value as any)}
                    className="w-full bg-[#18140F] border border-[#2B2319] rounded-lg p-2.5 text-white"
                  >
                    <option value="PURCHASE">PURCHASE (Debit/Invoice)</option>
                    <option value="PAYMENT">PAYMENT (Credit/Remittance)</option>
                    <option value="REFUND">REFUND (Credit/Reversal)</option>
                    <option value="ADJUSTMENT">ADJUSTMENT (Audit/Exchange)</option>
                  </select>
                </div>
                <div>
                  <label className="text-gray-300 block mb-1">Reference Number</label>
                  <input
                    type="text"
                    placeholder="e.g. AUR-RCP-901248"
                    value={ledRef}
                    onChange={(e) => setLedRef(e.target.value)}
                    className="w-full bg-[#18140F] border border-[#2B2319] rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-300 block mb-1">Debit Amount (₹)</label>
                  <input
                    type="number"
                    value={ledDebit}
                    onChange={(e) => setLedDebit(parseInt(e.target.value) || 0)}
                    className="w-full bg-[#18140F] border border-[#2B2319] rounded-lg p-2.5 text-rose-300 font-bold"
                  />
                </div>
                <div>
                  <label className="text-gray-300 block mb-1">Credit Amount (₹)</label>
                  <input
                    type="number"
                    value={ledCredit}
                    onChange={(e) => setLedCredit(parseInt(e.target.value) || 0)}
                    className="w-full bg-[#18140F] border border-[#2B2319] rounded-lg p-2.5 text-emerald-400 font-bold"
                  />
                </div>
              </div>
              <div>
                <label className="text-gray-300 block mb-1">Transaction Description</label>
                <input
                  type="text"
                  placeholder="e.g. Store exchange voucher credit for vintage bangle"
                  value={ledDesc}
                  onChange={(e) => setLedDesc(e.target.value)}
                  className="w-full bg-[#18140F] border border-[#2B2319] rounded-lg p-2.5 text-white"
                />
              </div>
              <div>
                <label className="text-gray-300 block mb-1">Mandatory Audit Reason / Notes *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Authorized by Boutique Manager for gold assay return"
                  value={ledNotes}
                  onChange={(e) => setLedNotes(e.target.value)}
                  className="w-full bg-[#18140F] border border-[#2B2319] rounded-lg p-2.5 text-white"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setLedgerModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-[#2B2319] text-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-[#D8B47A] text-[#090806] font-bold uppercase tracking-wider"
                >
                  Record Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          6. "ADD JEWELLERY CREATION TO VAULT" POPUP MODAL
          - Clearly visible × close mark in top-right corner using actual multiplication sign ×
          - Neat position in header with proper spacing and alignment
          - Accessible type="button", aria-label="Close dialog", visible focus ring
          - Safe unsaved changes confirmation
          - Escape key and backdrop click support
          - Mobile-friendly scrollable container
      ========================================================= */}
      {productModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150"
          onClick={(e) => {
            // Close when clicking directly on backdrop
            if (e.target === e.currentTarget) {
              handleCloseModal();
            }
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="vault-modal-title"
        >
          <div 
            ref={modalRef}
            className="bg-[#120F0B] border border-[#D8B47A]/50 rounded-2xl max-w-xl w-full p-6 text-left shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-[#241F18] mb-5">
              <div className="flex items-center gap-2">
                <span className="text-[#D8B47A] text-lg">✦</span>
                <h3 id="vault-modal-title" className="font-serif-luxury text-base sm:text-lg font-bold text-white tracking-wide">
                  {editingProductId ? 'EDIT JEWELLERY CREATION IN VAULT' : 'ADD JEWELLERY CREATION TO VAULT'}
                </h3>
              </div>

              {/* Accessible × Close Button */}
              <button
                type="button"
                id="close-vault-modal-btn"
                onClick={handleCloseModal}
                aria-label="Close dialog"
                title="Close (Esc)"
                className="w-9 h-9 rounded-full bg-[#1A1510] hover:bg-[#251E17] text-[#D8B47A] hover:text-white border border-[#D8B47A]/30 flex items-center justify-center transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#D8B47A]/50 select-none text-2xl font-light leading-none"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="text-gray-300 block mb-1 font-medium">Piece Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Imperial Emerald & Solitaire Art-Deco Ring"
                  value={prodName}
                  onChange={(e) => {
                    setProdName(e.target.value);
                    setFormIsDirty(true);
                  }}
                  className="w-full bg-[#18140F] border border-[#2B2319] focus:border-[#D8B47A] rounded-lg p-2.5 text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-300 block mb-1 font-medium">SKU Reference</label>
                  <input
                    type="text"
                    required
                    value={prodSku}
                    onChange={(e) => {
                      setProdSku(e.target.value);
                      setFormIsDirty(true);
                    }}
                    className="w-full bg-[#18140F] border border-[#2B2319] focus:border-[#D8B47A] rounded-lg p-2.5 text-white font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-gray-300 block mb-1 font-medium">Category</label>
                  <select
                    value={prodCategory}
                    onChange={(e) => {
                      setProdCategory(e.target.value);
                      setFormIsDirty(true);
                    }}
                    className="w-full bg-[#18140F] border border-[#2B2319] focus:border-[#D8B47A] rounded-lg p-2.5 text-white focus:outline-none"
                  >
                    {[
                      'Rings', 
                      'Necklaces', 
                      'Earrings', 
                      'Bracelets', 
                      'Bangles', 
                      'Pendants',
                      'Bridal Jewellery',
                      'New Arrivals'
                    ].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-gray-300 block mb-1 font-medium">Gold Purity</label>
                  <select
                    value={prodPurity}
                    onChange={(e) => {
                      setProdPurity(e.target.value);
                      setFormIsDirty(true);
                    }}
                    className="w-full bg-[#18140F] border border-[#2B2319] focus:border-[#D8B47A] rounded-lg p-2.5 text-white focus:outline-none"
                  >
                    {['24K', '22K', '18K', '14K', '950 Platinum', '925 Silver'].map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-gray-300 block mb-1 font-medium">Gross Weight (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={prodWeight}
                    onChange={(e) => {
                      setProdWeight(parseFloat(e.target.value) || 0);
                      setFormIsDirty(true);
                    }}
                    className="w-full bg-[#18140F] border border-[#2B2319] focus:border-[#D8B47A] rounded-lg p-2.5 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-gray-300 block mb-1 font-medium">Vault Stock</label>
                  <input
                    type="number"
                    required
                    value={prodStock}
                    onChange={(e) => {
                      setProdStock(parseInt(e.target.value) || 0);
                      setFormIsDirty(true);
                    }}
                    className="w-full bg-[#18140F] border border-[#2B2319] focus:border-[#D8B47A] rounded-lg p-2.5 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-300 block mb-1 font-medium">Vault Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={prodPrice}
                    onChange={(e) => {
                      setProdPrice(parseInt(e.target.value) || 0);
                      setFormIsDirty(true);
                    }}
                    className="w-full bg-[#18140F] border border-[#2B2319] focus:border-[#D8B47A] rounded-lg p-2.5 text-white font-bold text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-gray-300 block mb-1 font-medium">Design Style</label>
                  <input
                    type="text"
                    placeholder="e.g. Rajputana Royal Filigree"
                    value={prodStyle}
                    onChange={(e) => {
                      setProdStyle(e.target.value);
                      setFormIsDirty(true);
                    }}
                    className="w-full bg-[#18140F] border border-[#2B2319] focus:border-[#D8B47A] rounded-lg p-2.5 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-300 block mb-1 font-medium">Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={prodImageUrl}
                  onChange={(e) => {
                    setProdImageUrl(e.target.value);
                    setFormIsDirty(true);
                  }}
                  className="w-full bg-[#18140F] border border-[#2B2319] focus:border-[#D8B47A] rounded-lg p-2.5 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-gray-300 block mb-1 font-medium">Description</label>
                <textarea
                  rows={2}
                  placeholder="Masterpiece provenance, gemstone characteristics, and styling..."
                  value={prodDescription}
                  onChange={(e) => {
                    setProdDescription(e.target.value);
                    setFormIsDirty(true);
                  }}
                  className="w-full bg-[#18140F] border border-[#2B2319] focus:border-[#D8B47A] rounded-lg p-2.5 text-white focus:outline-none"
                />
              </div>

              {/* Published Toggle */}
              <div className="flex items-center gap-3 pt-1">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodPublished}
                    onChange={(e) => {
                      setProdPublished(e.target.checked);
                      setFormIsDirty(true);
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#D8B47A]"></div>
                </label>
                <span className="text-xs text-gray-300">
                  {prodPublished ? 'Published to Customer Boutique' : 'Save as Unpublished Draft'}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#241F18] flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2.5 rounded-lg border border-[#2B2319] text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProduct}
                  className="px-6 py-2.5 rounded-lg bg-[#D8B47A] hover:bg-[#EBD5A8] text-[#090806] font-bold uppercase tracking-wider text-xs transition-colors disabled:opacity-50"
                >
                  {savingProduct ? 'Saving to Vault...' : editingProductId ? 'Save Creation' : 'Publish Piece'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
