import React, { useState } from 'react';
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
  Layers 
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { productService } from '../services/productService';
import { payDueService } from '../services/payDueService';
import { rateService } from '../services/rateService';
import { Product, PayDueRecord } from '../types';

export const AdminPage: React.FC = () => {
  const { user, switchRole, rates, formatINR, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'products' | 'rates' | 'dues' | 'submissions'>('products');

  // Products
  const [products, setProducts] = useState<Product[]>(() => productService.getAll());
  const [newProductModal, setNewProductModal] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState(95000);
  const [newProdCategory, setNewProdCategory] = useState('Rings');
  const [newProdPurity, setNewProdPurity] = useState('18K');
  const [newProdWeight, setNewProdWeight] = useState(4.2);

  // Bullion rates manual editor
  const [edit22k, setEdit22k] = useState(rates.gold22k);
  const [edit24k, setEdit24k] = useState(rates.gold24k);
  const [editSilver, setEditSilver] = useState(rates.silver1g);

  // Pay Dues
  const [payDues, setPayDues] = useState<PayDueRecord[]>(() => payDueService.getAll());
  const [newBillNumber, setNewBillNumber] = useState('');
  const [newBillCustomer, setNewBillCustomer] = useState('');
  const [newBillPhone, setNewBillPhone] = useState('');
  const [newBillTotal, setNewBillTotal] = useState(150000);
  const [newBillItem, setNewBillItem] = useState('');

  const handleUpdateRates = (e: React.FormEvent) => {
    e.preventDefault();
    rateService.updateRates({
      gold22k: edit22k,
      gold24k: edit24k,
      silver1g: editSilver,
    });
    showToast('Bullion rates updated in live system!', 'success');
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Product = {
      id: 'aur-custom-' + Date.now(),
      name: newProdName,
      sku: `AUR-SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      category: newProdCategory as any,
      description: 'Handcrafted luxury piece added via Aurelle Admin Suite with verified purity assay.',
      price: newProdPrice,
      images: [
        'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
      ],
      material: `${newProdPurity} Solid Gold`,
      purity: newProdPurity as any,
      weightGrams: newProdWeight,
      stock: 5,
      style: 'Artisan Contemporary',
      occasion: ['Luxury Daily', 'Anniversary'],
      isFeatured: true,
      rating: 5.0,
      reviewsCount: 1,
      certification: 'BIS 916 Guaranteed',
    };

    productService.saveProduct(created);
    setProducts(productService.getAll());
    setNewProductModal(false);
    showToast(`Product "${created.name}" created!`, 'success');
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Delete this product from catalog?')) {
      productService.deleteProduct(id);
      setProducts(productService.getAll());
      showToast('Product deleted', 'info');
    }
  };

  const handleCreatePayDue = (e: React.FormEvent) => {
    e.preventDefault();
    payDueService.createRecord({
      billNumber: newBillNumber || `AUR-INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: newBillCustomer,
      customerPhone: newBillPhone,
      customerEmail: 'customer@example.com',
      totalAmount: newBillTotal,
      amountPaid: 0,
      balanceDue: newBillTotal,
      dueDate: new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString().split('T')[0],
      status: 'PENDING',
      orderSummary: newBillItem || 'Fine Jewellery Order',
    });
    setPayDues(payDueService.getAll());
    showToast('Pay Due record created for customer', 'success');
    setNewBillCustomer('');
    setNewBillPhone('');
  };

  if (user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#090806] text-white flex flex-col items-center justify-center p-6 text-center">
        <ShieldAlert className="w-16 h-16 text-[#D8B47A] mb-4" />
        <h2 className="font-serif-luxury text-3xl font-bold mb-2">Restricted Guild Admin Access</h2>
        <p className="text-xs text-gray-400 max-w-md mb-6">
          You are currently in customer viewing mode. Switch to Administrator mode to access product management, bullion feeds, and customer ledger records.
        </p>
        <button
          onClick={() => switchRole('admin')}
          className="px-6 py-2.5 rounded-lg bg-[#D8B47A] text-[#090806] text-xs font-bold uppercase tracking-wider"
        >
          Switch to Admin Role Mode
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090806] text-[#F7F1E7] py-10 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Admin Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-6 border-b border-[#241F18] mb-8 gap-4">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-[#D8B47A]">
              AUTHORIZED PERSONNEL CONTROL
            </span>
            <h1 className="font-serif-luxury text-3xl font-bold text-white mt-1">
              Aurelle Guild Admin Suite
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">Logged in as Administrator ({user.name})</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => switchRole('customer')}
              className="px-4 py-2 rounded-lg bg-[#18140F] border border-[#2B2319] hover:border-[#D8B47A] text-xs font-semibold text-gray-300"
            >
              Exit to Customer View
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
            Product Catalog ({products.length})
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
        </div>

        {/* Tab 1: Products */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-serif-luxury text-xl font-bold text-white">Catalogue & Inventory</h3>
              <button
                onClick={() => setNewProductModal(true)}
                className="px-4 py-2 rounded-lg bg-[#D8B47A] text-[#090806] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add New Piece
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
                    <th className="p-4">Stock</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1C1712] text-gray-300">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-[#16120D]">
                      <td className="p-4 flex items-center gap-3">
                        <img src={p.images[0]} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-black" />
                        <span className="font-semibold text-white">{p.name}</span>
                      </td>
                      <td className="p-4 font-mono text-gray-400">{p.sku}</td>
                      <td className="p-4">{p.category}</td>
                      <td className="p-4 font-bold text-[#D8B47A]">{p.purity} ({p.weightGrams}g)</td>
                      <td className="p-4 font-bold text-white">{formatINR(p.price)}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold">
                          {p.stock} in vault
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-1.5 text-gray-400 hover:text-red-400 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Bullion Rates */}
        {activeTab === 'rates' && (
          <div className="max-w-2xl bg-[#120F0B] border border-[#2B2319] rounded-2xl p-6 sm:p-8">
            <h3 className="font-serif-luxury text-2xl font-bold text-white mb-2">
              Bullion Rate Master Configuration
            </h3>
            <p className="text-xs text-gray-400 mb-6">
              Override live market benchmark rates. Changes reflect dynamically across all product price formulas and the top gold rate ticker.
            </p>

            <form onSubmit={handleUpdateRates} className="space-y-4 text-xs">
              <div>
                <label className="text-gray-300 block mb-1 font-medium">22-Carat Gold Rate (₹ / Gram)</label>
                <input
                  type="number"
                  value={edit22k}
                  onChange={(e) => setEdit22k(parseInt(e.target.value) || 0)}
                  className="w-full bg-[#18140F] border border-[#2C2720] rounded-lg p-2.5 text-base font-bold text-white"
                />
              </div>

              <div>
                <label className="text-gray-300 block mb-1 font-medium">24-Carat Pure Gold Rate (₹ / Gram)</label>
                <input
                  type="number"
                  value={edit24k}
                  onChange={(e) => setEdit24k(parseInt(e.target.value) || 0)}
                  className="w-full bg-[#18140F] border border-[#2C2720] rounded-lg p-2.5 text-base font-bold text-[#D8B47A]"
                />
              </div>

              <div>
                <label className="text-gray-300 block mb-1 font-medium">Silver 999 Rate (₹ / Gram)</label>
                <input
                  type="number"
                  step="0.5"
                  value={editSilver}
                  onChange={(e) => setEditSilver(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#18140F] border border-[#2C2720] rounded-lg p-2.5 text-base font-bold text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#D8B47A] hover:bg-[#EBD5A8] text-[#090806] text-xs font-bold uppercase tracking-wider"
              >
                Broadcast Rates Across System
              </button>
            </form>
          </div>
        )}

        {/* Tab 3: Pay Dues Management */}
        {activeTab === 'dues' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Existing Dues List */}
              <div className="lg:col-span-2 space-y-4">
                <h3 className="font-serif-luxury text-xl font-bold text-white">Outstanding Customer Bills</h3>
                <div className="space-y-3">
                  {payDues.map((due) => (
                    <div
                      key={due.id}
                      className="bg-[#120F0B] border border-[#241F18] rounded-xl p-4 text-xs flex justify-between items-center"
                    >
                      <div>
                        <span className="font-mono font-bold text-white">{due.billNumber}</span>
                        <p className="text-gray-400 mt-0.5">{due.customerName} ({due.customerPhone})</p>
                        <p className="text-[11px] text-gray-500">{due.orderSummary}</p>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-extrabold text-[#D8B47A]">{formatINR(due.balanceDue)} Due</span>
                        <div className="text-[11px] text-gray-400 mt-0.5">Total: {formatINR(due.totalAmount)}</div>
                        <span className="text-[10px] font-bold text-emerald-400 uppercase">{due.status}</span>
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
                    className="w-full py-2.5 rounded-lg bg-[#D8B47A] text-[#090806] font-bold uppercase tracking-wider"
                  >
                    Generate Customer Invoice
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* New Product Modal */}
      {newProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#120F0B] border border-[#D8B47A]/40 rounded-2xl max-w-lg w-full p-6 text-left">
            <h3 className="font-display-luxury text-base font-bold text-white mb-4">
              ADD JEWELLERY CREATION TO VAULT
            </h3>
            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div>
                <label className="text-gray-400 block mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Emerald & Solitaire Art-Deco Ring"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  className="w-full bg-[#18140F] border border-[#2B2319] rounded p-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400 block mb-1">Category</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    className="w-full bg-[#18140F] border border-[#2B2319] rounded p-2 text-white"
                  >
                    {['Rings', 'Necklaces', 'Earrings', 'Bracelets', 'Bangles', 'Bridal Jewellery'].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-gray-400 block mb-1">Purity</label>
                  <select
                    value={newProdPurity}
                    onChange={(e) => setNewProdPurity(e.target.value)}
                    className="w-full bg-[#18140F] border border-[#2B2319] rounded p-2 text-white"
                  >
                    {['24K', '22K', '18K', '14K'].map((p) => (
                      <option key={p} value={p}>{p} Gold</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400 block mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(parseInt(e.target.value) || 0)}
                    className="w-full bg-[#18140F] border border-[#2B2319] rounded p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-gray-400 block mb-1">Gross Weight (Grams)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={newProdWeight}
                    onChange={(e) => setNewProdWeight(parseFloat(e.target.value) || 1)}
                    className="w-full bg-[#18140F] border border-[#2B2319] rounded p-2 text-white"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#241F18] flex justify-between">
                <button
                  type="button"
                  onClick={() => setNewProductModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-[#D8B47A] text-[#090806] font-bold uppercase tracking-wider"
                >
                  Publish Piece
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
