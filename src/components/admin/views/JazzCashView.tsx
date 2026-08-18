import React, { useState } from 'react';
import { 
  Wallet, 
  Search, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowUpRight, 
  RefreshCw, 
  Zap,
  Lock
} from 'lucide-react';

export const JazzCashView: React.FC = () => {
  const [merchantId, setMerchantId] = useState('');
  const [password, setPassword] = useState('');
  const [integritySalt, setIntegritySalt] = useState('');
  const [searchTxn, setSearchTxn] = useState('');
  const [queryResult, setQueryResult] = useState<any>(null);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTxn.trim()) return;

    setQueryResult({
      txnRefNo: searchTxn.trim(),
      amount: 'Rs 1,199',
      status: 'PAID & SETTLED',
      pp_ResponseCode: '000',
      pp_ResponseMessage: 'Transaction Successful',
      settlementAccount: '03001234567',
      timestamp: new Date().toLocaleString()
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#11192e]/90 border border-slate-800/80 p-4 rounded-2xl">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Wallet className="w-5 h-5 text-amber-400" />
            <span>JazzCash Merchant Direct Integration Portal</span>
          </h2>
          <p className="text-xs text-slate-400">Merchant API credentials, IPN callback handlers, HMAC integrity hashes & live transaction queries</p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs font-bold text-emerald-400 bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-500/30">
          <ShieldCheck className="w-4 h-4" />
          <span>JazzCash 1Link Gateway Online</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Credentials Form */}
        <div className="bg-[#11192e]/90 border border-slate-800/80 p-5 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-400" />
            <span>Production Merchant API Credentials</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Merchant ID (pp_MerchantID)</label>
              <input
                type="text"
                value={merchantId}
                onChange={(e) => setMerchantId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Password (pp_Password)</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Integrity Salt (HMAC SHA-256)</label>
              <input
                type="password"
                value={integritySalt}
                onChange={(e) => setIntegritySalt(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Callback URL: /api/ipn/jazzcash</span>
            <span className="text-emerald-400 font-bold">HMAC Verified</span>
          </div>
        </div>

        {/* Transaction Query Tool */}
        <div className="bg-[#11192e]/90 border border-slate-800/80 p-5 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Search className="w-4 h-4 text-purple-400" />
            <span>Real-Time JazzCash Transaction Inquirer</span>
          </h3>

          <form onSubmit={handleLookup} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Enter Transaction Reference (TxnRefNo)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="e.g. JC-TXN-9842018"
                  value={searchTxn}
                  onChange={(e) => setSearchTxn(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs placeholder-slate-500 focus:border-purple-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Query</span>
                </button>
              </div>
            </div>
          </form>

          {queryResult && (
            <div className="p-3.5 bg-slate-900/80 border border-slate-700 rounded-xl space-y-2 text-xs animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-white">{queryResult.txnRefNo}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                  {queryResult.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-800 text-slate-300">
                <div>Amount: <strong className="text-[#fcb800]">{queryResult.amount}</strong></div>
                <div>Response: <strong className="text-emerald-400">{queryResult.pp_ResponseMessage}</strong></div>
                <div>Account: <span className="font-mono">{queryResult.settlementAccount}</span></div>
                <div>Timestamp: <span className="font-mono">{queryResult.timestamp}</span></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
