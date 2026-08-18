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
  InventoryKeyModel,
  SubscriptionModel,
  SupportTicketModel,
  AuditLogModel,
  UserModel,
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
  // REST API v1 Routes
  // -------------------------------------------------------------

  // Health & Database Diagnostics
  app.get(['/api/health', '/api/v1/health'], async (req, res) => {
    try {
      if (!isMongoReady) {
        await connectDB();
        isMongoReady = true;
      }
      res.json({
        status: 'ok',
        database: 'MongoDB Atlas',
        cluster: 'cluster0.75ddnhu.mongodb.net',
        dbName: 'playbeat_store',
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

  // DB Sync / Reset Endpoint
  app.post(['/api/db/sync', '/api/v1/db/sync'], async (req, res) => {
    try {
      await seedDatabaseIfEmpty();
      const count = await ProductModel.countDocuments();
      res.json({ success: true, message: 'Database catalog synced with MongoDB Atlas', count });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  });

  // 1. Products API
  app.get(['/api/products', '/api/v1/products'], async (req, res) => {
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

  app.get(['/api/products/:id', '/api/v1/products/:id'], async (req, res) => {
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

  app.post(['/api/products', '/api/v1/products'], async (req, res) => {
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

  app.put(['/api/products/:id', '/api/v1/products/:id'], async (req, res) => {
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

  app.delete(['/api/products/:id', '/api/v1/products/:id'], async (req, res) => {
    try {
      await ProductModel.deleteOne({ id: req.params.id });
      res.json({ success: true, id: req.params.id });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 2. Categories API
  app.get(['/api/categories', '/api/v1/categories'], async (req, res) => {
    try {
      let categories = await CategoryModel.find({}).lean();
      if (!categories || categories.length === 0) {
        categories = INITIAL_CATEGORIES as any;
      }
      res.json(categories);
    } catch (err: any) {
      res.json(INITIAL_CATEGORIES);
    }
  });

  // 3. Orders API & Checkout
  app.get(['/api/orders', '/api/v1/orders'], async (req, res) => {
    try {
      const { email } = req.query;
      const filter = email ? { customerEmail: email } : {};
      const orders = await OrderModel.find(filter).sort({ createdAt: -1 }).lean();
      res.json(orders);
    } catch (err: any) {
      res.json([]);
    }
  });

  app.post(['/api/orders', '/api/v1/orders'], async (req, res) => {
    try {
      const orderData = req.body;
      if (!orderData.id) {
        orderData.id = `ord-${Date.now()}`;
      }
      if (!orderData.orderNumber) {
        orderData.orderNumber = `PB-${Date.now().toString().slice(-6)}`;
      }

      // Generate digital license key for instant fulfillment
      const enrichedItems = (orderData.items || []).map((item: any) => {
        const prod = item.product || {};
        const keys: string[] = item.licenseKeys && item.licenseKeys.length > 0 
          ? item.licenseKeys 
          : [
              `PB-${prod.type === 'HARDWARE' ? 'HW-TRACKING' : 'KEY'}-${Math.random().toString(36).substring(2, 7).toUpperCase()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`
            ];
        return {
          ...item,
          licenseKeys: keys,
          instructions: prod.type === 'HARDWARE' 
            ? 'Track your courier dispatch parcel via TCS Pakistan.' 
            : 'Enter this official license key in your software activation portal.'
        };
      });

      orderData.items = enrichedItems;
      const created = await OrderModel.create(orderData);

      // Audit Log
      await AuditLogModel.create({
        id: `aud-${Date.now()}`,
        userId: orderData.customerEmail || 'customer',
        userName: orderData.customerName || 'Customer',
        userRole: 'CUSTOMER',
        action: 'ORDER_PLACED',
        targetType: 'ORDER',
        targetId: created.orderNumber,
        details: `Order ${created.orderNumber} placed for Rs ${orderData.totalAmountPKR}`,
        timestamp: new Date().toISOString()
      }).catch(() => {});

      res.status(201).json(created);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 4. Inventory Keys Vault API
  app.get('/api/v1/inventory', async (req, res) => {
    try {
      const keys = await InventoryKeyModel.find({}).sort({ addedAt: -1 }).lean();
      res.json(keys);
    } catch (err: any) {
      res.json([]);
    }
  });

  app.post('/api/v1/inventory', async (req, res) => {
    try {
      const newKey = req.body;
      if (!newKey.id) newKey.id = `key-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
      const saved = await InventoryKeyModel.create(newKey);
      res.status(201).json(saved);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 5. Subscriptions API
  app.get('/api/v1/subscriptions', async (req, res) => {
    try {
      const { email } = req.query;
      const filter = email ? { customerEmail: email } : {};
      const subs = await SubscriptionModel.find(filter).sort({ startDate: -1 }).lean();
      res.json(subs);
    } catch (err: any) {
      res.json([]);
    }
  });

  app.post('/api/v1/subscriptions', async (req, res) => {
    try {
      const sub = req.body;
      if (!sub.id) sub.id = `sub-${Date.now()}`;
      const saved = await SubscriptionModel.create(sub);
      res.status(201).json(saved);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 6. Support Tickets API
  app.get('/api/v1/support', async (req, res) => {
    try {
      const { email } = req.query;
      const filter = email ? { customerEmail: email } : {};
      const tickets = await SupportTicketModel.find(filter).sort({ updatedAt: -1 }).lean();
      res.json(tickets);
    } catch (err: any) {
      res.json([]);
    }
  });

  app.post('/api/v1/support', async (req, res) => {
    try {
      const ticket = req.body;
      if (!ticket.id) ticket.id = `tkt-${Date.now()}`;
      if (!ticket.ticketNumber) ticket.ticketNumber = `TKT-${Date.now().toString().slice(-5)}`;
      const saved = await SupportTicketModel.create(ticket);
      res.status(201).json(saved);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/v1/support/:id/message', async (req, res) => {
    try {
      const { message, sender, senderName, attachmentUrl } = req.body;
      const updated = await SupportTicketModel.findOneAndUpdate(
        { id: req.params.id },
        { 
          $push: { 
            messages: {
              id: `msg-${Date.now()}`,
              sender: sender || 'AGENT',
              senderName: senderName || 'Support Agent',
              message,
              attachmentUrl,
              timestamp: new Date().toISOString()
            }
          },
          $set: { updatedAt: new Date().toISOString() }
        },
        { new: true }
      );
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 7. Users & Customers API
  app.get('/api/v1/users', async (req, res) => {
    try {
      const users = await UserModel.find({}).lean();
      res.json(users);
    } catch (err: any) {
      res.json([]);
    }
  });

  app.put('/api/v1/users/:id/wallet', async (req, res) => {
    try {
      const { amount, action, reason } = req.body;
      const user = await UserModel.findOne({ id: req.params.id });
      if (!user) return res.status(404).json({ error: 'User not found' });

      const oldBalance = user.balancePKR || 0;
      const newBalance = action === 'CREDIT' ? oldBalance + Number(amount) : Math.max(0, oldBalance - Number(amount));
      user.balancePKR = newBalance;
      await user.save();

      // Financial Audit Log
      await AuditLogModel.create({
        id: `aud-${Date.now()}`,
        userId: 'admin@playbeat.digital',
        userName: 'PlayBeat Super Admin',
        userRole: 'ADMIN',
        action: action === 'CREDIT' ? 'WALLET_CREDITED' : 'WALLET_DEBITED',
        targetType: 'WALLET',
        targetId: user.email,
        details: `${action} Rs ${amount} (${reason || 'Admin Adjustment'}). Old: Rs ${oldBalance} -> New: Rs ${newBalance}`,
        timestamp: new Date().toISOString()
      }).catch(() => {});

      res.json({ success: true, balance: newBalance });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 8. Audit Logs API
  app.get('/api/v1/audit-logs', async (req, res) => {
    try {
      const logs = await AuditLogModel.find({}).sort({ timestamp: -1 }).limit(100).lean();
      res.json(logs);
    } catch (err: any) {
      res.json([]);
    }
  });

  // 9. Coupons API
  app.get(['/api/coupons', '/api/v1/coupons'], async (req, res) => {
    try {
      let coupons = await CouponModel.find({}).lean();
      if (!coupons || coupons.length === 0) {
        coupons = INITIAL_COUPONS as any;
      }
      res.json(coupons);
    } catch (err: any) {
      res.json(INITIAL_COUPONS);
    }
  });

  // 10. Payment Proofs API
  app.get('/api/payment-proofs', async (req, res) => {
    try {
      const proofs = await PaymentProofModel.find({}).sort({ submittedAt: -1 }).lean();
      res.json(proofs);
    } catch (err: any) {
      res.json([]);
    }
  });

  app.post('/api/payment-proofs', async (req, res) => {
    try {
      const proof = await PaymentProofModel.create({
        ...req.body,
        id: `proof-${Date.now()}`
      });
      res.status(201).json(proof);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Vite middleware for development
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
