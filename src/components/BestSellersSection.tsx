import React, { useMemo } from 'react';
import { useStore } from '../store/useStore';
import { Crown, Award } from 'lucide-react';
import { ProductCard } from './ProductCard';

export const BestSellersSection: React.FC = () => {
  const { products } = useStore();

  const bestSellers = useMemo(() => {
    return products
      .filter(p => p.salesCount > 0)
      .sort((a, b) => b.salesCount - a.salesCount)
      .slice(0, 8);
  }, [products]);

  return (
    <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto bg-transparent">
      {/* Section Header */}
      <div className="flex items-end justify-between gap-4 mb-10">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#fff7e6] border border-[#e4d3a7] shadow-[0_12px_24px_rgba(16,35,61,0.04)]">
              <Crown className="w-5 h-5 text-[#d7a53a]" />
            </div>
            <span className="text-[11px] font-black uppercase tracking-[0.22em] text-[#58687c]">
              Popular
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#10233d] tracking-[-0.05em] leading-none">
            Best Sellers
          </h2>
          <p className="text-sm text-[#58687c] max-w-xl">
            Voted by thousands of satisfied customers
          </p>
        </div>
      </div>

      {/* Best Sellers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {bestSellers.map((product, index) => (
          <div key={product.id} className="relative group">
            {/* Rank Badge */}
            <div className={`absolute top-3 right-3 z-10 px-3.5 py-2 rounded-lg font-black text-white text-sm shadow-lg flex items-center gap-2 ${
              index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' :
              index === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-400' :
              index === 2 ? 'bg-gradient-to-r from-amber-600 to-amber-700' :
              'bg-[#0B1F3A]'
            }`}>
              {index === 0 && <Crown className="w-4 h-4" />}
              {index === 1 && <Award className="w-4 h-4" />}
              <span>#{index + 1}</span>
            </div>

            {/* Sales Count Badge */}
            <div className="absolute top-3 left-3 z-10 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-md">
              <p className="text-xs font-bold text-[#0B1F3A]">
                {product.salesCount.toLocaleString()} sold
              </p>
            </div>

            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* Info Banner */}
      <div className="mt-8 p-4 rounded-2xl bg-[#0B1F3A]/80 border border-[#FFD21F]/20 flex items-start gap-3">
        <Crown className="w-5 h-5 text-[#FFD21F] fill-[#FFD21F] shrink-0 mt-0.5" />
        <p className="text-xs text-slate-200">
          <span className="font-bold text-white">Most Popular:</span> Our best-selling products are tried and tested by thousands of customers. Secure your purchase with our 30-day satisfaction guarantee.
        </p>
      </div>
    </section>
  );
};

export default BestSellersSection;
