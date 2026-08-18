import React, { useState } from 'react';
import { Clock, AlertCircle } from 'lucide-react';

interface LimitedOffer {
  id: string;
  title: string;
  discount: number;
  originalPrice: number;
  finalPrice: number;
  image: string;
  hoursLeft: number;
  stockRemaining: number;
}

export const LimitedTimeOffersSection: React.FC = () => {
  const [offers] = useState<LimitedOffer[]>([
    {
      id: 'offer-1',
      title: 'Netflix Premium 4K — Flash Sale',
      discount: 15,
      originalPrice: 13860,
      finalPrice: 11999,
      image: 'https://images.unsplash.com/photo-1522869635100-ce306e08592d?auto=format&fit=crop&w=500&q=60',
      hoursLeft: 18,
      stockRemaining: 42
    },
    {
      id: 'offer-2',
      title: 'Magcubic HY300 PRO — Limited Bundle',
      discount: 8,
      originalPrice: 30500,
      finalPrice: 28060,
      image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=500&q=60',
      hoursLeft: 24,
      stockRemaining: 12
    },
    {
      id: 'offer-3',
      title: 'Spotify Premium Bundle — Yearly Deal',
      discount: 18,
      originalPrice: 6776,
      finalPrice: 5559,
      image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=500&q=60',
      hoursLeft: 36,
      stockRemaining: 99
    },
    {
      id: 'offer-4',
      title: 'HY7 Battery Projector — Early Bird',
      discount: 12,
      originalPrice: 52500,
      finalPrice: 46200,
      image: 'https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?auto=format&fit=crop&w=500&q=60',
      hoursLeft: 12,
      stockRemaining: 8
    }
  ]);

  const formatTimeLeft = (hours: number) => {
    if (hours < 1) return 'Ends soon';
    if (hours === 24) return '1 day left';
    return `${hours}h left`;
  };

  return (
    <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto bg-transparent">
      {/* Section Header */}
      <div className="flex items-end justify-between gap-4 mb-10">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#fff1f1] border border-[#f2b9b9] shadow-[0_12px_24px_rgba(16,35,61,0.04)]">
              <Clock className="w-5 h-5 text-[#d54d4d]" />
            </div>
            <span className="text-[11px] font-black uppercase tracking-[0.22em] text-[#58687c]">
              Limited
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#10233d] tracking-[-0.05em] leading-none">
            Limited-Time Offers
          </h2>
          <p className="text-sm text-[#58687c] max-w-xl">
            Flash deals ending soon — grab them before they're gone
          </p>
        </div>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {offers.map(offer => (
          <div
            key={offer.id}
            className="group relative rounded-2xl overflow-hidden border border-[#E2E6EB] hover:border-[#FFD21F] hover:shadow-xl transition-all duration-300 bg-white cursor-pointer"
          >
            {/* Image Container */}
            <div className="relative h-48 overflow-hidden bg-[#F4F6F8]">
              <img
                src={offer.image}
                alt={offer.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />

              {/* Discount Badge */}
              <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-lg font-black text-sm shadow-lg">
                -{offer.discount}%
              </div>

              {/* Time Left Badge */}
              <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-md">
                <Clock className="w-3.5 h-3.5 text-red-500" />
                <span className="text-xs font-bold text-[#0B1F3A]">
                  {formatTimeLeft(offer.hoursLeft)}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
              <h3 className="text-sm font-bold text-[#0B1F3A] line-clamp-2 group-hover:text-[#FFD21F] transition-colors">
                {offer.title}
              </h3>

              {/* Price Section */}
              <div className="space-y-1.5">
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-black text-[#0B1F3A]">
                    Rs {offer.finalPrice.toLocaleString()}
                  </span>
                  <span className="text-xs text-[#6B7280] line-through">
                    Rs {offer.originalPrice.toLocaleString()}
                  </span>
                </div>

                {/* Savings Amount */}
                <p className="text-xs font-bold text-green-600">
                  Save Rs {(offer.originalPrice - offer.finalPrice).toLocaleString()}
                </p>
              </div>

              {/* Stock Warning */}
              {offer.stockRemaining < 20 && (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-red-50 border border-red-200">
                  <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                  <span className="text-xs font-bold text-red-600">
                    Only {offer.stockRemaining} left!
                  </span>
                </div>
              )}

              {/* CTA Button */}
              <button className="w-full mt-2 py-2.5 rounded-xl bg-gradient-to-r from-[#FFD21F] to-[#FFC400] hover:from-[#FFC400] hover:to-[#FFB300] text-[#0B1F3A] font-bold text-xs transition-all shadow-md hover:shadow-lg cursor-pointer">
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Info Banner */}
      <div className="mt-8 p-4 rounded-2xl bg-[#0B1F3A]/80 border border-red-400/20 flex items-start gap-3">
        <Clock className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-200">
          <span className="font-bold text-white">Flash Sales:</span> These limited-time offers are available only while stock lasts. Prices are subject to change once the countdown expires.
        </p>
      </div>
    </section>
  );
};

export default LimitedTimeOffersSection;
