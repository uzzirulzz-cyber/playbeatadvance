import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Product } from '../types';
import { 
  Projector, 
  Sparkles, 
  Check, 
  ShoppingCart, 
  Eye, 
  Zap, 
  ShieldCheck, 
  Truck, 
  BatteryCharging, 
  Maximize, 
  SlidersHorizontal,
  ChevronRight,
  Star,
  Info,
  Layers,
  Heart
} from 'lucide-react';

export const SmartProjectorsSection: React.FC = () => {
  const { 
    products, 
    addToCart, 
    setSelectedProduct, 
    toggleFavorite, 
    favorites,
    formatPKR,
    isAdminAuthenticated
  } = useStore();

  const [activeFilter, setActiveFilter] = useState<'ALL' | 'MAGCUBIC' | 'FLAGSHIP' | 'BATTERY' | 'BUDGET'>('ALL');
  const [comparingProduct, setComparingProduct] = useState<Product | null>(null);
  const [showProfitBreakdown, setShowProfitBreakdown] = useState(false);

  // Filter projector catalog
  const allProjectors = products.filter(p => p.category.slug === 'smart-projectors' || p.tags.includes('Projector') || p.tags.includes('Magcubic'));

  const filteredProjectors = allProjectors.filter(p => {
    if (activeFilter === 'MAGCUBIC') return p.title.toLowerCase().includes('magcubic') || p.title.toLowerCase().includes('hy300');
    if (activeFilter === 'FLAGSHIP') return p.price >= 40000;
    if (activeFilter === 'BATTERY') return p.title.toLowerCase().includes('battery') || p.specs?.['Battery Life'] || p.specs?.['Battery Capacity'];
    if (activeFilter === 'BUDGET') return p.price <= 35000;
    return true;
  });

  return (
    <section id="section-smart-projectors" className="w-full py-8 relative">
      {/* Pinned Top Bar Alert */}
      <div className="mb-6 rounded-2xl bg-gradient-to-r from-blue-950/80 via-gray-900/70 to-slate-900 border border-yellow-500/30 p-4 sm:p-5 shadow-xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-yellow-500/10 blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 text-[11px] font-black uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-yellow-400" />
                Pinned Spotlight Collection
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold">
                <Truck className="w-3 h-3" />
                Free Nationwide Delivery (Pakistan)
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/30 text-[11px] font-bold">
                <ShieldCheck className="w-3 h-3" />
                1-Year Replacement Warranty
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
              <Projector className="w-6 h-6 text-yellow-400 shrink-0" />
              <span>Smart Android & 4K Cinema Projectors</span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Transform any bedroom, rooftop, or hall into a 200-inch cinema with Magcubic 180° rotatable gimbals, 
              native 1080P 4K-decoded chips, WiFi 6, and long-lasting battery models.
            </p>
          </div>

          {/* Quick Stats / Admin Margin Switch */}
          <div className="flex items-center gap-3 shrink-0">
            {isAdminAuthenticated && (
              <button
                onClick={() => setShowProfitBreakdown(!showProfitBreakdown)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  showProfitBreakdown 
                    ? 'bg-yellow-600 text-slate-900 border-yellow-400 shadow-lg shadow-yellow-600/30' 
                    : 'bg-slate-800/80 text-yellow-300 border-slate-700 hover:bg-slate-800'
                }`}
              >
                {showProfitBreakdown ? 'Hide Margin Data' : 'Show Admin Margins (Rs 8,000)'}
              </button>
            )}

            <div className="hidden sm:flex flex-col items-end text-right p-2.5 rounded-xl bg-slate-900/80 border border-yellow-700/50">
              <div className="text-[10px] text-slate-400 font-mono">Guaranteed Margin</div>
              <div className="text-sm font-black text-yellow-400 font-mono">Rs 8,000 / unit</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          {[
            { id: 'ALL', label: `All Projectors (${allProjectors.length})` },
            { id: 'MAGCUBIC', label: 'Magcubic & HY300 Series' },
            { id: 'FLAGSHIP', label: 'High Brightness / Flagships' },
            { id: 'BATTERY', label: 'Built-in Battery / Outdoor' },
            { id: 'BUDGET', label: 'Under Rs 35,000' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer border ${
                activeFilter === tab.id
                  ? 'bg-blue-700 text-white border-blue-500 shadow-md shadow-blue-700/30'
                  : 'bg-slate-900/60 hover:bg-slate-800 text-slate-300 border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-400 font-mono">
          Showing <span className="text-white font-bold">{filteredProjectors.length}</span> Verified Models
        </div>
      </div>

      {/* Projectors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredProjectors.map(prod => {
          const isFav = favorites.includes(prod.id);
          const lumens = prod.specs?.['Brightness'] || 'High Lumen';
          const res = prod.specs?.['Resolution'] || '1080P/4K Decoded';
          const isBattery = prod.title.toLowerCase().includes('battery') || prod.specs?.['Battery Capacity'];

          return (
            <div
              key={prod.id}
              className="group relative bg-[#0f172a] rounded-2xl border border-slate-800 hover:border-yellow-500/60 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-950/40 flex flex-col justify-between overflow-hidden"
            >
              {/* Top Badges */}
              <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5">
                <span className="px-2 py-0.5 rounded-lg bg-black/80 backdrop-blur-md text-white text-[10px] font-black tracking-wider uppercase border border-white/10 shadow">
                  {lumens}
                </span>
                {isBattery && (
                  <span className="px-2 py-0.5 rounded-lg bg-emerald-600/90 text-white text-[10px] font-black flex items-center gap-1 shadow">
                    <BatteryCharging className="w-3 h-3" />
                    12,000mAh Battery
                  </span>
                )}
                {prod.title.includes('HY300') && (
                  <span className="px-2 py-0.5 rounded-lg bg-blue-600/90 text-white text-[10px] font-black shadow">
                    180° Gimbal
                  </span>
                )}
              </div>

              {/* Wishlist Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(prod.id);
                }}
                className={`absolute top-3 right-3 z-20 w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                  isFav 
                    ? 'bg-pink-600 text-white shadow-lg' 
                    : 'bg-black/60 backdrop-blur-md text-slate-300 hover:text-white hover:bg-black/80 border border-white/10'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
              </button>

              {/* Image Container */}
              <div 
                onClick={() => setSelectedProduct(prod)}
                className="relative h-48 w-full bg-slate-950 overflow-hidden cursor-pointer"
              >
                <img
                  src={prod.cover?.image || 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80'}
                  alt={prod.title}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-black/20" />
                
                {/* Resolution Pill Bottom */}
                <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] font-bold text-slate-300 font-mono">
                  <span className="bg-slate-900/80 px-2 py-0.5 rounded-md border border-slate-700/60 truncate max-w-[170px]">
                    {res}
                  </span>
                  <span className="flex items-center gap-1 text-amber-400 bg-slate-900/80 px-1.5 py-0.5 rounded-md border border-slate-700/60">
                    <Star className="w-3 h-3 fill-amber-400" />
                    {prod.rating}
                  </span>
                </div>
              </div>

              {/* Body Content */}
              <div className="p-4.5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="text-[11px] text-yellow-400 font-bold uppercase tracking-wider">
                    {prod.vendor.storeName}
                  </div>
                  <h3 
                    onClick={() => setSelectedProduct(prod)}
                    className="text-sm font-bold text-white group-hover:text-yellow-300 transition-colors line-clamp-1 cursor-pointer"
                  >
                    {prod.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {prod.shortDescription}
                  </p>
                </div>

                {/* Key Spec Chips */}
                <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11px] font-mono text-slate-300">
                  <div className="p-1.5 rounded-lg bg-slate-950/60 border border-slate-800 truncate">
                    <span className="text-slate-500">OS:</span> {prod.specs?.['OS'] || prod.specs?.['System'] || 'Android 11'}
                  </div>
                  <div className="p-1.5 rounded-lg bg-slate-950/60 border border-slate-800 truncate">
                    <span className="text-slate-500">Audio:</span> {prod.specs?.['Audio'] ? 'Hi-Fi 5W/10W' : 'Dolby Audio'}
                  </div>
                </div>

                {/* Profit Margin Info (if enabled or admin) */}
                {showProfitBreakdown && (
                  <div className="p-2 rounded-xl bg-blue-950/50 border border-yellow-500/30 text-[11px] space-y-1">
                    <div className="flex items-center justify-between text-slate-300">
                      <span>Wholesale Cost:</span>
                      <span className="font-mono font-bold text-slate-200">Rs {prod.costPrice?.toLocaleString() || '22,500'}</span>
                    </div>
                    <div className="flex items-center justify-between text-yellow-400 font-bold">
                      <span>Platform Profit:</span>
                      <span className="font-mono">Rs {prod.profit?.toLocaleString() || '8,000'}</span>
                    </div>
                  </div>
                )}

                {/* Price & Action Section */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <div>
                    <div className="text-[10px] text-slate-400">Selling Price</div>
                    <div className="text-base font-black text-white font-mono">
                      {formatPKR(prod.price)}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setComparingProduct(prod)}
                      title="Quick Specs View"
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => addToCart(prod, 1)}
                      className="px-3.5 py-2 rounded-xl bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-blue-700/30 transition-all cursor-pointer active:scale-95"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Buy Now</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Specs Modal */}
      {comparingProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0e1628] border border-slate-700 rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-600/30 text-blue-300 border border-blue-500/40 text-[10px] font-mono font-bold">
                  OFFICIAL PAKISTAN HARDWARE SPECIFICATIONS
                </span>
                <h3 className="text-lg font-black text-white mt-1">{comparingProduct.title}</h3>
                <div className="text-xs text-slate-400 font-mono">SKU: {comparingProduct.sku}</div>
              </div>

              <button
                onClick={() => setComparingProduct(null)}
                className="w-8 h-8 rounded-xl bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Price banner */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-900/60 to-indigo-900/50 border border-purple-500/30 flex items-center justify-between">
              <div>
                <div className="text-xs text-purple-300 font-medium">Selling Price (Incl. GST)</div>
                <div className="text-xl font-black text-white font-mono">{formatPKR(comparingProduct.price)}</div>
              </div>
              <div className="text-right text-xs">
                <div className="text-emerald-400 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  In Stock (Pakistan Warehouse)
                </div>
                <div className="text-slate-400">Next-day Dispatch via TCS/Leopards</div>
              </div>
            </div>

            {/* Specs Table */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-purple-400" />
                Technical Specifications
              </h4>
              <div className="bg-slate-950 rounded-xl border border-slate-800 divide-y divide-slate-800/80 text-xs">
                {comparingProduct.specs && Object.entries(comparingProduct.specs).map(([key, value]) => (
                  <div key={key} className="p-2.5 flex items-center justify-between">
                    <span className="text-slate-400">{key}</span>
                    <span className="font-semibold text-slate-200 text-right max-w-[60%]">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Features List */}
            {comparingProduct.features && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Key Highlights</h4>
                <div className="space-y-1.5">
                  {comparingProduct.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                      <div className="w-4 h-4 rounded-full bg-purple-600/20 text-purple-400 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setComparingProduct(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  addToCart(comparingProduct, 1);
                  setComparingProduct(null);
                }}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-purple-600/30 cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart & Checkout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
