import React, { useMemo } from 'react';
import { useStore } from '../store/useStore';
import { Star, TrendingUp, Zap } from 'lucide-react';
import { ProductCard } from './ProductCard';

interface TrendingProduct {
  product: any;
  trendScore: number;
  priceChange: number;
}

export const TrendingProductsSection: React.FC = () => {
  const { products } = useStore();

  const trendingProducts = useMemo(() => {
    return products
      .map(product => {
        const trendScore = 
          (product.salesCount * 0.4) + 
          (product.rating * 20) + 
          (product.reviewCount * 0.8);
        
        const priceChange = (Math.random() - 0.5) * 20;
        
        return { product, trendScore, priceChange };
      })
      .sort((a, b) => b.trendScore - a.trendScore)
      .slice(0, 8);
  }, [products]);

  return (
    <section className="py-12 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-[#FFD21F] to-[#FFC400] shadow-lg">
              <TrendingUp className="w-6 h-6 text-[#0B1F3A]" />
            </div>
            <h2 className="text-3xl font-black text-[#0B1F3A] tracking-tight">
              Trending This Week
            </h2>
          </div>
          <p className="text-sm text-[#6B7280] ml-11">
            Featured by buyers & climbing the charts
          </p>
        </div>
        <a
          href="#products"
          className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg border border-[#E2E6EB] hover:border-[#FFD21F] hover:bg-[#F4F6F8] transition-all text-xs font-bold text-[#0B1F3A] cursor-pointer"
        >
          View All
          <span>→</span>
        </a>
      </div>

      {/* Trending Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {trendingProducts.map(({ product, priceChange }) => (
          <div key={product.id} className="relative group">
            {/* Trending Badge */}
            <div className="absolute top-3 right-3 z-10 bg-gradient-to-r from-[#FFD21F] to-[#FFC400] px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-lg">
              <Zap className="w-3.5 h-3.5 text-[#0B1F3A]" />
              <span className="text-xs font-black text-[#0B1F3A]">TRENDING</span>
            </div>

            {/* Price Change Indicator */}
            {priceChange > 0 && (
              <div className="absolute top-3 left-3 z-10 bg-red-500/90 px-2.5 py-1 rounded-lg flex items-center gap-1">
                <span className="text-xs font-bold text-white">
                  {priceChange > 0 ? '+' : ''}{priceChange.toFixed(0)}%
                </span>
              </div>
            )}

            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* Carousel Info */}
      <div className="mt-8 p-4 rounded-2xl bg-gradient-to-r from-[#F4F6F8] to-[#FFFFFF] border border-[#E2E6EB] flex items-center gap-3">
        <Star className="w-5 h-5 text-[#FFD21F] fill-[#FFD21F] shrink-0" />
        <p className="text-xs text-[#6B7280]">
          🔥 <span className="font-bold text-[#0B1F3A]">New Trending Badge:</span> These products are being purchased frequently and loved by our community. Limited stock available.
        </p>
      </div>
    </section>
  );
};

export default TrendingProductsSection;
