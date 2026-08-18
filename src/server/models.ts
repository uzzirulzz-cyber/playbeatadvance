import mongoose, { Schema, Model } from 'mongoose';

// MongoDB Connection URI
export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://uzzirulzz_db_user:rz7dz7AlVwnX6jEF@cluster0.75ddnhu.mongodb.net/?appName=Cluster0';

let isConnected = false;

export async function connectDB() {
  if (isConnected) return mongoose.connection;

  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      dbName: 'playbeat_store',
      serverSelectionTimeoutMS: 10000,
    });
    isConnected = true;
    console.log(`[MongoDB] Connected to PlayBeat cluster: ${conn.connection.host} / database: playbeat_store`);
    return conn.connection;
  } catch (error) {
    console.error('[MongoDB] Connection error:', error);
    throw error;
  }
}

// -------------------------------------------------------------
// Product Schema
// -------------------------------------------------------------
const ProductSchema = new Schema({
  id: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  slug: { type: String, required: true },
  shortDescription: { type: String, default: '' },
  description: { type: String, default: '' },
  type: { type: String, required: true },
  status: { type: String, default: 'PUBLISHED' },
  price: { type: Number, required: true },
  discountPrice: { type: Number },
  costPrice: { type: Number },
  profit: { type: Number },
  currency: { type: String, default: 'PKR' },
  sku: { type: String, required: true, index: true },
  stock: { type: Number, default: -1 },
  cover: {
    type: { type: String, default: 'image' },
    image: { type: String },
    colors: [{ type: String }],
    icon: { type: String }
  },
  tags: [{ type: String }],
  variants: [{
    id: { type: String },
    name: { type: String },
    duration: { type: String },
    price: { type: Number },
    discountPrice: { type: Number },
    costPrice: { type: Number },
    stock: { type: Number },
    sku: { type: String },
    isDefault: { type: Boolean }
  }],
  licenseType: { type: String },
  version: { type: String },
  featured: { type: Boolean, default: false },
  rating: { type: Number, default: 5.0 },
  reviewCount: { type: Number, default: 0 },
  salesCount: { type: Number, default: 0 },
  vendor: {
    id: { type: String, default: 'v-playbeat' },
    storeName: { type: String, default: 'PlayBeat Digital Official' },
    slug: { type: String, default: 'playbeat-official' },
    verified: { type: Boolean, default: true },
    rating: { type: Number, default: 5.0 },
    salesCount: { type: Number, default: 0 }
  },
  category: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, index: true },
    icon: { type: String, default: 'Sparkles' },
    color: { type: String }
  },
  deliveryType: { type: String, default: 'INSTANT_KEY' },
  downloadFile: { type: String },
  fileSize: { type: String },
  specs: { type: Schema.Types.Mixed },
  faqs: [{
    question: { type: String },
    answer: { type: String }
  }],
  sourceUrl: { type: String }
}, { timestamps: true, strict: false });

// -------------------------------------------------------------
// Category Schema
// -------------------------------------------------------------
const CategorySchema = new Schema({
  id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  slug: { type: String, required: true, index: true },
  icon: { type: String, default: 'Grid' },
  description: { type: String, default: '' },
  color: { type: String, default: '#6366f1' },
  featured: { type: Boolean, default: false },
  subcategories: [{ type: String }],
  count: { type: Number, default: 0 }
}, { timestamps: true, strict: false });

// -------------------------------------------------------------
// Order Schema
// -------------------------------------------------------------
const OrderSchema = new Schema({
  id: { type: String, required: true, unique: true, index: true },
  orderNumber: { type: String, required: true, index: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true, index: true },
  customerPhone: { type: String },
  shippingAddress: { type: String },
  items: [{
    product: { type: Schema.Types.Mixed, required: true },
    quantity: { type: Number, default: 1 },
    variantName: { type: String },
    selectedLicense: { type: String },
    itemPricePKR: { type: Number, required: true },
    licenseKeys: [{ type: String }],
    instructions: { type: String }
  }],
  subtotalPKR: { type: Number, required: true },
  discountPKR: { type: Number, default: 0 },
  totalAmountPKR: { type: Number, required: true },
  couponApplied: { type: String },
  paymentMethod: { type: String, required: true },
  paymentStatus: { type: String, default: 'COMPLETED' },
  status: { type: String, default: 'COMPLETED' },
  deliveryStatus: { type: String, default: 'DELIVERED' },
  transactionRef: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true, strict: false });

// -------------------------------------------------------------
// Inventory Keys Vault Schema
// -------------------------------------------------------------
const InventoryKeySchema = new Schema({
  id: { type: String, required: true, unique: true, index: true },
  productId: { type: String, required: true, index: true },
  productTitle: { type: String, required: true },
  variantName: { type: String },
  key: { type: String, required: true },
  status: { type: String, enum: ['AVAILABLE', 'RESERVED', 'USED', 'EXPIRED'], default: 'AVAILABLE', index: true },
  assignedOrderId: { type: String },
  assignedCustomerEmail: { type: String },
  addedAt: { type: String, default: () => new Date().toISOString() },
  usedAt: { type: String },
  batchNumber: { type: String }
}, { timestamps: true, strict: false });

// -------------------------------------------------------------
// Subscriptions Schema
// -------------------------------------------------------------
const SubscriptionSchema = new Schema({
  id: { type: String, required: true, unique: true, index: true },
  customerEmail: { type: String, required: true, index: true },
  customerName: { type: String, required: true },
  productTitle: { type: String, required: true },
  planName: { type: String, required: true },
  billingPeriod: { type: String, default: 'MONTHLY' },
  pricePKR: { type: Number, required: true },
  status: { type: String, enum: ['ACTIVE', 'TRIAL', 'EXPIRING', 'EXPIRED', 'CANCELLED', 'PAYMENT_FAILED'], default: 'ACTIVE', index: true },
  startDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
  nextBillingDate: { type: String },
  autoRenew: { type: Boolean, default: true },
  paymentMethod: { type: String, default: 'card' }
}, { timestamps: true, strict: false });

// -------------------------------------------------------------
// Support Tickets Schema
// -------------------------------------------------------------
const SupportTicketSchema = new Schema({
  id: { type: String, required: true, unique: true, index: true },
  ticketNumber: { type: String, required: true, index: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true, index: true },
  subject: { type: String, required: true },
  category: { type: String, default: 'GENERAL' },
  priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'], default: 'MEDIUM' },
  status: { type: String, enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'], default: 'OPEN', index: true },
  messages: [{
    id: { type: String },
    sender: { type: String, enum: ['CUSTOMER', 'AGENT', 'SYSTEM'] },
    senderName: { type: String },
    message: { type: String },
    timestamp: { type: String },
    attachmentUrl: { type: String }
  }],
  createdAt: { type: String, default: () => new Date().toISOString() },
  updatedAt: { type: String, default: () => new Date().toISOString() }
}, { timestamps: true, strict: false });

// -------------------------------------------------------------
// Audit Log Schema
// -------------------------------------------------------------
const AuditLogSchema = new Schema({
  id: { type: String, required: true, unique: true, index: true },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  userRole: { type: String, required: true },
  action: { type: String, required: true },
  targetType: { type: String, required: true },
  targetId: { type: String, required: true },
  details: { type: String, required: true },
  timestamp: { type: String, default: () => new Date().toISOString() },
  ipAddress: { type: String, default: '127.0.0.1' }
}, { timestamps: true, strict: false });

// -------------------------------------------------------------
// User Schema
// -------------------------------------------------------------
const UserSchema = new Schema({
  id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  phone: { type: String },
  role: { type: String, default: 'CUSTOMER' },
  avatar: { type: String },
  balancePKR: { type: Number, default: 0 },
  status: { type: String, enum: ['ACTIVE', 'SUSPENDED', 'PENDING'], default: 'ACTIVE' },
  totalOrdersCount: { type: Number, default: 0 },
  totalSpentPKR: { type: Number, default: 0 },
  notes: { type: String }
}, { timestamps: true, strict: false });

// -------------------------------------------------------------
// Coupon Schema
// -------------------------------------------------------------
const CouponSchema = new Schema({
  code: { type: String, required: true, unique: true, uppercase: true, index: true },
  discountPercent: { type: Number, required: true },
  minSpendPKR: { type: Number, default: 0 },
  maxDiscountPKR: { type: Number },
  description: { type: String, default: '' },
  usedCount: { type: Number, default: 0 },
  maxUses: { type: Number, default: 1000 },
  active: { type: Boolean, default: true },
  expiresAt: { type: String, default: '2026-12-31' }
}, { timestamps: true, strict: false });

// -------------------------------------------------------------
// Payment Proof Schema
// -------------------------------------------------------------
const PaymentProofSchema = new Schema({
  id: { type: String, required: true, unique: true },
  orderNumber: { type: String, required: true },
  senderName: { type: String, required: true },
  senderAccount: { type: String, required: true },
  transactionRef: { type: String, required: true },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  screenshotUrl: { type: String },
  submittedAt: { type: String, default: () => new Date().toISOString() },
  status: { type: String, enum: ['PENDING', 'VERIFIED', 'REJECTED'], default: 'PENDING' },
  verifiedBy: { type: String },
  notes: { type: String }
}, { timestamps: true, strict: false });

// Models Export
export const ProductModel: Model<any> = mongoose.models.Product || mongoose.model('Product', ProductSchema);
export const CategoryModel: Model<any> = mongoose.models.Category || mongoose.model('Category', CategorySchema);
export const OrderModel: Model<any> = mongoose.models.Order || mongoose.model('Order', OrderSchema);
export const InventoryKeyModel: Model<any> = mongoose.models.InventoryKey || mongoose.model('InventoryKey', InventoryKeySchema);
export const SubscriptionModel: Model<any> = mongoose.models.Subscription || mongoose.model('Subscription', SubscriptionSchema);
export const SupportTicketModel: Model<any> = mongoose.models.SupportTicket || mongoose.model('SupportTicket', SupportTicketSchema);
export const AuditLogModel: Model<any> = mongoose.models.AuditLog || mongoose.model('AuditLog', AuditLogSchema);
export const UserModel: Model<any> = mongoose.models.User || mongoose.model('User', UserSchema);
export const CouponModel: Model<any> = mongoose.models.Coupon || mongoose.model('Coupon', CouponSchema);
export const PaymentProofModel: Model<any> = mongoose.models.PaymentProof || mongoose.model('PaymentProof', PaymentProofSchema);
