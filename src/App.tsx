import React, { useMemo, useState, useEffect } from 'react';
import { useStore } from './store/useStore';
import { Navbar } from './components/Navbar';
import { HeroSpotlight } from './components/HeroSpotlight';
import { SmartProjectorsSection } from './components/SmartProjectorsSection';
import { CategoryFilterBar } from './components/CategoryFilterBar';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistModal } from './components/WishlistModal';
import { OrderLookupModal } from './components/OrderLookupModal';
import { VendorStudio } from './components/VendorStudio';
import { AffiliateHub } from './components/AffiliateHub';
import { AdminConsole } from './components/AdminConsole';
import { LiveSupportAssistant } from './components/LiveSupportAssistant';
import { ThemeSectionManager } from './components/ThemeSectionManager';
import { Footer } from './components/Footer';
import { Sparkles, AlertCircle } from 'lucide-react';

export function App() {
  const {
    activeView,
    products,
    selectedCategory,
    selectedType,
    sortBy,
    searchQuery,
    setSelectedCategory,
    setSelectedType,
    setSearchQuery
  } = useStore();

  const [sectionConfig, setSectionConfig] = useState({
    smartProjectors: true,
    heroSpotlight: true,
    categoryFilter: true,
    trustBadges: true,
  });

  useEffect(() => {
    const loadConfig = () => {
      const saved = localStorage.getItem('playbeat_sections_config');
      if (saved) {
        try {
          setSectionConfig(JSON.parse(saved));
        } catch (e) {}
      }
    };
    loadConfig();

    const handleUpdate = () => loadConfig();
    window.addEventListener('sections_updated', handleUpdate);
    return () => window.removeEventListener('sections_updated', handleUpdate);
  }, []);

  // Filtered & Sorted products pipeline
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Category match
      if (selectedCategory !== 'all' && product.category.slug !== selectedCategory) {
        return false;
      }

      // Type match
      if (selectedType !== 'ALL' && product.type !== selectedType) {
        return false;
      }

      // Search match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = product.title.toLowerCase().includes(query);
        const matchesDesc = product.shortDescription.toLowerCase().includes(query) || product.description.toLowerCase().includes(query);
        const matchesTags = product.tags.some(t => t.toLowerCase().includes(query));
        const matchesCat = product.category.name.toLowerCase().includes(query);
        const matchesVendor = product.vendor.storeName.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesTags && !matchesCat && !matchesVendor) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      const priceA = a.discountPrice ?? a.price;
      const priceB = b.discountPrice ?? b.price;

      if (sortBy === 'price_asc') return priceA - priceB;
      if (sortBy === 'price_desc') return priceB - priceA;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      // default 'popular'
      return b.salesCount - a.salesCount;
    });
  }, [products, selectedCategory, selectedType, searchQuery, sortBy]);

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      {/* Top Main Navigation */}
      <Navbar />

      {/* Main Viewport Router */}
      <main className="flex-1 w-full">
        {activeView === 'storefront' && (
          <div>
            {/* Dynamic Hero Showcase */}
            {sectionConfig.heroSpotlight && <HeroSpotlight />}

            {/* Marketplace Grid & Filters Container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-8">
              
              {/* Pinned Smart Projectors Showcase Section - Sticky at Top */}
              {sectionConfig.smartProjectors && (
                <div className="sticky top-0 z-40 -mx-4 sm:-mx-6 px-4 sm:px-6 pb-4 bg-gradient-to-b from-slate-900 to-transparent backdrop-blur-lg">
                  <SmartProjectorsSection />
                </div>
              )}

              {/* Category Slider & Filter Bar */}
              {sectionConfig.categoryFilter && (
                <CategoryFilterBar />
              )}

              {/* Products Grid */}
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center space-y-3 p-8 rounded-3xl bg-slate-900/40 border border-slate-800">
                  <div className="w-14 h-14 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center mx-auto text-slate-500">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <h3 className="font-extrabold text-lg text-white">No products found matching your criteria</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Try adjusting your search terms, changing the category filter, or resetting all filters.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setSelectedType('ALL');
                      setSearchQuery('');
                    }}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs cursor-pointer shadow-md"
                  >
                    Reset All Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeView === 'vendor' && <VendorStudio />}
        {activeView === 'affiliate' && <AffiliateHub />}
        {activeView === 'admin' && <AdminConsole />}
      </main>

      {/* Global Modals, Drawers & Overlays */}
      <ProductDetailModal />
      <CartDrawer />
      <WishlistModal />
      <OrderLookupModal />
      <LiveSupportAssistant />
      <ThemeSectionManager />

      {/* Modern Footer */}
      <Footer />
    </div>
  );
}

export default App;
