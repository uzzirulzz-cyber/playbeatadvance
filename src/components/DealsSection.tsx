import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { 
  Flame, 
  Clock, 
  Sparkles, 
  ShoppingCart, 
  Heart, 
  Eye, 
  Zap, 
  ShieldCheck, 
  Star,
  Check
} from 'lucide-react';
import { Product } from '../types';

export const DealsSection: React.FC = () => {
  const { 
    products, 
    addToCart, 
    toggleFavorite, 
    isFavorite, 
    setSelectedProduct, 
    formatPKR 
  } = useStore();

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 32,
    seconds: 45
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter deal products
  const dealProducts = products.filter(p => (p.discountPrice && p.discountPrice < p.price) || p.featured).slice(0, 4);

  if (dealProducts.length === 0) return null;

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-8">
      <div className="bg-gradient-to-r from-[#070b14] via-[#0f172a] to-[#070b14] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header with Countdown Timer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
                <Flame className="w-4 h-4" />
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Flash Deals & Special Offers
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Limited-time discounts on genuine software licenses and ZeroByte 4K cinema projectors.
            </p>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-2 bg-[#070b14] px-4 py-2.5 rounded-2xl border border-slate-800 shadow-inner">
            <Clock className="w-4 h-4 text-[#fcb800] shrink-0" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ends in:</span>
            <div className="flex items-center gap-1 font-mono font-black text-sm text-white">
              <span className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[#fcb800]">
                {String(timeLeft.hours).padStart(2, '0')}h
              </span>
              <span>:</span>
              <span className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[#fcb800]">
                {String(timeLeft.minutes).padStart(2, '0')}m
              </span>
              <span>:</span>
              <span className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[#fcb800]">
                {String(timeLeft.seconds).padStart(2, '0')}s
              </span>
            </div>
          </div>
        </div>

        {/* Deals Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {dealProducts.map(product => {
            const hasDiscount = product.discountPrice && product.discountPrice < product.price;
            const discountPct = hasDiscount 
              ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
              : 15;

            return (
              <div
                key={product.id}
                className="bg-[#070b14] border border-slate-800/80 hover:border-[#fcb800]/50 rounded-2xl p-4 flex flex-col justify-between group transition-all duration-300 shadow-lg hover:shadow-yellow-500/5 relative"
              >
                {/* Discount Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-500 text-white shadow-md">
                    -{discountPct}% OFF
                  </span>
                </div>

                {/* Wishlist Button */}
                <div className="absolute top-3 right-3 z-10">
                  <button
                    onClick={() => toggleFavorite(product.id)}
                    className={`p-2 rounded-xl bg-black/60 backdrop-blur-md border border-slate-700 transition-colors cursor-pointer ${
                      isFavorite(product.id) ? 'text-pink-500 border-pink-500/40' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Heart className="w-3.5 h-3.5 fill-current" />
                  </button>
                </div>

                {/* Product Cover */}
                <div 
                  onClick={() => setSelectedProduct(product)}
                  className="w-full aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-800/60 mb-3 cursor-pointer relative flex items-center justify-center group-hover:opacity-95 transition-opacity"
                >
                  {product.cover?.image ? (
                    <img 
                      src={product.cover.image} 
                      alt={product.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  ) : (
                    <Sparkles className="w-8 h-8 text-[#fcb800]" />
                  )}
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1 text-[10px] text-amber-400">
                    <Star className="w-3 h-3 fill-current" />
                    <span className="font-bold">{product.rating || 5.0}</span>
                    <span className="text-slate-500">({product.reviewCount || 12} sold)</span>
                  </div>

                  <h3 
                    onClick={() => setSelectedProduct(product)}
                    className="font-bold text-white text-xs line-clamp-2 hover:text-[#fcb800] transition-colors cursor-pointer"
                  >
                    {product.title}
                  </h3>

                  {/* Pricing */}
                  <div className="pt-1 flex items-baseline gap-2">
                    <span className="text-base font-black text-[#fcb800] font-mono">
                      {formatPKR(product.discountPrice || product.price)}
                    </span>
                    {hasDiscount && (
                      <span className="text-xs text-slate-500 line-through font-mono">
                        {formatPKR(product.price)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Quick Add To Cart */}
                <div className="pt-3 border-t border-slate-800/80 mt-3 flex items-center gap-2">
                  <button
                    onClick={() => addToCart(product, 1)}
                    className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-[#fcb800] text-slate-200 hover:text-slate-950 border border-slate-700 hover:border-[#fcb800] font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Quick Add</span>
                  </button>

                  <button
                    onClick={() => setSelectedProduct(product)}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
                    title="Quick Preview"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
