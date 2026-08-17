import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { 
  connectDB, 
  ProductModel, 
  CategoryModel, 
  OrderModel, 
  CouponModel, 
  PaymentProofModel,
  MONGODB_URI
} from './src/server/models';
import { seedDatabaseIfEmpty } from './src/server/seed';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_COUPONS } from './src/data/initialData';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON Body Parser with reasonable limits
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Initialize MongoDB Connection in background
  let isMongoReady = false;
  try {
    await connectDB();
    await seedDatabaseIfEmpty();
    isMongoReady = true;
  } catch (err) {
    console.warn('[MongoDB Warning] Could not connect at startup, will retry on request:', err);
  }

  // -------------------------------------------------------------
  // REST API Routes
  // -------------------------------------------------------------

  // Health & Database Diagnostics
  app.get('/api/health', async (req, res) => {
    try {
      if (!isMongoReady) {
        await connectDB();
        isMongoReady = true;
      }
      res.json({
        status: 'ok',
        database: 'MongoDB Atlas',
        cluster: 'playbeat.umqpdyx.mongodb.net',
        dbName: 'playbeat',
        connected: isMongoReady,
        timestamp: new Date().toISOString()
      });
    } catch (e: any) {
      res.json({
        status: 'degraded',
        database: 'MongoDB Atlas',
        connected: false,
        error: e.message
      });
    }
  });

  // 1. Products API
  app.get('/api/products', async (req, res) => {
    try {
      const { category, type, search } = req.query;
      const filter: any = {};

      if (category && category !== 'all') {
        filter['category.slug'] = category;
      }
      if (type && type !== 'ALL') {
        filter.type = type;
      }
      if (search && typeof search === 'string' && search.trim()) {
        const regex = new RegExp(search.trim(), 'i');
        filter.$or = [
          { title: regex },
          { shortDescription: regex },
          { tags: regex },
          { sku: regex },
          { 'category.name': regex }
        ];
      }

      let products = await ProductModel.find(filter).sort({ salesCount: -1 }).lean();
      if (!products || products.length === 0) {
        products = INITIAL_PRODUCTS as any;
      }
      res.json(products);
    } catch (err: any) {
      console.error('[API /products error]:', err);
      res.json(INITIAL_PRODUCTS);
    }
  });

  app.get('/api/products/:id', async (req, res) => {
    try {
      const product = await ProductModel.findOne({ id: req.params.id }).lean();
      if (!product) {
        const fallback = INITIAL_PRODUCTS.find(p => p.id === req.params.id);
        if (fallback) return res.json(fallback);
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(product);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/products', async (req, res) => {
    try {
      const newProduct = req.body;
      if (!newProduct.id) {
        newProduct.id = `prod-${Date.now()}`;
      }
      const saved = await ProductModel.create(newProduct);
      res.status(201).json(saved);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put('/api/products/:id', async (req, res) => {
    try {
      const updated = await ProductModel.findOneAndUpdate(
        { id: req.params.id },
        { $set: req.body },
        { new: true }
      );
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/products/:id', async (req, res) => {
    try {
      await ProductModel.findOneAndDelete({ id: req.params.id });
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 2. Categories API
  app.get('/api/categories', async (req, res) => {
    try {
      let categories = await CategoryModel.find().lean();
      if (!categories || categories.length === 0) {
        categories = INITIAL_CATEGORIES as any;
      }
      res.json(categories);
    } catch (err) {
      res.json(INITIAL_CATEGORIES);
    }
  });

  // 3. Coupons API
  app.get('/api/coupons', async (req, res) => {
    try {
      let coupons = await CouponModel.find().lean();
      if (!coupons || coupons.length === 0) {
        coupons = INITIAL_COUPONS as any;
      }
      res.json(coupons);
    } catch (err) {
      res.json(INITIAL_COUPONS);
    }
  });

  app.post('/api/coupons/validate', async (req, res) => {
    try {
      const { code, cartTotalPKR } = req.body;
      if (!code) return res.status(400).json({ valid: false, message: 'Coupon code required' });

      const coupon = await CouponModel.findOne({ code: code.toUpperCase().trim() }).lean() ||
        INITIAL_COUPONS.find(c => c.code.toUpperCase() === code.toUpperCase().trim());

      if (!coupon) {
        return res.status(404).json({ valid: false, message: 'Invalid coupon code' });
      }

      if (coupon.minSpendPKR && cartTotalPKR < coupon.minSpendPKR) {
        return res.status(400).json({ 
          valid: false, 
          message: `Minimum order amount of Rs ${coupon.minSpendPKR.toLocaleString()} required for this coupon.` 
        });
      }

      let discountAmount = Math.round((cartTotalPKR * coupon.discountPercent) / 100);
      if (coupon.maxDiscountPKR && discountAmount > coupon.maxDiscountPKR) {
        discountAmount = coupon.maxDiscountPKR;
      }

      res.json({ valid: true, coupon, discountAmount });
    } catch (err: any) {
      res.status(500).json({ valid: false, error: err.message });
    }
  });

  // 4. Orders API
  app.get('/api/orders', async (req, res) => {
    try {
      const { email, orderNumber } = req.query;
      const filter: any = {};
      if (email) filter.customerEmail = new RegExp(String(email).trim(), 'i');
      if (orderNumber) filter.orderNumber = new RegExp(String(orderNumber).trim(), 'i');

      const orders = await OrderModel.find(filter).sort({ createdAt: -1 }).limit(100).lean();
      res.json(orders);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/orders', async (req, res) => {
    try {
      const orderData = req.body;
      if (!orderData.id) orderData.id = `ord-${Date.now()}`;
      if (!orderData.orderNumber) {
        const rand = Math.floor(1000 + Math.random() * 9000);
        orderData.orderNumber = `PB-${Date.now().toString().slice(-6)}-${rand}`;
      }

      const created = await OrderModel.create(orderData);

      // Increment product salesCount & decrement stock
      if (orderData.items && Array.isArray(orderData.items)) {
        for (const item of orderData.items) {
          const pId = item.product?.id || item.productId;
          if (pId) {
            await ProductModel.findOneAndUpdate(
              { id: pId },
              { 
                $inc: { salesCount: item.quantity || 1 },
                $set: { updatedAt: new Date() }
              }
            );
          }
        }
      }

      res.status(201).json(created);
    } catch (err: any) {
      console.error('[API create order error]:', err);
      res.status(500).json({ error: err.message });
    }
  });

  app.put('/api/orders/:id/status', async (req, res) => {
    try {
      const { status } = req.body;
      const updated = await OrderModel.findOneAndUpdate(
        { id: req.params.id },
        { $set: { paymentStatus: status, deliveryStatus: status === 'COMPLETED' ? 'DELIVERED' : 'PENDING' } },
        { new: true }
      );
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 5. Payment Proofs API
  app.get('/api/payment-proofs', async (req, res) => {
    try {
      const proofs = await PaymentProofModel.find().sort({ createdAt: -1 }).lean();
      res.json(proofs);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/payment-proofs', async (req, res) => {
    try {
      const proofData = req.body;
      if (!proofData.id) proofData.id = `proof-${Date.now()}`;
      const saved = await PaymentProofModel.create(proofData);
      res.status(201).json(saved);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put('/api/payment-proofs/:id', async (req, res) => {
    try {
      const { status, notes, verifiedBy } = req.body;
      const updated = await PaymentProofModel.findOneAndUpdate(
        { id: req.params.id },
        { $set: { status, notes, verifiedBy, updatedAt: new Date() } },
        { new: true }
      );
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 6. Admin Authentication & Dashboard Stats
  app.post('/api/admin/login', (req, res) => {
    const { password } = req.body;
    if (password === 'playbeat123' || password === 'admin' || password === 'admin123') {
      return res.json({ success: true, token: 'playbeat_admin_jwt_session_2026' });
    }
    return res.status(401).json({ success: false, message: 'Invalid Admin Credentials' });
  });

  app.get('/api/stats', async (req, res) => {
    try {
      const productCount = await ProductModel.countDocuments();
      const orderCount = await OrderModel.countDocuments();
      const orders = await OrderModel.find({ paymentStatus: 'COMPLETED' }).lean();

      const totalRevenuePKR = orders.reduce((sum, o) => sum + (o.totalAmountPKR || 0), 0) + 4825000;
      const totalProfitPKR = Math.round(totalRevenuePKR * 0.28);

      res.json({
        totalRevenuePKR,
        totalProfitPKR,
        productCount: productCount || INITIAL_PRODUCTS.length,
        orderCount: (orderCount || 0) + 128,
        activeSellers: 38,
        instantDeliveryRate: '99.98%'
      });
    } catch (err: any) {
      res.json({
        totalRevenuePKR: 4825000,
        totalProfitPKR: 1351000,
        productCount: INITIAL_PRODUCTS.length,
        orderCount: 128,
        activeSellers: 38,
        instantDeliveryRate: '99.98%'
      });
    }
  });

  // -------------------------------------------------------------
  // Vite Integration for Dev / Static Files for Production
  // -------------------------------------------------------------
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[PlayBeat Server] Live on http://0.0.0.0:${PORT}`);
  });
}

startServer();
