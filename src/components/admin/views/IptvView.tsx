import React, { useState } from 'react';
import { 
  Tv, 
  Plus, 
  Server, 
  CheckCircle2, 
  Copy, 
  RefreshCw, 
  Globe, 
  ShieldCheck,
  Play
} from 'lucide-react';

interface IptvAccount {
  id: string;
  username: string;
  serverUrl: string;
  maxConnections: number;
  expireDate: string;
  status: 'ONLINE' | 'STANDBY';
  channelsCount: number;
}

export const IptvView: React.FC = () => {
  const [accounts, setAccounts] = useState<IptvAccount[]>([]);

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyM3u = (acc: IptvAccount) => {
    // NOTE: Password must be retrieved from secure environment variables, NOT hardcoded
    const password = process.env.REACT_APP_IPTV_PASSWORD || '';
    const url = `${acc.serverUrl}/get.php?username=${acc.username}&password=${password}&type=m3u_plus&output=ts`;
    navigator.clipboard.writeText(url);
    setCopiedId(acc.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#11192e]/90 border border-slate-800/80 p-4 rounded-2xl">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Tv className="w-5 h-5 text-purple-400" />
            <span>IPTV & Xtream Codes Line Management</span>
          </h2>
          <p className="text-xs text-slate-400">4K Live TV, sports streams, Pakistani channels & automated M3U playlist dispatch</p>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-lg shadow-purple-600/30 cursor-pointer">
          <Plus className="w-4 h-4" />
          <span>Generate New M3U Line</span>
        </button>
      </div>

      {/* Cluster Nodes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#11192e]/90 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Server className="w-8 h-8 text-blue-400" />
            <div>
              <div className="text-xs font-bold text-white">PK Low-Latency Edge 1</div>
              <div className="text-[10px] text-slate-400 font-mono">18ms Ping • 1.2 Gbps</div>
            </div>
          </div>
          <span className="text-emerald-400 font-mono text-xs font-bold bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-500/30">ONLINE</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#11192e]/90 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Server className="w-8 h-8 text-purple-400" />
            <div>
              <div className="text-xs font-bold text-white">UK Cinema Stream CDN</div>
              <div className="text-[10px] text-slate-400 font-mono">32ms Ping • 4.8 Gbps</div>
            </div>
          </div>
          <span className="text-emerald-400 font-mono text-xs font-bold bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-500/30">ONLINE</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#11192e]/90 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Server className="w-8 h-8 text-emerald-400" />
            <div>
              <div className="text-xs font-bold text-white">SG Backup Load Balancer</div>
              <div className="text-[10px] text-slate-400 font-mono">45ms Ping • 850 Mbps</div>
            </div>
          </div>
          <span className="text-emerald-400 font-mono text-xs font-bold bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-500/30">ONLINE</span>
        </div>
      </div>

      {/* Active Accounts Table */}
      <div className="bg-[#11192e]/90 border border-slate-800/80 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold text-[10px] bg-slate-900/60">
                <th className="py-3 px-4">Account Line</th>
                <th className="py-3 px-4">Server Host</th>
                <th className="py-3 px-4">Connections</th>
                <th className="py-3 px-4">Channels & VOD</th>
                <th className="py-3 px-4">Expiry</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">M3U Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {accounts.map((acc) => (
                <tr key={acc.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-mono font-bold text-white">{acc.username}</div>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-300">
                    {acc.serverUrl}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-purple-400">
                    {acc.maxConnections} Screens
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-200">
                    {acc.channelsCount.toLocaleString()} Live + Movies
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-300">
                    {acc.expireDate}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/50 text-emerald-400 border border-emerald-500/30">
                      {acc.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => copyM3u(acc)}
                      className="px-3 py-1 bg-purple-950/40 border border-purple-500/30 text-purple-300 hover:bg-purple-900/60 rounded-lg text-[11px] font-bold inline-flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedId === acc.id ? 'Copied URL!' : 'Copy M3U URL'}</span>
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
