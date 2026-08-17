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
  UploadCloud 
} from 'lucide-react';
import { useStore } from '../../../store/useStore';
import { Product, ProductType } from '../../../types';

export const ProductsView: React.FC = () => {
  const { products, categories, addProduct, updateProduct, deleteProduct, setSelectedProduct } = useStore();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New product form state
  const [newTitle, setNewTitle] = useState('');
  const [newShortDesc, setNewShortDesc] = useState('');
  const [newPrice, setNewPrice] = useState(4999);
  const [newDiscountPrice, setNewDiscountPrice] = useState(3999);
  const [newType, setNewType] = useState<ProductType>('STREAMING');
  const [newCategoryId, setNewCategoryId] = useState('cat-streaming');
  const [newStock, setNewStock] = useState(-1);
  const [newSku, setNewSku] = useState('PB-KEY-2026-');

  const filtered = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'all' || p.categoryId === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const cat = categories.find(c => c.id === newCategoryId) || categories[0];

    addProduct({
      title: newTitle.trim(),
      slug: newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      shortDescription: newShortDesc || 'Premium digital product delivery on PlayBeat Digital.',
      description: `${newTitle.trim()} - Instant license key activation with 24/7 dedicated support desk from playbeat.digital.`,
      type: newType,
      status: 'PUBLISHED',
      price: Number(newPrice),
      discountPrice: newDiscountPrice ? Number(newDiscountPrice) : undefined,
      currency: 'PKR',
      sku: newSku.trim() || `PB-${Date.now().toString().slice(-6)}`,
      stock: Number(newStock),
      cover: {
        type: 'image',
        image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=900&q=80',
        colors: ['#6366f1', '#a855f7'],
        icon: 'Sparkles'
      },
      tags: ['Verified', 'Digital Key', 'Instant Dispatch'],
      licenseType: 'Instant Automated Key Vault Dispatch',
      version: 'v2026.1',
      featured: false,
      vendor: {
        id: 'v-playbeat',
        storeName: 'PlayBeat Digital Official',
        slug: 'playbeat-official',
        verified: true,
        rating: 5.0,
        salesCount: 3400
      },
      category: {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        icon: cat.icon
      },
      deliveryType: 'INSTANT_KEY'
    });

    setIsAddModalOpen(false);
    setNewTitle('');
    setNewShortDesc('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#11192e]/90 border border-slate-800/80 p-4 rounded-2xl">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-purple-400" />
            <span>Product Catalog Management ({products.length})</span>
          </h2>
          <p className="text-xs text-slate-400">Manage IPTV passes, subscriptions, software keys & cinema projectors</p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-lg shadow-purple-600/30 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by product name, SKU, or tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-[#11192e]/90 border border-slate-800 text-slate-200 placeholder-slate-400 focus:outline-none focus:border-purple-500"
          />
        </div>

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
      <div className="bg-[#11192e]/90 border border-slate-800/80 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold text-[10px] bg-slate-900/60">
                <th className="py-3 px-4">Product Details</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Selling Price</th>
                <th className="py-3 px-4">Cost / Profit</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Sales</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((prod) => (
                <tr key={prod.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-[#fcb800] font-black text-xs shrink-0">
                        {prod.type === 'HARDWARE' ? '4K' : prod.type === 'STREAMING' ? 'TV' : 'AI'}
                      </div>
                      <div>
                        <div className="font-bold text-white line-clamp-1">{prod.title}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          SKU: {prod.sku} • {prod.category.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                      {prod.type}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-[#fcb800] font-mono">
                      Rs {(prod.discountPrice || prod.price).toLocaleString()}
                    </div>
                    {prod.discountPrice && (
                      <div className="text-[10px] text-slate-500 line-through font-mono">
                        Rs {prod.price.toLocaleString()}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px]">
                    {prod.costPrice ? (
                      <div>
                        <div className="text-slate-400">Cost: Rs {prod.costPrice.toLocaleString()}</div>
                        <div className="text-emerald-400 font-bold">Margin: +Rs {(prod.profit || (prod.price - prod.costPrice)).toLocaleString()}</div>
                      </div>
                    ) : (
                      <span className="text-slate-500">— Digital Vault</span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold">
                    {prod.stock === -1 ? (
                      <span className="text-emerald-400">∞ Digital</span>
                    ) : prod.stock < 5 ? (
                      <span className="text-amber-400">{prod.stock} units</span>
                    ) : (
                      <span className="text-slate-300">{prod.stock} units</span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-300">
                    {prod.salesCount || 10} sold
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedProduct(prod)}
                        title="Quick View"
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteProduct(prod.id)}
                        title="Delete Product"
                        className="p-1.5 rounded-lg bg-red-950/30 border border-red-500/20 text-red-400 hover:bg-red-900/50 hover:text-red-200 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-700 w-full max-w-xl rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-purple-400" />
                <span>Publish New Product to playbeat.digital</span>
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Netflix UHD 4K 1-Month Private Screen Pass"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Short Description</label>
                <input
                  type="text"
                  placeholder="Instant pin activation with 4K HDR streaming."
                  value={newShortDesc}
                  onChange={(e) => setNewShortDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Regular Price (PKR)</label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-purple-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Discount Price (PKR)</label>
                  <input
                    type="number"
                    value={newDiscountPrice}
                    onChange={(e) => setNewDiscountPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-purple-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Product Category</label>
                  <select
                    value={newCategoryId}
                    onChange={(e) => setNewCategoryId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Product Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as ProductType)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none"
                  >
                    <option value="STREAMING">Streaming Membership</option>
                    <option value="AI_TOOL">AI Tool / SaaS</option>
                    <option value="HARDWARE">Hardware / Smart Projector</option>
                    <option value="SOFTWARE_LICENSE">Software License</option>
                    <option value="GAME">Game Key</option>
                    <option value="GIFT_CARD">Gift Card</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-lg shadow-purple-600/30 cursor-pointer"
                >
                  Publish Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
