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
      className="group relative rounded-[28px] p-3.5 border border-white/10 bg-[#0B1F3A]/80 shadow-[0_18px_45px_rgba(2,6,23,0.35)] hover:border-[#FFD21F]/50 hover:shadow-[0_22px_60px_rgba(255,210,31,0.12)] transition-all duration-300 flex flex-col justify-between cursor-pointer overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/3 via-transparent to-[#FFD21F]/5 pointer-events-none" />

      {/* Top Banner Cover */}
      <div className="relative aspect-[16/10] w-full rounded-[22px] overflow-hidden bg-[#07182d] border border-white/10 mb-3.5 group-hover:shadow-lg group-hover:shadow-[#07182d]/60 transition-all">
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
            <span className="px-2 py-0.5 rounded-lg bg-[#FF4D6D] text-white font-extrabold text-[10px] uppercase tracking-wider shadow-md">
              -{discountPercent}% OFF
            </span>
          )}
          {product.featured && (
            <span className="px-2 py-0.5 rounded-lg bg-[#FFD21F] text-[#0B1F3A] font-extrabold text-[10px] uppercase tracking-wider shadow-md">
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
              ? 'bg-[#FF4D6D]/90 border-[#FF4D6D] text-white shadow-lg shadow-pink-600/30' 
              : 'bg-[#07182d]/80 border-white/10 text-slate-300 hover:text-white hover:bg-[#0B1F3A]'
          }`}
          title={favorited ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 ${favorited ? 'fill-white' : ''}`} />
        </button>

        {/* Bottom image overlay chip */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none">
          <span className="px-2 py-0.5 rounded-md bg-[#07182d]/80 backdrop-blur-md text-[10px] font-semibold text-slate-200 border border-white/10 flex items-center gap-1">
            <Zap className="w-2.5 h-2.5 text-[#FFD21F] fill-[#FFD21F]" />
            {product.deliveryType === 'INSTANT_KEY' ? 'Instant Key' : product.deliveryType === 'POSTAL_SHIPPING' ? 'Courier Dispatch' : 'Instant Download'}
          </span>
          <span className="px-1.5 py-0.5 rounded-md bg-[#07182d]/80 backdrop-blur-md text-[10px] font-bold text-[#FFD21F] border border-white/10 flex items-center gap-1">
            <Star className="w-2.5 h-2.5 fill-[#FFD21F]" />
            {product.rating}
          </span>
        </div>
      </div>

      {/* Product Information */}
      <div className="space-y-2 flex-1 flex flex-col justify-between relative z-10">
        <div>
          {/* Vendor & Category strip */}
          <div className="flex items-center justify-between text-[11px] text-slate-300 mb-1.5">
            <span className="text-[#FFD21F] font-semibold truncate max-w-[130px]">
              {product.category.name}
            </span>
            <div className="flex items-center gap-1 text-[10px] text-slate-300">
              <span>{product.vendor.storeName}</span>
              {product.vendor.verified && (
                <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" title="Verified Vendor" />
              )}
            </div>
          </div>

          {/* Product Title */}
          <h3 className="font-black text-base text-white group-hover:text-[#FFD21F] transition-colors line-clamp-1 tracking-tight">
            {product.title}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-slate-300 line-clamp-2 mt-1.5 leading-relaxed">
            {product.shortDescription}
          </p>
        </div>

        {/* Price & Action Area */}
        <div className="pt-3 mt-2 border-t border-white/10 flex items-center justify-between gap-2">
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold tracking-[0.12em]">Price</div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-extrabold text-[#FFD21F]">
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
              className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                addedAnim 
                  ? 'bg-[#FFD21F] border-[#FFD21F] text-[#0B1F3A]' 
                  : 'bg-[#0F2342] hover:bg-[#122a4b] border-white/10 text-slate-200 hover:text-white'
              }`}
              title="Add to Cart"
            >
              {addedAnim ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
            </button>

            <button
              onClick={handleQuickBuy}
              className="px-3 py-2 rounded-xl bg-gradient-to-r from-[#FFD21F] to-[#FFC400] hover:from-[#FFC400] hover:to-[#FFB000] text-[#0B1F3A] font-black text-xs shadow-md shadow-[#FFD21F]/20 transition-all cursor-pointer flex items-center gap-1"
            >
              <span>Buy</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
