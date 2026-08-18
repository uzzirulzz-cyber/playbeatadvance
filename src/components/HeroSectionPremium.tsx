import React, { useState } from 'react';
import { ArrowRight, Search, Zap, ShieldCheck, Truck, Clock, Award } from 'lucide-react';
import { useStore } from '../store/useStore';

export const HeroSectionPremium: React.FC = () => {
  const { setSearchQuery, setActiveView, setSelectedCategory } = useStore();
  const [searchInput, setSearchInput] = useState('');

  const handleSearch = () => {
    if (searchInput.trim()) {
      setSearchQuery(searchInput);
      setActiveView('storefront');
      setSelectedCategory('all');
    }
  };

  const trustIndicators = [
    { icon: ShieldCheck, label: 'Verified Products', desc: '100% authentic' },
    { icon: Truck, label: 'Instant Delivery', desc: 'Digital downloads' },
    { icon: Clock, label: '24/7 Support', desc: 'Always available' },
    { icon: Award, label: 'Best Prices', desc: 'Competitive rates' },
  ];

  const stats = [
    { number: '50K+', label: 'Products' },
    { number: '10K+', label: 'Happy Customers' },
    { number: '99.9%', label: 'Satisfaction' },
    { number: '24/7', label: 'Support' },
  ];

  return (
    <section className="w-full py-16 sm:py-24 bg-gradient-to-b from-white via-[#F4F6F8] to-white relative overflow-hidden">
      
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFD21F] opacity-5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#0B1F3A] opacity-3 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Hero Content */}
        <div className="grid md:grid-cols-2 gap-8 items-center mb-16">
          
          {/* Left: Text & CTA */}
          <div className="space-y-6">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FFD21F]/10 border border-[#FFD21F]/30 rounded-full w-fit">
              <Zap className="w-4 h-4 text-[#FFD21F]" />
              <span className="text-sm font-bold text-[#0B1F3A]">
                Everything Digital. One Platform.
              </span>
            </div>

            {/* Headline */}
            <div>
              <h1 className="text-5xl sm:text-6xl font-black text-[#0B1F3A] leading-tight mb-4">
                Premium Digital 
                <span className="text-[#FFD21F]"> Marketplace</span>
              </h1>
              <p className="text-lg text-[#6B7280] leading-relaxed">
                Discover premium gaming, software, subscriptions, gift cards, hosting, marketing tools and digital services from PlayBeat Digital. Instant delivery, secure payments, verified products.
              </p>
            </div>

            {/* Primary Search CTA */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 flex items-center rounded-lg overflow-hidden border-2 border-[#0B1F3A] bg-white shadow-md">
                <input
                  type="text"
                  placeholder="Search products, games, software..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-1 px-4 py-3 text-sm outline-none text-[#263241] placeholder-[#9CA3AF]"
                />
                <button
                  onClick={handleSearch}
                  className="px-6 bg-[#FFD21F] hover:bg-[#FFC400] text-[#0B1F3A] font-bold transition-colors"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
              <button className="px-6 py-3 bg-[#0B1F3A] hover:bg-[#0a1428] text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-colors group">
                <span>Browse Catalog</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Secondary CTA */}
            <div className="flex gap-3 pt-4">
              <button className="px-4 py-2 text-sm font-semibold text-[#0B1F3A] border-2 border-[#0B1F3A] hover:bg-[#F4F6F8] rounded-lg transition-colors">
                Special Offers
              </button>
              <button className="px-4 py-2 text-sm font-semibold text-[#6B7280] hover:text-[#0B1F3A] transition-colors">
                Learn More →
              </button>
            </div>
          </div>

          {/* Right: Feature showcase cards */}
          <div className="space-y-4 hidden md:block">
            <div className="grid grid-cols-2 gap-4">
              {/* Card 1 */}
              <div className="p-6 bg-white rounded-lg border border-[#E2E6EB] shadow-sm hover:shadow-md hover:border-[#FFD21F] transition-all group">
                <div className="w-12 h-12 bg-[#FFD21F] rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Zap className="w-6 h-6 text-[#0B1F3A]" />
                </div>
                <h3 className="font-bold text-[#0B1F3A] mb-1">Instant Delivery</h3>
                <p className="text-sm text-[#6B7280]">Get your digital products immediately after purchase</p>
              </div>

              {/* Card 2 */}
              <div className="p-6 bg-white rounded-lg border border-[#E2E6EB] shadow-sm hover:shadow-md hover:border-[#FFD21F] transition-all group">
                <div className="w-12 h-12 bg-[#FFD21F] rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-6 h-6 text-[#0B1F3A]" />
                </div>
                <h3 className="font-bold text-[#0B1F3A] mb-1">Secure Payments</h3>
                <p className="text-sm text-[#6B7280]">256-bit encryption protects your transactions</p>
              </div>

              {/* Card 3 */}
              <div className="p-6 bg-white rounded-lg border border-[#E2E6EB] shadow-sm hover:shadow-md hover:border-[#FFD21F] transition-all group">
                <div className="w-12 h-12 bg-[#FFD21F] rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Truck className="w-6 h-6 text-[#0B1F3A]" />
                </div>
                <h3 className="font-bold text-[#0B1F3A] mb-1">Verified Products</h3>
                <p className="text-sm text-[#6B7280]">All items authenticated and tested</p>
              </div>

              {/* Card 4 */}
              <div className="p-6 bg-white rounded-lg border border-[#E2E6EB] shadow-sm hover:shadow-md hover:border-[#FFD21F] transition-all group">
                <div className="w-12 h-12 bg-[#FFD21F] rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Clock className="w-6 h-6 text-[#0B1F3A]" />
                </div>
                <h3 className="font-bold text-[#0B1F3A] mb-1">24/7 Support</h3>
                <p className="text-sm text-[#6B7280]">Our team is always here to help</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-8 border-y border-[#E2E6EB]">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="text-3xl sm:text-4xl font-black text-[#FFD21F] mb-1">
                {stat.number}
              </div>
              <div className="text-sm text-[#6B7280] font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="grid sm:grid-cols-4 gap-6 pt-12">
          {trustIndicators.map((indicator, idx) => {
            const Icon = indicator.icon;
            return (
              <div key={idx} className="text-center">
                <div className="w-16 h-16 bg-[#FFD21F]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-8 h-8 text-[#FFD21F]" />
                </div>
                <h4 className="font-bold text-[#0B1F3A] mb-1">
                  {indicator.label}
                </h4>
                <p className="text-sm text-[#6B7280]">
                  {indicator.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
