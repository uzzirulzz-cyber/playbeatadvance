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
  Review,
  Subscription,
  InventoryKey,
  SupportTicket,
  AuditLog,
  StoreSettings,
  ProductVariant
} from '../types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_COUPONS, INITIAL_NOTIFICATIONS, DEMO_USER } from '../data/initialData';
import { generateLicenseKey, generateOrderNumber, formatCurrency, formatPKR } from '../lib/utils';
import confetti from 'canvas-confetti';

const DEFAULT_STORE_SETTINGS: StoreSettings = {
  storeName: 'PlayBeat Digital',
  storeEmail: 'support@playbeat.digital',
  storePhone: '+923321029333',
  currency: 'PKR',
  currencyRateUSD: 280,
  maintenanceMode: false,
  announcementText: 'Welcome to PlayBeat Digital (playbeat.digital) — Instant Delivery on All Keys & Projectors!',
  promoCode: 'PLAYBEAT20',
  whatsappNumber: '+923321029333',
  taxRatePercent: 0,
  freeShippingThresholdPKR: 15000,
  activeGateways: {
    jazzcash: true,
    easypaisa: true,
    bankTransfer: true,
    raast: true,
    stripe: true,
    card: true,
    wallet: true
  },
  bankDetails: {
    bankName: 'Meezan Bank Limited',
    accountTitle: 'PlayBeat Digital Store',
    accountNumber: '02890104829102',
    iban: 'PK49MEZN0002890104829102',
    branchCode: '0289'
  },
  easypaisaDetails: {
    accountTitle: 'PlayBeat Digital Official',
    mobileNumber: '03321029333'
  },
  jazzcashDetails: {
    accountTitle: 'PlayBeat Digital Merchant',
    mobileNumber: '03321029333'
  },
  raastDetails: {
    raastId: '03321029333',
    accountTitle: 'PlayBeat Digital Raast'
  }
};

const INITIAL_SUBSCRIPTIONS: Subscription[] = [
  {
    id: 'sub-1',
    customerEmail: 'admin@playbeat.digital',
    customerName: 'PlayBeat Super Admin',
    productTitle: 'IPTV 4K Ultra VIP Pass (10,000+ Channels)',
    planName: '12-Month VIP Annual Pass',
    billingPeriod: 'ANNUAL',
    pricePKR: 12500,
    status: 'ACTIVE',
    startDate: '2026-01-15',
    nextBillingDate: '2027-01-15',
    autoRenew: true,
    paymentMethod: 'card'
  },
  {
    id: 'sub-2',
    customerEmail: 'admin@playbeat.digital',
    customerName: 'PlayBeat Super Admin',
    productTitle: 'ChatGPT Plus & Claude 3.5 Sonnet Pro',
    planName: '1-Month Pro Shared Access',
    billingPeriod: 'MONTHLY',
    pricePKR: 3500,
    status: 'ACTIVE',
    startDate: '2026-08-01',
    nextBillingDate: '2026-09-01',
    autoRenew: true,
    paymentMethod: 'jazzcash'
  }
];

const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 'tkt-1',
    ticketNumber: 'TKT-92011',
    customerName: 'PlayBeat Super Admin',
    customerEmail: 'admin@playbeat.digital',
    subject: 'Magcubic HY300 PRO Courier Tracking Confirmation',
    category: 'ORDER_ISSUE',
    priority: 'HIGH',
    status: 'RESOLVED',
    messages: [
      {
        id: 'm1',
        sender: 'CUSTOMER',
        senderName: 'PlayBeat Super Admin',
        message: 'Hi, please provide the TCS tracking ID for my order PB-892182.',
        timestamp: '2026-08-16T10:00:00Z'
      },
      {
        id: 'm2',
        sender: 'AGENT',
        senderName: 'PlayBeat Support Desk',
        message: 'Your parcel has been dispatched via TCS Express Tracking #TCS-92819283. Estimated arrival in 24-48 hours.',
        timestamp: '2026-08-16T10:30:00Z'
      }
    ],
    createdAt: '2026-08-16T10:00:00Z',
    updatedAt: '2026-08-16T10:30:00Z'
  }
];

const INITIAL_INVENTORY_KEYS: InventoryKey[] = [
  { id: 'k-1', productId: 'p-win11-pro', productTitle: 'Windows 11 Pro Retail License Key', key: 'W269N-WFGWX-YVC9B-4J6C9-T83GX', status: 'AVAILABLE', addedAt: '2026-08-01' },
  { id: 'k-2', productId: 'p-win11-pro', productTitle: 'Windows 11 Pro Retail License Key', key: 'MH37W-N47XK-V7XM9-C7227-GCQG9', status: 'AVAILABLE', addedAt: '2026-08-01' },
  { id: 'k-3', productId: 'p-office-2024', productTitle: 'Microsoft Office 2024 Professional Plus', key: 'NMMKJ-6RK4F-KMJVX-8D9MJ-6MWKP', status: 'AVAILABLE', addedAt: '2026-08-01' },
  { id: 'k-4', productId: 'p-chatgpt-plus', productTitle: 'ChatGPT Plus & Claude 3.5 Sonnet Pro', key: 'ACC-GPTPLUS-VAL-9281-PASS2026', status: 'AVAILABLE', addedAt: '2026-08-01' }
];

const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud-1',
    userId: 'admin@playbeat.digital',
    userName: 'PlayBeat Super Admin',
    userRole: 'SUPER_ADMIN',
    action: 'CATALOG_SYNC',
    targetType: 'PRODUCT',
    targetId: 'MongoDB Atlas',
    details: 'Synchronized 8 ZeroByte verified cinema projectors and software keys.',
    timestamp: '2026-08-18T12:00:00Z',
    ipAddress: '127.0.0.1'
  }
];

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
  isAuthModalOpen: boolean;
  isCustomerDashboardOpen: boolean;
  isInvoiceModalOpen: boolean;
  activeInvoiceOrder: Order | null;
  appliedCoupon: Coupon | null;
  isAdminAuthenticated: boolean;
  isCustomerLoggedIn: boolean;
  isMongoConnected: boolean;
  subscriptions: Subscription[];
  inventoryKeys: InventoryKey[];
  supportTickets: SupportTicket[];
  auditLogs: AuditLog[];
  storeSettings: StoreSettings;
  
  // Format helpers
  formatCurrency: (amountPKR: number, curr?: Currency) => string;
  formatPKR: (amount: number) => string;

  // Actions
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  addProduct: (product: Omit<Product, 'id' | 'rating' | 'reviewCount' | 'salesCount'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addReview: (productId: string, review: Omit<Review, 'id' | 'createdAt' | 'helpfulCount'>) => void;
  
  addToCart: (product: Product, quantity?: number, selectedVariant?: ProductVariant, selectedLicense?: string) => void;
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
    customerDetails: { name: string; email: string; phone?: string; address?: string }
  ) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  
  adminLogin: (password: string) => { success: boolean; message: string };
  adminLogout: () => void;
  customerLogin: (email: string, name?: string) => void;
  customerLogout: () => void;
  
  setSelectedProduct: (product: Product | null) => void;
  setIsCartOpen: (open: boolean) => void;
  setIsWishlistOpen: (open: boolean) => void;
  setIsOrderLookupOpen: (open: boolean) => void;
  setIsSupportOpen: (open: boolean) => void;
  setIsAuthModalOpen: (open: boolean) => void;
  setIsCustomerDashboardOpen: (open: boolean) => void;
  setIsInvoiceModalOpen: (open: boolean) => void;
  setActiveInvoiceOrder: (order: Order | null) => void;
  
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

  // Subscriptions & Support & Inventory & Settings
  addSubscription: (sub: Omit<Subscription, 'id'>) => void;
  cancelSubscription: (id: string) => void;
  addSupportTicket: (ticket: Omit<SupportTicket, 'id' | 'ticketNumber' | 'createdAt' | 'updatedAt'>) => SupportTicket;
  addTicketMessage: (ticketId: string, message: string, sender?: 'CUSTOMER' | 'AGENT', senderName?: string) => void;
  addInventoryKey: (key: Omit<InventoryKey, 'id' | 'addedAt'>) => void;
  deleteInventoryKey: (id: string) => void;
  updateUserWallet: (userId: string, amount: number, action: 'CREDIT' | 'DEBIT', reason?: string) => void;
  updateStoreSettings: (newSettings: Partial<StoreSettings>) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('playbeat_products_v6');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return INITIAL_PRODUCTS;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('playbeat_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('playbeat_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('playbeat_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('playbeat_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('playbeat_coupons');
    return saved ? JSON.parse(saved) : INITIAL_COUPONS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('playbeat_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem('playbeat_user');
    return saved ? JSON.parse(saved) : DEMO_USER;
  });

  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => {
    const saved = localStorage.getItem('playbeat_subscriptions');
    return saved ? JSON.parse(saved) : INITIAL_SUBSCRIPTIONS;
  });

  const [inventoryKeys, setInventoryKeys] = useState<InventoryKey[]>(() => {
    const saved = localStorage.getItem('playbeat_inventory_keys');
    return saved ? JSON.parse(saved) : INITIAL_INVENTORY_KEYS;
  });

  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(() => {
    const saved = localStorage.getItem('playbeat_support_tickets');
    return saved ? JSON.parse(saved) : INITIAL_TICKETS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('playbeat_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem('playbeat_store_settings');
    return saved ? JSON.parse(saved) : DEFAULT_STORE_SETTINGS;
  });

  const [activeRole, setActiveRole] = useState<UserRole>('SUPER_ADMIN');
  const [activeView, setActiveView] = useState<ActiveView>('storefront');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'price_asc' | 'price_desc' | 'rating'>('popular');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [currency, setCurrency] = useState<Currency>('PKR');
  const [themePreset, setThemePreset] = useState<ThemePreset>('martfury');
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState<boolean>(false);
  const [isOrderLookupOpen, setIsOrderLookupOpen] = useState<boolean>(false);
  const [isSupportOpen, setIsSupportOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isCustomerDashboardOpen, setIsCustomerDashboardOpen] = useState<boolean>(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState<boolean>(false);
  const [activeInvoiceOrder, setActiveInvoiceOrder] = useState<Order | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isCustomerLoggedIn, setIsCustomerLoggedIn] = useState<boolean>(true);
  
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

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('playbeat_products_v6', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('playbeat_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('playbeat_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('playbeat_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('playbeat_subscriptions', JSON.stringify(subscriptions));
  }, [subscriptions]);

  useEffect(() => {
    localStorage.setItem('playbeat_inventory_keys', JSON.stringify(inventoryKeys));
  }, [inventoryKeys]);

  useEffect(() => {
    localStorage.setItem('playbeat_support_tickets', JSON.stringify(supportTickets));
  }, [supportTickets]);

  useEffect(() => {
    localStorage.setItem('playbeat_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('playbeat_store_settings', JSON.stringify(storeSettings));
  }, [storeSettings]);

  useEffect(() => {
    localStorage.setItem('playbeat_user', JSON.stringify(user));
  }, [user]);

  // Apply theme preset class
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-martfury', 'theme-obsidian', 'theme-titanium', 'theme-cyberpunk', 'theme-emerald');
    root.classList.add(`theme-${themePreset}`);
  }, [themePreset]);

  // Cart Calculations
  const cartTotalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  const cartSubtotalPKR = cart.reduce((sum, item) => {
    const unitPrice = item.selectedVariant?.price ?? item.product.discountPrice ?? item.product.price;
    return sum + (unitPrice * item.quantity);
  }, 0);

  const cartDiscountPKR = appliedCoupon 
    ? Math.min(
        (cartSubtotalPKR * appliedCoupon.discountPercent) / 100, 
        appliedCoupon.maxDiscountPKR || 999999
      ) 
    : 0;

  const cartFinalTotalPKR = Math.max(0, cartSubtotalPKR - cartDiscountPKR);

  // Cart Actions
  const addToCart = (product: Product, quantity: number = 1, selectedVariant?: ProductVariant, selectedLicense?: string) => {
    setCart(prev => {
      const existing = prev.find(item => 
        item.product.id === product.id && 
        item.selectedVariant?.id === selectedVariant?.id
      );
      if (existing) {
        return prev.map(item => 
          item === existing 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity, selectedVariant, selectedLicense }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => 
      item.product.id === productId ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Favorites
  const toggleFavorite = (productId: string) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const isFavorite = (productId: string) => favorites.includes(productId);

  // Coupons
  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const found = coupons.find(c => c.code.toUpperCase() === cleanCode);
    if (!found) {
      return { success: false, message: 'Invalid or expired promo coupon.' };
    }
    if (found.minSpendPKR && cartSubtotalPKR < found.minSpendPKR) {
      return { success: false, message: `Minimum spend of Rs ${found.minSpendPKR.toLocaleString()} required.` };
    }
    setAppliedCoupon(found);
    return { success: true, message: `Coupon ${cleanCode} applied (-${found.discountPercent}%)!` };
  };

  const removeCoupon = () => setAppliedCoupon(null);
  const addCoupon = (coupon: Coupon) => setCoupons(prev => [coupon, ...prev]);

  // Product CRUD
  const addProduct = (newProdData: Omit<Product, 'id' | 'rating' | 'reviewCount' | 'salesCount'>) => {
    const newProduct: Product = {
      ...newProdData,
      id: `prod-${Date.now()}`,
      rating: 5.0,
      reviewCount: 1,
      salesCount: 0,
      createdAt: new Date().toISOString()
    };
    setProducts(prev => [newProduct, ...prev]);

    // Async persist to Express Backend
    fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct)
    }).catch(() => {});
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));

    fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    }).catch(() => {});
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));

    fetch(`/api/products/${id}`, {
      method: 'DELETE'
    }).catch(() => {});
  };

  const addReview = (productId: string, reviewData: Omit<Review, 'id' | 'createdAt' | 'helpfulCount'>) => {
    const newReview: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      helpfulCount: 0
    };

    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const existingReviews = p.reviews || [];
        const updatedReviews = [newReview, ...existingReviews];
        const avgRating = Number((updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length).toFixed(2));
        return {
          ...p,
          reviews: updatedReviews,
          reviewCount: updatedReviews.length,
          rating: avgRating
        };
      }
      return p;
    }));
  };

  // Checkout Process
  const processCheckout = (
    paymentMethod: Order['paymentMethod'], 
    customerDetails: { name: string; email: string; phone?: string; address?: string }
  ): Order => {
    const orderNumber = generateOrderNumber();
    
    // Auto generate keys / tracking
    const orderItems = cart.map(item => {
      const isHW = item.product.type === 'HARDWARE';
      const keys = isHW 
        ? [`TCS-PK-EXP-${Math.floor(1000000 + Math.random() * 9000000)}`]
        : [generateLicenseKey(item.product.title)];

      return {
        product: item.product,
        quantity: item.quantity,
        variantName: item.selectedVariant?.name,
        unitPrice: item.selectedVariant?.price ?? item.product.discountPrice ?? item.product.price,
        licenseKeys: keys,
        instructions: isHW 
          ? 'ZeroByte projector dispatched via TCS courier in 24-48 hours with official 1-year warranty card.' 
          : 'Instant automated license activation. Enter this code into your official software/streaming portal.'
      };
    });

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      createdAt: new Date().toISOString(),
      customerName: customerDetails.name,
      customerEmail: customerDetails.email,
      customerPhone: customerDetails.phone,
      shippingAddress: customerDetails.address,
      items: orderItems,
      subtotal: cartSubtotalPKR,
      discount: cartDiscountPKR,
      totalAmountPKR: cartFinalTotalPKR,
      currency,
      paymentMethod,
      paymentStatus: 'PAID',
      status: 'COMPLETED',
      couponCode: appliedCoupon?.code,
      transactionRef: `TXN-${Date.now().toString().slice(-8)}`
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();

    // Trigger celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    // Persist to backend
    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrder)
    }).catch(() => {});

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  // Auth
  const adminLogin = (password: string) => {
    if (password === 'playbeat1122') {
      setIsAdminAuthenticated(true);
      localStorage.setItem('playbeat_admin_auth', 'true');
      return { success: true, message: 'Welcome Master Super Admin!' };
    }
    return { success: false, message: 'Incorrect master password. Use playbeat1122' };
  };

  const adminLogout = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('playbeat_admin_auth');
    setActiveView('storefront');
  };

  const customerLogin = (email: string, name?: string) => {
    setUser({
      id: `u-${Date.now()}`,
      name: name || 'Valued Customer',
      email: email.trim(),
      role: 'CUSTOMER',
      balancePKR: 5000,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    });
    setIsCustomerLoggedIn(true);
    setIsAuthModalOpen(false);
  };

  const customerLogout = () => {
    setIsCustomerLoggedIn(false);
    setUser({
      id: 'guest',
      name: 'Guest Customer',
      email: 'guest@playbeat.digital',
      role: 'CUSTOMER',
      balancePKR: 0
    });
  };

  // Subscriptions & Tickets & Inventory Keys
  const addSubscription = (subData: Omit<Subscription, 'id'>) => {
    const newSub: Subscription = {
      ...subData,
      id: `sub-${Date.now()}`
    };
    setSubscriptions(prev => [newSub, ...prev]);
  };

  const cancelSubscription = (id: string) => {
    setSubscriptions(prev => prev.map(s => s.id === id ? { ...s, status: 'CANCELLED', autoRenew: false } : s));
  };

  const addSupportTicket = (ticketData: Omit<SupportTicket, 'id' | 'ticketNumber' | 'createdAt' | 'updatedAt'>) => {
    const newTicket: SupportTicket = {
      ...ticketData,
      id: `tkt-${Date.now()}`,
      ticketNumber: `TKT-${Math.floor(10000 + Math.random() * 90000)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setSupportTickets(prev => [newTicket, ...prev]);
    return newTicket;
  };

  const addTicketMessage = (ticketId: string, message: string, sender: 'CUSTOMER' | 'AGENT' = 'CUSTOMER', senderName: string = 'You') => {
    setSupportTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        const newMsg = {
          id: `msg-${Date.now()}`,
          sender,
          senderName,
          message,
          timestamp: new Date().toISOString()
        };
        return {
          ...t,
          messages: [...t.messages, newMsg],
          updatedAt: new Date().toISOString()
        };
      }
      return t;
    }));
  };

  const addInventoryKey = (keyData: Omit<InventoryKey, 'id' | 'addedAt'>) => {
    const newKey: InventoryKey = {
      ...keyData,
      id: `key-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      addedAt: new Date().toISOString().split('T')[0]
    };
    setInventoryKeys(prev => [newKey, ...prev]);
  };

  const deleteInventoryKey = (id: string) => {
    setInventoryKeys(prev => prev.filter(k => k.id !== id));
  };

  const updateUserWallet = (userId: string, amount: number, action: 'CREDIT' | 'DEBIT', reason?: string) => {
    setUser(prev => {
      const current = prev.balancePKR || 0;
      const updated = action === 'CREDIT' ? current + amount : Math.max(0, current - amount);
      return { ...prev, balancePKR: updated };
    });

    const newLog: AuditLog = {
      id: `aud-${Date.now()}`,
      userId: 'admin@playbeat.digital',
      userName: 'PlayBeat Super Admin',
      userRole: 'ADMIN',
      action: action === 'CREDIT' ? 'WALLET_CREDITED' : 'WALLET_DEBITED',
      targetType: 'WALLET',
      targetId: user.email,
      details: `${action} Rs ${amount.toLocaleString()} (${reason || 'Wallet Adjustment'}).`,
      timestamp: new Date().toISOString(),
      ipAddress: '127.0.0.1'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const updateStoreSettings = (newSettings: Partial<StoreSettings>) => {
    setStoreSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const addNotification = (nData: Omit<NotificationItem, 'id' | 'createdAt' | 'read'>) => {
    const newItem: NotificationItem = {
      ...nData,
      id: `notif-${Date.now()}`,
      read: false,
      createdAt: 'Just now'
    };
    setNotifications(prev => [newItem, ...prev]);
  };

  return (
    <StoreContext.Provider
      value={{
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
        isAuthModalOpen,
        isCustomerDashboardOpen,
        isInvoiceModalOpen,
        activeInvoiceOrder,
        appliedCoupon,
        isAdminAuthenticated,
        isCustomerLoggedIn,
        isMongoConnected,
        subscriptions,
        inventoryKeys,
        supportTickets,
        auditLogs,
        storeSettings,
        formatCurrency,
        formatPKR,
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
        customerLogin,
        customerLogout,
        setSelectedProduct,
        setIsCartOpen,
        setIsWishlistOpen,
        setIsOrderLookupOpen,
        setIsSupportOpen,
        setIsAuthModalOpen,
        setIsCustomerDashboardOpen,
        setIsInvoiceModalOpen,
        setActiveInvoiceOrder,
        setActiveView,
        setActiveRole,
        setSelectedCategory,
        setSelectedType,
        setSearchQuery,
        setSortBy,
        setPriceRange,
        setCurrency,
        setThemePreset,
        markNotificationRead,
        addNotification,
        addSubscription,
        cancelSubscription,
        addSupportTicket,
        addTicketMessage,
        addInventoryKey,
        deleteInventoryKey,
        updateUserWallet,
        updateStoreSettings
      }}
    >
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
