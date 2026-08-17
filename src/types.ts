export type Currency = 'PKR' | 'USD' | 'EUR' | 'GBP' | 'AED' | 'INR';

export type ThemePreset = 'martfury' | 'obsidian' | 'titanium' | 'cyberpunk' | 'emerald';

export type UserRole = 'CUSTOMER' | 'VENDOR' | 'AFFILIATE' | 'ADMIN';

export type ActiveView = 'storefront' | 'vendor' | 'affiliate' | 'admin' | 'orders' | 'support';

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
  deliveryType: 'INSTANT_KEY' | 'INSTANT_DOWNLOAD' | 'ACCOUNT_INVITE' | 'POSTAL_SHIPPING';
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
}

export interface CartItem {
  product: Product;
  quantity: number;
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
  licenseKeys: string[];
  downloadUrl?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customerEmail: string;
  customerName: string;
  items: OrderItem[];
  subtotal?: number;
  discount?: number;
  total?: number;
  totalAmountPKR: number;
  currency: Currency;
  paymentMethod: 'card' | 'jazzcash' | 'easypaisa' | 'paypal' | 'lemonsqueezy' | 'crypto';
  paymentStatus?: 'PAID' | 'PENDING' | 'REFUNDED';
  status: 'COMPLETED' | 'PENDING' | 'REFUNDED';
  couponCode?: string;
  transactionRef: string;
}

export interface NotificationItem {
  id: string;
  type: 'ORDER' | 'PROMO' | 'SYSTEM' | 'PAYOUT';
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
  role: UserRole;
  avatar?: string;
  balancePKR?: number;
}
