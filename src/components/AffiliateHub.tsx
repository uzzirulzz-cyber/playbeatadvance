import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { formatCurrency } from '../lib/utils';
import { 
  Share2, 
  Copy, 
  Check, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Gift, 
  Zap, 
  Award, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const AffiliateHub: React.FC = () => {
  const { currency, products } = useStore();

  const [refCode, setRefCode] = useState('PLAYBEAT_VIP');
  const [copied, setCopied] = useState(false);
  const [calcSales, setCalcSales] = useState(50);
  const [calcAvgOrder, setCalcAvgOrder] = useState(4500);

  const referralUrl = `https://playbeat.io/?ref=${refCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Commission calc (20% standard rate)
  const estimatedEarningsPKR = calcSales * calcAvgOrder * 0.20;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      
      {/* Top Banner */}
      <div className="p-6 rounded-3xl glass-panel border border-purple-500/30 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
            <Share2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-2xl text-white">Affiliate Partner Network</h2>
              <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold">
                20% - 30% Lifetime RevShare
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Share digital licenses, 4K projectors, and AI tools with your audience and earn instant automated payouts.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Tier Status:</span>
          <span className="px-3 py-1 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold flex items-center gap-1">
            <Award className="w-3.5 h-3.5" /> Platinum Ambassador
          </span>
        </div>
      </div>

      {/* Referral Link Generator Box */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h3 className="font-extrabold text-base text-white">Your Unique Referral Link</h3>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              readOnly
              value={referralUrl}
              className="w-full h-11 px-4 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm font-mono text-purple-300 font-bold focus:outline-none"
            />
          </div>

          <button
            onClick={handleCopyLink}
            className="px-5 h-11 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-purple-600/30 shrink-0"
          >
            {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Referral Link'}</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 60-day cookie tracking
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" /> Instant attribution on key delivery
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Gift className="w-3.5 h-3.5 text-pink-400" /> Buyer gets 10% discount automatically
          </span>
        </div>
      </div>

      {/* Affiliate Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Total Commissions Earned</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">
            {formatCurrency(86400, currency)}
          </div>
          <div className="text-[10px] text-emerald-400">+18.2% from last cycle</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Referred Customers</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white">314</div>
          <div className="text-[10px] text-slate-400">68% repeat purchase rate</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Link Click-Throughs</span>
            <TrendingUp className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white">4,820</div>
          <div className="text-[10px] text-slate-400">6.5% conversion rate</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Next Automated Payout</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">
            {formatCurrency(19200, currency)}
          </div>
          <div className="text-[10px] text-slate-400">Scheduled in 3 days (JazzCash)</div>
        </div>
      </div>

      {/* Interactive Revenue Calculator */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h3 className="font-extrabold text-base text-white">Earnings Potential Simulator</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between font-bold text-slate-300 mb-1">
                <span>Estimated Monthly Referrals:</span>
                <span className="text-purple-400 font-mono text-sm">{calcSales} buyers</span>
              </div>
              <input
                type="range"
                min="5"
                max="500"
                step="5"
                value={calcSales}
                onChange={(e) => setCalcSales(Number(e.target.value))}
                className="w-full accent-purple-500"
              />
            </div>

            <div>
              <div className="flex justify-between font-bold text-slate-300 mb-1">
                <span>Average Order Value:</span>
                <span className="text-emerald-400 font-mono text-sm">{formatCurrency(calcAvgOrder, currency)}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="50000"
                step="1000"
                value={calcAvgOrder}
                onChange={(e) => setCalcAvgOrder(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950 border border-purple-500/30 flex flex-col justify-between text-center sm:text-left">
            <div>
              <div className="text-xs text-slate-400 uppercase font-bold">Estimated Monthly Payout</div>
              <div className="text-3xl font-black text-emerald-400 mt-1">
                {formatCurrency(estimatedEarningsPKR, currency)}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Based on Platinum 20% base RevShare with automated monthly wire.
              </p>
            </div>

            <div className="pt-3">
              <span className="text-xs font-bold text-purple-300">
                Top Performers earn over {formatCurrency(250000, currency)}/month!
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
