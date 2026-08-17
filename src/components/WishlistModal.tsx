import React from 'react';
import { useStore } from '../store/useStore';
import { formatCurrency } from '../lib/utils';
import { X, Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';

export const WishlistModal: React.FC = () => {
  const { 
    isWishlistOpen, 
    setIsWishlistOpen, 
    favorites, 
    products, 
    toggleFavorite, 
    addToCart, 
    setIsCartOpen,
    currency 
  } = useStore();

  if (!isWishlistOpen) return null;

  const favoritedProducts = products.filter(p => favorites.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl glass-dropdown border border-pink-500/30 shadow-2xl p-6 space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center">
              <Heart className="w-4 h-4 fill-pink-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">Your Saved Wishlist</h3>
              <span className="text-xs text-slate-400">{favoritedProducts.length} saved item(s)</span>
            </div>
          </div>

          <button
            onClick={() => setIsWishlistOpen(false)}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        {favoritedProducts.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <Heart className="w-12 h-12 text-slate-600 mx-auto" />
            <h4 className="font-bold text-white text-sm">No saved products yet</h4>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Click the heart icon on any product in the marketplace to save it to your wishlist for later.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {favoritedProducts.map(product => {
              const price = product.discountPrice ?? product.price;
              return (
                <div 
                  key={product.id}
                  className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden shrink-0">
                      {product.cover.image && (
                        <img 
                          src={product.cover.image} 
                          alt={product.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover" 
                        />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white truncate">{product.title}</div>
                      <div className="text-[11px] text-slate-400">{product.category.name}</div>
                      <div className="text-xs font-black text-emerald-400 mt-0.5">
                        {formatCurrency(price, currency)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        addToCart(product);
                        setIsWishlistOpen(false);
                        setIsCartOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Move to Cart</span>
                    </button>

                    <button
                      onClick={() => toggleFavorite(product.id)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-pink-400 cursor-pointer"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};
