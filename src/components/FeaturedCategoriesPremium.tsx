import React from 'react';
import { ArrowRight, Gamepad2, Code, Gift, Monitor, Cloud, TrendingUp, Zap } from 'lucide-react';
import { useStore } from '../store/useStore';

export const FeaturedCategoriesPremium: React.FC = () => {
  const { setActiveView, setSelectedCategory } = useStore();

  const categories = [
    { id: 'games', label: 'Gaming & Subscriptions', icon: Gamepad2, desc: 'Steam, PlayStation, Xbox & more', color: 'bg-blue-50 border-blue-200 text-blue-600' },
    { id: 'software-licenses', label: 'Software & Licenses', icon: Code, desc: 'Professional & creative software', color: 'bg-purple-50 border-purple-200 text-purple-600' },
    { id: 'gift-cards', label: 'Gift Cards & Vouchers', icon: Gift, desc: 'Digital & retail gift cards', color: 'bg-rose-50 border-rose-200 text-rose-600' },
    { id: 'streaming', label: 'Streaming Services', icon: Monitor, desc: 'Netflix, Prime, Disney+ & more', color: 'bg-red-50 border-red-200 text-red-600' },
    { id: 'cloud-services', label: 'Cloud Services', icon: Cloud, desc: 'Storage, hosting & databases', color: 'bg-cyan-50 border-cyan-200 text-cyan-600' },
    { id: 'web-hosting', label: 'Web Hosting', icon: TrendingUp, desc: 'Domains, hosting & security', color: 'bg-green-50 border-green-200 text-green-600' },
    { id: 'marketing', label: 'Digital Marketing', icon: Zap, desc: 'SEO tools & marketing platforms', color: 'bg-orange-50 border-orange-200 text-orange-600' },
    { id: 'smart-projectors', label: 'Premium Hardware', icon: Monitor, desc: 'Projectors, devices & more', color: 'bg-amber-50 border-amber-200 text-amber-600' },
  ];

  return (
    <section className="w-full py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#FFD21F]/10 border border-[#FFD21F]/30 rounded-full mb-4">
            <span className="text-xs font-bold text-[#0B1F3A] uppercase tracking-wider">
              explore
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-[#0B1F3A] mb-4">
            Featured <span className="text-[#FFD21F]">Categories</span>
          </h2>
          <p className="text-lg text-[#6B7280] max-w-2xl">
            Browse our comprehensive collection of digital products and services, all organized for easy discovery.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => {
                  setActiveView('storefront');
                  setSelectedCategory(category.id);
                }}
                className="group p-6 bg-white rounded-lg border-2 border-[#E2E6EB] hover:border-[#FFD21F] shadow-sm hover:shadow-lg transition-all duration-300 text-left"
              >
                
                {/* Icon Circle */}
                <div className={`w-14 h-14 rounded-lg flex items-center justify-center mb-4 transition-all group-hover:scale-110 ${category.color}`}>
                  <Icon className="w-7 h-7" />
                </div>

                {/* Title & Desc */}
                <h3 className="font-bold text-[#0B1F3A] text-lg mb-1 group-hover:text-[#FFD21F] transition-colors">
                  {category.label}
                </h3>
                <p className="text-sm text-[#6B7280] mb-4">
                  {category.desc}
                </p>

                {/* Arrow */}
                <div className="flex items-center gap-1.5 text-[#FFD21F] font-bold text-sm">
                  <span>Explore</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
};
