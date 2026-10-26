import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, MetalRateData, UserProfile } from '../types';
import { rateService } from '../services/rateService';
import { authService } from '../services/authService';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'gold';
}

interface AppContextType {
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedSize?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;

  // Wishlist
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;

  // Comparison
  comparison: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  isInCompare: (productId: string) => boolean;
  clearCompare: () => void;

  // Metal Rates
  rates: MetalRateData;
  refreshRates: () => Promise<void>;
  isRefreshingRates: boolean;

  // User & Auth
  user: UserProfile;
  switchRole: (role: 'customer' | 'admin') => void;
  updateUser: (updates: Partial<UserProfile>) => void;

  // Toast
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'gold') => void;

  // Formatters
  formatINR: (amount: number) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Cart state persisted to localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('aurelle_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist state persisted to localStorage
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('aurelle_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Comparison state
  const [comparison, setComparison] = useState<Product[]>([]);

  // Metal rates state
  const [rates, setRates] = useState<MetalRateData>(() => rateService.getRates());
  const [isRefreshingRates, setIsRefreshingRates] = useState(false);

  // User state
  const [user, setUser] = useState<UserProfile>(() => authService.getCurrentUser());

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    localStorage.setItem('aurelle_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('aurelle_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const showToast = (message: string, type: 'success' | 'info' | 'gold' = 'gold') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const addToCart = (product: Product, quantity = 1, selectedSize?: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity, selectedSize: selectedSize || item.selectedSize }
            : item
        );
      }
      return [...prev, { product, quantity, selectedSize }];
    });
    showToast(`Added "${product.name}" to your Cart`, 'gold');
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Item removed from Cart', 'info');
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        showToast(`Removed from Wishlist`, 'info');
        return prev.filter((p) => p.id !== product.id);
      } else {
        showToast(`Saved "${product.name}" to Wishlist`, 'gold');
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.some((p) => p.id === productId);

  const addToCompare = (product: Product) => {
    if (comparison.length >= 4) {
      showToast('You can compare at most 4 jewellery pieces at once', 'info');
      return;
    }
    if (comparison.some((p) => p.id === product.id)) {
      removeFromCompare(product.id);
      return;
    }
    setComparison((prev) => [...prev, product]);
    showToast(`Added to Comparison (${comparison.length + 1}/4)`, 'gold');
  };

  const removeFromCompare = (productId: string) => {
    setComparison((prev) => prev.filter((p) => p.id !== productId));
    showToast('Removed from Comparison', 'info');
  };

  const isInCompare = (productId: string) => comparison.some((p) => p.id === productId);
  const clearCompare = () => setComparison([]);

  const refreshRates = async () => {
    setIsRefreshingRates(true);
    try {
      const updated = await rateService.refreshLiveRates();
      setRates(updated);
      showToast('Live bullion market rates updated successfully', 'success');
    } catch (e) {
      showToast('Unable to fetch live rates. Using cached rates.', 'info');
    } finally {
      setIsRefreshingRates(false);
    }
  };

  const switchRole = (role: 'customer' | 'admin') => {
    const updated = authService.setUserRole(role);
    setUser(updated);
    showToast(`Switched view to ${role.toUpperCase()} mode`, 'gold');
  };

  const updateUser = (updates: Partial<UserProfile>) => {
    const updated = authService.updateProfile(updates);
    setUser(updated);
    showToast('Account details updated', 'success');
  };

  const formatINR = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <AppContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        wishlist,
        toggleWishlist,
        isInWishlist,
        comparison,
        addToCompare,
        removeFromCompare,
        isInCompare,
        clearCompare,
        rates,
        refreshRates,
        isRefreshingRates,
        user,
        switchRole,
        updateUser,
        toasts,
        showToast,
        formatINR,
      }}
    >
      {children}
      {/* Toast Notification Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 px-5 py-3.5 rounded-lg border text-sm font-medium shadow-2xl backdrop-blur-md transition-all duration-300 transform translate-y-0 ${
              toast.type === 'gold'
                ? 'bg-[#15130F]/95 text-[#F7F1E7] border-[#D8B47A]/50 shadow-[0_4px_25px_rgba(216,180,122,0.18)]'
                : toast.type === 'success'
                ? 'bg-[#0E1E14]/95 text-[#D1FAE5] border-[#10B981]/50'
                : 'bg-[#18181B]/95 text-gray-200 border-gray-700'
            }`}
          >
            <span className="text-[#D8B47A]">✦</span>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
