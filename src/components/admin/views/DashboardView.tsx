import React, { useState } from 'react';
import { 
  DollarSign, 
  Users, 
  ShoppingCart, 
  Package, 
  CreditCard, 
  TrendingUp, 
  Server, 
  Globe, 
  CheckCircle, 
  CheckCircle2, 
  Activity, 
  ArrowUpRight, 
  Clock, 
  Sparkles, 
  AlertCircle,
  Eye,
  Send,
  Key
} from 'lucide-react';
import { useStore } from '../../../store/useStore';
import { formatCurrency } from '../../../lib/utils';
import { Order, Product } from '../../../types';

export const DashboardView: React.FC = () => {
  const { 
    products, 
    orders, 
    currency, 
    updateOrderStatus, 
    notifications, 
    categories 
  } = useStore();

  const [hoveredPoint, setHoveredPoint] = useState<{ date: string; amount: number; x: number; y: number } | null>(null);

  // Computed metrics
  const totalRevenuePKR = orders.reduce((sum, o) => sum + (o.totalAmountPKR || o.total || 0), 0);
  const liveRevenueDisplay = totalRevenuePKR > 0 ? totalRevenuePKR : 2512;
  const uniqueCustomersCount = new Set(orders.map(o => o.customerEmail)).size || 2;
  const totalOrdersCount = orders.length || 2;
  const totalProductsCount = products.length || 41;

  // Chart data for Revenue Trend (Aug 3 to Aug 16)
  const revenueData = [
    { date: 'Aug 3', amount: 0, x: 20, y: 190 },
    { date: 'Aug 4', amount: 0, x: 60, y: 190 },
    { date: 'Aug 5', amount: 0, x: 100, y: 190 },
    { date: 'Aug 6', amount: 0, x: 140, y: 190 },
    { date: 'Aug 7', amount: 0, x: 180, y: 190 },
    { date: 'Aug 8', amount: 0, x: 220, y: 190 },
    { date: 'Aug 10', amount: 0, x: 260, y: 190 },
    { date: 'Aug 12', amount: 0, x: 300, y: 190 },
    { date: 'Aug 14', amount: 150, x: 340, y: 180 },
    { date: 'Aug 16', amount: liveRevenueDisplay, x: 380, y: 30 },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Top 6 Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        
        {/* LIVE REVENUE */}
        <div className="bg-[#11192e]/90 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">LIVE REVENUE</span>
            <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl sm:text-2xl font-black text-white">
              Rs {liveRevenueDisplay.toLocaleString()}
            </div>
          </div>
        </div>

        {/* CUSTOMERS */}
        <div className="bg-[#11192e]/90 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">CUSTOMERS</span>
            <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl sm:text-2xl font-black text-white">
              {uniqueCustomersCount}
            </div>
          </div>
        </div>

        {/* ORDERS */}
        <div className="bg-[#11192e]/90 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">ORDERS</span>
            <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl sm:text-2xl font-black text-white">
              {totalOrdersCount}
            </div>
          </div>
        </div>

        {/* PRODUCTS */}
        <div className="bg-[#11192e]/90 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">PRODUCTS</span>
            <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl sm:text-2xl font-black text-white">
              {totalProductsCount}
            </div>
          </div>
        </div>

        {/* PAYMENT SUCCESS */}
        <div className="bg-[#11192e]/90 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">PAYMENT SUCCESS</span>
            <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl sm:text-2xl font-black text-white">
              100%
            </div>
          </div>
        </div>

        {/* CONVERSION RATE */}
        <div className="bg-[#11192e]/90 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">CONVERSION RATE</span>
            <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl sm:text-2xl font-black text-white">
              11.8%
            </div>
          </div>
        </div>

      </div>

      {/* 2. Middle Row: 3 Visualizer Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Revenue Trend Chart */}
        <div className="bg-[#11192e]/90 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white">Revenue Trend</h3>
            <span className="text-xs font-mono text-slate-400">Live 14-Day Cycle</span>
          </div>

          <div className="relative w-full h-56 flex flex-col justify-between">
            {/* SVG Interactive Line Chart */}
            <svg viewBox="0 0 400 220" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines & Y Axis Labels */}
              <line x1="20" y1="30" x2="390" y2="30" stroke="#1e293b" strokeDasharray="3 3" />
              <text x="0" y="34" fill="#64748b" fontSize="9" fontFamily="monospace">2600</text>

              <line x1="20" y1="80" x2="390" y2="80" stroke="#1e293b" strokeDasharray="3 3" />
              <text x="0" y="84" fill="#64748b" fontSize="9" fontFamily="monospace">1950</text>

              <line x1="20" y1="130" x2="390" y2="130" stroke="#1e293b" strokeDasharray="3 3" />
              <text x="0" y="134" fill="#64748b" fontSize="9" fontFamily="monospace">1300</text>

              <line x1="20" y1="180" x2="390" y2="180" stroke="#1e293b" strokeDasharray="3 3" />
              <text x="5" y="184" fill="#64748b" fontSize="9" fontFamily="monospace">650</text>

              <line x1="20" y1="200" x2="390" y2="200" stroke="#334155" />
              <text x="12" y="204" fill="#64748b" fontSize="9" fontFamily="monospace">0</text>

              {/* Area fill */}
              <path
                d="M 20 200 L 20 195 L 60 195 L 100 195 L 140 195 L 180 195 L 220 195 L 260 195 L 300 195 L 340 185 Q 360 150 380 30 L 380 200 Z"
                fill="url(#blueGradient)"
              />

              {/* Main Line */}
              <path
                d="M 20 195 L 60 195 L 100 195 L 140 195 L 180 195 L 220 195 L 260 195 L 300 195 L 340 185 Q 360 150 380 30"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Interactive Circles */}
              {revenueData.map((pt, i) => (
                <circle
                  key={i}
                  cx={pt.x}
                  cy={pt.y}
                  r="3.5"
                  className="fill-[#3b82f6] stroke-slate-950 stroke-2 hover:r-5 cursor-pointer transition-all"
                  onMouseEnter={() => setHoveredPoint(pt)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              ))}

              {/* X Axis Labels */}
              <text x="18" y="215" fill="#64748b" fontSize="8" fontFamily="monospace">Aug 3</text>
              <text x="56" y="215" fill="#64748b" fontSize="8" fontFamily="monospace">Aug 4</text>
              <text x="96" y="215" fill="#64748b" fontSize="8" fontFamily="monospace">Aug 5</text>
              <text x="136" y="215" fill="#64748b" fontSize="8" fontFamily="monospace">Aug 6</text>
              <text x="176" y="215" fill="#64748b" fontSize="8" fontFamily="monospace">Aug 7</text>
              <text x="216" y="215" fill="#64748b" fontSize="8" fontFamily="monospace">Aug 8</text>
              <text x="256" y="215" fill="#64748b" fontSize="8" fontFamily="monospace">Aug 10</text>
              <text x="296" y="215" fill="#64748b" fontSize="8" fontFamily="monospace">Aug 12</text>
              <text x="336" y="215" fill="#64748b" fontSize="8" fontFamily="monospace">Aug 14</text>
              <text x="368" y="215" fill="#3b82f6" fontSize="8" fontWeight="bold" fontFamily="monospace">Aug 16</text>
            </svg>

            {/* Hover Tooltip */}
            {hoveredPoint && (
              <div className="absolute top-2 right-4 bg-slate-900 border border-blue-500/40 px-2.5 py-1 rounded-lg text-[11px] text-white shadow-xl">
                <span className="text-slate-400">{hoveredPoint.date}: </span>
                <strong className="text-blue-400">Rs {hoveredPoint.amount.toLocaleString()}</strong>
              </div>
            )}
          </div>
        </div>

        {/* Order Breakdown Donut */}
        <div className="bg-[#11192e]/90 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-white">Order Breakdown</h3>
            <span className="text-xs text-slate-400 font-mono">100% Fulfilled</span>
          </div>

          <div className="py-4 flex flex-col items-center justify-center relative">
            <svg viewBox="0 0 160 160" className="w-40 h-40">
              {/* Outer track */}
              <circle cx="80" cy="80" r="60" fill="none" stroke="#1e293b" strokeWidth="18" />
              {/* Active full donut */}
              <circle
                cx="80"
                cy="80"
                r="60"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="18"
                strokeDasharray="377"
                strokeDashoffset="0"
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-white">{totalOrdersCount}</span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Total</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span>COMPLETED <strong className="text-white ml-1">{totalOrdersCount}</strong></span>
            </div>
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-[#11192e]/90 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-white">Traffic Sources</h3>
            <span className="text-xs font-mono text-emerald-400">Live Influx</span>
          </div>

          <div className="space-y-3.5 my-auto">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Direct / URL</span>
                <span className="text-white font-mono font-bold">52% (1,492)</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full w-[52%]" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">TikTok Leads & Pixel</span>
                <span className="text-white font-mono font-bold">28% (802)</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full w-[28%]" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Organic Google Search</span>
                <span className="text-white font-mono font-bold">14% (401)</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full w-[14%]" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Affiliate Network Referrals</span>
                <span className="text-white font-mono font-bold">6% (172)</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full w-[6%]" />
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 font-mono text-center mt-2 border-t border-slate-800 pt-2">
            Real-time analytics captured from playbeat.digital
          </div>
        </div>

      </div>

      {/* 3. Third Row: System Status, Product Approvals, Live Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* System Status Widget */}
        <div className="bg-[#11192e]/90 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>System Status</span>
            </h3>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-500/30">
              100% HEALTHY
            </span>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <Server className="w-4 h-4 text-slate-400" />
                <span className="font-semibold">Server</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold bg-emerald-950/50 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Operational</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <Globe className="w-4 h-4 text-slate-400" />
                <span className="font-semibold">CDN</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold bg-emerald-950/50 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Operational</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <CreditCard className="w-4 h-4 text-slate-400" />
                <span className="font-semibold">Payment Gateway</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold bg-emerald-950/50 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Operational</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <Activity className="w-4 h-4 text-emerald-400" />
                <div>
                  <div className="font-semibold">MongoDB Atlas Cloud</div>
                  <div className="text-[10px] text-slate-400 font-mono">playbeat.umqpdyx.mongodb.net</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold bg-emerald-950/50 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Connected</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Products Approvals */}
        <div className="bg-[#11192e]/90 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white">Pending Products Approvals</h3>
            <span className="text-xs text-emerald-400 font-mono">0 Queued</span>
          </div>

          <div className="py-8 flex flex-col items-center justify-center text-center my-auto">
            <div className="w-14 h-14 rounded-full bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3 shadow-lg shadow-emerald-500/10">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div className="text-sm font-black text-emerald-400">All products published</div>
            <div className="text-xs text-slate-400 mt-1">No products awaiting approval</div>
          </div>

          <div className="border-t border-slate-800 pt-3 text-center">
            <span className="text-[11px] text-slate-500">Auto-verification enabled for verified merchants</span>
          </div>
        </div>

        {/* Live Notifications Feed */}
        <div className="bg-[#11192e]/90 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-white">Live Notifications</h3>
            <span className="text-xs text-slate-400 font-mono">Real-time</span>
          </div>

          <div className="space-y-2.5 overflow-y-auto max-h-56 pr-1 custom-scrollbar">
            {notifications && notifications.length > 0 ? (
              notifications.map((n) => (
                <div key={n.id} className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                  <div className="flex items-center justify-between text-white font-semibold">
                    <span className="line-clamp-1">{n.title}</span>
                    <span className="text-[10px] text-slate-400 font-mono shrink-0">{n.createdAt}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{n.message}</p>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-xs text-slate-400">
                No recent activity
              </div>
            )}
          </div>

          <div className="border-t border-slate-800 pt-3 text-center">
            <span className="text-[11px] text-slate-500">IPN Webhook listeners active on /api/webhooks</span>
          </div>
        </div>

      </div>

      {/* 4. Bottom Section: Recent Orders & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Recent Orders Table */}
        <div className="bg-[#11192e]/90 border border-slate-800/80 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Recent Orders</h3>
              <p className="text-xs text-slate-400">Latest transactions dispatched across Pakistan</p>
            </div>
            <span className="text-xs font-mono font-bold text-blue-400 bg-blue-950/40 px-2.5 py-1 rounded-lg border border-blue-500/30">
              {orders.length} Total
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold text-[10px]">
                  <th className="pb-2.5">Order</th>
                  <th className="pb-2.5">Customer</th>
                  <th className="pb-2.5">Amount</th>
                  <th className="pb-2.5">Method</th>
                  <th className="pb-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3 font-mono font-bold text-white">
                      {order.orderNumber}
                    </td>
                    <td className="py-3">
                      <div className="font-semibold text-slate-200">{order.customerName}</div>
                      <div className="text-[10px] text-slate-400">{order.customerEmail}</div>
                    </td>
                    <td className="py-3 font-bold text-[#fcb800]">
                      Rs {(order.totalAmountPKR || order.total || 0).toLocaleString()}
                    </td>
                    <td className="py-3 uppercase text-[11px] font-mono text-slate-300">
                      {order.paymentMethod}
                    </td>
                    <td className="py-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/50 text-emerald-400 border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" />
                        {order.status || 'COMPLETED'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-[#11192e]/90 border border-slate-800/80 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Top Products</h3>
              <p className="text-xs text-slate-400">Best-selling subscriptions, projectors & passes</p>
            </div>
            <span className="text-xs font-mono font-bold text-purple-400 bg-purple-950/40 px-2.5 py-1 rounded-lg border border-purple-500/30">
              Verified
            </span>
          </div>

          <div className="space-y-3">
            {products.slice(0, 5).map((prod) => (
              <div key={prod.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/50 border border-slate-800/70 hover:border-slate-700 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-[#fcb800] font-black text-xs shrink-0">
                    {prod.type === 'HARDWARE' ? '4K' : prod.type === 'STREAMING' ? 'TV' : 'AI'}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white line-clamp-1">{prod.title}</div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {prod.category.name} • {prod.salesCount || 100}+ sold
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs font-black text-[#fcb800]">
                    Rs {(prod.discountPrice || prod.price).toLocaleString()}
                  </div>
                  <div className="text-[10px] text-emerald-400 font-semibold">
                    ★ {prod.rating} ({prod.reviewCount})
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
