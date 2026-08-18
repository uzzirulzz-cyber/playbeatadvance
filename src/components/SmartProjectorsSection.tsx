import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Product } from '../types';
import { 
  Projector, 
  Sparkles, 
  Check, 
  ShoppingCart, 
  Eye, 
  ShieldCheck, 
  Truck, 
  BatteryCharging, 
  SlidersHorizontal,
  ExternalLink,
  Star,
  MessageCircle,
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
  const [showCostPricing, setShowCostPricing] = useState(false);

  // Filter projector catalog
  const allProjectors = products.filter(p => p.category.slug === 'smart-projectors' || p.tags.includes('Projector') || p.tags.includes('Magcubic'));

  const filteredProjectors = allProjectors.filter(p => {
    if (activeFilter === 'MAGCUBIC') return p.title.toLowerCase().includes('magcubic') || p.title.toLowerCase().includes('hy300') || p.title.toLowerCase().includes('hy320');
    if (activeFilter === 'FLAGSHIP') return p.price >= 38000;
    if (activeFilter === 'BATTERY') return p.title.toLowerCase().includes('battery') || p.specs?.['Battery Life'] || p.specs?.['Battery Capacity'];
    if (activeFilter === 'BUDGET') return p.price <= 30000;
    return true;
  });

  const getWhatsAppLink = (prod: Product) => {
    const text = encodeURIComponent(`Hi PlayBeat / ZeroByte, I am interested in purchasing the "${prod.title}" (Price: Rs ${prod.price.toLocaleString()}). Is it available for delivery?`);
    return `https://wa.me/923321029333?text=${text}`;
  };

  return (
    <section id="section-smart-projectors" className="w-full py-6 relative">
      {/* Modern Clean Header (No Saving Pin) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 text-[11px] font-bold flex items-center gap-1">
              <Projector className="w-3 h-3 text-[#fcb800]" />
              ZeroByte Official Projector Lineup
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-medium">
              <Truck className="w-3 h-3" />
              TCS Express Nationwide Delivery
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Smart Android & 4K Cinema Projectors</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Magcubic 180° rotatable gimbals, motorized electric focus, native 1080P/4K decoding, and rechargeable outdoor battery cinema models.
          </p>
        </div>

        {/* Pricing Mode Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowCostPricing(!showCostPricing)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer flex items-center gap-1.5 ${
              showCostPricing 
                ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40 shadow-lg shadow-yellow-500/10' 
                : 'bg-[#0f172a] text-slate-300 border-slate-700 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span>{showCostPricing ? 'Showing Cost Pricing' : 'View Cost Breakdown'}</span>
          </button>
          
          <a
            href="https://wa.me/923321029333?text=Hi%20PlayBeat%2C%20I%20want%20to%20inquire%20about%20smart%20projectors"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-900/30 transition-all cursor-pointer"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">WhatsApp</span>
            <span>+92 332 1029333</span>
          </a>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          {[
            { id: 'ALL', label: `All 8 Projectors (${allProjectors.length})` },
            { id: 'MAGCUBIC', label: 'Magcubic HY300 & HY320 Series' },
            { id: 'FLAGSHIP', label: 'High Brightness & HM103-A' },
            { id: 'BATTERY', label: 'HY7 Battery & Portable' },
            { id: 'BUDGET', label: 'Under Rs 30,000' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer border ${
                activeFilter === tab.id
                  ? 'bg-[#fcb800] text-black border-[#fcb800] shadow-md shadow-yellow-500/20'
                  : 'bg-[#0f172a] hover:bg-slate-800 text-slate-300 border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-400 font-mono">
          Catalog: <span className="text-white font-bold">{filteredProjectors.length}</span> Verified ZeroByte Hardware Models
        </div>
      </div>

      {/* Modern Fashion/Retail Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredProjectors.map(prod => {
          const isFav = favorites.includes(prod.id);
          const lumens = prod.specs?.['Brightness'] || '260-650 ANSI';
          const isBattery = prod.title.toLowerCase().includes('battery') || prod.specs?.['Battery Capacity'];

          return (
            <div
              key={prod.id}
              className="group relative bg-[#0f172a] rounded-2xl border border-slate-800/80 hover:border-yellow-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-black/60 flex flex-col justify-between overflow-hidden"
            >
              {/* Badges */}
              <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5">
                <span className="px-2 py-0.5 rounded-md bg-black/85 backdrop-blur-md text-yellow-400 text-[10px] font-black tracking-wider uppercase border border-yellow-500/30 shadow">
                  {lumens}
                </span>
                {isBattery && (
                  <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-bold flex items-center gap-1 shadow">
                    <BatteryCharging className="w-3 h-3" />
                    Built-in Battery
                  </span>
                )}
                {prod.title.includes('HY300') && (
                  <span className="px-2 py-0.5 rounded-md bg-slate-900/90 text-white text-[10px] font-bold border border-slate-700 shadow">
                    180° Gimbal Stand
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
                    ? 'bg-red-500 text-white shadow-lg' 
                    : 'bg-black/60 backdrop-blur-md text-slate-300 hover:text-white hover:bg-black/80 border border-white/10'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
              </button>

              {/* Image Cover */}
              <div 
                onClick={() => setSelectedProduct(prod)}
                className="relative h-48 w-full bg-slate-950 overflow-hidden cursor-pointer"
              >
                <img
                  src={prod.cover?.image || 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80'}
                  alt={prod.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-black/20" />
                
                {/* Rating badge */}
                <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] font-bold text-slate-300 font-mono">
                  <span className="bg-slate-900/90 px-2 py-0.5 rounded-md border border-slate-700/60 truncate max-w-[160px] text-yellow-400">
                    {prod.specs?.['Model'] || 'ZeroByte Edition'}
                  </span>
                  <span className="flex items-center gap-1 text-amber-400 bg-slate-900/90 px-1.5 py-0.5 rounded-md border border-slate-700/60">
                    <Star className="w-3 h-3 fill-amber-400" />
                    {prod.rating}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-yellow-400 font-bold uppercase tracking-wider">
                      ZeroByte Official
                    </span>
                    {prod.sourceUrl && (
                      <a
                        href={prod.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-slate-400 hover:text-white flex items-center gap-1 text-[10px]"
                      >
                        <span>zerobyte.store</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>

                  <h3 
                    onClick={() => setSelectedProduct(prod)}
                    className="text-sm font-bold text-white group-hover:text-yellow-400 transition-colors line-clamp-1 cursor-pointer"
                  >
                    {prod.title}
                  </h3>
                  
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {prod.shortDescription}
                  </p>
                </div>

                {/* Specs Chips */}
                <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono text-slate-300">
                  <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 truncate">
                    <span className="text-slate-500">Res:</span> {prod.specs?.['Resolution'] ? '1080P/4K' : '720P/1080P'}
                  </div>
                  <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 truncate">
                    <span className="text-slate-500">OS:</span> {prod.specs?.['OS'] || 'Android 11'}
                  </div>
                </div>

                {/* Cost Pricing Information */}
                {showCostPricing && (
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-yellow-500/30 text-[11px] space-y-1">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Wholesale Cost:</span>
                      <span className="font-mono font-bold text-slate-200">Rs {prod.costPrice?.toLocaleString() || '18,500'}</span>
                    </div>
                    <div className="flex items-center justify-between text-yellow-400 font-bold">
                      <span>Retail Margin:</span>
                      <span className="font-mono">Rs {prod.profit?.toLocaleString() || '4,000'}</span>
                    </div>
                  </div>
                )}

                {/* Price & Action Section */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                  <div>
                    <div className="text-[10px] text-slate-400">Price (PKR)</div>
                    <div className="text-base font-black text-[#fcb800] font-mono">
                      {formatPKR(prod.price)}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <a
                      href={getWhatsAppLink(prod)}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Order on WhatsApp"
                      className="p-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 transition-all cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </a>

                    <button
                      onClick={() => setComparingProduct(prod)}
                      title="Quick Specs View"
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => addToCart(prod, 1)}
                      className="px-3 py-2 rounded-xl bg-[#fcb800] hover:bg-[#e5a700] text-black text-xs font-black flex items-center gap-1 shadow-md shadow-yellow-500/20 transition-all cursor-pointer active:scale-95"
                    >
                      <ShoppingCart className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Order</span>
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
          <div className="bg-[#0f172a] border border-slate-700 rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 text-[10px] font-mono font-bold">
                  ZEROBYTE PAKISTAN HARDWARE SPECIFICATIONS
                </span>
                <h3 className="text-lg font-black text-white mt-1">{comparingProduct.title}</h3>
                <div className="text-xs text-slate-400 font-mono flex items-center gap-2 mt-0.5">
                  <span>SKU: {comparingProduct.sku}</span>
                  {comparingProduct.sourceUrl && (
                    <a
                      href={comparingProduct.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-yellow-400 hover:underline flex items-center gap-1"
                    >
                      <span>View on zerobyte.store</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              <button
                onClick={() => setComparingProduct(null)}
                className="w-8 h-8 rounded-xl bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Price banner */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-yellow-500/30 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400 font-medium">Selling Price</div>
                <div className="text-xl font-black text-[#fcb800] font-mono">{formatPKR(comparingProduct.price)}</div>
                {comparingProduct.costPrice && (
                  <div className="text-[11px] text-slate-400 font-mono">Wholesale Cost: Rs {comparingProduct.costPrice.toLocaleString()}</div>
                )}
              </div>
              <div className="text-right text-xs">
                <div className="text-emerald-400 font-bold flex items-center gap-1 justify-end">
                  <Check className="w-3.5 h-3.5" />
                  In Stock (Pakistan Warehouse)
                </div>
                <div className="text-slate-400 mt-0.5">Free 2-Day Delivery via TCS/Leopards</div>
              </div>
            </div>

            {/* Specs Table */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-yellow-400" />
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
                      <div className="w-4 h-4 rounded-full bg-yellow-500/20 text-yellow-400 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-slate-800 gap-2">
              <a
                href={getWhatsAppLink(comparingProduct)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Order (+923321029333)</span>
              </a>

              <div className="flex items-center gap-2">
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
                  className="px-5 py-2 rounded-xl bg-[#fcb800] hover:bg-[#e5a700] text-black text-xs font-black flex items-center gap-1.5 shadow-lg shadow-yellow-500/20 cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4 stroke-[2.5]" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
