import mongoose, { Schema, Model } from 'mongoose';

// MongoDB Connection URI provided by user
export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://max11:ZaGpeL3XRMHK4VP0@playbeat.umqpdyx.mongodb.net/?appName=playbeat';

let isConnected = false;

export async function connectDB() {
  if (isConnected) return mongoose.connection;

  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      dbName: 'playbeat',
      serverSelectionTimeoutMS: 8000,
    });
    isConnected = true;
    console.log(`[MongoDB] Connected to PlayBeat cluster: ${conn.connection.host} / database: playbeat`);
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
  sku: { type: String, required: true },
  stock: { type: Number, default: -1 },
  cover: {
    type: { type: String, default: 'image' },
    image: { type: String },
    colors: [{ type: String }],
    icon: { type: String }
  },
  tags: [{ type: String }],
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
    slug: { type: String, required: true },
    icon: { type: String, default: 'Sparkles' },
    color: { type: String }
  },
  deliveryType: { type: String, default: 'INSTANT_KEY' },
  downloadFile: { type: String },
  fileSize: { type: String },
  specs: { type: Schema.Types.Mixed }
}, { timestamps: true, strict: false });

// -------------------------------------------------------------
// Category Schema
// -------------------------------------------------------------
const CategorySchema = new Schema({
  id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  slug: { type: String, required: true },
  icon: { type: String, default: 'Grid' },
  description: { type: String, default: '' },
  color: { type: String, default: '#6366f1' },
  featured: { type: Boolean, default: false },
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
  items: [{
    product: { type: Schema.Types.Mixed, required: true },
    quantity: { type: Number, default: 1 },
    selectedLicense: { type: String },
    itemPricePKR: { type: Number, required: true }
  }],
  subtotalPKR: { type: Number, required: true },
  discountPKR: { type: Number, default: 0 },
  totalAmountPKR: { type: Number, required: true },
  couponApplied: { type: String },
  paymentMethod: { type: String, required: true },
  paymentStatus: { type: String, default: 'COMPLETED' },
  deliveryStatus: { type: String, default: 'DELIVERED' },
  licenseKeys: [{
    productId: { type: String },
    productTitle: { type: String },
    key: { type: String },
    type: { type: String },
    instructions: { type: String }
  }],
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true, strict: false });

// -------------------------------------------------------------
// Coupon Schema
// -------------------------------------------------------------
const CouponSchema = new Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  discountPercent: { type: Number, required: true },
  minSpendPKR: { type: Number, default: 0 },
  maxDiscountPKR: { type: Number },
  description: { type: String, default: '' },
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
export const CouponModel: Model<any> = mongoose.models.Coupon || mongoose.model('Coupon', CouponSchema);
export const PaymentProofModel: Model<any> = mongoose.models.PaymentProof || mongoose.model('PaymentProof', PaymentProofSchema);
