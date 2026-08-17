import React, { useState } from 'react';
import { 
  FileCheck2, 
  Check, 
  X, 
  ExternalLink, 
  Eye, 
  Clock, 
  DollarSign, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface ProofItem {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  txnId: string;
  method: 'JazzCash Manual' | 'EasyPaisa Manual' | 'Bank Transfer (Meezan/HBL)';
  amountPKR: number;
  screenshotUrl: string;
  submittedAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export const PaymentProofView: React.FC = () => {
  const [proofs, setProofs] = useState<ProofItem[]>([
    {
      id: 'proof-1',
      orderNumber: 'PB-984201',
      customerName: 'Muhammad Bilal',
      customerEmail: 'bilal@live.com',
      txnId: 'JC-84920194',
      method: 'JazzCash Manual',
      amountPKR: 1199,
      screenshotUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
      submittedAt: '10 mins ago',
      status: 'PENDING'
    },
    {
      id: 'proof-2',
      orderNumber: 'PB-984180',
      customerName: 'Usman Ali',
      customerEmail: 'usman@gmail.com',
      txnId: 'EP-49201948',
      method: 'EasyPaisa Manual',
      amountPKR: 4499,
      screenshotUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
      submittedAt: '1 hour ago',
      status: 'APPROVED'
    }
  ]);

  const [toast, setToast] = useState<string | null>(null);

  const handleApprove = (p: ProofItem) => {
    setProofs(proofs.map(item => item.id === p.id ? { ...item, status: 'APPROVED' } : item));
    setToast(`Payment for order ${p.orderNumber} approved! License keys dispatched to ${p.customerEmail}.`);
    setTimeout(() => setToast(null), 3000);
  };

  const handleReject = (p: ProofItem) => {
    setProofs(proofs.map(item => item.id === p.id ? { ...item, status: 'REJECTED' } : item));
    setToast(`Payment proof for ${p.orderNumber} rejected.`);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="space-y-6 pb-12">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-900 border border-emerald-500 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-bold animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#11192e]/90 border border-slate-800/80 p-4 rounded-2xl">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-purple-400" />
            <span>Manual Payment Slip & Proof Verification Queue</span>
          </h2>
          <p className="text-xs text-slate-400">Review uploaded JazzCash / EasyPaisa / Bank screenshots and approve instant key delivery</p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs font-bold text-amber-400 bg-amber-950/40 px-3 py-1.5 rounded-xl border border-amber-500/30">
          <span>Pending Slips: <strong>{proofs.filter(p => p.status === 'PENDING').length}</strong></span>
        </div>
      </div>

      {/* Proofs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {proofs.map(proof => (
          <div key={proof.id} className="bg-[#11192e]/90 border border-slate-800/80 p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono font-bold text-white text-sm">{proof.orderNumber}</span>
                <div className="text-[11px] text-slate-400 font-mono">Txn ID: {proof.txnId}</div>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                proof.status === 'APPROVED'
                  ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-500/30'
                  : proof.status === 'PENDING'
                  ? 'bg-amber-950/50 text-amber-400 border border-amber-500/30'
                  : 'bg-red-950/50 text-red-400 border border-red-500/30'
              }`}>
                {proof.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl">
                <div className="text-slate-400 text-[10px]">Customer:</div>
                <div className="font-bold text-white mt-0.5">{proof.customerName}</div>
                <div className="text-[10px] text-slate-400">{proof.customerEmail}</div>
              </div>

              <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl">
                <div className="text-slate-400 text-[10px]">Amount & Method:</div>
                <div className="font-bold text-[#fcb800] mt-0.5">Rs {proof.amountPKR.toLocaleString()}</div>
                <div className="text-[10px] text-slate-400 font-mono">{proof.method}</div>
              </div>
            </div>

            {/* Slip Thumbnail */}
            <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-slate-950 h-36 flex items-center justify-center group">
              <img
                src={proof.screenshotUrl}
                alt="Payment Slip Proof"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <a
                  href={proof.screenshotUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xl"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect Full Slip</span>
                </a>
              </div>
            </div>

            {/* Actions */}
            {proof.status === 'PENDING' && (
              <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => handleApprove(proof)}
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Approve & Dispatch Key</span>
                </button>
                <button
                  onClick={() => handleReject(proof)}
                  className="px-4 py-2 bg-red-950/40 border border-red-500/30 text-red-400 hover:bg-red-900/60 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
