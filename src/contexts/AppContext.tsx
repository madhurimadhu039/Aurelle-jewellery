import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, CartItem, MetalRateData, UserProfile } from '../types';
import { rateService } from '../services/rateService';
import { authService } from '../services/authService';
import { productService } from '../services/productService';
import { AuthRequiredModal } from '../components/AuthRequiredModal';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'gold' | 'error';
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

  // Products
  products: Product[];
  refreshProducts: () => Promise<void>;

  // User & Auth
  user: UserProfile | null;
  isAdmin: boolean;
  loginCustomer: (email: string, pass: string) => Promise<UserProfile>;
  registerCustomer: (name: string, email: string, pass: string, phone?: string) => Promise<UserProfile>;
  loginAdmin: (email: string, pass: string) => Promise<UserProfile>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<UserProfile>) => Promise<void>;

  // Toast
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'gold' | 'error') => void;

  // Formatters
  formatINR: (amount: number) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const GUEST_PATRON: UserProfile = {
  uid: 'patron-guest-demo',
  name: 'Madhurima Sharma',
  email: 'madhurima@example.com',
  phone: '+91 98765 43210',
  role: 'customer',
  addresses: [
    {
      street: '14B, Altamount Road, Cumballa Hill',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400026',
    },
  ],
};

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

  // Products state (subscribes to real-time changes)
  const [products, setProducts] = useState<Product[]>(() => productService.getAll(false));

  // User & Auth state (unauthenticated guests start as null until login / register)
  const [user, setUser] = useState<UserProfile | null>(() => authService.getCurrentUser());
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Authentication prompt modal state for unauthenticated cart/wishlist attempts
  const [authModal, setAuthModal] = useState<{
    isOpen: boolean;
    action: 'cart' | 'wishlist';
    productName?: string;
  }>({
    isOpen: false,
    action: 'cart',
  });

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync auth state on mount and subscribe to changes
  useEffect(() => {
    const unsubscribeAuth = authService.subscribeToAuth((activeUser, adminFlag) => {
      setUser(activeUser);
      setIsAdmin(adminFlag);
    });

    // Subscribe to product updates
    const unsubscribeProducts = productService.subscribe((updated) => {
      setProducts(updated.filter((p) => p.isPublished !== false));
    });

    // Subscribe to rate updates
    const unsubscribeRates = rateService.subscribe((updatedRates) => {
      setRates(updatedRates);
    });

    // Initial background sync from Firestore and live bullion rate check
    productService.fetchFromFirestore().catch(() => {});
    rateService.initializeRates().then((latest) => {
      if (latest && latest.gold22k !== 8455) {
        setRates(latest);
      }
    }).catch(() => {});

    return () => {
      unsubscribeAuth();
      unsubscribeProducts();
      unsubscribeRates();
    };
  }, []);

  // Guard against any residual stale 8455 in state
  useEffect(() => {
    if (rates.gold22k === 8455) {
      setRates(rateService.getRates());
    }
  }, [rates]);

  useEffect(() => {
    localStorage.setItem('aurelle_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('aurelle_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'gold' | 'error' = 'gold') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  }, []);

  const addToCart = (product: Product, quantity = 1, selectedSize?: string) => {
    // Authentication check: users must be signed in/registered to add to cart
    const isAuthenticated = Boolean(user && user.uid && user.uid !== 'patron-guest-demo');
    if (!isAuthenticated) {
      setAuthModal({
        isOpen: true,
        action: 'cart',
        productName: product.name,
      });
      showToast('Please sign in or register to add items to your cart', 'info');
      return;
    }

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
    // Authentication check: users must be signed in/registered to save to wishlist/favorites
    const isAuthenticated = Boolean(user && user.uid && user.uid !== 'patron-guest-demo');
    if (!isAuthenticated) {
      setAuthModal({
        isOpen: true,
        action: 'wishlist',
        productName: product.name,
      });
      showToast('Please sign in or register to save items to your wishlist', 'info');
      return;
    }

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
      const res = await rateService.refreshLiveRates();
      setRates(res.rates);
      if (res.source === 'live-feed' || res.source === 'goldapi') {
        showToast('Live bullion market rates updated successfully', 'success');
      } else {
        showToast(res.message, 'info');
      }
    } catch (e: any) {
      showToast('Unable to reach rate provider. Displaying official benchmark.', 'info');
    } finally {
      setIsRefreshingRates(false);
    }
  };

  const refreshProducts = async () => {
    const updated = await productService.fetchFromFirestore();
    setProducts(updated.filter((p) => p.isPublished !== false));
  };

  const loginCustomer = async (email: string, pass: string): Promise<UserProfile> => {
    const profile = await authService.loginCustomer(email, pass);
    setUser(profile);
    setIsAdmin(profile.role === 'admin');
    showToast(`Welcome back, ${profile.name}`, 'success');
    return profile;
  };

  const registerCustomer = async (
    name: string, 
    email: string, 
    pass: string, 
    phone?: string
  ): Promise<UserProfile> => {
    const profile = await authService.registerCustomer(name, email, pass, phone);
    setUser(profile);
    setIsAdmin(false);
    showToast(`Account registered successfully. Welcome to Aurelle!`, 'success');
    return profile;
  };

  const loginAdmin = async (email: string, pass: string): Promise<UserProfile> => {
    const admin = await authService.loginAdmin(email, pass);
    setUser(admin);
    setIsAdmin(true);
    showToast(`Aurelle Guild Admin credentials authenticated`, 'gold');
    return admin;
  };

  const logout = async () => {
    await authService.logout();
    setUser(GUEST_PATRON);
    setIsAdmin(false);
    showToast('Signed out successfully', 'info');
  };

  const updateUser = async (updates: Partial<UserProfile>) => {
    const updated = await authService.updateProfile(updates);
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
        products,
        refreshProducts,
        user,
        isAdmin,
        loginCustomer,
        registerCustomer,
        loginAdmin,
        logout,
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
                : toast.type === 'error'
                ? 'bg-[#2B0E0E]/95 text-[#FCA5A5] border-[#EF4444]/50'
                : 'bg-[#18181B]/95 text-gray-200 border-gray-700'
            }`}
          >
            <span className="text-[#D8B47A]">✦</span>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

      {/* Authentication Required Modal for Unauthenticated Cart / Wishlist Actions */}
      <AuthRequiredModal
        isOpen={authModal.isOpen}
        onClose={() => setAuthModal((prev) => ({ ...prev, isOpen: false }))}
        action={authModal.action}
        productName={authModal.productName}
      />
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
