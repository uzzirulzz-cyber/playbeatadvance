export type Currency = 'PKR' | 'USD' | 'EUR' | 'GBP' | 'AED' | 'SAR';

export type ThemePreset = 'martfury' | 'obsidian' | 'titanium' | 'cyberpunk' | 'emerald';

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'SUPPORT_AGENT' | 'CONTENT_MANAGER' | 'FINANCE_MANAGER' | 'VENDOR' | 'AFFILIATE' | 'CUSTOMER';

export type ActiveView = 'storefront' | 'account' | 'vendor' | 'affiliate' | 'admin' | 'orders' | 'support' | 'deals';

export interface ProductCover {
  type?: 'gradient' | 'image';
  colors?: string[];
  gradient?: string;
  icon?: string;
  seed?: string;
  image?: string;
}

export interface VendorRef {
  id: string;
  name?: string;
  storeName: string;
  slug?: string;
  verified: boolean;
  rating: number;
  salesCount?: number;
}

export interface CategoryRef {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color?: string;
}

export interface Review {
  id: string;
  rating: number;
  title: string;
  comment: string;
  verified: boolean;
  vendorReply?: string;
  createdAt: string;
  authorName: string;
  helpfulCount?: number;
}

export type ProductType = 
  | 'AI_TOOL'
  | 'SOFTWARE_LICENSE'
  | 'SAAS_SUBSCRIPTION'
  | 'DIGITAL_DOWNLOAD'
  | 'STREAMING'
  | 'HARDWARE'
  | 'GAME'
  | 'GIFT_CARD'
  | 'EBOOK'
  | 'TEMPLATE'
  | 'GRAPHICS'
  | 'COURSE'
  | 'MEMBERSHIP'
  | 'PAYMENT_GATEWAY';

export interface ProductVariant {
  id: string;
  name: string; // e.g., '1 Month', '3 Months', '1 Year', 'Lifetime'
  duration?: string;
  price: number;
  discountPrice?: number;
  costPrice?: number;
  stock: number;
  sku: string;
  isDefault?: boolean;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  type: ProductType;
  status?: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
  price: number; // in PKR (base currency)
  discountPrice?: number;
  costPrice?: number; // wholesale cost in PKR
  profit?: number; // profit margin in PKR
  currency?: string;
  sku: string;
  stock: number; // -1 for unlimited digital
  cover: ProductCover;
  tags: string[];
  variants?: ProductVariant[];
  licenseType?: string;
  downloadFile?: string;
  fileSize?: string;
  version?: string;
  changelog?: Array<{ version: string; date: string; notes: string }>;
  featured?: boolean;
  rating: number;
  reviewCount: number;
  salesCount: number;
  vendor: VendorRef;
  category: CategoryRef;
  specs?: Record<string, string>;
  features?: string[];
  faqs?: Array<{ question: string; answer: string }>;
  deliveryType: 'INSTANT_KEY' | 'INSTANT_DOWNLOAD' | 'ACCOUNT_INVITE' | 'POSTAL_SHIPPING' | 'PHYSICAL_COURIER';
  sourceUrl?: string;
  reviews?: Review[];
  createdAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon: string;
  color?: string;
  productCount?: number;
  badge?: string;
  subcategories?: string[];
  featured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: ProductVariant;
  selectedLicense?: string;
}

export interface Coupon {
  id?: string;
  code: string;
  discountPercent: number;
  minSpendPKR?: number;
  maxDiscountPKR?: number;
  description?: string;
  expiresAt?: string;
  validUntil?: string;
  usedCount?: number;
  maxUses?: number;
  active?: boolean;
}

export interface OrderItem {
  product: Product;
  quantity: number;
  unitPrice?: number;
  variantName?: string;
  licenseKeys: string[];
  downloadUrl?: string;
  instructions?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  shippingAddress?: string;
  items: OrderItem[];
  subtotal?: number;
  discount?: number;
  total?: number;
  totalAmountPKR: number;
  currency: Currency;
  paymentMethod: 'card' | 'jazzcash' | 'easypaisa' | 'bank_transfer' | 'raast' | 'stripe' | 'lemonsqueezy' | 'wallet';
  paymentStatus?: 'PAID' | 'PENDING' | 'REFUNDED' | 'FAILED';
  status: 'COMPLETED' | 'PENDING' | 'PROCESSING' | 'REFUNDED' | 'CANCELLED';
  couponCode?: string;
  transactionRef: string;
  invoiceUrl?: string;
}

export interface NotificationItem {
  id: string;
  type: 'ORDER' | 'PROMO' | 'SYSTEM' | 'PAYOUT' | 'SECURITY';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  balancePKR?: number;
  status?: 'ACTIVE' | 'SUSPENDED' | 'PENDING';
  totalOrdersCount?: number;
  totalSpentPKR?: number;
  createdAt?: string;
  lastLogin?: string;
  notes?: string;
}

export interface InventoryKey {
  id: string;
  productId: string;
  productTitle: string;
  variantName?: string;
  key: string;
  status: 'AVAILABLE' | 'RESERVED' | 'USED' | 'EXPIRED';
  assignedOrderId?: string;
  assignedCustomerEmail?: string;
  addedAt: string;
  usedAt?: string;
  batchNumber?: string;
}

export interface Subscription {
  id: string;
  customerEmail: string;
  customerName: string;
  productTitle: string;
  planName: string;
  billingPeriod: 'MONTHLY' | 'QUARTERLY' | 'SEMI_ANNUAL' | 'ANNUAL' | 'LIFETIME';
  pricePKR: number;
  status: 'ACTIVE' | 'TRIAL' | 'EXPIRING' | 'EXPIRED' | 'CANCELLED' | 'PAYMENT_FAILED';
  startDate: string;
  nextBillingDate: string;
  autoRenew: boolean;
  paymentMethod: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  category: 'ORDER_ISSUE' | 'LICENSE_KEY' | 'PAYMENT_PROOF' | 'IPTV_SETUP' | 'REFUND' | 'GENERAL';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  messages: Array<{
    id: string;
    sender: 'CUSTOMER' | 'AGENT' | 'SYSTEM';
    senderName: string;
    message: string;
    timestamp: string;
    attachmentUrl?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  targetType: 'PRODUCT' | 'ORDER' | 'CUSTOMER' | 'WALLET' | 'INVENTORY' | 'SETTING' | 'COUPON';
  targetId: string;
  details: string;
  timestamp: string;
  ipAddress?: string;
}

export interface StoreSettings {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  currency: Currency;
  currencyRateUSD: number;
  maintenanceMode: boolean;
  announcementText: string;
  promoCode: string;
  whatsappNumber: string;
  taxRatePercent: number;
  freeShippingThresholdPKR: number;
  activeGateways: {
    jazzcash: boolean;
    easypaisa: boolean;
    bankTransfer: boolean;
    raast: boolean;
    stripe: boolean;
    card: boolean;
    wallet: boolean;
  };
  bankDetails: {
    bankName: string;
    accountTitle: string;
    accountNumber: string;
    iban: string;
    branchCode: string;
  };
  easypaisaDetails: {
    accountTitle: string;
    mobileNumber: string;
  };
  jazzcashDetails: {
    accountTitle: string;
    mobileNumber: string;
  };
  raastDetails: {
    raastId: string;
    accountTitle: string;
  };
}
