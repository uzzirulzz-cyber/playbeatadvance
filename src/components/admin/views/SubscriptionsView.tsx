import React, { useState } from 'react';
import { 
  RefreshCw, 
  Tv, 
  Sparkles, 
  Key, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Send,
  Plus
} from 'lucide-react';
import { useStore } from '../../../store/useStore';

interface SubItem {
  id: string;
  customerName: string;
  customerEmail: string;
  planName: string;
  slotPin: string;
  renewalDate: string;
  status: 'ACTIVE' | 'EXPIRING' | 'EXPIRED';
  pricePKR: number;
}

export const SubscriptionsView: React.FC = () => {
  const [subs, setSubs] = useState<SubItem[]>([
    {
      id: 'sub-1',
      customerName: 'Alex Vance',
      customerEmail: 'alex@playbeat.io',
      planName: 'Netflix UHD 4K (Private Profile #3)',
      slotPin: 'PIN-8492',
      renewalDate: '2026-09-16',
      status: 'ACTIVE',
      pricePKR: 1199
    },
    {
      id: 'sub-2',
      customerName: 'Hamza Tariq',
      customerEmail: 'hamza.dev@gmail.com',
      planName: 'ChatGPT Plus & Codex Team Pass',
      slotPin: 'OAI-TEAM-892',
      renewalDate: '2026-09-20',
      status: 'ACTIVE',
      pricePKR: 4499
    },
    {
      id: 'sub-3',
      customerName: 'Bilal Khan',
      customerEmail: 'bilal@cinema.pk',
      planName: 'IPTV 4K Platinum 12-Month Line',
      slotPin: 'M3U-PK-98210',
      renewalDate: '2026-08-22',
      status: 'EXPIRING',
      pricePKR: 5999
    }
  ]);

  const [toast, setToast] = useState<string | null>(null);

  const handleRenew = (sub: SubItem) => {
    setSubs(subs.map(s => s.id === sub.id ? { ...s, status: 'ACTIVE', renewalDate: '2026-10-16' } : s));
    setToast(`Subscription for ${sub.customerName} renewed for 30 days.`);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="space-y-6 pb-12">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-900 border border-emerald-500 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-bold">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#11192e]/90 border border-slate-800/80 p-4 rounded-2xl">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-purple-400" />
            <span>Recurring Subscriptions & Stream Passes</span>
          </h2>
          <p className="text-xs text-slate-400">Automated recurring billing, profile pin management & subscription expiration triggers</p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-300 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
          <span>Active Passes: <strong className="text-purple-400">{subs.filter(s => s.status === 'ACTIVE').length}</strong></span>
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="bg-[#11192e]/90 border border-slate-800/80 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold text-[10px] bg-slate-900/60">
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Subscription Plan</th>
                <th className="py-3 px-4">Credential / PIN</th>
                <th className="py-3 px-4">Next Renewal</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {subs.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-white">{sub.customerName}</div>
                    <div className="text-[10px] text-slate-400">{sub.customerEmail}</div>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-200">
                    {sub.planName}
                  </td>
                  <td className="py-3 px-4">
                    <code className="px-2 py-0.5 rounded bg-purple-950/50 border border-purple-500/30 text-purple-300 font-mono text-[11px]">
                      {sub.slotPin}
                    </code>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-300">
                    {sub.renewalDate}
                  </td>
                  <td className="py-3 px-4 font-bold text-[#fcb800]">
                    Rs {sub.pricePKR.toLocaleString()}/mo
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      sub.status === 'ACTIVE'
                        ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-950/50 text-amber-400 border border-amber-500/30'
                    }`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleRenew(sub)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/60 text-[11px] font-bold transition-colors cursor-pointer"
                    >
                      Extend 30d
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
