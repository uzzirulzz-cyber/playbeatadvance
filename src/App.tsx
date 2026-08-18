import React, { useMemo, useState, useEffect } from 'react';
import { useStore } from './store/useStore';
import { NavbarPremium } from './components/NavbarPremium';
import { HeroSectionPremium } from './components/HeroSectionPremium';
import { FeaturedCategoriesPremium } from './components/FeaturedCategoriesPremium';
import { TrendingProductsSection } from './components/TrendingProductsSection';
import { BestSellersSection } from './components/BestSellersSection';
import { LimitedTimeOffersSection } from './components/LimitedTimeOffersSection';
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
import { FooterPremium } from './components/FooterPremium';
import { AlertCircle } from 'lucide-react';

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
      <NavbarPremium />

      {/* Main Viewport Router */}
      <main className="flex-1 w-full bg-white">
        {activeView === 'storefront' && (
          <div>
            {/* Premium Hero Section */}
            {sectionConfig.heroSpotlight && <HeroSectionPremium />}

            <div className="space-y-8">
              {/* Featured Categories */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <FeaturedCategoriesPremium />
              </div>

              {/* Trending Products Section */}
              <TrendingProductsSection />

              {/* Smart Projectors Showcase Section - kept in flow, no sticky pinning */}
              {sectionConfig.smartProjectors && (
                <div className="-mx-4 sm:-mx-6 px-4 sm:px-6 pb-4">
                  <SmartProjectorsSection />
                </div>
              )}

              {/* Limited-Time Offers Section */}
              <LimitedTimeOffersSection />

              {/* Best Sellers Section */}
              <BestSellersSection />

              {/* Category Slider & Filter Bar */}
              {sectionConfig.categoryFilter && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                  <CategoryFilterBar />
                </div>
              )}

              {/* Products Grid */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
                {filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                    {filteredProducts.map(product => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="py-20 text-center space-y-3 p-8 rounded-3xl bg-[#F4F6F8] border border-[#E2E6EB]">
                    <div className="w-14 h-14 rounded-full bg-white border border-[#E2E6EB] flex items-center justify-center mx-auto text-[#6B7280]">
                      <AlertCircle className="w-6 h-6" />
                    </div>
                    <h3 className="font-extrabold text-lg text-[#0B1F3A]">No products found matching your criteria</h3>
                    <p className="text-xs text-[#6B7280] max-w-sm mx-auto">
                      Try adjusting your search terms, changing the category filter, or resetting all filters.
                    </p>
                    <button
                      onClick={() => {
                        setSelectedCategory('all');
                        setSelectedType('ALL');
                        setSearchQuery('');
                      }}
                      className="px-4 py-2 rounded-xl bg-[#FFD21F] hover:bg-[#FFC400] text-[#0B1F3A] font-bold text-xs cursor-pointer shadow-md"
                    >
                      Reset All Filters
                    </button>
                  </div>
                )}
              </div>
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
      <FooterPremium />
    </div>
  );
}

export default App;
