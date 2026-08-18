import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { formatCurrency } from '../lib/utils';
import { 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  Flame, 
  Clock, 
  ArrowRight, 
  Star, 
  Play, 
  CheckCircle2, 
  Layers,
  Award,
  Lock,
  RefreshCw,
  Gift
} from 'lucide-react';

export const HeroSpotlight: React.FC = () => {
  const { products, setSelectedProduct, addToCart, setIsCartOpen, currency, setSelectedCategory, setSearchQuery } = useStore();
  
  // Spotlight showcase rotation between featured products
  const spotlightIds = ['prod-proj-hy300-pro', 'prod-stream-1', 'prod-proj-hy7-battery', 'prod-ai-1'];
  const spotlightProducts = products.filter(p => spotlightIds.includes(p.id));
  
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % (spotlightProducts.length || 1));
    }, 6000);
    return () => clearInterval(timer);
  }, [spotlightProducts.length]);

  const currentProduct = spotlightProducts[activeIndex] || products[0];

  const popularKeywords = [
    { label: 'Magcubic HY300', cat: 'smart-projectors', tag: 'Magcubic' },
    { label: '4K Projectors', cat: 'smart-projectors', tag: 'Projector' },
    { label: 'Netflix UHD', cat: 'streaming', tag: 'Netflix' },
    { label: 'NovaScript AI', cat: 'ai-tools', tag: 'AI' },
    { label: 'Steam $50 Card', cat: 'gift-cards', tag: 'Steam' },
  ];

  return (
    <div className="relative overflow-hidden pt-6 pb-8 border-b border-slate-800/80 bg-[#080d1a]">
      {/* Background ambient lighting orbs (Navy & Martfury Yellow accents) */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-blue-900/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Hero Tagline & Value Props */}
          <div className="lg:col-span-7 space-y-5 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-semibold backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-[#fcb800] animate-ping" />
              <Sparkles className="w-3.5 h-3.5 text-[#fcb800]" />
              <span>Next-Gen Digital Goods & Automated Key Vault</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
              Instant Access to <br className="hidden sm:inline" />
              <span className="text-[#fcb800] drop-shadow-[0_2px_12px_rgba(252,184,0,0.25)]">
                Software, Streaming & 4K Cinema
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
              Buy verified digital licenses, AI suites, Netflix & Spotify passes, Steam wallet keys, and smart laser projectors. Delivered in seconds with official warranty & 24/7 support.
            </p>

            {/* Popular quick tags */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs font-bold text-slate-400">Trending Now:</span>
              {popularKeywords.map(kw => (
                <button
                  key={kw.label}
                  onClick={() => {
                    setSelectedCategory(kw.cat);
                    setSearchQuery(kw.tag);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[#0f172a] hover:bg-[#1e293b] border border-slate-700/70 hover:border-yellow-500/50 text-xs text-slate-300 hover:text-yellow-400 transition-all cursor-pointer font-medium"
                >
                  #{kw.label}
                </button>
              ))}
            </div>

            {/* Platform Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
              <div className="p-3.5 rounded-xl bg-[#0f172a]/90 border border-slate-800">
                <div className="text-lg sm:text-xl font-black text-[#fcb800]">99.98%</div>
                <div className="text-[11px] text-slate-400 font-medium">Instant Auto-Delivery</div>
              </div>
              <div className="p-3.5 rounded-xl bg-[#0f172a]/90 border border-slate-800">
                <div className="text-lg sm:text-xl font-black text-white">124K+</div>
                <div className="text-[11px] text-slate-400 font-medium">Keys Delivered</div>
              </div>
              <div className="p-3.5 rounded-xl bg-[#0f172a]/90 border border-slate-800">
                <div className="text-lg sm:text-xl font-black text-yellow-400">4.9 / 5.0</div>
                <div className="text-[11px] text-slate-400 font-medium">18.4k Verified Reviews</div>
              </div>
              <div className="p-3.5 rounded-xl bg-[#0f172a]/90 border border-slate-800">
                <div className="text-lg sm:text-xl font-black text-amber-400">256-Bit</div>
                <div className="text-[11px] text-slate-400 font-medium">Escrow Protected</div>
              </div>
            </div>
          </div>

          {/* Right Column: Featured Spotlight Card Carousel */}
          <div className="lg:col-span-5">
            {currentProduct && (
              <div className="relative rounded-3xl p-5 bg-[#0f172a] border border-yellow-500/30 shadow-2xl shadow-black/60 glow-hover transition-all">
                {/* Spotlight Header Bar */}
                <div className="flex items-center justify-between mb-3.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-yellow-500/15 text-yellow-400 border border-yellow-500/30 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1">
                      <Flame className="w-3 h-3 fill-[#fcb800]" />
                      Featured Spotlight
                    </span>
                    <span className="text-xs text-slate-400">
                      {activeIndex + 1} of {spotlightProducts.length}
                    </span>
                  </div>

                  {/* Manual pagination dots */}
                  <div className="flex items-center gap-1.5">
                    {spotlightProducts.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveIndex(idx)}
                        className={`h-2 rounded-full transition-all cursor-pointer ${
                          activeIndex === idx ? 'w-6 bg-[#fcb800]' : 'w-2 bg-slate-700 hover:bg-slate-500'
                        }`}
                        title={`Slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Product Preview Visual Cover */}
                <div 
                  onClick={() => setSelectedProduct(currentProduct)}
                  className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-slate-700/60 bg-slate-950 cursor-pointer group mb-4"
                >
                  {currentProduct.cover.image ? (
                    <img 
                      src={currentProduct.cover.image} 
                      alt={currentProduct.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div 
                      className="w-full h-full flex items-center justify-center p-6 bg-[#162238]"
                    >
                      <Sparkles className="w-16 h-16 text-[#fcb800]/40" />
                    </div>
                  )}

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                  {/* Floating badges on image */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md border border-white/10 text-white font-bold text-xs flex items-center gap-1">
                      <Zap className="w-3 h-3 text-[#fcb800] fill-[#fcb800]" />
                      {currentProduct.deliveryType === 'INSTANT_KEY' ? 'Instant License Key' : currentProduct.deliveryType === 'POSTAL_SHIPPING' ? 'Free Courier Dispatch' : 'Direct Download'}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                    <div>
                      <div className="text-xs text-yellow-400 font-semibold">{currentProduct.category.name}</div>
                      <div className="text-base font-bold text-white line-clamp-1">{currentProduct.title}</div>
                    </div>
                    <div className="flex items-center gap-1 bg-slate-950/90 px-2 py-1 rounded-lg border border-slate-700">
                      <Star className="w-3.5 h-3.5 text-[#fcb800] fill-[#fcb800]" />
                      <span className="text-xs font-bold text-white">{currentProduct.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Product Description Snippet */}
                <p className="text-xs text-slate-300 line-clamp-2 mb-4 leading-relaxed">
                  {currentProduct.shortDescription}
                </p>

                {/* Price and Action CTAs */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Special Offer</div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-black text-[#fcb800]">
                        {formatCurrency(currentProduct.discountPrice || currentProduct.price, currency)}
                      </span>
                      {currentProduct.discountPrice && (
                        <span className="text-xs text-slate-500 line-through">
                          {formatCurrency(currentProduct.price, currency)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedProduct(currentProduct)}
                      className="px-3 py-2 rounded-xl bg-[#1e293b] hover:bg-[#334155] text-xs font-bold text-slate-200 hover:text-white transition-all cursor-pointer border border-slate-700/60"
                    >
                      Quick Specs
                    </button>
                    <button
                      onClick={() => {
                        addToCart(currentProduct);
                        setIsCartOpen(true);
                      }}
                      className="px-4 py-2 rounded-xl bg-[#fcb800] hover:bg-[#e5a700] text-black font-extrabold text-xs shadow-md shadow-yellow-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Claim Now</span>
                      <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* 4 Pillars Trust Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800/60">
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#0f172a]/80 border border-slate-800/80">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-[#fcb800]" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Instant Automated Delivery</div>
              <div className="text-[11px] text-slate-400">Digital keys generated & delivered in &lt; 5s</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#0f172a]/80 border border-slate-800/80">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#fcb800]" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">100% Genuine Licenses</div>
              <div className="text-[11px] text-slate-400">Official vendor keys with full replacement guarantee</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#0f172a]/80 border border-slate-800/80">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5 text-[#fcb800]" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Local & Global Gateways</div>
              <div className="text-[11px] text-slate-400">JazzCash, EasyPaisa, Visa, PayPal & Crypto</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#0f172a]/80 border border-slate-800/80">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center shrink-0">
              <RefreshCw className="w-5 h-5 text-[#fcb800]" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Lifetime License Vault</div>
              <div className="text-[11px] text-slate-400">Store and re-download your codes anytime</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
