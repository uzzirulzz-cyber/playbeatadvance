import React from 'react';
import { ArrowRight, Gamepad2, Code, Gift, Monitor } from 'lucide-react';
import { useStore } from '../store/useStore';

export const FeaturedCategoriesPremium: React.FC = () => {
  const { setActiveView, setSelectedCategory } = useStore();

  const categories = [
    { id: 'games', label: 'Gaming & Subscriptions', icon: Gamepad2, desc: 'Steam, PlayStation, Xbox & more', color: 'bg-blue-50 border-blue-200 text-blue-600' },
    { id: 'software-licenses', label: 'Software & Licenses', icon: Code, desc: 'Professional & creative software', color: 'bg-purple-50 border-purple-200 text-purple-600' },
    { id: 'gift-cards', label: 'Gift Cards & Vouchers', icon: Gift, desc: 'Digital & retail gift cards', color: 'bg-rose-50 border-rose-200 text-rose-600' },
    { id: 'streaming', label: 'Streaming Services', icon: Monitor, desc: 'Netflix, Prime, Disney+ & more', color: 'bg-red-50 border-red-200 text-red-600' },
  ];

  return (
    <section className="w-full py-20 sm:py-24 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="mb-10">
          <div className="mb-4 flex items-center gap-3">
            <span className="text-[11px] font-black uppercase tracking-[0.22em] text-[#58687c]">
              Explore
            </span>
            <span className="h-px flex-1 bg-[#dfe4eb]" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#10233d] leading-none tracking-[-0.05em] mb-3">
            Featured <span className="text-[#d7a53a]">Categories</span>
          </h2>
          <p className="text-base text-[#58687c] max-w-2xl">
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
                className="group p-6 bg-[#102749] rounded-lg border-2 border-white/10 hover:border-[#FFD21F] shadow-sm hover:shadow-lg hover:shadow-[#FFD21F]/20 transition-all duration-300 text-left"
              >
                
                {/* Icon Circle */}
                <div className={`w-14 h-14 rounded-lg flex items-center justify-center mb-4 transition-all group-hover:scale-110 ${category.color}`}>
                  <Icon className="w-7 h-7" />
                </div>

                {/* Title & Desc */}
                <h3 className="font-bold text-white text-lg mb-1 group-hover:text-[#FFD21F] transition-colors">
                  {category.label}
                </h3>
                <p className="text-sm text-slate-300 mb-4">
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
