import React, { useState } from 'react';
import { Product } from '../types';
import { useStore } from '../store/useStore';
import { formatCurrency, calculateDiscount } from '../lib/utils';
import { 
  Star, 
  ShoppingCart, 
  Heart, 
  Eye, 
  Zap, 
  ShieldCheck, 
  Check, 
  Tv, 
  Sparkles, 
  KeyRound, 
  RefreshCw, 
  Gamepad2, 
  Gift, 
  LayoutTemplate, 
  CreditCard,
  Projector
} from 'lucide-react';

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { 
    setSelectedProduct, 
    addToCart, 
    setIsCartOpen, 
    toggleFavorite, 
    isFavorite, 
    currency 
  } = useStore();

  const [addedAnim, setAddedAnim] = useState(false);
  const favorited = isFavorite(product.id);
  const discountPercent = calculateDiscount(product.price, product.discountPrice);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 1500);
  };

  const handleQuickBuy = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    setIsCartOpen(true);
  };

  const getProductIcon = () => {
    switch (product.type) {
      case 'HARDWARE': return Projector;
      case 'STREAMING': return Tv;
      case 'AI_TOOL': return Sparkles;
      case 'SOFTWARE_LICENSE': return KeyRound;
      case 'SAAS_SUBSCRIPTION': return RefreshCw;
      case 'GAME': return Gamepad2;
      case 'GIFT_CARD': return Gift;
      case 'TEMPLATE': return LayoutTemplate;
      case 'PAYMENT_GATEWAY': return CreditCard;
      default: return Sparkles;
    }
  };

  const TypeIcon = getProductIcon();

  return (
    <div 
      onClick={() => setSelectedProduct(product)}
      className="group relative rounded-3xl p-4 glass-panel border border-slate-800/80 hover:border-indigo-500/50 glow-hover transition-all duration-300 flex flex-col justify-between cursor-pointer overflow-hidden bg-slate-900/40"
    >
      {/* Top Banner Cover */}
      <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800/80 mb-3.5 group-hover:shadow-lg group-hover:shadow-indigo-950/50 transition-all">
        {product.cover.image ? (
          <img 
            src={product.cover.image} 
            alt={product.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div 
            className="w-full h-full flex flex-col items-center justify-center p-4 relative"
            style={{
              background: `linear-gradient(135deg, ${product.cover.colors?.[0] || '#4f46e5'}, ${product.cover.colors?.[1] || '#9333ea'})`
            }}
          >
            <div className="w-14 h-14 rounded-2xl bg-black/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-xl transform group-hover:scale-110 transition-transform">
              <TypeIcon className="w-7 h-7" />
            </div>
            <span className="text-[11px] font-bold text-white/90 uppercase tracking-widest mt-2">
              {product.type.replace('_', ' ')}
            </span>
          </div>
        )}

        {/* Top Floating Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 z-10">
          {discountPercent > 0 && (
            <span className="px-2 py-0.5 rounded-lg bg-pink-600 text-white font-extrabold text-[10px] uppercase tracking-wider shadow-md">
              -{discountPercent}% OFF
            </span>
          )}
          {product.featured && (
            <span className="px-2 py-0.5 rounded-lg bg-amber-500 text-slate-950 font-extrabold text-[10px] uppercase tracking-wider shadow-md">
              ★ TOP
            </span>
          )}
        </div>

        {/* Favorite heart button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(product.id);
          }}
          className={`absolute top-2.5 right-2.5 p-2 rounded-xl backdrop-blur-md border transition-all z-10 cursor-pointer ${
            favorited 
              ? 'bg-pink-600/90 border-pink-500 text-white shadow-lg shadow-pink-600/30' 
              : 'bg-slate-950/70 border-white/10 text-slate-300 hover:text-white hover:bg-slate-900'
          }`}
          title={favorited ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 ${favorited ? 'fill-white' : ''}`} />
        </button>

        {/* Bottom image overlay chip */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none">
          <span className="px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md text-[10px] font-semibold text-slate-200 border border-white/10 flex items-center gap-1">
            <Zap className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
            {product.deliveryType === 'INSTANT_KEY' ? 'Instant Key' : product.deliveryType === 'POSTAL_SHIPPING' ? 'Courier Dispatch' : 'Instant Download'}
          </span>
          <span className="px-1.5 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-amber-400 border border-white/10 flex items-center gap-1">
            <Star className="w-2.5 h-2.5 fill-amber-400" />
            {product.rating}
          </span>
        </div>
      </div>

      {/* Product Information */}
      <div className="space-y-2 flex-1 flex flex-col justify-between">
        <div>
          {/* Vendor & Category strip */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span className="text-indigo-400 font-semibold truncate max-w-[130px]">
              {product.category.name}
            </span>
            <div className="flex items-center gap-1 text-[10px]">
              <span>{product.vendor.storeName}</span>
              {product.vendor.verified && (
                <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" title="Verified Vendor" />
              )}
            </div>
          </div>

          {/* Product Title */}
          <h3 className="font-bold text-sm text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
            {product.title}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
            {product.shortDescription}
          </p>
        </div>

        {/* Price & Action Area */}
        <div className="pt-3 mt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Price</div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-extrabold text-emerald-400">
                {formatCurrency(product.discountPrice || product.price, currency)}
              </span>
              {product.discountPrice && (
                <span className="text-[11px] text-slate-500 line-through">
                  {formatCurrency(product.price, currency)}
                </span>
              )}
            </div>
          </div>

          {/* Add to Cart & Buy Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleAddToCart}
              className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                addedAnim 
                  ? 'bg-emerald-600 border-emerald-500 text-white' 
                  : 'bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-slate-200 hover:text-white'
              }`}
              title="Add to Cart"
            >
              {addedAnim ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
            </button>

            <button
              onClick={handleQuickBuy}
              className="px-3 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-md shadow-indigo-600/25 transition-all cursor-pointer flex items-center gap-1"
            >
              <span>Buy</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
