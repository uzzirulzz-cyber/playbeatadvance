import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Download, 
  Wallet, 
  CreditCard, 
  ShieldCheck,
  FileSpreadsheet
} from 'lucide-react';
import { useStore } from '../../../store/useStore';

export const FinanceView: React.FC = () => {
  const { orders } = useStore();
  const grossSales = orders.reduce((sum, o) => sum + (o.totalAmountPKR || o.total || 0), 0) || 2512;
  const paymentGatewayFees = Math.round(grossSales * 0.025);
  const vendorPayouts = Math.round(grossSales * 0.70);
  const netPlatformProfit = grossSales - paymentGatewayFees - vendorPayouts;

  const [toast, setToast] = useState<string | null>(null);

  const handleExport = () => {
    setToast('Financial ledger exported to playbeat-financial-statement-2026.csv');
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="space-y-6 pb-12">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-900 border border-emerald-500 text-white px-4 py-3 rounded-2xl shadow-2xl text-xs font-bold animate-in fade-in">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#11192e]/90 border border-slate-800/80 p-4 rounded-2xl">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-purple-400" />
            <span>Finance & Platform Treasury (PKR)</span>
          </h2>
          <p className="text-xs text-slate-400">Escrow settlement, vendor split calculations, merchant fees & payout schedules</p>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-lg shadow-purple-600/30 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export Financial Statement</span>
        </button>
      </div>

      {/* 4 Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#11192e]/90 border border-slate-800/80 p-4 rounded-2xl">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gross Merchandise Value</div>
          <div className="text-2xl font-black text-white mt-2">Rs {grossSales.toLocaleString()}</div>
          <div className="text-[11px] text-emerald-400 mt-1 font-semibold flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>All verified orders</span>
          </div>
        </div>

        <div className="bg-[#11192e]/90 border border-slate-800/80 p-4 rounded-2xl">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Platform Net Profit</div>
          <div className="text-2xl font-black text-emerald-400 mt-2">Rs {netPlatformProfit.toLocaleString()}</div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">27.5% retained platform margin</div>
        </div>

        <div className="bg-[#11192e]/90 border border-slate-800/80 p-4 rounded-2xl">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Vendor Escrow Balance</div>
          <div className="text-2xl font-black text-[#fcb800] mt-2">Rs {vendorPayouts.toLocaleString()}</div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">Dispatched bi-weekly on Fridays</div>
        </div>

        <div className="bg-[#11192e]/90 border border-slate-800/80 p-4 rounded-2xl">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Payment IPN Fees (2.5%)</div>
          <div className="text-2xl font-black text-slate-300 mt-2">Rs {paymentGatewayFees.toLocaleString()}</div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">JazzCash & 1Link Gateway</div>
        </div>
      </div>

      {/* Payout Queue */}
      <div className="bg-[#11192e]/90 border border-slate-800/80 p-5 rounded-2xl">
        <h3 className="text-sm font-bold text-white mb-4">Vendor Payout Queue</h3>
        
        <div className="space-y-3">
          <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center justify-between">
            <div>
              <div className="font-bold text-white text-xs">Lumix Cinema Official Store</div>
              <div className="text-[11px] text-slate-400 font-mono">Bank: Meezan Bank (PK82MEZN009842019482)</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-[#fcb800] text-xs">Rs 74,999</div>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-500/30">Cleared</span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center justify-between">
            <div>
              <div className="font-bold text-white text-xs">PlayBeat Stream Cloud Partner</div>
              <div className="text-[11px] text-slate-400 font-mono">JazzCash Merchant Wallet: 03001234567</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-[#fcb800] text-xs">Rs 2,512</div>
              <span className="text-[10px] text-purple-400 font-bold bg-purple-950/50 px-2 py-0.5 rounded-full border border-purple-500/30">Pending Batch</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
