import React, { useState } from 'react';
import { 
  Ticket, 
  Plus, 
  Check, 
  Trash2, 
  Tag, 
  Clock, 
  Percent,
  CheckCircle2
} from 'lucide-react';
import { useStore } from '../../../store/useStore';
import { Coupon } from '../../../types';

export const CouponsView: React.FC = () => {
  const { coupons, addCoupon } = useStore();
  const [code, setCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(20);
  const [minSpend, setMinSpend] = useState(1000);
  const [maxDiscount, setMaxDiscount] = useState(5000);
  const [successToast, setSuccessToast] = useState(false);

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    const newCpn: Coupon = {
      id: `cpn-${Date.now()}`,
      code: code.trim().toUpperCase(),
      discountPercent: Number(discountPercent),
      minSpendPKR: Number(minSpend),
      maxDiscountPKR: Number(maxDiscount),
      validUntil: '2026-12-31',
      usedCount: 0,
      maxUses: 100,
      active: true,
      description: `${discountPercent}% OFF promotional coupon code for playbeat.digital`
    };

    addCoupon(newCpn);
    setCode('');
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12">
      {successToast && (
        <div className="bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 p-4 rounded-2xl flex items-center gap-3 text-xs font-bold animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>New coupon code published and ready for storefront checkout!</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#11192e]/90 border border-slate-800/80 p-4 rounded-2xl">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Ticket className="w-5 h-5 text-purple-400" />
            <span>Discount Coupons & Promotional Campaigns</span>
          </h2>
          <p className="text-xs text-slate-400">Create instant percentage and fixed PKR vouchers for flash sales and affiliate boosts</p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-300 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
          <span>Active Coupons: <strong className="text-purple-400">{coupons.length}</strong></span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Create Form */}
        <div className="bg-[#11192e]/90 border border-slate-800/80 p-5 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-purple-400" />
            <span>Create Coupon Code</span>
          </h3>

          <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Coupon Code (Uppercase)</label>
              <input
                type="text"
                required
                placeholder="e.g. FLASH30, PLAYBEAT20"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono uppercase focus:border-purple-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Discount (%)</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  required
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Min Spend (PKR)</label>
                <input
                  type="number"
                  min="0"
                  value={minSpend}
                  onChange={(e) => setMinSpend(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:border-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Max Cap (PKR)</label>
              <input
                type="number"
                min="0"
                value={maxDiscount}
                onChange={(e) => setMaxDiscount(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:border-purple-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all shadow-lg shadow-purple-600/30 cursor-pointer"
            >
              Publish Coupon
            </button>
          </form>
        </div>

        {/* Coupons List */}
        <div className="lg:col-span-2 bg-[#11192e]/90 border border-slate-800/80 p-5 rounded-2xl">
          <h3 className="text-sm font-bold text-white mb-4">Active Promo Vouchers</h3>

          <div className="space-y-3">
            {coupons.map((cpn, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 font-black text-sm">
                    {cpn.discountPercent}%
                  </div>
                  <div>
                    <div className="font-mono font-black text-white text-sm flex items-center gap-2">
                      <span>{cpn.code}</span>
                      <span className="text-[10px] text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-500/30">Active</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Min spend Rs {(cpn.minSpendPKR || 0).toLocaleString()} • Max cap Rs {(cpn.maxDiscountPKR || 5000).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-slate-300">
                    {cpn.usedCount || 0} Uses
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    Valid till Dec 2026
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
