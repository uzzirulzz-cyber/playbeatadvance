import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { formatCurrency } from '../lib/utils';
import { Currency, ThemePreset, UserRole } from '../types';
import { 
  Search, 
  ShoppingCart, 
  Heart, 
  Bell, 
  Gamepad2,
  Zap,
  Menu,
  X,
  ChevronDown,
  Check,
  Lock,
  PhoneCall,
  Headphones,
} from 'lucide-react';

export const NavbarPremium: React.FC = () => {
  const {
    cartTotalCount,
    cartFinalTotalPKR,
    favorites,
    currency,
    setCurrency,
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
  } = useStore();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter products for quick search
  const filteredSearchProducts = searchQuery.trim()
    ? products.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 5)
    : [];

  const unreadNotifs = notifications.filter(n => !n.read).length;

  const currencies: { code: Currency; label: string; symbol: string }[] = [
    { code: 'PKR', label: 'Pakistani Rupee', symbol: '₨' },
    { code: 'USD', label: 'US Dollar', symbol: '$' },
    { code: 'EUR', label: 'Euro', symbol: '€' },
    { code: 'GBP', label: 'British Pound', symbol: '£' },
  ];

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navigationLinks = [
    { label: 'Home', category: 'all' },
    { label: 'Gaming', category: 'games' },
    { label: 'Software', category: 'software-licenses' },
    { label: 'Gift Cards', category: 'gift-cards' },
    { label: 'Subscriptions', category: 'streaming' },
    { label: 'Digital Marketing', category: 'all' },
    { label: 'Web Hosting', category: 'all' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#07182d] border-b-2 border-[#0f2342] shadow-sm transition-all duration-300">
      
      {/* Top announcement bar */}
      <div className="w-full bg-[#0B1F3A] border-b border-[#132e53] px-4 py-2 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-200 font-medium">
              Welcome to <strong className="text-white">PlayBeat Digital</strong> - Premium Digital Marketplace
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-300">
            <a href="tel:+923321029333" className="flex items-center gap-1.5 hover:text-[#FFD21F] transition-colors">
              <PhoneCall className="w-3.5 h-3.5" />
              <span className="hidden sm:inline font-semibold">+92 332 102 9333</span>
            </a>
            <button onClick={() => setIsSupportOpen(true)} className="flex items-center gap-1 hover:text-[#FFD21F] transition-colors">
              <Headphones className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">24/7 Support</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4 bg-[#07182d]">
        
        {/* Logo */}
        <button
          onClick={() => {
            setActiveView('storefront');
            setSelectedCategory('all');
            setSearchQuery('');
          }}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <div className="w-10 h-10 rounded-lg bg-[#0B1F3A] flex items-center justify-center shadow-md hover:shadow-lg transition-all">
            <Zap className="w-6 h-6 text-[#FFD21F]" />
          </div>
          <div className="hidden sm:block text-left">
            <div className="font-black text-[#0B1F3A] text-lg leading-none">
              PLAYBEAT
            </div>
            <div className="text-[10px] text-[#6B7280] font-semibold tracking-wider">
              DIGITAL
            </div>
          </div>
        </button>

        {/* Search bar - hidden on mobile */}
        <div ref={searchRef} className="relative flex-1 max-w-2xl hidden md:block">
          <div className="flex items-stretch rounded-lg overflow-hidden border-2 border-[#0B1F3A] bg-[#F4F6F8] shadow-sm hover:shadow-md transition-shadow">
            
            {/* Category select */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent text-xs font-semibold text-[#0B1F3A] px-3 py-2 border-r border-[#E2E6EB] outline-none cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            {/* Input */}
            <div className="relative flex-1 flex items-center">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search products, games, software..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                className="w-full h-10 px-3 text-sm text-[#263241] placeholder-[#9CA3AF] bg-transparent outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setIsSearchOpen(false);
                  }}
                  className="mr-2 text-[#6B7280] hover:text-[#0B1F3A] p-1 rounded-full hover:bg-[#E2E6EB] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Search button */}
            <button className="px-4 bg-[#FFD21F] hover:bg-[#FFC400] text-[#0B1F3A] font-bold text-xs transition-colors flex items-center gap-2">
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>

          {/* Search dropdown */}
          {isSearchOpen && searchQuery.trim() && (
            <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-white rounded-lg border border-[#E2E6EB] shadow-lg z-50">
              <div className="px-3 py-1.5 text-[10px] font-bold text-[#6B7280] uppercase tracking-wider border-b border-[#E2E6EB] pb-1">
                Matching Products ({filteredSearchProducts.length})
              </div>
              {filteredSearchProducts.length > 0 ? (
                <div className="space-y-1 mt-1">
                  {filteredSearchProducts.map(p => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setSelectedProduct(p);
                        setIsSearchOpen(false);
                      }}
                      className="w-full px-3 py-2 rounded-lg flex items-center gap-3 hover:bg-[#F4F6F8] transition-colors text-left"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#FFD21F]/10 flex items-center justify-center text-[#FFD21F] font-bold text-xs shrink-0">
                        ♦
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-[#0B1F3A] truncate hover:text-[#FFD21F]">
                          {p.title}
                        </div>
                        <div className="text-xs text-[#6B7280]">
                          {p.category.name}
                        </div>
                      </div>
                      <div className="text-right shrink-0 font-bold text-[#FFD21F]">
                        {formatCurrency(p.discountPrice || p.price, currency)}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-6 text-center text-sm text-[#6B7280]">
                  No products found
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* Currency selector */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-[#0B1F3A] hover:bg-[#F4F6F8] rounded-lg transition-colors"
            >
              <span className="text-[#FFD21F]">
                {currencies.find(c => c.code === currency)?.symbol}
              </span>
              <span>{currency}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {isCurrencyOpen && (
              <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-lg border border-[#E2E6EB] shadow-lg z-50 p-1">
                {currencies.map(c => (
                  <button
                    key={c.code}
                    onClick={() => {
                      setCurrency(c.code);
                      setIsCurrencyOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-sm text-left rounded-lg flex items-center justify-between transition-colors ${
                      currency === c.code
                        ? 'bg-[#FFD21F] text-[#0B1F3A] font-bold'
                        : 'text-[#263241] hover:bg-[#F4F6F8]'
                    }`}
                  >
                    <span>{c.symbol} {c.code}</span>
                    {currency === c.code && <Check className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="p-2 hover:bg-[#F4F6F8] rounded-lg transition-colors relative"
            >
              <Bell className="w-5 h-5 text-[#0B1F3A]" />
              {unreadNotifs > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadNotifs}
                </span>
              )}
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg border border-[#E2E6EB] shadow-lg z-50 p-3">
                <div className="text-sm font-bold text-[#0B1F3A] border-b border-[#E2E6EB] pb-2">
                  Notifications
                </div>
                <div className="space-y-1 mt-2 max-h-64 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map(n => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`p-2 rounded-lg text-xs cursor-pointer transition-colors ${
                          n.read ? 'bg-[#F4F6F8] text-[#6B7280]' : 'bg-[#FFD21F]/10 text-[#263241]'
                        }`}
                      >
                        <div className="font-semibold">{n.title}</div>
                        <div className="text-[11px] mt-0.5">{n.message}</div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-[#6B7280] py-4">No notifications</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Wishlist */}
          <button
            onClick={() => setIsWishlistOpen(true)}
            className="p-2 hover:bg-[#F4F6F8] rounded-lg transition-colors relative"
            title="Wishlist"
          >
            <Heart className={`w-5 h-5 ${favorites.length > 0 ? 'fill-red-500 text-red-500' : 'text-[#0B1F3A]'}`} />
            {favorites.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {favorites.length}
              </span>
            )}
          </button>

          {/* Cart - main CTA */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#FFD21F] hover:bg-[#FFC400] text-[#0B1F3A] font-bold text-sm rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-[1.02]"
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5" />
              {cartTotalCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartTotalCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline">
              {cartTotalCount === 0 ? 'Cart' : formatCurrency(cartFinalTotalPKR, currency)}
            </span>
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 hover:bg-[#F4F6F8] rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 text-[#0B1F3A]" />
            ) : (
              <Menu className="w-5 h-5 text-[#0B1F3A]" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation bar - desktop */}
      <nav className="hidden md:flex max-w-7xl mx-auto px-4 sm:px-6 py-0 border-t border-[#132e53] bg-[#07182d]">
        {navigationLinks.map((link) => (
          <button
            key={link.category}
            onClick={() => {
              setActiveView('storefront');
              setSelectedCategory(link.category);
            }}
            className={`px-4 py-3 font-semibold text-sm border-b-2 transition-colors ${
              selectedCategory === link.category
                ? 'border-[#FFD21F] text-[#FFD21F]'
                : 'border-transparent text-slate-300 hover:text-white'
            }`}
          >
            {link.label}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-1.5 py-3 text-xs text-slate-300">
          <Lock className="w-3.5 h-3.5" />
          <span>256-Bit Secure</span>
        </div>
      </nav>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-[#132e53] bg-[#07182d] p-4 space-y-2">
          <div className="px-3 py-1.5 text-xs font-bold text-slate-300 uppercase">Categories</div>
          {navigationLinks.map((link) => (
            <button
              key={link.category}
              onClick={() => {
                setActiveView('storefront');
                setSelectedCategory(link.category);
                setIsMobileMenuOpen(false);
              }}
              className="w-full px-3 py-2 text-left text-sm font-medium text-slate-200 hover:bg-[#0B1F3A] rounded-lg transition-colors"
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
