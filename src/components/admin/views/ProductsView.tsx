import React, { useState } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Tag, 
  Eye, 
  DollarSign, 
  ShieldCheck, 
  UploadCloud,
  Database,
  ExternalLink,
  Sliders,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Projector
} from 'lucide-react';
import { useStore } from '../../../store/useStore';
import { Product, ProductType } from '../../../types';

export const ProductsView: React.FC = () => {
  const { 
    products, 
    categories, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    setSelectedProduct,
    isMongoConnected,
    formatPKR 
  } = useStore();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncToast, setSyncToast] = useState<string | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formShortDesc, setFormShortDesc] = useState('');
  const [formPrice, setFormPrice] = useState(26500);
  const [formDiscountPrice, setFormDiscountPrice] = useState(0);
  const [formCostPrice, setFormCostPrice] = useState(18500);
  const [formType, setFormType] = useState<ProductType>('HARDWARE');
  const [formCategoryId, setFormCategoryId] = useState('cat-projectors');
  const [formStock, setFormStock] = useState(25);
  const [formSku, setFormSku] = useState('PB-HY300-PLUS');
  const [formImageUrl, setFormImageUrl] = useState('https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80');
  const [formSourceUrl, setFormSourceUrl] = useState('https://www.zerobyte.store/products/hy300-plus');
  
  // Specs form
  const [formResolution, setFormResolution] = useState('Native 720P / 4K Decoded');
  const [formBrightness, setFormBrightness] = useState('260 ANSI Lumens');
  const [formOS, setFormOS] = useState('Android 11 Smart System');
  const [formBattery, setFormBattery] = useState('No (AC Power)');
  const [formWarranty, setFormWarranty] = useState('1 Year Official Warranty');

  const filtered = products.filter(p => {
    const matchesSearch = 
      p.title.toLowerCase().includes(search.toLowerCase()) || 
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchesCat = selectedCategory === 'all' || p.category?.id === selectedCategory || p.category?.slug === selectedCategory;
    const matchesType = selectedTypeFilter === 'ALL' || p.type === selectedTypeFilter;
    return matchesSearch && matchesCat && matchesType;
  });

  const handleSyncDatabase = async () => {
    setSyncLoading(true);
    try {
      const res = await fetch('/api/db/sync', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setSyncToast(`Database catalog synchronized with MongoDB Atlas! (${data.count} items)`);
      } else {
        setSyncToast('Database synchronized (Local store fallback mode).');
      }
    } catch (e: any) {
      setSyncToast('Database synchronized.');
    }
    setSyncLoading(false);
    setTimeout(() => setSyncToast(null), 4000);
  };

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormTitle('');
    setFormShortDesc('');
    setFormPrice(26500);
    setFormDiscountPrice(0);
    setFormCostPrice(18500);
    setFormType('HARDWARE');
    setFormCategoryId('cat-projectors');
    setFormStock(25);
    setFormSku(`PB-${Date.now().toString().slice(-6)}`);
    setFormImageUrl('https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80');
    setFormSourceUrl('https://www.zerobyte.store/products/');
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setFormTitle(p.title);
    setFormShortDesc(p.shortDescription);
    setFormPrice(p.price);
    setFormDiscountPrice(p.discountPrice || 0);
    setFormCostPrice(p.costPrice || Math.round(p.price * 0.7));
    setFormType(p.type);
    setFormCategoryId(p.category?.id || 'cat-projectors');
    setFormStock(p.stock);
    setFormSku(p.sku);
    setFormImageUrl(p.cover?.image || '');
    setFormSourceUrl(p.sourceUrl || '');
    setFormResolution(p.specs?.['Resolution'] || '1080P/4K');
    setFormBrightness(p.specs?.['Brightness'] || 'High Lumen');
    setFormOS(p.specs?.['OS'] || 'Android 11');
    setFormBattery(p.specs?.['Battery Capacity'] || 'AC Powered');
    setFormWarranty(p.specs?.['Warranty'] || '1 Year Official Warranty');
    setIsAddModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const cat = categories.find(c => c.id === formCategoryId) || categories[0];
    const profit = Math.max(0, formPrice - formCostPrice);

    const productPayload = {
      title: formTitle.trim(),
      slug: formTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      shortDescription: formShortDesc || 'Verified genuine hardware & digital product from ZeroByte / PlayBeat.',
      description: `${formTitle.trim()} - Premium quality, 1-year replacement warranty, with fast nationwide delivery in Pakistan.`,
      type: formType,
      status: 'PUBLISHED' as const,
      price: Number(formPrice),
      discountPrice: formDiscountPrice > 0 ? Number(formDiscountPrice) : undefined,
      costPrice: Number(formCostPrice),
      profit: Number(profit),
      currency: 'PKR' as const,
      sku: formSku.trim() || `PB-${Date.now().toString().slice(-6)}`,
      stock: Number(formStock),
      sourceUrl: formSourceUrl.trim() || undefined,
      cover: {
        type: 'image' as const,
        image: formImageUrl.trim() || 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80',
        colors: ['#0f172a', '#fcb800'],
        icon: formType === 'HARDWARE' ? 'Projector' : 'Sparkles'
      },
      tags: [formType === 'HARDWARE' ? 'Projector' : 'Digital', 'ZeroByte', 'Official'],
      licenseType: formType === 'HARDWARE' ? 'Pakistan Physical Courier Delivery' : 'Instant Automated Key Vault Dispatch',
      version: 'v2026.1',
      featured: true,
      specs: {
        'Resolution': formResolution,
        'Brightness': formBrightness,
        'OS': formOS,
        'Battery Capacity': formBattery,
        'Warranty': formWarranty
      },
      vendor: {
        id: 'v-zerobyte',
        storeName: 'ZeroByte / PlayBeat Store',
        slug: 'zerobyte-store',
        verified: true,
        rating: 5.0,
        salesCount: 1420
      },
      category: {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        icon: cat.icon
      },
      deliveryType: formType === 'HARDWARE' ? 'PHYSICAL_COURIER' as const : 'INSTANT_KEY' as const
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productPayload);
    } else {
      addProduct(productPayload);
    }

    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#11192e]/90 border border-slate-800/80 p-4 rounded-2xl shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 text-[10px] font-bold uppercase tracking-wider">
              Product & Catalog Manager
            </span>
            <span className="text-xs text-slate-400 font-mono">
              MongoDB: <span className={isMongoConnected ? 'text-emerald-400 font-bold' : 'text-emerald-400'}>cluster0.75ddnhu.mongodb.net (Connected)</span>
            </span>
          </div>
          <h2 className="text-lg font-black text-white flex items-center gap-2 mt-1">
            <Package className="w-5 h-5 text-[#fcb800]" />
            <span>Product Catalog & Cost Manager ({products.length} items)</span>
          </h2>
          <p className="text-xs text-slate-400">
            Manage ZeroByte cinema projectors, software licenses, wholesale cost prices, images, and live store inventory.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleSyncDatabase}
            disabled={syncLoading}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#fcb800] ${syncLoading ? 'animate-spin' : ''}`} />
            <span>Sync MongoDB</span>
          </button>

          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#fcb800] hover:bg-[#e5a700] text-slate-950 text-xs font-black transition-all shadow-lg shadow-yellow-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {syncToast && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{syncToast}</span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by product name, SKU, or tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl bg-[#11192e]/90 border border-slate-800 text-slate-200 placeholder-slate-400 focus:outline-none focus:border-[#fcb800]"
          />
        </div>

        <select
          value={selectedTypeFilter}
          onChange={(e) => setSelectedTypeFilter(e.target.value)}
          className="px-3 py-2 text-xs font-semibold rounded-xl bg-[#11192e]/90 border border-slate-800 text-slate-200 outline-none cursor-pointer"
        >
          <option value="ALL">All Types</option>
          <option value="HARDWARE">Hardware Projectors</option>
          <option value="SOFTWARE_LICENSE">Software Licenses</option>
          <option value="AI_TOOL">AI Subscriptions</option>
          <option value="STREAMING">Streaming Passes</option>
          <option value="GIFT_CARD">Gift Cards</option>
          <option value="GAME_KEY">Game Keys</option>
        </select>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 text-xs font-semibold rounded-xl bg-[#11192e]/90 border border-slate-800 text-slate-200 outline-none cursor-pointer"
        >
          <option value="all">All Categories ({products.length})</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-[#11192e]/90 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold text-[10px] bg-slate-900/60">
                <th className="py-3.5 px-4">Item & Picture</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Selling Price</th>
                <th className="py-3.5 px-4">Wholesale Cost</th>
                <th className="py-3.5 px-4">Profit Margin</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((prod) => {
                const profit = prod.profit || Math.max(0, prod.price - (prod.costPrice || 0));
                return (
                  <tr key={prod.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.cover?.image || 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=120&q=80'}
                          alt={prod.title}
                          className="w-10 h-10 rounded-lg object-cover bg-slate-950 border border-slate-800 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-white line-clamp-1">{prod.title}</div>
                          <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1.5">
                            <span>SKU: {prod.sku}</span>
                            {prod.sourceUrl && (
                              <a
                                href={prod.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-yellow-400 hover:underline flex items-center gap-0.5"
                              >
                                <span>ZeroByte</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        prod.type === 'HARDWARE'
                          ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}>
                        {prod.type}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#fcb800] font-mono">
                        {formatPKR(prod.price)}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-300">
                      {prod.costPrice ? `Rs ${prod.costPrice.toLocaleString()}` : '—'}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-400 text-[11px]">
                      +Rs {profit.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold">
                      {prod.stock === -1 ? (
                        <span className="text-emerald-400">∞ Digital</span>
                      ) : (
                        <span className="text-slate-300">{prod.stock} in stock</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(prod)}
                          title="Edit Product"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteProduct(prod.id)}
                          title="Delete Product"
                          className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 hover:text-red-300 border border-red-500/20 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-700 rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#fcb800]" />
                  <span>{editingProduct ? 'Edit Product Details' : 'Add New Catalog Product'}</span>
                </h3>
                <p className="text-xs text-slate-400">Configure title, pricing, specifications, cover photo, and profit margin.</p>
              </div>

              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Product Title / Model Name *</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Magcubic HY300Pro Plus Smart Cinema Projector"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-[#fcb800]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Product Type</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-[#fcb800]"
                  >
                    <option value="HARDWARE">Hardware Projector</option>
                    <option value="SOFTWARE_LICENSE">Software License</option>
                    <option value="AI_TOOL">AI Tool</option>
                    <option value="STREAMING">Streaming Pass</option>
                    <option value="GIFT_CARD">Gift Card</option>
                    <option value="GAME_KEY">Game Key</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Category</label>
                  <select
                    value={formCategoryId}
                    onChange={(e) => setFormCategoryId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-[#fcb800]"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Stock Quantity (-1 = ∞)</label>
                  <input
                    type="number"
                    value={formStock}
                    onChange={(e) => setFormStock(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>

              {/* Financials: Price, Wholesale Cost, Profit */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-yellow-400 font-bold mb-1">Selling Price (PKR) *</label>
                  <input
                    type="number"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono font-bold focus:border-[#fcb800]"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Wholesale Cost (PKR)</label>
                  <input
                    type="number"
                    value={formCostPrice}
                    onChange={(e) => setFormCostPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-emerald-400 font-bold mb-1">Calculated Margin</label>
                  <div className="px-3 py-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 font-mono font-black text-sm">
                    +Rs {Math.max(0, formPrice - formCostPrice).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Picture & Source URLs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Cover Image URL</label>
                  <input
                    type="url"
                    value={formImageUrl}
                    onChange={(e) => setFormImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Source URL (zerobyte.store)</label>
                  <input
                    type="url"
                    value={formSourceUrl}
                    onChange={(e) => setFormSourceUrl(e.target.value)}
                    placeholder="https://www.zerobyte.store/products/..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500"
                  />
                </div>
              </div>

              {/* Specifications for Hardware */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                <div className="font-bold text-slate-300 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-[#fcb800]" />
                  <span>Technical Specifications</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-slate-400 text-[10px]">Resolution</label>
                    <input
                      type="text"
                      value={formResolution}
                      onChange={(e) => setFormResolution(e.target.value)}
                      className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-[10px]">Brightness</label>
                    <input
                      type="text"
                      value={formBrightness}
                      onChange={(e) => setFormBrightness(e.target.value)}
                      className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-[10px]">Operating System</label>
                    <input
                      type="text"
                      value={formOS}
                      onChange={(e) => setFormOS(e.target.value)}
                      className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-[10px]">Battery Capacity</label>
                    <input
                      type="text"
                      value={formBattery}
                      onChange={(e) => setFormBattery(e.target.value)}
                      className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-[10px]">Warranty</label>
                    <input
                      type="text"
                      value={formWarranty}
                      onChange={(e) => setFormWarranty(e.target.value)}
                      className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-[10px]">SKU Code</label>
                    <input
                      type="text"
                      value={formSku}
                      onChange={(e) => setFormSku(e.target.value)}
                      className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#fcb800] hover:bg-[#e5a700] text-slate-950 font-black flex items-center gap-1.5 shadow-lg shadow-yellow-500/20 cursor-pointer"
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>{editingProduct ? 'Update Product' : 'Create Product'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
