import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  CheckCircle2, 
  Calendar, 
  FileText, 
  FileCheck,
  DollarSign
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  const handleDownload = (filename: string) => {
    setDownloadToast(`Generated and downloaded ${filename}`);
    setTimeout(() => setDownloadToast(null), 3000);
  };

  return (
    <div className="space-y-6 pb-12">
      {downloadToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-900 border border-emerald-500 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-bold animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{downloadToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#11192e]/90 border border-slate-800/80 p-4 rounded-2xl">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-purple-400" />
            <span>Reports, Audits & Accounting Statements</span>
          </h2>
          <p className="text-xs text-slate-400">Export tax reports, license delivery logs, monthly P&L summaries, and vendor payout files</p>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-[#11192e]/90 border border-slate-800/80 p-5 rounded-2xl space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 text-white font-bold text-sm">
              <FileSpreadsheet className="w-5 h-5 text-purple-400" />
              <span>Full Order & Sales Ledger (CSV)</span>
            </div>
            <p className="text-xs text-slate-400">
              Includes all completed, pending, and refunded orders with transaction reference IDs, customer emails, and payment channels.
            </p>
          </div>
          <button
            onClick={() => handleDownload('playbeat-orders-ledger-2026.csv')}
            className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV Statement</span>
          </button>
        </div>

        <div className="bg-[#11192e]/90 border border-slate-800/80 p-5 rounded-2xl space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 text-white font-bold text-sm">
              <FileCheck className="w-5 h-5 text-emerald-400" />
              <span>License Key Dispatch Vault Log (PDF)</span>
            </div>
            <p className="text-xs text-slate-400">
              Complete security audit trail of generated and dispatched license vouchers, serials, and IPTV M3U credentials.
            </p>
          </div>
          <button
            onClick={() => handleDownload('playbeat-key-dispatch-audit.pdf')}
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Audit PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
