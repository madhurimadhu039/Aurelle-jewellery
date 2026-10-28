import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ShieldCheck, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../contexts/AppContext';
import { productService } from '../services/productService';
import { orderService } from '../services/orderService';

export const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, cartSubtotal, formatINR, user } = useApp();
  const navigate = useNavigate();

  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');

  // Form states initialized with logged-in user details if available
  const [formData, setFormData] = useState({
    name: user?.name || 'Madhurima Sharma',
    email: user?.email || 'madhurima@example.com',
    phone: user?.phone || '+91 98765 43210',
    address: user?.addresses?.[0]?.street || '14B, Altamount Road, Cumballa Hill',
    city: user?.addresses?.[0]?.city || 'Mumbai',
    pincode: user?.addresses?.[0]?.pincode || '400026',
    paymentMode: 'UPI',
  });

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (coupon.toUpperCase() === 'AURELLE10') {
      const disc = Math.round(cartSubtotal * 0.1);
      setDiscount(disc);
      setCouponApplied(true);
    } else {
      alert('Invalid coupon code. Try "AURELLE10" for 10% privilege discount.');
    }
  };

  // Re-verify prices and stock against active product catalogue
  let validatedSubtotal = 0;
  for (const item of cart) {
    const liveProd = productService.getById(item.product.id);
    const unitPrice = liveProd ? liveProd.price : item.product.price;
    validatedSubtotal += unitPrice * item.quantity;
  }

  const gstAmount = Math.round((validatedSubtotal - discount) * 0.03);
  const finalTotal = validatedSubtotal - discount + gstAmount;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    // Verify stock availability
    for (const item of cart) {
      const liveProd = productService.getById(item.product.id);
      if (liveProd && liveProd.stock < item.quantity) {
        alert(`Insufficient vault stock for "${item.product.name}". Only ${liveProd.stock} remaining in vault.`);
        return;
      }
    }

    const newOrderId = `AUR-ORD-${Math.floor(100000 + Math.random() * 900000)}`;

    // Persist real order record
    orderService.createOrder({
      orderNumber: newOrderId,
      items: cart.map((c) => ({
        id: c.product.id,
        name: c.product.name,
        sku: c.product.sku,
        price: c.product.price,
        quantity: c.quantity,
        image: c.product.images[0] || '/images/hero-model.jpg',
        purity: c.product.purity,
      })),
      subtotal: validatedSubtotal,
      tax: gstAmount,
      discount,
      shipping: 0,
      total: finalTotal,
      customer: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        pincode: formData.pincode,
        state: 'Maharashtra',
      },
      paymentMethod: formData.paymentMode as any,
      paymentStatus: 'PAID',
      status: 'CONFIRMED',
    }).catch(() => {});

    // Deduct stock in real time
    for (const item of cart) {
      productService.deductStock(item.product.id, item.quantity).catch(() => {});
    }

    setOrderId(newOrderId);
    setOrderComplete(true);
    clearCart();

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D8B47A', '#F7F1E7', '#A98446'],
      });
    } catch (err) {
      // safe fallback
    }
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-[#090806] text-white py-16 px-4">
        <div className="max-w-lg mx-auto bg-[#120F0B] border border-[#D8B47A]/50 rounded-2xl p-8 text-center shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-[#10B981]/20 border border-[#10B981] text-[#10B981] flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#D8B47A]">Order Registered</span>
          <h2 className="font-serif-luxury text-3xl font-bold text-white mt-1 mb-2">
            Thank You for Your Patronage
          </h2>
          <p className="text-xs text-gray-400 mb-4">
            Your order <strong className="text-[#D8B47A]">#{orderId}</strong> has been logged in the vault register.
          </p>

          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-[11px] text-amber-200 text-left mb-5">
            <strong>Payment Notice (Demo Environment):</strong> Online payment processing gateway is currently in sandbox/pending configuration. No live bank deduction was made.
          </div>

          <div className="bg-[#18140F] border border-[#2B2319] rounded-xl p-4 text-xs text-left mb-6 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Recipient:</span>
              <span className="text-white font-medium">{formData.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Delivery Address:</span>
              <span className="text-white font-medium">{formData.address}, {formData.city}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Payment Status:</span>
              <span className="text-[#D8B47A] font-medium">{formData.paymentMode} (Demo Registration)</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-[#241F18]">
              <span className="text-gray-400 font-semibold">Total Value:</span>
              <span className="text-[#D8B47A] font-bold text-sm">{formatINR(finalTotal)}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <Link
              to="/passport"
              className="flex-1 py-2.5 rounded-lg bg-[#D8B47A] text-[#090806] text-xs font-bold uppercase tracking-wider hover:bg-[#EBD5A8]"
            >
              View Heirloom Passport
            </Link>
            <Link
              to="/shop"
              className="flex-1 py-2.5 rounded-lg bg-[#1D1812] text-white border border-[#2C2720] text-xs font-bold uppercase tracking-wider hover:bg-[#251F17]"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#090806] text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-[#120F0B] border border-[#262018] text-[#D8B47A] flex items-center justify-center mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="font-serif-luxury text-3xl font-bold mb-2">Your Shopping Bag is Empty</h2>
        <p className="text-xs text-gray-400 max-w-sm mb-6">
          Explore our fine collections of 22K gold heirlooms, rare solitaires, and royal bridal pieces.
        </p>
        <Link
          to="/shop"
          className="px-8 py-3 rounded-xl bg-[#D8B47A] text-[#090806] text-xs font-bold uppercase tracking-widest hover:bg-[#EBD5A8] transition-colors"
        >
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090806] text-[#F7F1E7] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-white mb-2 text-left">
          Shopping Bag ({cart.length} {cart.length === 1 ? 'Piece' : 'Pieces'})
        </h1>
        <p className="text-xs text-gray-400 mb-8 text-left">
          All orders are shipped via insured high-security vault transit across India.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.product.id}
                className="bg-[#120F0B] border border-[#241F18] rounded-xl p-4 flex gap-4 items-center"
              >
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (item.product.category === 'Bracelets') {
                      target.src = '/images/bracelet-1.jpg';
                    }
                  }}
                  className="w-24 h-24 rounded-lg object-cover bg-black flex-shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#D8B47A]">
                        {item.product.purity} • {item.product.weightGrams}g
                      </span>
                      <h4 className="font-serif-luxury text-base font-bold text-white truncate">
                        {item.product.name}
                      </h4>
                      {item.selectedSize && (
                        <p className="text-xs text-gray-400 mt-0.5">Size: {item.selectedSize}</p>
                      )}
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-1.5 text-gray-500 hover:text-red-400"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex justify-between items-center mt-3 pt-2 border-t border-[#1C1712]">
                    {/* Quantity controls */}
                    <div className="flex items-center border border-[#2B2319] rounded bg-[#18140F]">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="px-2.5 py-0.5 text-xs text-gray-300 hover:text-white"
                      >
                        -
                      </button>
                      <span className="px-2 text-xs font-semibold text-white">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="px-2.5 py-0.5 text-xs text-gray-300 hover:text-white"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-sm font-bold text-white">
                      {formatINR(item.product.price * item.quantity)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Card */}
          <div className="space-y-6">
            <div className="bg-[#120F0B] border border-[#2B2319] rounded-xl p-5 space-y-4">
              <h3 className="text-xs uppercase font-bold tracking-wider text-[#D8B47A] pb-3 border-b border-[#241F18]">
                Order Summary
              </h3>

              <div className="space-y-2 text-xs text-gray-400">
                <div className="flex justify-between">
                  <span>Bag Subtotal:</span>
                  <span className="text-white font-medium">{formatINR(cartSubtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-[#34D399]">
                    <span>Privilege Discount (10%):</span>
                    <span>-{formatINR(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Applicable GST (3%):</span>
                  <span className="text-white font-medium">{formatINR(gstAmount)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Insured Express Shipping:</span>
                  <span className="text-[#34D399] font-medium">COMPLIMENTARY</span>
                </div>

                <div className="pt-3 border-t border-[#241F18] flex justify-between text-base font-bold">
                  <span className="text-white">Grand Total:</span>
                  <span className="text-[#D8B47A]">{formatINR(finalTotal)}</span>
                </div>
              </div>

              {/* Coupon input */}
              <form onSubmit={handleApplyCoupon} className="pt-2 flex gap-2">
                <input
                  type="text"
                  placeholder="Promo Code (AURELLE10)"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  className="flex-1 bg-[#18140F] border border-[#2B2319] rounded px-3 py-1.5 text-xs text-white placeholder-gray-500 uppercase"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-[#241E17] hover:bg-[#D8B47A] text-white hover:text-black text-xs font-semibold rounded border border-[#D8B47A]/30 transition-colors"
                >
                  Apply
                </button>
              </form>

              {/* Checkout Button */}
              <button
                onClick={() => setCheckoutModalOpen(true)}
                className="w-full py-3.5 rounded-xl bg-[#D8B47A] hover:bg-[#EBD5A8] text-[#090806] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-[#D8B47A]/10 transition-colors"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 text-[11px] text-gray-500 pt-1">
                <ShieldCheck className="w-4 h-4 text-[#D8B47A]" />
                <span>100% Encrypted & Authenticated Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {checkoutModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          onClick={(e) => {
            if (e.target === e.currentTarget) setCheckoutModalOpen(false);
          }}
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[#120F0B] border border-[#D8B47A]/40 rounded-2xl max-w-xl w-full p-6 text-left max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-[#241F18] mb-4">
              <h3 className="font-display-luxury text-base font-bold text-white">
                CONFIRM SHIPPING & ORDER
              </h3>
              <button 
                type="button"
                onClick={() => setCheckoutModalOpen(false)} 
                aria-label="Close dialog"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-[#D8B47A] hover:bg-[#1E1912] focus:outline-none focus:ring-2 focus:ring-[#D8B47A] text-xl font-light leading-none"
              >
                ×
              </button>
            </div>

            <div className="mb-4 p-3 rounded-xl bg-[#D8B47A]/10 border border-[#D8B47A]/30 text-[11px] text-[#D8B47A]">
              <strong>Sandbox / Demo Notice:</strong> Payment gateway is in demo mode. Submitting this order will register your request in the vault without live credit card/UPI charges.
            </div>

            <form onSubmit={handlePlaceOrder} className="space-y-4 text-xs">
              <div>
                <label className="text-gray-400 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#18140F] border border-[#2B2319] rounded p-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400 block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#18140F] border border-[#2B2319] rounded p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-gray-400 block mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#18140F] border border-[#2B2319] rounded p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-400 block mb-1">Shipping Street Address</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-[#18140F] border border-[#2B2319] rounded p-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400 block mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-[#18140F] border border-[#2B2319] rounded p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-gray-400 block mb-1">Pincode</label>
                  <input
                    type="text"
                    required
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full bg-[#18140F] border border-[#2B2319] rounded p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-400 block mb-1.5">Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  {['UPI', 'Credit/Debit Card', 'Net Banking'].map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setFormData({ ...formData, paymentMode: mode })}
                      className={`p-2.5 rounded border text-center font-medium ${
                        formData.paymentMode === mode
                          ? 'bg-[#D8B47A] text-[#090806] border-[#D8B47A]'
                          : 'bg-[#18140F] text-gray-300 border-[#2B2319]'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#241F18] flex items-center justify-between">
                <div>
                  <span className="text-gray-400 block text-[11px]">Payable Amount</span>
                  <span className="text-base font-extrabold text-[#D8B47A]">{formatINR(finalTotal)}</span>
                </div>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-[#D8B47A] text-[#090806] font-bold uppercase tracking-wider hover:bg-[#EBD5A8]"
                >
                  Confirm & Place Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
