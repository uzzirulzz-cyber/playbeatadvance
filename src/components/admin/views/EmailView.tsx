import React, { useState } from 'react';
import { 
  Mail, 
  Send, 
  CheckCircle2, 
  Key, 
  FileText, 
  Server,
  Sparkles
} from 'lucide-react';

export const EmailView: React.FC = () => {
  const [smtpHost, setSmtpHost] = useState('smtp.mailgun.org');
  const [smtpPort, setSmtpPort] = useState('587');
  const [senderEmail, setSenderEmail] = useState('support@playbeat.digital');
  const [testRecipient, setTestRecipient] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const handleSendTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testRecipient.trim()) return;
    setToast(`Test license voucher email dispatched to ${testRecipient}`);
    setTestRecipient('');
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
            <Mail className="w-5 h-5 text-purple-400" />
            <span>Transactional Email & SMTP Delivery</span>
          </h2>
          <p className="text-xs text-slate-400">Manage instant key delivery templates, order receipts, and SMTP gateway credentials</p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs font-bold text-emerald-400 bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-500/30">
          <span>SMTP Online (TLS 1.3)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* SMTP Configuration */}
        <div className="bg-[#11192e]/90 border border-slate-800/80 p-5 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Server className="w-4 h-4 text-purple-400" />
            <span>SMTP Server Configuration</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="block text-slate-300 font-bold mb-1">SMTP Host</label>
                <input
                  type="text"
                  value={smtpHost}
                  onChange={(e) => setSmtpHost(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-bold mb-1">Port</label>
                <input
                  type="text"
                  value={smtpPort}
                  onChange={(e) => setSmtpPort(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Sender Email Address</label>
              <input
                type="email"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800">
            <form onSubmit={handleSendTest} className="space-y-2">
              <label className="block text-slate-300 font-bold text-xs">Send Test Dispatch Email</label>
              <div className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="recipient@example.com"
                  value={testRecipient}
                  onChange={(e) => setTestRecipient(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder-slate-500 focus:border-purple-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Email Templates */}
        <div className="bg-[#11192e]/90 border border-slate-800/80 p-5 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-purple-400" />
            <span>Active Automated Templates</span>
          </h3>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center justify-between">
              <div>
                <div className="font-bold text-white">1. Instant License Key Voucher</div>
                <div className="text-[10px] text-slate-400 font-mono">Dispatched immediately after payment</div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/30">Active</span>
            </div>

            <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center justify-between">
              <div>
                <div className="font-bold text-white">2. Martfury Order Invoice & Receipt</div>
                <div className="text-[10px] text-slate-400 font-mono">Contains PDF tax breakdown & order ID</div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/30">Active</span>
            </div>

            <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center justify-between">
              <div>
                <div className="font-bold text-white">3. Subscription Expiry Reminder</div>
                <div className="text-[10px] text-slate-400 font-mono">Sent 48 hours prior to renewal</div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/30">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
