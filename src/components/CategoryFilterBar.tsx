import React from 'react';
import { useStore } from '../store/useStore';
import { 
  Sparkles, 
  Tv, 
  KeyRound, 
  RefreshCw, 
  Gamepad2, 
  Gift, 
  LayoutTemplate, 
  CreditCard, 
  Grid,
  SlidersHorizontal,
  ArrowUpDown,
  Filter,
  X,
  Projector
} from 'lucide-react';

export const CategoryFilterBar: React.FC = () => {
  const {
    categories,
    selectedCategory,
    setSelectedCategory,
    selectedType,
    setSelectedType,
    sortBy,
    setSortBy,
    searchQuery,
    setSearchQuery,
    products
  } = useStore();

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Tv': return Tv;
      case 'Projector': return Projector;
      case 'Sparkles': return Sparkles;
      case 'KeyRound': return KeyRound;
      case 'RefreshCw': return RefreshCw;
      case 'Gamepad2': return Gamepad2;
      case 'Gift': return Gift;
      case 'LayoutTemplate': return LayoutTemplate;
      case 'CreditCard': return CreditCard;
      default: return Grid;
    }
  };

  const productTypes = [
    { value: 'ALL', label: 'All Product Types' },
    { value: 'HARDWARE', label: 'Smart Projectors & Cinema' },
    { value: 'STREAMING', label: 'Streaming Passes' },
    { value: 'AI_TOOL', label: 'AI Tools & Suites' },
    { value: 'SOFTWARE_LICENSE', label: 'Software Licenses' },
    { value: 'SAAS_SUBSCRIPTION', label: 'SaaS Subscriptions' },
    { value: 'GAME', label: 'Games & Steam Keys' },
    { value: 'GIFT_CARD', label: 'Digital Gift Cards' },
    { value: 'TEMPLATE', label: 'Templates & Code' },
  ];

  const sortOptions = [
    { value: 'popular', label: 'Most Popular' },
    { value: 'newest', label: 'Newest Arrivals' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
  ];

  const hasActiveFilters = selectedCategory !== 'all' || selectedType !== 'ALL' || searchQuery.trim() !== '';

  return (
    <div className="w-full space-y-4 pt-6 pb-2">
      {/* Category Pill Slider */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none scroll-smooth">
        {categories.map(cat => {
          const Icon = getCategoryIcon(cat.icon);
          const isSelected = selectedCategory === cat.slug;
          
          // count products in category
          const count = cat.slug === 'all' 
            ? products.length 
            : products.filter(p => p.category.slug === cat.slug).length;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl shrink-0 text-xs font-bold transition-all cursor-pointer border ${
                isSelected
                  ? 'bg-blue-700 text-white border-yellow-400 shadow-lg shadow-blue-700/30 scale-[1.02]'
                  : 'bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-800'
              }`}
            >
              <div 
                className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                  isSelected ? 'bg-white/20' : 'bg-slate-800 text-yellow-400'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>
              <span>{cat.name}</span>
              
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                isSelected ? 'bg-blue-800 text-white' : 'bg-slate-800 text-slate-400'
              }`}>
                {count}
              </span>

              {cat.badge && (
                <span className="px-1.5 py-0.2 rounded-full bg-pink-500 text-white text-[9px] font-black uppercase">
                  {cat.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Filter and Sorting Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/50 border border-slate-800/80">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Product Type dropdown */}
          <div className="relative">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="h-9 px-3 pr-8 rounded-xl bg-slate-950/80 border border-slate-700/60 text-xs font-semibold text-slate-200 focus:outline-none focus:border-yellow-500 cursor-pointer appearance-none"
            >
              {productTypes.map(t => (
                <option key={t.value} value={t.value} className="bg-slate-900 text-slate-200">
                  {t.label}
                </option>
              ))}
            </select>
            <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Sort By Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="h-9 px-3 pr-8 rounded-xl bg-slate-950/80 border border-slate-700/60 text-xs font-semibold text-slate-200 focus:outline-none focus:border-yellow-500 cursor-pointer appearance-none"
            >
              {sortOptions.map(s => (
                <option key={s.value} value={s.value} className="bg-slate-900 text-slate-200">
                  {s.label}
                </option>
              ))}
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Reset Filters button */}
          {hasActiveFilters && (
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedType('ALL');
                setSearchQuery('');
              }}
              className="h-9 px-3 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 text-pink-400 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Live filtered count feedback */}
        <div className="text-xs font-medium text-slate-400 flex items-center gap-2">
          <span>Showing products</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="text-emerald-400 font-bold">Live Inventory</span>
        </div>
      </div>
    </div>
  );
};
