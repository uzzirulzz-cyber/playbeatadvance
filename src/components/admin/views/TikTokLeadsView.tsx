import React, { useState } from 'react';
import { 
  Sparkles, 
  Download, 
  Search, 
  CheckCircle2, 
  Phone, 
  Mail, 
  TrendingUp 
} from 'lucide-react';

interface TikTokLead {
  id: string;
  leadName: string;
  phone: string;
  email: string;
  productInterest: string;
  adCampaign: string;
  submittedAt: string;
  status: 'NEW' | 'CONTACTED' | 'CONVERTED';
}

export const TikTokLeadsView: React.FC = () => {
  const [leads, setLeads] = useState<TikTokLead[]>([
    {
      id: 'lead-1',
      leadName: 'Ahmed Raza',
      phone: '+92 301 9842019',
      email: 'ahmed.raza@gmail.com',
      productInterest: 'Lumix CinemaPro 4K Laser Projector',
      adCampaign: 'TikTok_Projector_Offer_Aug26',
      submittedAt: '15 mins ago',
      status: 'NEW'
    },
    {
      id: 'lead-2',
      leadName: 'Danish Ali',
      phone: '+92 345 8829104',
      email: 'danish@yahoo.com',
      productInterest: 'Netflix UHD 4K + Spotify Combo',
      adCampaign: 'TikTok_StreamingPasses_Viral',
      submittedAt: '2 hours ago',
      status: 'CONVERTED'
    },
    {
      id: 'lead-3',
      leadName: 'Kashif Mehmood',
      phone: '+92 333 1199201',
      email: 'kashif@outlook.com',
      productInterest: 'IPTV 4K Platinum 12-Month Line',
      adCampaign: 'TikTok_IPTV_Cricket_Promo',
      submittedAt: '5 hours ago',
      status: 'CONTACTED'
    }
  ]);

  const [toast, setToast] = useState<string | null>(null);

  const handleExportCsv = () => {
    setToast('Leads exported to tiktok-leads-playbeat-2026.csv');
    setTimeout(() => setToast(null), 3000);
  };

  const updateLeadStatus = (id: string, newStatus: TikTokLead['status']) => {
    setLeads(leads.map(l => l.id === id ? { ...l, status: newStatus } : l));
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
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span>TikTok Ads Instant Lead Capture</span>
          </h2>
          <p className="text-xs text-slate-400">Manage high-intent customer leads captured directly from TikTok in-feed instant forms</p>
        </div>

        <button
          onClick={handleExportCsv}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-lg shadow-purple-600/30 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export Leads CSV</span>
        </button>
      </div>

      {/* Leads Table */}
      <div className="bg-[#11192e]/90 border border-slate-800/80 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold text-[10px] bg-slate-900/60">
                <th className="py-3 px-4">Lead Name</th>
                <th className="py-3 px-4">Contact Details</th>
                <th className="py-3 px-4">Product of Interest</th>
                <th className="py-3 px-4">Ad Campaign</th>
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {leads.map(lead => (
                <tr key={lead.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-white">
                    {lead.leadName}
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-slate-200">{lead.phone}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{lead.email}</div>
                  </td>
                  <td className="py-3 px-4 font-semibold text-[#fcb800]">
                    {lead.productInterest}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                    {lead.adCampaign}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400">
                    {lead.submittedAt}
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={lead.status}
                      onChange={(e) => updateLeadStatus(lead.id, e.target.value as any)}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-bold outline-none cursor-pointer ${
                        lead.status === 'CONVERTED'
                          ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-500/30'
                          : lead.status === 'CONTACTED'
                          ? 'bg-blue-950/50 text-blue-400 border border-blue-500/30'
                          : 'bg-purple-950/50 text-purple-300 border border-purple-500/30'
                      }`}
                    >
                      <option value="NEW">NEW</option>
                      <option value="CONTACTED">CONTACTED</option>
                      <option value="CONVERTED">CONVERTED</option>
                    </select>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <a
                      href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(lead.leadName)},%20thank%20you%20for%20your%20inquiry%20on%20PlayBeat%20Digital!`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/60 rounded-lg text-[11px] font-bold inline-flex items-center gap-1 transition-colors"
                    >
                      <Phone className="w-3 h-3" />
                      <span>WhatsApp</span>
                    </a>
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
