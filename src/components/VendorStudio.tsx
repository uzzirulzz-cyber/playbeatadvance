import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { formatCurrency } from '../lib/utils';
import { Product, ProductType } from '../types';
import { 
  Briefcase, 
  Plus, 
  TrendingUp, 
  Package, 
  DollarSign, 
  Star, 
  Trash2, 
  Check, 
  Zap, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  Send,
  Sliders,
  Store
} from 'lucide-react';

export const VendorStudio: React.FC = () => {
  const { products, addProduct, deleteProduct, currency, categories } = useStore();
  
  // Tab states
  const [activeTab, setActiveTab] = useState<'overview' | 'catalog' | 'add_product' | 'payouts'>('overview');
  
  // New product form states
  const [title, setTitle] = useState('');
  const [categorySlug, setCategorySlug] = useState('streaming');
  const [productType, setProductType] = useState<ProductType>('STREAMING');
  const [pricePKR, setPricePKR] = useState(2500);
  const [discountPricePKR, setDiscountPricePKR] = useState(1999);
  const [shortDesc, setShortDesc] = useState('');
  const [fullDesc, setFullDesc] = useState('');
  const [featuresInput, setFeaturesInput] = useState('Instant activation PIN\n24/7 Replacement guarantee\nUltra HD 4K Support');
  const [licenseType, setLicenseType] = useState('12-Month Official License');
  const [tagsInput, setTagsInput] = useState('streaming, 4k, subscription');
  const [formSuccess, setFormSuccess] = useState(false);

  // Payout request states
  const [payoutAmount, setPayoutAmount] = useState(25000);
  const [payoutMethod, setPayoutMethod] = useState('JazzCash');
  const [payoutAccount, setPayoutAccount] = useState('03001234567');
  const [payoutSuccess, setPayoutSuccess] = useState(false);

  // Filter products for this vendor
  const vendorProducts = products.filter(p => p.vendor.storeName === 'PlayBeat Labs' || p.vendor.storeName === 'CinemaTech Direct');

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !shortDesc.trim()) return;

    const selectedCat = categories.find(c => c.slug === categorySlug) || categories[1];

    const newProd: Product = {
      id: `prod-custom-${Date.now()}`,
      title: title.trim(),
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      shortDescription: shortDesc.trim(),
      description: fullDesc.trim() || shortDesc.trim(),
      price: Number(pricePKR),
      discountPrice: discountPricePKR ? Number(discountPricePKR) : undefined,
      category: selectedCat,
      type: productType,
      deliveryType: productType === 'HARDWARE' ? 'POSTAL_SHIPPING' : 'INSTANT_KEY',
      stock: 99,
      rating: 5.0,
      reviewCount: 1,
      salesCount: 0,
      featured: true,
      sku: `PB-CUSTOM-${Math.floor(1000 + Math.random() * 9000)}`,
      licenseType: licenseType.trim(),
      cover: {
        colors: ['#6366f1', '#ec4899'],
        gradient: 'from-indigo-600 to-pink-600'
      },
      tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
      features: featuresInput.split('\n').map(f => f.trim()).filter(Boolean),
      vendor: {
        id: 'vendor-current',
        name: 'Studio Partner',
        storeName: 'PlayBeat Labs',
        verified: true,
        rating: 4.95
      },
      createdAt: new Date().toISOString()
    };

    addProduct(newProd);
    setFormSuccess(true);
    setTitle('');
    setShortDesc('');
    setFullDesc('');
    setTimeout(() => {
      setFormSuccess(false);
      setActiveTab('catalog');
    }, 1500);
  };

  const handleRequestPayout = (e: React.FormEvent) => {
    e.preventDefault();
    setPayoutSuccess(true);
    setTimeout(() => setPayoutSuccess(false), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-3xl glass-panel border border-indigo-500/30 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-2xl text-white">Vendor Creator Studio</h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Partner
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Manage your digital licenses, projector inventory, automated key pools, and instant payouts.
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('add_product')}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>List New Product</span>
        </button>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'overview' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Studio Overview
        </button>
        <button
          onClick={() => setActiveTab('catalog')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'catalog' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          My Inventory ({vendorProducts.length})
        </button>
        <button
          onClick={() => setActiveTab('add_product')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'add_product' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          + Create Product
        </button>
        <button
          onClick={() => setActiveTab('payouts')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'payouts' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Payouts & Banking
        </button>
      </div>

      {/* TAB 1: OVERVIEW METRICS */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
              <div className="text-xs text-slate-400 flex items-center justify-between">
                <span>Total Net Revenue</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-emerald-400">
                {formatCurrency(148500, currency)}
              </div>
              <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +24.8% vs last month
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
              <div className="text-xs text-slate-400 flex items-center justify-between">
                <span>Active Products</span>
                <Package className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-2xl font-black text-white">{vendorProducts.length}</div>
              <div className="text-[10px] text-slate-400">Across 6 marketplace categories</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
              <div className="text-xs text-slate-400 flex items-center justify-between">
                <span>Total Keys Dispatched</span>
                <Zap className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-black text-amber-400">842</div>
              <div className="text-[10px] text-slate-400">99.98% instant dispatch rate</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
              <div className="text-xs text-slate-400 flex items-center justify-between">
                <span>Partner Rating</span>
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              </div>
              <div className="text-2xl font-black text-white">4.95 / 5.0</div>
              <div className="text-[10px] text-slate-400">From 320+ customer reviews</div>
            </div>
          </div>

          {/* Recent Sales Simulation Stream */}
          <div className="p-5 rounded-3xl bg-slate-900/40 border border-slate-800 space-y-3">
            <h3 className="font-bold text-sm text-white">Recent Real-Time Sales</h3>
            <div className="space-y-2">
              {vendorProducts.slice(0, 3).map((p, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold">
                      #{idx + 1}
                    </div>
                    <div>
                      <div className="font-bold text-white">{p.title}</div>
                      <div className="text-[11px] text-slate-400">Delivered via Automated Vault • 2m ago</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-emerald-400">
                      +{formatCurrency(p.discountPrice || p.price, currency)}
                    </div>
                    <div className="text-[10px] text-slate-500">JazzCash Verified</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MY INVENTORY */}
      {activeTab === 'catalog' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {vendorProducts.map(p => (
              <div key={p.id} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold text-[10px]">
                      {p.category.name}
                    </span>
                    <span className="font-mono text-slate-400 text-[10px]">{p.sku}</span>
                  </div>

                  <h4 className="font-bold text-sm text-white line-clamp-1">{p.title}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2">{p.shortDescription}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <span className="text-sm font-black text-emerald-400">
                    {formatCurrency(p.discountPrice || p.price, currency)}
                  </span>

                  <button
                    onClick={() => deleteProduct(p.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-pink-400 hover:bg-pink-500/10 transition-colors cursor-pointer"
                    title="Delete Product"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CREATE PRODUCT FORM */}
      {activeTab === 'add_product' && (
        <div className="max-w-2xl mx-auto p-6 rounded-3xl glass-panel border border-indigo-500/30 space-y-4">
          <h3 className="font-extrabold text-lg text-white">List a New Product / License Key</h3>

          {formSuccess ? (
            <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm font-bold flex items-center gap-2">
              <Check className="w-5 h-5" /> Product listed successfully in marketplace!
            </div>
          ) : (
            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Disney+ 1-Year Ultra HD 4K Pass"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={categorySlug}
                    onChange={(e) => setCategorySlug(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                  >
                    {categories.filter(c => c.slug !== 'all').map(c => (
                      <option key={c.slug} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Product Type</label>
                  <select
                    value={productType}
                    onChange={(e) => setProductType(e.target.value as ProductType)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="STREAMING">Streaming Pass</option>
                    <option value="HARDWARE">Hardware / Smart Projector</option>
                    <option value="AI_TOOL">AI Tool / Suite</option>
                    <option value="SOFTWARE_LICENSE">Software License Key</option>
                    <option value="GAME">Game / Steam Voucher</option>
                    <option value="GIFT_CARD">Digital Gift Card</option>
                    <option value="TEMPLATE">Code Template / Script</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Regular Price (PKR)</label>
                  <input
                    type="number"
                    required
                    value={pricePKR}
                    onChange={(e) => setPricePKR(Number(e.target.value))}
                    className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Discount Price (PKR - Optional)</label>
                  <input
                    type="number"
                    value={discountPricePKR}
                    onChange={(e) => setDiscountPricePKR(Number(e.target.value))}
                    className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Short Description (Card snippet)</label>
                <input
                  type="text"
                  required
                  placeholder="One sentence highlighting key benefits..."
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Features (One per line)</label>
                <textarea
                  rows={3}
                  value={featuresInput}
                  onChange={(e) => setFeaturesInput(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 cursor-pointer"
              >
                Publish Product to Marketplace
              </button>
            </form>
          )}
        </div>
      )}

      {/* TAB 4: PAYOUTS */}
      {activeTab === 'payouts' && (
        <div className="max-w-xl mx-auto p-6 rounded-3xl glass-panel border border-emerald-500/30 space-y-4">
          <h3 className="font-extrabold text-lg text-white">Withdraw Vendor Earnings</h3>
          <p className="text-xs text-slate-400">
            Available Balance: <strong className="text-emerald-400 text-sm font-bold">{formatCurrency(48500, currency)}</strong>
          </p>

          {payoutSuccess ? (
            <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4" /> Payout request of {formatCurrency(payoutAmount, currency)} submitted! Dispatches within 1 hour.
            </div>
          ) : (
            <form onSubmit={handleRequestPayout} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Withdrawal Amount (PKR)</label>
                <input
                  type="number"
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(Number(e.target.value))}
                  className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Destination Channel</label>
                <select
                  value={payoutMethod}
                  onChange={(e) => setPayoutMethod(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="JazzCash">JazzCash Mobile Account</option>
                  <option value="EasyPaisa">EasyPaisa Mobile Account</option>
                  <option value="Bank">Direct IBAN Bank Wire (Meezan / HBL / SCB)</option>
                  <option value="USDT">USDT Crypto (TRC-20)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Account Number / Mobile / IBAN</label>
                <input
                  type="text"
                  value={payoutAccount}
                  onChange={(e) => setPayoutAccount(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs shadow-lg shadow-emerald-600/30 cursor-pointer"
              >
                Submit Instant Payout Request
              </button>
            </form>
          )}
        </div>
      )}

    </div>
  );
};
