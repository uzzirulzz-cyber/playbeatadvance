import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { formatCurrency, calculateDiscount } from '../lib/utils';
import { 
  X, 
  Star, 
  ShoppingCart, 
  Zap, 
  ShieldCheck, 
  Check, 
  Heart, 
  Clock, 
  Download, 
  KeyRound, 
  FileText, 
  Layers, 
  Send,
  MessageSquare,
  Sparkles,
  Package,
  HelpCircle
} from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const { 
    selectedProduct, 
    setSelectedProduct, 
    addToCart, 
    setIsCartOpen, 
    toggleFavorite, 
    isFavorite, 
    currency,
    addReview
  } = useStore();

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'reviews' | 'faq'>('overview');
  
  // Review form states
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  if (!selectedProduct) return null;

  const favorited = isFavorite(selectedProduct.id);
  const discountPercent = calculateDiscount(selectedProduct.price, selectedProduct.discountPrice);
  const unitPrice = selectedProduct.discountPrice ?? selectedProduct.price;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    addToCart(selectedProduct, quantity);
  };

  const handleInstantBuy = () => {
    addToCart(selectedProduct, quantity);
    setSelectedProduct(null);
    setIsCartOpen(true);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) return;

    addReview(selectedProduct.id, {
      authorName: reviewName.trim(),
      rating: reviewRating,
      title: reviewTitle.trim() || 'Verified Purchase',
      comment: reviewComment.trim(),
      verified: true
    });

    setReviewSubmitted(true);
    setReviewName('');
    setReviewTitle('');
    setReviewComment('');
    setTimeout(() => setReviewSubmitted(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#07182d]/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[32px] border border-[#FFD21F]/20 bg-[#0B1F3A]/95 shadow-[0_28px_80px_rgba(2,6,23,0.72)] p-6 sm:p-8 space-y-6 my-8">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFD21F]/5 via-transparent to-[#2D5BFF]/5 pointer-events-none" />
        
        {/* Close Button */}
        <button
          onClick={() => setSelectedProduct(null)}
          className="absolute top-5 right-5 p-2 rounded-xl bg-[#07182d]/80 hover:bg-[#0F2342] border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Media Preview */}
          <div className="md:col-span-5 space-y-3">
            <div className="relative aspect-[4/3] rounded-[24px] overflow-hidden bg-[#07182d] border border-white/10 shadow-xl">
              {selectedProduct.cover.image ? (
                <img 
                  src={selectedProduct.cover.image} 
                  alt={selectedProduct.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div 
                  className="w-full h-full flex flex-col items-center justify-center p-6 text-center"
                  style={{
                    background: `linear-gradient(135deg, ${selectedProduct.cover.colors?.[0] || '#4f46e5'}, ${selectedProduct.cover.colors?.[1] || '#9333ea'})`
                  }}
                >
                  <Sparkles className="w-16 h-16 text-white/50 mb-2" />
                  <span className="text-sm font-bold text-white uppercase tracking-wider">
                    {selectedProduct.type.replace('_', ' ')}
                  </span>
                </div>
              )}

              {discountPercent > 0 && (
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-pink-600 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg">
                  -{discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Quick Specs Chips */}
            <div className="p-3.5 rounded-[20px] bg-[#07182d]/80 border border-white/10 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" /> Delivery:
                </span>
                <span className="font-semibold text-emerald-400">
                  {selectedProduct.deliveryType === 'INSTANT_KEY' ? 'Instant Key Generation' : selectedProduct.deliveryType === 'POSTAL_SHIPPING' ? 'Express Courier' : 'Direct Download'}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> License:
                </span>
                <span className="font-semibold text-slate-200 truncate max-w-[180px]">
                  {selectedProduct.licenseType || 'Standard Official'}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-purple-400" /> SKU:
                </span>
                <span className="font-mono text-slate-200">{selectedProduct.sku}</span>
              </div>
            </div>
          </div>

          {/* Right Product Summary & Actions */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-bold text-xs">
                  {selectedProduct.category.name}
                </span>

                <button
                  onClick={() => toggleFavorite(selectedProduct.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    favorited 
                      ? 'bg-pink-500/20 border-pink-500/40 text-pink-400' 
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${favorited ? 'fill-pink-400' : ''}`} />
                  <span>{favorited ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
                </button>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
                {selectedProduct.title}
              </h2>

              {/* Vendor & Rating */}
              <div className="flex flex-wrap items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="font-bold text-white">{selectedProduct.rating}</span>
                  <span className="text-slate-400">({selectedProduct.reviewCount} reviews)</span>
                </div>

                <div className="text-slate-400">
                  Sold by <span className="font-semibold text-slate-200">{selectedProduct.vendor.storeName}</span>
                </div>

                <div className="text-emerald-400 font-medium">
                  {selectedProduct.salesCount}+ Total Orders
                </div>
              </div>

              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                {selectedProduct.shortDescription}
              </p>
            </div>

            {/* Price & Cart Actions Box */}
            <div className="p-4 rounded-[24px] bg-[#07182d]/80 border border-white/10 space-y-4">
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Price</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-emerald-400">
                      {formatCurrency(totalPrice, currency)}
                    </span>
                    {selectedProduct.discountPrice && (
                      <span className="text-sm text-slate-500 line-through">
                        {formatCurrency(selectedProduct.price * quantity, currency)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Quantity Stepper */}
                <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-700">
                  <span className="text-xs text-slate-400">Qty:</span>
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-6 h-6 rounded bg-slate-800 text-white font-bold hover:bg-slate-700 flex items-center justify-center cursor-pointer"
                  >
                    -
                  </button>
                  <span className="font-mono text-sm font-bold text-white px-2">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-6 h-6 rounded bg-slate-800 text-white font-bold hover:bg-slate-700 flex items-center justify-center cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 font-bold text-xs sm:text-sm text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <ShoppingCart className="w-4 h-4 text-indigo-400" />
                  <span>Add to Cart</span>
                </button>

                <button
                  onClick={handleInstantBuy}
                  className="py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 font-bold text-xs sm:text-sm text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/30"
                >
                  <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                  <span>Instant Checkout</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-white/10 flex items-center gap-6 text-sm font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 transition-colors cursor-pointer ${
              activeTab === 'overview' 
                ? 'text-indigo-400 border-b-2 border-indigo-400' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Overview & Features
          </button>
          
          {selectedProduct.specs && (
            <button
              onClick={() => setActiveTab('specs')}
              className={`pb-3 transition-colors cursor-pointer ${
                activeTab === 'specs' 
                  ? 'text-indigo-400 border-b-2 border-indigo-400' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Technical Specs
            </button>
          )}

          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'reviews' 
                ? 'text-indigo-400 border-b-2 border-indigo-400' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Verified Reviews</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] text-slate-300">
              {selectedProduct.reviews?.length || 0}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('faq')}
            className={`pb-3 transition-colors cursor-pointer ${
              activeTab === 'faq' 
                ? 'text-indigo-400 border-b-2 border-indigo-400' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Delivery & FAQ
          </button>
        </div>

        {/* Tab Contents */}
        <div className="pt-2">
          {activeTab === 'overview' && (
            <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <p>{selectedProduct.description}</p>

              {selectedProduct.features && selectedProduct.features.length > 0 && (
                <div className="space-y-2 pt-2">
                  <h4 className="font-bold text-white text-sm">Key Capabilities & Features:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedProduct.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/80">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-slate-200 text-xs">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'specs' && selectedProduct.specs && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(selectedProduct.specs).map(([key, val]) => (
                <div key={key} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-semibold">{key}</span>
                  <span className="text-slate-100 font-bold">{val}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {/* Existing Reviews List */}
              <div className="space-y-3">
                {selectedProduct.reviews && selectedProduct.reviews.length > 0 ? (
                  selectedProduct.reviews.map(r => (
                    <div key={r.id} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-xs sm:text-sm">{r.authorName}</span>
                          <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold border border-emerald-500/20">
                            Verified Buyer
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500">{r.createdAt}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-3.5 h-3.5 ${i < r.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'}`} 
                          />
                        ))}
                        <span className="text-xs font-semibold text-white ml-1">{r.title}</span>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed pt-1">{r.comment}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-xs text-slate-400 rounded-2xl bg-slate-900/30 border border-slate-800">
                    No reviews yet. Be the first to review this digital product!
                  </div>
                )}
              </div>

              {/* Submit a Review Form */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-indigo-500/30 space-y-3">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-indigo-400" />
                  Leave a Verified Review
                </h4>

                {reviewSubmitted ? (
                  <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                    <Check className="w-4 h-4" /> Thank you! Your review has been recorded.
                  </div>
                ) : (
                  <form onSubmit={handleSubmitReview} className="space-y-3 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-400 mb-1 font-semibold">Your Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Daniyal Ahmed"
                          value={reviewName}
                          onChange={(e) => setReviewName(e.target.value)}
                          className="w-full h-9 px-3 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1 font-semibold">Rating</label>
                        <div className="flex items-center gap-1.5 h-9">
                          {[1, 2, 3, 4, 5].map(star => (
                            <button
                              type="button"
                              key={star}
                              onClick={() => setReviewRating(star)}
                              className="p-1 text-slate-600 hover:text-amber-400 cursor-pointer"
                            >
                              <Star className={`w-5 h-5 ${star <= reviewRating ? 'text-amber-400 fill-amber-400' : ''}`} />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1 font-semibold">Headline</label>
                      <input
                        type="text"
                        placeholder="e.g. Works perfectly, instant delivery!"
                        value={reviewTitle}
                        onChange={(e) => setReviewTitle(e.target.value)}
                        className="w-full h-9 px-3 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1 font-semibold">Detailed Feedback</label>
                      <textarea
                        required
                        rows={3}
                        placeholder="Write your honest experience with the activation and product quality..."
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Send className="w-3.5 h-3.5" /> Submit Review
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

          {activeTab === 'faq' && (
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800 space-y-1">
                <h5 className="font-bold text-white">How do I receive my digital license key or download?</h5>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Keys and download links are generated automatically and displayed immediately upon payment completion. You also receive an encrypted copy via email, and you can re-access your codes in the License Vault anytime.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800 space-y-1">
                <h5 className="font-bold text-white">What is the replacement guarantee policy?</h5>
                <p className="text-slate-400 text-xs leading-relaxed">
                  All subscriptions and licenses are backed by a full replacement warranty for the entire duration of the plan. If you ever encounter an issue, our 24/7 support team issues an instant replacement.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800 space-y-1">
                <h5 className="font-bold text-white">Which payment methods are accepted?</h5>
                <p className="text-slate-400 text-xs leading-relaxed">
                  We accept JazzCash, EasyPaisa, Visa, Mastercard, American Express, PayPal, Lemon Squeezy, and major Cryptocurrencies (Bitcoin, USDT, Ethereum).
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
