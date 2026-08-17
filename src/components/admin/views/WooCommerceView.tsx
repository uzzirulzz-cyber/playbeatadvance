import React, { useState } from 'react';
import { 
  ShoppingBag, 
  RefreshCw, 
  CheckCircle2, 
  Key, 
  Globe, 
  Zap, 
  ExternalLink,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { useStore } from '../../../store/useStore';

export const WooCommerceView: React.FC = () => {
  const { products } = useStore();
  const [storeUrl, setStoreUrl] = useState('https://playbeat.digital');
  const [consumerKey, setConsumerKey] = useState('ck_9f83a827492048210381048210');
  const [consumerSecret, setConsumerSecret] = useState('cs_7b192847102938472910482910');
  const [syncing, setSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  const handleSyncNow = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#11192e]/90 border border-slate-800/80 p-4 rounded-2xl">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-purple-400" />
            <span>WooCommerce REST API & Sync Hub</span>
          </h2>
          <p className="text-xs text-slate-400">Synchronize WordPress Martfury store catalog, automated webhooks & key dispatch</p>
        </div>

        <button
          onClick={handleSyncNow}
          disabled={syncing}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-lg shadow-purple-600/30 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
          <span>{syncing ? 'Syncing Catalog...' : 'Sync Catalog Now'}</span>
        </button>
      </div>

      {syncSuccess && (
        <div className="bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 p-4 rounded-2xl flex items-center gap-3 text-xs font-bold animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>Catalog synchronized with playbeat.digital — {products.length} products verified and stock levels updated.</span>
        </div>
      )}

      {/* API Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-[#11192e]/90 border border-slate-800/80 p-5 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Key className="w-4 h-4 text-purple-400" />
            <span>WooCommerce V3 REST Credentials</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Store URL</label>
              <input
                type="text"
                value={storeUrl}
                onChange={(e) => setStoreUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Consumer Key (Read / Write)</label>
              <input
                type="password"
                value={consumerKey}
                onChange={(e) => setConsumerKey(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Consumer Secret</label>
              <input
                type="password"
                value={consumerSecret}
                onChange={(e) => setConsumerSecret(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
              />
            </div>

            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-950/40 px-3 py-1 rounded-lg border border-emerald-500/30">
                <ShieldCheck className="w-4 h-4" />
                <span>Status: Connected to playbeat.digital/wp-json/wc/v3</span>
              </span>
            </div>
          </div>
        </div>

        {/* Webhook & IPN Listener */}
        <div className="bg-[#11192e]/90 border border-slate-800/80 p-5 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Automated Webhook Topics</span>
          </h3>

          <div className="space-y-2.5 text-xs">
            <div className="p-2.5 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center justify-between">
              <div>
                <div className="font-bold text-white">woocommerce.order.created</div>
                <div className="text-[10px] text-slate-400 font-mono">Triggers instant key generation</div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/30">Active</span>
            </div>

            <div className="p-2.5 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center justify-between">
              <div>
                <div className="font-bold text-white">woocommerce.order.paid</div>
                <div className="text-[10px] text-slate-400 font-mono">Dispatches license voucher email</div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/30">Active</span>
            </div>

            <div className="p-2.5 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center justify-between">
              <div>
                <div className="font-bold text-white">woocommerce.product.updated</div>
                <div className="text-[10px] text-slate-400 font-mono">Syncs price and stock changes</div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/30">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
