import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Calendar, 
  Globe2, 
  Smartphone, 
  Laptop, 
  ArrowUpRight, 
  ArrowDownRight,
  PieChart
} from 'lucide-react';
import { useStore } from '../../../store/useStore';

export const AnalyticsView: React.FC = () => {
  const { orders, products } = useStore();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  const totalSales = orders.reduce((sum, o) => sum + (o.totalAmountPKR || o.total || 0), 0) || 2512;
  const avgOrderValue = Math.round(totalSales / (orders.length || 1));

  return (
    <div className="space-y-6 pb-12">
      {/* Header with range switch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#11192e]/90 border border-slate-800/80 p-4 rounded-2xl">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-400" />
            <span>Store Analytics & Funnel Metrics</span>
          </h2>
          <p className="text-xs text-slate-400">Deep telemetry, customer acquisition costs, and conversion funnel</p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-700">
          {(['7d', '30d', '90d', 'all'] as const).map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                timeRange === range 
                  ? 'bg-purple-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {range.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#11192e]/90 border border-slate-800/80 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Average Order Value (AOV)</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white mt-2">Rs {avgOrderValue.toLocaleString()}</div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+14.2% vs last period</span>
          </div>
        </div>

        <div className="bg-[#11192e]/90 border border-slate-800/80 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Checkout Completion Rate</span>
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white mt-2">92.4%</div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+4.8% JazzCash 1-Click speed</span>
          </div>
        </div>

        <div className="bg-[#11192e]/90 border border-slate-800/80 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Customer Lifetime Value (LTV)</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white mt-2">Rs 18,400</div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Recurring IPTV & Netflix passes</span>
          </div>
        </div>

        <div className="bg-[#11192e]/90 border border-slate-800/80 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Refund / Dispute Rate</span>
            <PieChart className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white mt-2">0.00%</div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold mt-1">
            <span>Zero chargebacks recorded</span>
          </div>
        </div>
      </div>

      {/* Conversion Funnel & Device Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Funnel */}
        <div className="bg-[#11192e]/90 border border-slate-800/80 p-5 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-white">E-Commerce Conversion Funnel</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1 font-semibold">
                <span className="text-slate-300">1. Product Page Views</span>
                <span className="text-white font-mono">14,820 (100%)</span>
              </div>
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full w-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-semibold">
                <span className="text-slate-300">2. Added to Martfury Cart</span>
                <span className="text-white font-mono">3,240 (21.8%)</span>
              </div>
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full w-[21.8%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-semibold">
                <span className="text-slate-300">3. Initiated Checkout</span>
                <span className="text-white font-mono">2,180 (14.7%)</span>
              </div>
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-pink-500 rounded-full w-[14.7%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-semibold">
                <span className="text-slate-300">4. Successful Paid Orders</span>
                <span className="text-white font-mono">1,750 (11.8%)</span>
              </div>
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full w-[11.8%]" />
              </div>
            </div>
          </div>
        </div>

        {/* Devices & Regional distribution */}
        <div className="bg-[#11192e]/90 border border-slate-800/80 p-5 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-white">Device & Regional Distribution</h3>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center gap-3">
              <Smartphone className="w-6 h-6 text-purple-400" />
              <div>
                <div className="text-xs font-bold text-white">Mobile Phones</div>
                <div className="text-[10px] text-slate-400 font-mono">74% (JazzCash/EasyPaisa)</div>
              </div>
            </div>

            <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center gap-3">
              <Laptop className="w-6 h-6 text-blue-400" />
              <div>
                <div className="text-xs font-bold text-white">Desktop Workstations</div>
                <div className="text-[10px] text-slate-400 font-mono">26% (Cards / Crypto)</div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 space-y-2">
            <div className="text-xs font-bold text-slate-300">Top Influx Cities:</div>
            <div className="flex flex-wrap gap-2 text-xs font-mono">
              <span className="px-2.5 py-1 bg-slate-900 border border-slate-700 rounded-lg text-slate-200">Karachi (38%)</span>
              <span className="px-2.5 py-1 bg-slate-900 border border-slate-700 rounded-lg text-slate-200">Lahore (29%)</span>
              <span className="px-2.5 py-1 bg-slate-900 border border-slate-700 rounded-lg text-slate-200">Islamabad / RWP (18%)</span>
              <span className="px-2.5 py-1 bg-slate-900 border border-slate-700 rounded-lg text-slate-200">Faisalabad (9%)</span>
              <span className="px-2.5 py-1 bg-slate-900 border border-slate-700 rounded-lg text-slate-200">Overseas / UAE (6%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
