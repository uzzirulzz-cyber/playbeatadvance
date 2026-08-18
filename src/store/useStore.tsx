import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Product, 
  Category, 
  CartItem, 
  Coupon, 
  Order, 
  NotificationItem, 
  User, 
  UserRole, 
  Currency, 
  ThemePreset, 
  ActiveView,
  Review 
} from '../types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_COUPONS, INITIAL_NOTIFICATIONS, DEMO_USER } from '../data/initialData';
import { generateLicenseKey, generateOrderNumber, formatCurrency, formatPKR } from '../lib/utils';
import confetti from 'canvas-confetti';

interface StoreContextType {
  products: Product[];
  categories: Category[];
  cart: CartItem[];
  favorites: string[];
  orders: Order[];
  coupons: Coupon[];
  notifications: NotificationItem[];
  user: User;
  activeRole: UserRole;
  activeView: ActiveView;
  selectedCategory: string;
  selectedType: string;
  searchQuery: string;
  sortBy: 'popular' | 'newest' | 'price_asc' | 'price_desc' | 'rating';
  priceRange: [number, number];
  currency: Currency;
  themePreset: ThemePreset;
  selectedProduct: Product | null;
  isCartOpen: boolean;
  isWishlistOpen: boolean;
  isOrderLookupOpen: boolean;
  isSupportOpen: boolean;
  appliedCoupon: Coupon | null;
  isAdminAuthenticated: boolean;
  isMongoConnected: boolean;
  
  // Format helpers
  formatCurrency: (amountPKR: number, curr?: Currency) => string;
  formatPKR: (amount: number) => string;

  // Actions
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  addProduct: (product: Omit<Product, 'id' | 'rating' | 'reviewCount' | 'salesCount'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addReview: (productId: string, review: Omit<Review, 'id' | 'createdAt' | 'helpfulCount'>) => void;
  
  addToCart: (product: Product, quantity?: number, selectedLicense?: string) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotalCount: number;
  cartSubtotalPKR: number;
  cartDiscountPKR: number;
  cartFinalTotalPKR: number;
  
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  addCoupon: (coupon: Coupon) => void;
  
  processCheckout: (
    paymentMethod: Order['paymentMethod'], 
    customerDetails: { name: string; email: string; phone?: string }
  ) => Order;
  updateOrderStatus: (orderId: string, status: 'COMPLETED' | 'PENDING' | 'REFUNDED') => void;
  
  adminLogin: (email: string, password: string) => { success: boolean; message: string };
  adminLogout: () => void;
  
  setSelectedProduct: (product: Product | null) => void;
  setIsCartOpen: (open: boolean) => void;
  setIsWishlistOpen: (open: boolean) => void;
  setIsOrderLookupOpen: (open: boolean) => void;
  setIsSupportOpen: (open: boolean) => void;
  
  setActiveView: (view: ActiveView) => void;
  setActiveRole: (role: UserRole) => void;
  setSelectedCategory: (cat: string) => void;
  setSelectedType: (type: string) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sort: 'popular' | 'newest' | 'price_asc' | 'price_desc' | 'rating') => void;
  setPriceRange: (range: [number, number]) => void;
  setCurrency: (currency: Currency) => void;
  setThemePreset: (preset: ThemePreset) => void;
  
  markNotificationRead: (id: string) => void;
  addNotification: (notification: Omit<NotificationItem, 'id' | 'createdAt' | 'read'>) => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load initial saved state or defaults
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('playbeat_products_v3');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.some((p: Product) => p.id === 'prod-proj-hy300-pro')) {
          return parsed;
        }
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_PRODUCTS;
  });

  const [categories] = useState<Category[]>(INITIAL_CATEGORIES);
  
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('playbeat_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('playbeat_favs');
    return saved ? JSON.parse(saved) : ['prod-stream-1', 'prod-proj-1', 'prod-ai-1'];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('playbeat_orders');
    return saved ? JSON.parse(saved) : [
      {
        id: 'ord-sample-1',
        orderNumber: 'PB-849201-4921',
        createdAt: '2026-08-16T14:20:00.000Z',
        customerEmail: 'alex@playbeat.io',
        customerName: 'Alex Vance',
        items: [
          {
            product: INITIAL_PRODUCTS[2], // Netflix
            quantity: 1,
            unitPrice: INITIAL_PRODUCTS[2].discountPrice || INITIAL_PRODUCTS[2].price,
            licenseKeys: ['PB-NFLX-4K92-VAULT-2026'],
            downloadUrl: 'https://netflix.com/login'
          }
        ],
        subtotal: 11999,
        discount: 1200,
        total: 10799,
        currency: 'PKR',
        paymentMethod: 'jazzcash',
        paymentStatus: 'PAID',
        couponCode: 'VIP10',
        transactionRef: 'JC-TXN-9842018'
      }
    ];
  });

  // Initialize view and role based on browser URL pathname
  const getInitialView = (): ActiveView => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      if (path === '/adminpanel' || path === '/admin' || path === '/wp-admin') return 'admin';
      if (path === '/vendor') return 'vendor';
      if (path === '/affiliate') return 'affiliate';
      if (path === '/storefront') return 'storefront';
    }
    return 'storefront';
  };

  const getInitialRole = (): UserRole => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      if (path === '/adminpanel' || path === '/admin' || path === '/wp-admin') return 'ADMIN';
      if (path === '/vendor') return 'VENDOR';
      if (path === '/affiliate') return 'AFFILIATE';
    }
    return 'CUSTOMER';
  };

  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [user, setUser] = useState<User>(DEMO_USER);
  const [activeRole, setActiveRole] = useState<UserRole>(getInitialRole);
  const [activeView, setActiveViewState] = useState<ActiveView>(getInitialView);

  const setActiveView = (view: ActiveView) => {
    setActiveViewState(view);
    if (typeof window !== 'undefined') {
      let targetPath = '/';
      if (view === 'storefront') targetPath = '/storefront';
      else if (view === 'admin') targetPath = '/adminpanel';
      else if (view === 'vendor') targetPath = '/vendor';
      else if (view === 'affiliate') targetPath = '/affiliate';

      if (window.location.pathname !== targetPath && !(view === 'storefront' && window.location.pathname === '/')) {
        window.history.pushState({ view }, '', targetPath);
      }
    }
  };

  // Sync with browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      if (path === '/adminpanel' || path === '/admin' || path === '/wp-admin') {
        setActiveViewState('admin');
        setActiveRole('ADMIN');
      } else if (path === '/vendor') {
        setActiveViewState('vendor');
        setActiveRole('VENDOR');
      } else if (path === '/affiliate') {
        setActiveViewState('affiliate');
        setActiveRole('AFFILIATE');
      } else {
        setActiveViewState('storefront');
        setActiveRole('CUSTOMER');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Filtering states
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'price_asc' | 'price_desc' | 'rating'>('popular');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  
  // UI & Theme states
  const [currency, setCurrency] = useState<Currency>('PKR');
  const [themePreset, setThemePreset] = useState<ThemePreset>(() => {
    const saved = localStorage.getItem('playbeat_theme');
    return (saved as ThemePreset) || 'martfury';
  });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isOrderLookupOpen, setIsOrderLookupOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('playbeat_admin_auth') === 'true';
  });
  const [isMongoConnected, setIsMongoConnected] = useState<boolean>(false);

  // Sync state to MongoDB & fetch latest remote dataset
  useEffect(() => {
    const checkBackendAndFetch = async () => {
      try {
        const healthRes = await fetch('/api/health');
        if (healthRes.ok) {
          const healthData = await healthRes.json();
          setIsMongoConnected(healthData.connected ?? true);
        }

        const prodRes = await fetch('/api/products');
        if (prodRes.ok) {
          const fetchedProducts = await prodRes.json();
          if (Array.isArray(fetchedProducts) && fetchedProducts.length > 0) {
            setProducts(fetchedProducts);
          }
        }

        const orderRes = await fetch('/api/orders');
        if (orderRes.ok) {
          const fetchedOrders = await orderRes.json();
          if (Array.isArray(fetchedOrders) && fetchedOrders.length > 0) {
            setOrders(prev => {
              const combined = [...fetchedOrders];
              for (const p of prev) {
                if (!combined.some(c => c.id === p.id)) combined.push(p);
              }
              return combined;
            });
          }
        }
      } catch (err) {
        // Local mode fallback
      }
    };

    checkBackendAndFetch();
  }, []);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('playbeat_products_v3', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('playbeat_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('playbeat_favs', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('playbeat_orders', JSON.stringify(orders));
  }, [orders]);

  // Handle theme class on root and persist
  useEffect(() => {
    localStorage.setItem('playbeat_theme', themePreset);
    const root = document.documentElement;
    root.classList.remove('theme-martfury', 'theme-obsidian', 'theme-titanium', 'theme-cyberpunk', 'theme-emerald');
    root.classList.add(`theme-${themePreset}`);
    if (themePreset === 'titanium') {
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
    }
  }, [themePreset]);

  // Cart helper calculations
  const cartTotalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  const cartSubtotalPKR = cart.reduce((sum, item) => {
    const effectivePrice = item.product.discountPrice ?? item.product.price;
    return sum + effectivePrice * item.quantity;
  }, 0);

  let cartDiscountPKR = 0;
  if (appliedCoupon && cartSubtotalPKR >= appliedCoupon.minSpendPKR) {
    const calculated = (cartSubtotalPKR * appliedCoupon.discountPercent) / 100;
    cartDiscountPKR = appliedCoupon.maxDiscountPKR ? Math.min(calculated, appliedCoupon.maxDiscountPKR) : calculated;
  }

  const cartFinalTotalPKR = Math.max(0, cartSubtotalPKR - cartDiscountPKR);

  // Cart actions
  const addToCart = (product: Product, quantity = 1, selectedLicense?: string) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        if (selectedLicense) updated[existingIndex].selectedLicense = selectedLicense;
        return updated;
      }
      return [...prev, { product, quantity, selectedLicense: selectedLicense || product.licenseType }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => item.product.id === productId ? { ...item, quantity } : item));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Wishlist actions
  const toggleFavorite = (productId: string) => {
    setFavorites(prev => 
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const isFavorite = (productId: string) => favorites.includes(productId);

  // Coupon actions
  const applyCoupon = (code: string) => {
    const cleaned = code.trim().toUpperCase();
    const found = coupons.find(c => c.code === cleaned);
    if (!found) {
      return { success: false, message: 'Invalid promo code. Try PLAYBEAT20 or LAUNCH50' };
    }
    if (cartSubtotalPKR < found.minSpendPKR) {
      return { success: false, message: `Coupon requires a minimum spend of Rs ${found.minSpendPKR.toLocaleString()}` };
    }
    setAppliedCoupon(found);
    return { success: true, message: `Promo code ${cleaned} applied successfully!` };
  };

  const removeCoupon = () => setAppliedCoupon(null);

  const addCoupon = (newCoupon: Coupon) => {
    setCoupons(prev => [newCoupon, ...prev]);
    addNotification({
      type: 'SYSTEM',
      title: 'Coupon Created',
      message: `Code ${newCoupon.code} (${newCoupon.discountPercent}% OFF) is now active.`
    });
  };

  const updateOrderStatus = (orderId: string, status: 'COMPLETED' | 'PENDING' | 'REFUNDED') => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    addNotification({
      type: 'ORDER',
      title: 'Order Status Updated',
      message: `Order status set to ${status}.`
    });
  };

  const adminLogin = (email: string, password: string) => {
    const correctEmail = import.meta.env.REACT_APP_ADMIN_EMAIL;
    const correctPassword = import.meta.env.REACT_APP_ADMIN_PASSWORD;
    
    if (!correctEmail || !correctPassword) {
      return { success: false, message: 'Admin authentication not configured. Contact system administrator.' };
    }
    
    if (email === correctEmail && password === correctPassword) {
      setIsAdminAuthenticated(true);
      localStorage.setItem('playbeat_admin_auth', 'true');
      localStorage.setItem('playbeat_admin_email', email);
      return { success: true, message: 'Authentication successful! Welcome to PlayBeat Admin.' };
    }
    return { success: false, message: 'Invalid email or password. Please try again.' };
  };

  const adminLogout = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('playbeat_admin_auth');
  };

  // Product management actions
  const addProduct = (newProdData: Omit<Product, 'id' | 'rating' | 'reviewCount' | 'salesCount'>) => {
    const id = `prod-${Date.now()}`;
    const newProduct: Product = {
      ...newProdData,
      id,
      rating: 5.0,
      reviewCount: 0,
      salesCount: 0,
      reviews: []
    };
    setProducts(prev => [newProduct, ...prev]);
    
    // Sync to MongoDB
    fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct)
    }).catch(e => console.warn('Sync to MongoDB pending:', e));

    addNotification({
      type: 'SYSTEM',
      title: 'Product Published',
      message: `"${newProduct.title}" is now active in the store.`
    });
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    
    // Sync to MongoDB
    fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    }).catch(e => console.warn('Update to MongoDB pending:', e));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    removeFromCart(id);

    // Sync to MongoDB
    fetch(`/api/products/${id}`, {
      method: 'DELETE'
    }).catch(e => console.warn('Delete on MongoDB pending:', e));
  };

  const addReview = (productId: string, reviewData: Omit<Review, 'id' | 'createdAt' | 'helpfulCount'>) => {
    const newReview: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      createdAt: 'Just now',
      helpfulCount: 0
    };

    setProducts(prev => prev.map(p => {
      if (p.id !== productId) return p;
      const currentReviews = p.reviews || [];
      const updatedReviews = [newReview, ...currentReviews];
      const newTotalRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
      const newAvgRating = parseFloat((newTotalRating / updatedReviews.length).toFixed(1));
      return {
        ...p,
        reviews: updatedReviews,
        rating: newAvgRating,
        reviewCount: updatedReviews.length
      };
    }));
  };

  // Checkout process
  const processCheckout = (
    paymentMethod: Order['paymentMethod'], 
    customerDetails: { name: string; email: string; phone?: string }
  ): Order => {
    const orderNumber = generateOrderNumber();
    const orderItems = cart.map(item => {
      const unitPrice = item.product.discountPrice ?? item.product.price;
      const keys = Array.from({ length: item.quantity }, () => generateLicenseKey(item.product.sku.split('-')[0] || 'PB'));
      return {
        product: item.product,
        quantity: item.quantity,
        unitPrice,
        licenseKeys: keys,
        downloadUrl: item.product.downloadFile ? `https://downloads.playbeat.io/files/${item.product.downloadFile}` : undefined
      };
    });

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      createdAt: new Date().toISOString(),
      customerEmail: customerDetails.email || user.email,
      customerName: customerDetails.name || user.name,
      items: orderItems,
      subtotal: cartSubtotalPKR,
      discount: cartDiscountPKR,
      total: cartFinalTotalPKR,
      totalAmountPKR: cartFinalTotalPKR,
      currency,
      paymentMethod,
      paymentStatus: 'PAID',
      status: 'COMPLETED',
      couponCode: appliedCoupon?.code,
      transactionRef: `TXN-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
    };

    setOrders(prev => [newOrder, ...prev]);

    // Dispatch order to MongoDB
    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrder)
    }).catch(e => console.warn('Order MongoDB dispatch pending:', e));

    // Update product sales counts
    setProducts(prev => prev.map(prod => {
      const cartMatch = cart.find(c => c.product.id === prod.id);
      if (cartMatch) {
        return {
          ...prod,
          salesCount: prod.salesCount + cartMatch.quantity,
          stock: prod.stock > 0 ? Math.max(0, prod.stock - cartMatch.quantity) : prod.stock
        };
      }
      return prod;
    }));

    // Trigger confetti
    try {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // safe fallback
    }

    addNotification({
      type: 'ORDER',
      title: 'Order Confirmed!',
      message: `Order #${orderNumber} processed successfully. License keys dispatched to ${customerDetails.email}.`
    });

    clearCart();
    return newOrder;
  };

  // Notification actions
  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const addNotification = (item: Omit<NotificationItem, 'id' | 'createdAt' | 'read'>) => {
    const newNotif: NotificationItem = {
      ...item,
      id: `notif-${Date.now()}`,
      createdAt: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  return (
    <StoreContext.Provider value={{
      products,
      categories,
      cart,
      favorites,
      orders,
      coupons,
      notifications,
      user,
      activeRole,
      activeView,
      selectedCategory,
      selectedType,
      searchQuery,
      sortBy,
      priceRange,
      currency,
      themePreset,
      selectedProduct,
      isCartOpen,
      isWishlistOpen,
      isOrderLookupOpen,
      isSupportOpen,
      appliedCoupon,
      isAdminAuthenticated,
      isMongoConnected,
      setProducts,
      addProduct,
      updateProduct,
      deleteProduct,
      addReview,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      cartTotalCount,
      cartSubtotalPKR,
      cartDiscountPKR,
      cartFinalTotalPKR,
      toggleFavorite,
      isFavorite,
      applyCoupon,
      removeCoupon,
      addCoupon,
      processCheckout,
      updateOrderStatus,
      adminLogin,
      adminLogout,
      setSelectedProduct,
      setIsCartOpen,
      setIsWishlistOpen,
      setIsOrderLookupOpen,
      setIsSupportOpen,
      setActiveView,
      setActiveRole,
      setSelectedCategory,
      setSelectedType,
      setSearchQuery,
      setSortBy,
      setPriceRange,
      setCurrency,
      setThemePreset,
      formatCurrency,
      formatPKR,
      markNotificationRead,
      addNotification
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
