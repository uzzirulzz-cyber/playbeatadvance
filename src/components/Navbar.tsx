import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Currency, ThemePreset } from '../types';
import { 
  Search, 
  ShoppingCart, 
  Heart, 
  Bell, 
  Palette, 
  Sparkles,
  ChevronDown,
  X,
  Check,
  Headphones,
  SlidersHorizontal,
  Layers,
  ArrowRight,
  Menu,
  PhoneCall,
  User as UserIcon,
  ShoppingBag,
  Key,
  ShieldCheck,
  Flame,
  Clock,
  Sparkle,
  Tv
} from 'lucide-react';
import { MegaMenu } from './MegaMenu';

export const Navbar: React.FC = () => {
  const {
    cartTotalCount,
    favorites,
    currency,
    setCurrency,
    themePreset,
    setThemePreset,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    categories,
    products,
    setSelectedProduct,
    setIsCartOpen,
    setIsWishlistOpen,
    setIsOrderLookupOpen,
    setIsSupportOpen,
    setIsAuthModalOpen,
    setIsCustomerDashboardOpen,
    notifications,
    markNotificationRead,
    isAdminAuthenticated,
    isCustomerLoggedIn,
    user,
    formatPKR
  } = useStore();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isCurrencyMenuOpen, setIsCurrencyMenuOpen] = useState(false);
  const [isNotifMenuOpen, setIsNotifMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [searchCategoryFilter, setSearchCategoryFilter] = useState('all');

  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter products for quick search dropdown
  const filteredSearchProducts = searchQuery.trim()
    ? products.filter(p => {
        const matchesCategory = searchCategoryFilter === 'all' || p.category?.slug === searchCategoryFilter;
        const matchesQuery = 
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (p.category?.name && p.category.name.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesQuery;
      }).slice(0, 5)
    : [];

  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  const currencies: { code: Currency; label: string; symbol: string }[] = [
    { code: 'PKR', label: 'Pakistani Rupee', symbol: '₨' },
    { code: 'USD', label: 'US Dollar', symbol: '$' },
    { code: 'EUR', label: 'Euro', symbol: '€' },
    { code: 'GBP', label: 'British Pound', symbol: '£' },
    { code: 'AED', label: 'UAE Dirham', symbol: 'AED' },
    { code: 'SAR', label: 'Saudi Riyal', symbol: 'SAR' },
  ];

  const themes: { id: ThemePreset; name: string; desc: string; preview: string }[] = [
    { id: 'martfury', name: 'Martfury Yellow', desc: 'Envato signature marketplace', preview: 'bg-[#fcb800]' },
    { id: 'obsidian', name: 'Cyber Obsidian', desc: 'Midnight slate with electric indigo glow', preview: 'bg-indigo-600' },
    { id: 'titanium', name: 'Titanium Light', desc: 'Crisp porcelain with high-contrast slate', preview: 'bg-slate-200 border border-slate-400' },
    { id: 'cyberpunk', name: 'Neon Cyberpunk', desc: 'Deep violet with magenta & neon glow', preview: 'bg-pink-500' },
    { id: 'emerald', name: 'Emerald FinTech', desc: 'Midnight emerald with luminous mint glow', preview: 'bg-emerald-500' },
  ];

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0b1120] border-b border-slate-800 shadow-xl">
      
      {/* 1. Top micro-announcement bar */}
      <div className="w-full bg-[#070b14] border-b border-slate-800/80 px-4 py-1.5 text-xs text-slate-300">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400">
              Welcome to <strong className="text-white font-bold">PlayBeat Digital</strong> (<code className="text-[#fcb800] font-mono">playbeat.digital</code>)
            </span>
            <span className="hidden lg:inline text-slate-500">•</span>
            <span className="hidden lg:inline text-slate-400">
              Coupon <code className="px-1.5 py-0.5 rounded bg-yellow-400/10 text-[#fcb800] font-mono font-bold border border-yellow-400/20">PLAYBEAT20</code> for 20% OFF
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-[11px] text-slate-300">
            {/* WhatsApp Contact */}
            <a
              href="https://wa.me/923321029333"
              target="_blank"
              rel="noreferrer"
              title="Official WhatsApp Support"
              className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors bg-emerald-950/40 px-2 py-0.5 rounded-lg border border-emerald-500/30"
            >
              <PhoneCall className="w-3 h-3" />
              <span className="font-mono font-bold">+92 332 1029333</span>
            </a>

            {/* Currency Selector */}
            <div className="relative">
              <button
                onClick={() => setIsCurrencyMenuOpen(!isCurrencyMenuOpen)}
                className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer py-0.5"
              >
                <span className="font-mono font-bold text-[#fcb800]">{currency}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isCurrencyMenuOpen && (
                <div className="absolute right-0 mt-1 w-44 bg-[#070b14] border border-slate-800 rounded-xl shadow-xl z-50 p-1 space-y-0.5">
                  {currencies.map(c => (
                    <button
                      key={c.code}
                      onClick={() => {
                        setCurrency(c.code);
                        setIsCurrencyMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left text-xs hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <span className="text-white font-bold">{c.code}</span>
                      <span className="text-slate-400 text-[10px]">{c.symbol}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme Preset Selector */}
            <div className="relative">
              <button
                onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer py-0.5 text-slate-400 hover:text-slate-200"
              >
                <Palette className="w-3 h-3 text-[#fcb800]" />
                <span className="capitalize">{themePreset}</span>
              </button>

              {isThemeMenuOpen && (
                <div className="absolute right-0 mt-1 w-52 bg-[#070b14] border border-slate-800 rounded-xl shadow-xl z-50 p-1 space-y-0.5">
                  {themes.map(t => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setThemePreset(t.id);
                        setIsThemeMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left text-xs hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <span className={`w-3 h-3 rounded-full ${t.preview}`} />
                      <span className="text-white font-bold">{t.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="flex items-center gap-2.5 text-left cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#fcb800] to-yellow-300 text-slate-950 flex items-center justify-center font-black text-lg shadow-lg shadow-yellow-500/20 group-hover:scale-105 transition-transform">
              PB
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg tracking-tight text-white group-hover:text-[#fcb800] transition-colors">
                  PlayBeat
                </span>
                <span className="px-1.5 py-0.2 rounded bg-yellow-400/10 text-[#fcb800] text-[10px] font-black uppercase border border-yellow-400/30">
                  Digital
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">playbeat.digital</p>
            </div>
          </button>
        </div>

        {/* Search Bar with Live Instant Autocomplete */}
        <div className="flex-1 max-w-xl relative hidden md:block" ref={searchRef}>
          <div className="relative flex items-center bg-[#070b14] rounded-2xl border border-slate-700/80 focus-within:border-[#fcb800] transition-colors overflow-hidden">
            <Search className="w-4 h-4 text-slate-400 ml-3.5 shrink-0" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search 4K Projectors, Windows 11, IPTV, ChatGPT Plus, Game Keys..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              className="w-full bg-transparent px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-1 mr-2 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {isSearchOpen && searchQuery.trim() && (
            <div className="absolute top-full left-0 w-full mt-1.5 bg-[#070b14] border border-slate-800 rounded-2xl shadow-2xl z-50 p-2 space-y-1">
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Matching Products ({filteredSearchProducts.length})
              </div>
              {filteredSearchProducts.length === 0 ? (
                <div className="px-3 py-4 text-center text-xs text-slate-400">
                  No matching products found for "{searchQuery}".
                </div>
              ) : (
                filteredSearchProducts.map(p => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedProduct(p);
                      setIsSearchOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-800/80 text-left transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-slate-900 overflow-hidden shrink-0 border border-slate-700 flex items-center justify-center">
                        {p.cover?.image ? (
                          <img src={p.cover.image} alt={p.title} className="w-full h-full object-cover" />
                        ) : (
                          <Sparkles className="w-4 h-4 text-[#fcb800]" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate">{p.title}</div>
                        <div className="text-[10px] text-slate-400">{p.category?.name}</div>
                      </div>
                    </div>
                    <div className="font-mono font-bold text-xs text-[#fcb800] shrink-0 ml-2">
                      {formatPKR(p.discountPrice || p.price)}
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Order Lookup Tracker */}
          <button
            onClick={() => setIsOrderLookupOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold border border-slate-800 transition-colors cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#fcb800]" />
            <span>Track Order</span>
          </button>

          {/* Customer Account Button */}
          <div className="relative">
            <button
              onClick={() => {
                if (isCustomerLoggedIn) {
                  setIsCustomerDashboardOpen(true);
                } else {
                  setIsAuthModalOpen(true);
                }
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-200 cursor-pointer transition-colors"
            >
              <UserIcon className="w-4 h-4 text-[#fcb800]" />
              <span className="hidden lg:inline">{isCustomerLoggedIn ? (user.name.split(' ')[0]) : 'Sign In'}</span>
            </button>
          </div>

          {/* Wishlist Button */}
          <button
            onClick={() => setIsWishlistOpen(true)}
            className="relative p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white cursor-pointer transition-colors"
            title="Wishlist"
          >
            <Heart className="w-4 h-4" />
            {favorites.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-pink-500 text-white text-[9px] font-black flex items-center justify-center">
                {favorites.length}
              </span>
            )}
          </button>

          {/* Cart Drawer Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#fcb800] hover:bg-[#e5a700] text-slate-950 font-black text-xs cursor-pointer shadow-lg shadow-yellow-500/20 transition-transform active:scale-95"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="font-mono">{cartTotalCount}</span>
          </button>

        </div>

      </div>

      {/* 3. Secondary Navigation & Mega Menu Bar */}
      <div className="w-full bg-[#070b14] border-t border-slate-800/80 px-4 py-2 relative">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          
          <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar py-1">
            {/* Mega Menu Toggle */}
            <button
              onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
              onMouseEnter={() => setIsMegaMenuOpen(true)}
              className="flex items-center gap-2 font-black text-[#fcb800] hover:text-yellow-300 transition-colors cursor-pointer shrink-0"
            >
              <Menu className="w-4 h-4" />
              <span>ALL CATEGORIES</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {/* Quick Category links */}
            {[
              { label: 'Smart Projectors', slug: 'smart-projectors', icon: Tv },
              { label: 'Software Licenses', slug: 'software-licenses', icon: Key },
              { label: 'IPTV 4K Ultra', slug: 'streaming-iptv', icon: Sparkles },
              { label: 'AI Tools & SaaS', slug: 'ai-tools', icon: Sparkle },
              { label: 'Gaming & Gift Cards', slug: 'gaming-giftcards', icon: Flame },
            ].map(item => (
              <button
                key={item.slug}
                onClick={() => {
                  setSelectedCategory(item.slug);
                  setIsMegaMenuOpen(false);
                }}
                className={`font-bold transition-colors cursor-pointer shrink-0 ${
                  selectedCategory === item.slug
                    ? 'text-[#fcb800]'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsSupportOpen(true)}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white cursor-pointer"
            >
              <Headphones className="w-3.5 h-3.5 text-[#fcb800]" />
              <span>Live Support</span>
            </button>
          </div>

        </div>

        {/* Mega Menu Dropdown */}
        <MegaMenu
          isOpen={isMegaMenuOpen}
          onClose={() => setIsMegaMenuOpen(false)}
        />
      </div>

    </header>
  );
};
