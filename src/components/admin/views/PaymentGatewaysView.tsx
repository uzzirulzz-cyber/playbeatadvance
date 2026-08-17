import React, { useState } from 'react';
import { 
  CreditCard, 
  Wallet, 
  ShieldCheck, 
  CheckCircle2, 
  Key, 
  Sliders,
  ExternalLink
} from 'lucide-react';

interface GatewayConfig {
  id: string;
  name: string;
  type: 'MOBILE_WALLET' | 'CARD' | 'CRYPTO';
  enabled: boolean;
  mode: 'LIVE' | 'SANDBOX';
  merchantId: string;
  apiKey: string;
  feePercent: string;
}

export const PaymentGatewaysView: React.FC = () => {
  const [gateways, setGateways] = useState<GatewayConfig[]>([
    {
      id: 'jazzcash',
      name: 'JazzCash Direct Merchant Gateway',
      type: 'MOBILE_WALLET',
      enabled: true,
      mode: 'LIVE',
      merchantId: 'MC_PLAYBEAT_849201',
      apiKey: 'sec_live_9842019482019482',
      feePercent: '1.9% + Rs 10'
    },
    {
      id: 'easypaisa',
      name: 'EasyPaisa Instant IPN Checkout',
      type: 'MOBILE_WALLET',
      enabled: true,
      mode: 'LIVE',
      merchantId: 'EP_STORE_2026_99',
      apiKey: 'ep_sec_849201948201',
      feePercent: '2.0%'
    },
    {
      id: 'stripe',
      name: 'Stripe Global Cards (Visa / Mastercard)',
      type: 'CARD',
      enabled: true,
      mode: 'LIVE',
      merchantId: 'acct_1Nx84920PlayBeat',
      apiKey: 'sk_live_51Nx84920PlayBeatKey',
      feePercent: '2.9% + $0.30'
    },
    {
      id: 'binance',
      name: 'Binance Pay (USDT / BTC / SOL)',
      type: 'CRYPTO',
      enabled: true,
      mode: 'LIVE',
      merchantId: 'BINANCE_MERCHANT_PLAYBEAT',
      apiKey: 'binance_live_key_984201',
      feePercent: '0.5%'
    }
  ]);

  const toggleGateway = (id: string) => {
    setGateways(gateways.map(g => g.id === id ? { ...g, enabled: !g.enabled } : g));
  };

  const toggleMode = (id: string) => {
    setGateways(gateways.map(g => g.id === id ? { ...g, mode: g.mode === 'LIVE' ? 'SANDBOX' : 'LIVE' } : g));
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#11192e]/90 border border-slate-800/80 p-4 rounded-2xl">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-purple-400" />
            <span>Payment Gateways & Merchant IPN Integrations</span>
          </h2>
          <p className="text-xs text-slate-400">Configure Pakistan & Global checkout channels, webhook secrets, and live API credentials</p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs font-bold text-emerald-400 bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-500/30">
          <ShieldCheck className="w-4 h-4" />
          <span>IPN Listeners Active</span>
        </div>
      </div>

      {/* Gateways Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {gateways.map(gw => (
          <div key={gw.id} className="bg-[#11192e]/90 border border-slate-800/80 p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <Wallet className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{gw.name}</h3>
                  <div className="text-[10px] text-slate-400 font-mono">Fee: {gw.feePercent}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleMode(gw.id)}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold cursor-pointer transition-colors ${
                    gw.mode === 'LIVE' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' : 'bg-amber-950 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {gw.mode}
                </button>

                <button
                  onClick={() => toggleGateway(gw.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    gw.enabled
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {gw.enabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            </div>

            <div className="space-y-2.5 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-0.5">Merchant ID / Account Ref</label>
                <input
                  type="text"
                  readOnly
                  value={gw.merchantId}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-0.5">Secret Key / Salt</label>
                <input
                  type="password"
                  readOnly
                  value={gw.apiKey}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-mono text-[11px]"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>IPN URL: /api/ipn/{gw.id}</span>
              <span className="text-emerald-400">TLS 1.3 Verified</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
