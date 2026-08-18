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
  MessageCircle,
  Sparkles,
  Package,
  HelpCircle,
  PhoneCall,
  Tv
} from 'lucide-react';
import { ProductVariant } from '../types';

export const ProductDetailModal: React.FC = () => {
  const { 
    selectedProduct, 
    setSelectedProduct, 
    addToCart, 
    setIsCartOpen, 
    toggleFavorite, 
    isFavorite, 
    currency,
    addReview,
    formatPKR
  } = useStore();

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'reviews' | 'faq'>('overview');
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  
  // Review form states
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  if (!selectedProduct) return null;

  // Variants fallback if none defined
  const availableVariants: ProductVariant[] = selectedProduct.variants && selectedProduct.variants.length > 0 
    ? selectedProduct.variants 
    : [
        { id: 'v1', name: '1 Month Access', duration: '1 Month', price: Math.round(selectedProduct.price * 0.4), stock: 99, sku: `${selectedProduct.sku}-1M` },
        { id: 'v2', name: '3 Months Pass', duration: '3 Months', price: Math.round(selectedProduct.price * 0.75), stock: 99, sku: `${selectedProduct.sku}-3M` },
        { id: 'v3', name: '1 Year License (Best Value)', duration: '1 Year', price: selectedProduct.price, discountPrice: selectedProduct.discountPrice, stock: 99, sku: `${selectedProduct.sku}-1Y`, isDefault: true },
        { id: 'v4', name: 'Lifetime VIP Pass', duration: 'Lifetime', price: Math.round(selectedProduct.price * 2.2), stock: 99, sku: `${selectedProduct.sku}-LIFE` }
      ];

  const currentVariant = selectedVariant || availableVariants.find(v => v.isDefault) || availableVariants[0];
  const unitPrice = currentVariant ? (currentVariant.discountPrice || currentVariant.price) : (selectedProduct.discountPrice ?? selectedProduct.price);
  const totalPrice = unitPrice * quantity;
  const favorited = isFavorite(selectedProduct.id);

  const handleAddToCart = () => {
    addToCart(selectedProduct, quantity, currentVariant);
  };

  const handleInstantBuy = () => {
    addToCart(selectedProduct, quantity, currentVariant);
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

  const isHardware = selectedProduct.type === 'HARDWARE';
  const whatsappUrl = `https://wa.me/923321029333?text=${encodeURIComponent(
    `Hello PlayBeat Store! I want to order "${selectedProduct.title}" (${currentVariant?.name || 'Standard'}) for Rs ${totalPrice.toLocaleString()}. Please confirm availability and payment details.`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#0b1120] border border-slate-800 shadow-2xl p-5 sm:p-8 space-y-6 my-auto">
        
        {/* Close Button */}
        <button
          onClick={() => setSelectedProduct(null)}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Media Preview */}
          <div className="md:col-span-5 space-y-3">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl">
              {selectedProduct.cover.image ? (
                <img 
                  src={selectedProduct.cover.image} 
                  alt={selectedProduct.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-slate-900 to-slate-950">
                  <Sparkles className="w-16 h-16 text-[#fcb800] mb-2" />
                  <span className="text-sm font-bold text-white uppercase tracking-wider">
                    {selectedProduct.type.replace('_', ' ')}
                  </span>
                </div>
              )}

              {/* Status Badge */}
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-black/70 backdrop-blur-md text-[#fcb800] border border-yellow-500/30">
                  {isHardware ? 'ZeroByte 4K Projector' : 'Instant Key Delivery'}
                </span>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-2 text-[11px] p-3 rounded-2xl bg-[#070b14] border border-slate-800">
              <div className="flex items-center gap-2 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-[#fcb800] shrink-0" />
                <span>100% Genuine Key</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Instant Activation</span>
              </div>
            </div>
          </div>

          {/* Right Product Details & Actions */}
          <div className="md:col-span-7 space-y-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                <span>{selectedProduct.category.name}</span>
                <span>•</span>
                <span className="font-mono">SKU: {selectedProduct.sku}</span>
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-white leading-snug">
                {selectedProduct.title}
              </h1>

              {/* Ratings */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(selectedProduct.rating) ? 'fill-current' : 'text-slate-600'}`} />
                  ))}
                </div>
                <span className="text-xs font-bold text-white">{selectedProduct.rating}</span>
                <span className="text-xs text-slate-500">({selectedProduct.reviewCount || 12} customer reviews)</span>
              </div>
            </div>

            {/* Subscription / License Duration Variants */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Select License / Subscription Duration:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {availableVariants.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedVariant(v)}
                    className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                      currentVariant.id === v.id
                        ? 'bg-yellow-400/10 border-[#fcb800] text-white shadow-md'
                        : 'bg-[#070b14] border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold truncate">{v.name}</div>
                    <div className="text-xs font-mono font-black text-[#fcb800] mt-0.5">
                      Rs {(v.discountPrice || v.price).toLocaleString()}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Pricing Section */}
            <div className="p-4 rounded-2xl bg-[#070b14] border border-slate-800 flex items-baseline justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500">Total Price:</span>
                <div className="text-2xl font-black text-[#fcb800] font-mono">
                  {formatPKR(totalPrice)}
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-xl p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 hover:text-white font-bold flex items-center justify-center cursor-pointer"
                >
                  -
                </button>
                <span className="w-8 text-center text-xs font-mono font-bold text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 hover:text-white font-bold flex items-center justify-center cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 cursor-pointer transition-colors"
                >
                  <ShoppingCart className="w-4 h-4 text-[#fcb800]" />
                  <span>Add to Cart</span>
                </button>

                <button
                  onClick={handleInstantBuy}
                  className="flex-1 py-3 rounded-xl bg-[#fcb800] hover:bg-[#e5a700] text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/20 cursor-pointer transition-all active:scale-95"
                >
                  <Zap className="w-4 h-4" />
                  <span>Buy Now (Instant Key)</span>
                </button>
              </div>

              {/* Direct WhatsApp Order */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Order via WhatsApp (+92 332 1029333)</span>
              </a>
            </div>

          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-t border-slate-800 pt-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs font-bold">
            {[
              { id: 'overview' as const, label: 'Description & Features' },
              { id: 'specs' as const, label: 'Specifications' },
              { id: 'faq' as const, label: 'FAQ & Activation' },
              { id: 'reviews' as const, label: `Reviews (${selectedProduct.reviews?.length || 0})` },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#fcb800] text-slate-950 font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Contents */}
          <div className="pt-4 text-xs text-slate-300">
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <p className="leading-relaxed text-slate-300">
                  {selectedProduct.description || selectedProduct.shortDescription}
                </p>

                {selectedProduct.features && selectedProduct.features.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-bold text-white">Key Features:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedProduct.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-[#070b14] border border-slate-800">
                          <Check className="w-3.5 h-3.5 text-[#fcb800] shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="space-y-2">
                {selectedProduct.specs ? (
                  <div className="border border-slate-800 rounded-2xl overflow-hidden">
                    <table className="w-full text-left">
                      <tbody className="divide-y divide-slate-800">
                        {Object.entries(selectedProduct.specs).map(([key, val], idx) => (
                          <tr key={idx} className="hover:bg-slate-900/40">
                            <td className="p-3 font-bold text-slate-400 w-1/3 uppercase text-[10px] tracking-wider">{key}</td>
                            <td className="p-3 text-white font-mono">{String(val)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-slate-500 py-4 text-center">Standard digital key delivery format. No custom hardware specs required.</p>
                )}
              </div>
            )}

            {activeTab === 'faq' && (
              <div className="space-y-3">
                {[
                  {
                    q: 'How fast is digital key delivery?',
                    a: 'Digital license keys, activation codes, and streaming access links are generated instantly on the checkout success screen and dispatched to your email and Account Vault.'
                  },
                  {
                    q: 'What payment methods do you support in Pakistan?',
                    a: 'We support 1-click JazzCash, Easypaisa, Meezan Bank / HBL direct wire, Raast Instant ID, Visa/Mastercard, and PlayBeat Store Wallet Credits.'
                  },
                  {
                    q: 'How does the hardware projector warranty work?',
                    a: 'All ZeroByte Smart Cinema Projectors come with an official 1-Year PlayBeat replacement warranty and free courier dispatch across all major cities in Pakistan.'
                  }
                ].map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-[#070b14] border border-slate-800 space-y-1">
                    <h5 className="font-bold text-white text-xs flex items-center gap-2">
                      <HelpCircle className="w-3.5 h-3.5 text-[#fcb800]" />
                      <span>{item.q}</span>
                    </h5>
                    <p className="text-slate-400 pl-5 leading-relaxed">{item.a}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {/* Submit Review */}
                <form onSubmit={handleSubmitReview} className="p-4 rounded-2xl bg-[#070b14] border border-slate-800 space-y-3">
                  <h4 className="font-bold text-white text-xs">Write a Customer Review</h4>
                  {reviewSubmitted && (
                    <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs">
                      Thank you! Your verified customer review has been posted.
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Your Name"
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                    />
                    <select
                      value={reviewRating}
                      onChange={(e) => setReviewRating(Number(e.target.value))}
                      className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                    >
                      <option value={5}>5 Stars - Outstanding</option>
                      <option value={4}>4 Stars - Very Good</option>
                      <option value={3}>3 Stars - Average</option>
                      <option value={2}>2 Stars - Poor</option>
                      <option value={1}>1 Star - Bad</option>
                    </select>
                  </div>
                  <textarea
                    rows={2}
                    required
                    placeholder="Share your experience with this software key or projector..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#fcb800] text-slate-950 font-black text-xs cursor-pointer shadow-md"
                  >
                    Submit Review
                  </button>
                </form>

                {/* Existing Reviews List */}
                <div className="space-y-3">
                  {(selectedProduct.reviews || []).map((rev) => (
                    <div key={rev.id} className="p-3.5 rounded-xl bg-[#070b14] border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-white">{rev.authorName}</span>
                        <div className="flex items-center text-amber-400">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-300">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
