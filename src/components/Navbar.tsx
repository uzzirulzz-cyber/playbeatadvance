import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { formatCurrency } from '../lib/utils';
import { Currency, ThemePreset, UserRole } from '../types';
import { 
  Zap, 
  Search, 
  ShoppingCart, 
  Heart, 
  Key, 
  Bell, 
  Palette, 
  Store, 
  Briefcase, 
  Share2, 
  ShieldCheck, 
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
  Lock,
  Tv,
  Cpu,
  Monitor,
  Gamepad2,
  FileCode,
  CreditCard
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    cartTotalCount,
    cartFinalTotalPKR,
    favorites,
    currency,
    setCurrency,
    themePreset,
    setThemePreset,
    activeRole,
    setActiveRole,
    activeView,
    setActiveView,
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
    notifications,
    markNotificationRead,
    isAdminAuthenticated
  } = useStore();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isCurrencyMenuOpen, setIsCurrencyMenuOpen] = useState(false);
  const [isNotifMenuOpen, setIsNotifMenuOpen] = useState(false);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [isDepartmentMenuOpen, setIsDepartmentMenuOpen] = useState(false);
  const [searchCategoryFilter, setSearchCategoryFilter] = useState('all');

  const searchRef = useRef<HTMLDivElement>(null);
  const deptRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter products for quick search dropdown
  const filteredSearchProducts = searchQuery.trim()
    ? products.filter(p => {
        const matchesCategory = searchCategoryFilter === 'all' || p.categoryId === searchCategoryFilter;
        const matchesQuery = 
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
          p.category.name.toLowerCase().includes(searchQuery.toLowerCase());
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
    { code: 'INR', label: 'Indian Rupee', symbol: '₹' },
  ];

  const themes: { id: ThemePreset; name: string; desc: string; preview: string }[] = [
    { id: 'martfury', name: 'Martfury Yellow & Charcoal', desc: 'Signature Envato marketplace styling', preview: 'bg-[#fcb800]' },
    { id: 'obsidian', name: 'Cyber Obsidian', desc: 'Midnight slate with electric indigo glow', preview: 'bg-indigo-600' },
    { id: 'titanium', name: 'Titanium Light', desc: 'Crisp porcelain with high-contrast slate', preview: 'bg-slate-200 border border-slate-400' },
    { id: 'cyberpunk', name: 'Neon Cyberpunk', desc: 'Deep violet with magenta & neon pink glow', preview: 'bg-pink-500' },
    { id: 'emerald', name: 'Emerald FinTech', desc: 'Midnight emerald with luminous mint glow', preview: 'bg-emerald-500' },
  ];

  const roles: { role: UserRole; view: typeof activeView; label: string; icon: React.ElementType; badge?: string }[] = [
    { role: 'CUSTOMER', view: 'storefront', label: 'Storefront (Customer)', icon: Store },
    { role: 'VENDOR', view: 'vendor', label: 'Vendor Studio', icon: Briefcase, badge: 'Partner' },
    { role: 'AFFILIATE', view: 'affiliate', label: 'Affiliate Hub', icon: Share2, badge: 'Earn' },
  ];

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
      if (deptRef.current && !deptRef.current.contains(e.target as Node)) {
        setIsDepartmentMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#111827] border-b border-slate-800 shadow-md transition-colors duration-300">
      
      {/* 1. Top micro-announcement & utility bar */}
      <div className="w-full bg-[#0b0f19] border-b border-slate-800/80 px-4 py-1.5 text-xs text-slate-300">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400">Welcome to <strong className="text-white font-bold">PlayBeat Digital</strong> (<code className="text-[#fcb800] font-mono">playbeat.digital</code>)</span>
            <span className="hidden lg:inline text-slate-500">•</span>
            <span className="hidden lg:inline text-slate-400">Use promo <code className="px-1.5 py-0.5 rounded bg-amber-400/20 text-[#fcb800] font-mono font-bold border border-amber-400/30">PLAYBEAT20</code> for 20% OFF</span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-[11px] text-slate-300">
            {/* WhatsApp Contact */}
            <a
              href="https://wa.me/923321029333"
              target="_blank"
              rel="noreferrer"
              title="Official WhatsApp Support"
              className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30"
            >
              <PhoneCall className="w-3 h-3 text-emerald-400" />
              <span className="font-semibold">0332 102 9333</span>
            </a>

            {/* License Vault */}
            <button 
              onClick={() => setIsOrderLookupOpen(true)}
              className="hover:text-[#fcb800] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Key className="w-3 h-3 text-emerald-400" />
              <span>Track License</span>
            </button>

            {/* 24/7 Live Desk */}
            <button 
              onClick={() => setIsSupportOpen(true)}
              className="hover:text-[#fcb800] transition-colors hidden sm:flex items-center gap-1 cursor-pointer"
            >
              <Headphones className="w-3 h-3 text-[#fcb800]" />
              <span>24/7 Support</span>
            </button>

            {/* Currency Menu */}
            <div className="relative">
              <button
                onClick={() => setIsCurrencyMenuOpen(!isCurrencyMenuOpen)}
                className="flex items-center gap-1 font-bold text-slate-200 hover:text-[#fcb800] transition-colors cursor-pointer"
              >
                <span className="text-[#fcb800]">{currencies.find(c => c.code === currency)?.symbol}</span>
                <span>{currency}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isCurrencyMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-44 p-1.5 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl z-50">
                  <div className="px-2 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Select Currency
                  </div>
                  <div className="space-y-0.5 mt-0.5">
                    {currencies.map(c => (
                      <button
                        key={c.code}
                        onClick={() => {
                          setCurrency(c.code);
                          setIsCurrencyMenuOpen(false);
                        }}
                        className={`w-full px-2.5 py-1.5 rounded-lg flex items-center justify-between text-xs transition-colors ${
                          currency === c.code 
                            ? 'bg-[#fcb800] text-slate-950 font-bold' 
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="w-5 font-mono">{c.symbol}</span>
                          <span>{c.code}</span>
                        </div>
                        {currency === c.code && <Check className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Theme Selector */}
            <div className="relative">
              <button
                onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                title="Change UI Theme Preset"
                className="p-1 text-slate-300 hover:text-[#fcb800] transition-colors cursor-pointer"
              >
                <Palette className="w-3.5 h-3.5 text-[#fcb800]" />
              </button>

              {isThemeMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 p-2 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl z-50">
                  <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    <span>UI Theme Preset</span>
                    <Sparkles className="w-3.5 h-3.5 text-[#fcb800]" />
                  </div>
                  <div className="space-y-1 mt-1">
                    {themes.map(t => (
                      <button
                        key={t.id}
                        onClick={() => {
                          setThemePreset(t.id);
                          setIsThemeMenuOpen(false);
                        }}
                        className={`w-full p-2 rounded-xl flex items-center gap-2.5 text-left transition-all ${
                          themePreset === t.id 
                            ? 'bg-[#fcb800]/20 border border-[#fcb800] text-white font-semibold' 
                            : 'hover:bg-slate-800/80 text-slate-300 border border-transparent'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full ${t.preview} shadow-sm shrink-0 flex items-center justify-center`}>
                          {themePreset === t.id && <Check className="w-3 h-3 text-slate-950" />}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">{t.name}</div>
                          <div className="text-[10px] text-slate-400 leading-tight">{t.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* 2. Main Martfury Header (Logo + Integrated Search + Actions) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              setActiveView('storefront');
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="flex items-center gap-2.5 group text-left cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-[#fcb800] p-0.5 shadow-lg shadow-amber-400/20 group-hover:shadow-amber-400/40 transition-all duration-300 flex items-center justify-center">
              <Zap className="w-6 h-6 text-slate-950 fill-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-black text-2xl tracking-tight text-white">
                  PLAYBEAT
                </span>
                <span className="font-black text-2xl tracking-tight text-[#fcb800]">
                  DIGITAL
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono tracking-wider block mt-0.5">
                playbeat.digital
              </span>
            </div>
          </button>
        </div>

        {/* Martfury Universal Search Bar */}
        <div ref={searchRef} className="relative flex-1 max-w-2xl hidden md:block">
          <div className="flex items-stretch rounded-xl overflow-hidden border-2 border-[#fcb800] bg-slate-950 shadow-inner">
            
            {/* Category select prefix */}
            <select
              value={searchCategoryFilter}
              onChange={(e) => setSearchCategoryFilter(e.target.value)}
              className="bg-slate-900 text-xs font-semibold text-slate-200 px-3 py-2 border-r border-slate-700 outline-none cursor-pointer hover:bg-slate-800"
            >
              <option value="all">All Categories</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            {/* Input field */}
            <div className="relative flex-1 flex items-center">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="I'm shopping for Netflix 4K, Projectors, GPT AI, Steam keys..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                className="w-full h-10 px-3 text-sm text-slate-100 placeholder-slate-400 bg-transparent outline-none"
              />
              {searchQuery && (
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setIsSearchOpen(false);
                  }}
                  className="mr-2 text-slate-400 hover:text-white p-0.5 rounded-full hover:bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Martfury Yellow Action Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="px-5 bg-[#fcb800] hover:bg-[#e0a400] text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
          </div>

          {/* Autocomplete dropdown */}
          {isSearchOpen && searchQuery.trim() && (
            <div className="absolute top-full left-0 right-0 mt-2 p-2 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between border-b border-slate-800 pb-1.5">
                <span>Matching Products ({filteredSearchProducts.length})</span>
                <span className="text-[#fcb800]">Esc to close</span>
              </div>
              
              {filteredSearchProducts.length > 0 ? (
                <div className="space-y-1 mt-1">
                  {filteredSearchProducts.map(product => (
                    <button
                      key={product.id}
                      onClick={() => {
                        setSelectedProduct(product);
                        setIsSearchOpen(false);
                      }}
                      className="w-full px-3 py-2 rounded-xl flex items-center justify-between hover:bg-slate-800 transition-colors text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-[#fcb800] shrink-0 font-bold text-xs">
                          {product.type === 'HARDWARE' ? '4K' : product.type === 'STREAMING' ? 'TV' : 'AI'}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white group-hover:text-[#fcb800] transition-colors line-clamp-1">
                            {product.title}
                          </div>
                          <div className="text-xs text-slate-400">
                            {product.category.name} • {product.vendor.storeName}
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-sm font-bold text-[#fcb800]">
                          {formatCurrency(product.discountPrice || product.price, currency)}
                        </div>
                        {product.discountPrice && (
                          <div className="text-[10px] text-slate-500 line-through">
                            {formatCurrency(product.price, currency)}
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-6 text-center text-sm text-slate-400">
                  No matching products found for "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Hotline / Support Desk Badge */}
          <div className="hidden xl:flex items-center gap-2 text-left">
            <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[#fcb800]">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-medium uppercase">24/7 Hotline Desk</div>
              <div className="text-xs font-bold text-white">support@playbeat.digital</div>
            </div>
          </div>

          {/* Portal Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 hover:border-[#fcb800]/50 text-xs font-semibold text-slate-200 hover:text-white transition-all cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-[#fcb800]" />
              <span className="hidden sm:inline">
                {roles.find(r => r.view === activeView)?.label.split(' ')[0] || 'View'}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isRoleMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 p-2 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl z-50">
                <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Switch Workspace
                </div>
                <div className="space-y-1 mt-1">
                  {roles.map(r => {
                    const Icon = r.icon;
                    const isCurrent = activeView === r.view;
                    return (
                      <button
                        key={r.role}
                        onClick={() => {
                          setActiveRole(r.role);
                          setActiveView(r.view);
                          setIsRoleMenuOpen(false);
                        }}
                        className={`w-full px-2.5 py-2 rounded-xl flex items-center justify-between text-xs font-medium transition-all ${
                          isCurrent 
                            ? 'bg-[#fcb800] text-slate-950 font-black shadow-md' 
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className={`w-4 h-4 ${isCurrent ? 'text-slate-950' : 'text-[#fcb800]'}`} />
                          <span>{r.label}</span>
                        </div>
                        {r.badge && (
                          <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                            isCurrent ? 'bg-slate-950 text-[#fcb800]' : 'bg-slate-800 text-amber-300 border border-amber-500/30'
                          }`}>
                            {r.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsNotifMenuOpen(!isNotifMenuOpen)}
              className="relative p-2 rounded-xl bg-slate-800 border border-slate-700 hover:border-[#fcb800]/50 text-slate-300 hover:text-white transition-all cursor-pointer"
            >
              <Bell className="w-4 h-4 text-amber-400" />
              {unreadNotifsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-extrabold flex items-center justify-center ring-2 ring-slate-950 animate-pulse">
                  {unreadNotifsCount}
                </span>
              )}
            </button>

            {isNotifMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 p-2.5 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl z-50">
                <div className="px-2 py-1 text-xs font-bold text-white flex items-center justify-between border-b border-slate-800 pb-2">
                  <span>Notifications & Alerts</span>
                  <span className="text-[10px] text-[#fcb800]">{unreadNotifsCount} unread</span>
                </div>
                <div className="space-y-1.5 mt-2 max-h-64 overflow-y-auto pr-1">
                  {notifications.map(n => (
                    <div 
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`p-2.5 rounded-xl text-xs transition-colors cursor-pointer ${
                        n.read ? 'bg-slate-900/30 text-slate-400' : 'bg-amber-950/30 border border-amber-500/20 text-slate-200'
                      }`}
                    >
                      <div className="font-semibold text-white flex items-center justify-between">
                        <span>{n.title}</span>
                        <span className="text-[10px] text-slate-500">{n.createdAt}</span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-1 leading-snug">{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={() => setIsWishlistOpen(true)}
            title="Wishlist & Favorites"
            className="relative p-2 rounded-xl bg-slate-800 border border-slate-700 hover:border-pink-500/50 text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <Heart className={`w-4 h-4 ${favorites.length > 0 ? 'text-pink-500 fill-pink-500' : 'text-slate-400'}`} />
            {favorites.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-pink-600 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-slate-950">
                {favorites.length}
              </span>
            )}
          </button>

          {/* Martfury Signature Yellow Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-[#fcb800] hover:bg-[#e0a400] text-slate-950 shadow-lg shadow-amber-400/20 font-black text-xs transition-all transform hover:scale-[1.02] cursor-pointer"
          >
            <div className="relative">
              <ShoppingCart className="w-4 h-4 text-slate-950" />
              {cartTotalCount > 0 && (
                <span className="absolute -top-2 -right-2.5 min-w-[18px] h-[18px] rounded-full bg-slate-950 text-[#fcb800] text-[10px] font-black flex items-center justify-center px-1 border border-[#fcb800]">
                  {cartTotalCount}
                </span>
              )}
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-[10px] uppercase font-bold text-slate-800 leading-tight">My Cart</div>
              <div className="text-xs font-black text-slate-950 leading-tight">
                {cartTotalCount === 0 ? '0 Items' : formatCurrency(cartFinalTotalPKR, currency)}
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* 3. Martfury Secondary Department & Navigation Bar */}
      <div className="w-full bg-[#1e293b] border-t border-slate-800 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          
          {/* Shop By Department Dropdown button */}
          <div ref={deptRef} className="relative">
            <button
              onClick={() => setIsDepartmentMenuOpen(!isDepartmentMenuOpen)}
              className="flex items-center gap-2.5 px-4 py-3 bg-[#fcb800] text-slate-950 font-black text-xs uppercase tracking-wider hover:bg-[#e0a400] transition-colors cursor-pointer"
            >
              <Menu className="w-4 h-4" />
              <span>SHOP BY DEPARTMENT</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {isDepartmentMenuOpen && (
              <div className="absolute top-full left-0 w-64 bg-slate-900 border border-slate-700 shadow-2xl z-50 py-2">
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setActiveView('storefront');
                    setIsDepartmentMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-xs font-bold text-white hover:bg-slate-800 hover:text-[#fcb800] transition-colors flex items-center justify-between"
                >
                  <span>All Marketplace Categories</span>
                  <ArrowRight className="w-3 h-3 text-slate-500" />
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setActiveView('storefront');
                      setIsDepartmentMenuOpen(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-xs font-medium transition-colors flex items-center justify-between ${
                      selectedCategory === cat.id ? 'bg-[#fcb800]/20 text-[#fcb800] font-bold' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">({cat.productCount})</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Center Navigation Links */}
          <nav className="flex items-center gap-1 lg:gap-3 text-xs font-semibold text-slate-300">
            <button
              onClick={() => {
                setActiveView('storefront');
                setSelectedCategory('all');
              }}
              className={`px-3 py-3 hover:text-[#fcb800] transition-colors cursor-pointer ${
                activeView === 'storefront' && selectedCategory === 'all' ? 'text-[#fcb800] border-b-2 border-[#fcb800]' : ''
              }`}
            >
              Home
            </button>

            <button
              onClick={() => {
                setActiveView('storefront');
                setSelectedCategory('games');
              }}
              className={`px-3 py-3 hover:text-[#fcb800] transition-colors cursor-pointer ${
                activeView === 'storefront' && selectedCategory === 'games' ? 'text-[#fcb800] border-b-2 border-[#fcb800]' : ''
              }`}
            >
              Games
            </button>

            <button
              onClick={() => {
                setActiveView('storefront');
                setSelectedCategory('gift-cards');
              }}
              className={`px-3 py-3 hover:text-[#fcb800] transition-colors cursor-pointer ${
                activeView === 'storefront' && selectedCategory === 'gift-cards' ? 'text-[#fcb800] border-b-2 border-[#fcb800]' : ''
              }`}
            >
              Gift Cards
            </button>

            <button
              onClick={() => {
                setActiveView('storefront');
                setSelectedCategory('software-licenses');
              }}
              className={`px-3 py-3 hover:text-[#fcb800] transition-colors cursor-pointer ${
                activeView === 'storefront' && selectedCategory === 'software-licenses' ? 'text-[#fcb800] border-b-2 border-[#fcb800]' : ''
              }`}
            >
              Software
            </button>

            <button
              onClick={() => {
                setActiveView('storefront');
                setSelectedCategory('ai-tools');
              }}
              className={`px-3 py-3 hover:text-[#fcb800] transition-colors cursor-pointer ${
                activeView === 'storefront' && selectedCategory === 'ai-tools' ? 'text-[#fcb800] border-b-2 border-[#fcb800]' : ''
              }`}
            >
              AI Tools
            </button>

            <button
              onClick={() => {
                setActiveView('storefront');
                setSelectedCategory('streaming');
              }}
              className={`px-3 py-3 hover:text-[#fcb800] transition-colors cursor-pointer ${
                activeView === 'storefront' && selectedCategory === 'streaming' ? 'text-[#fcb800] border-b-2 border-[#fcb800]' : ''
              }`}
            >
              Subscriptions
            </button>

            <button
              onClick={() => {
                setActiveView('storefront');
                setSelectedCategory('smart-projectors');
              }}
              className={`px-3 py-3 hover:text-[#fcb800] transition-colors cursor-pointer text-amber-300 font-bold ${
                activeView === 'storefront' && selectedCategory === 'smart-projectors' ? 'text-[#fcb800] border-b-2 border-[#fcb800]' : ''
              }`}
            >
              Best Value
            </button>

            <button
              onClick={() => {
                setActiveView('storefront');
                setSelectedCategory('all');
              }}
              className={`px-3 py-3 hover:text-[#fcb800] transition-colors cursor-pointer text-pink-400 font-bold`}
            >
              Trending
            </button>

            <button
              onClick={() => {
                setActiveRole('VENDOR');
                setActiveView('vendor');
              }}
              className={`px-3 py-3 hover:text-[#fcb800] transition-colors cursor-pointer ${
                activeView === 'vendor' ? 'text-[#fcb800] border-b-2 border-[#fcb800]' : ''
              }`}
            >
              Vendor Studio
            </button>

            <button
              onClick={() => {
                setActiveRole('AFFILIATE');
                setActiveView('affiliate');
              }}
              className={`px-3 py-3 hover:text-[#fcb800] transition-colors cursor-pointer ${
                activeView === 'affiliate' ? 'text-[#fcb800] border-b-2 border-[#fcb800]' : ''
              }`}
            >
              Affiliate Hub
            </button>
          </nav>

          {/* Right Escrow Tag */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-400 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>256-Bit Escrow Vault</span>
          </div>

        </div>
      </div>

    </header>
  );
};
