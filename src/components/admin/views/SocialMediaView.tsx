import React, { useState } from 'react';
import { 
  Share2, 
  Sparkles, 
  TrendingUp, 
  CheckCircle2, 
  ExternalLink, 
  Layers, 
  Globe2
} from 'lucide-react';

export const SocialMediaView: React.FC = () => {
  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#11192e]/90 border border-slate-800/80 p-4 rounded-2xl">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Share2 className="w-5 h-5 text-purple-400" />
            <span>Social Pixels & Viral Campaign Tracking</span>
          </h2>
          <p className="text-xs text-slate-400">Meta Pixel, TikTok Events API, WhatsApp Click-to-Chat & UTM link builder</p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs font-bold text-emerald-400 bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-500/30">
          <span>Pixel Tracking Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Meta Pixel */}
        <div className="bg-[#11192e]/90 border border-slate-800/80 p-5 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Meta Pixel (Facebook/IG)</h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30 font-mono font-bold">Active</span>
          </div>
          <div className="text-xs text-slate-400">Pixel ID: <code className="text-purple-300 font-mono">198420194820194</code></div>
          <div className="p-3 bg-slate-900/60 rounded-xl text-[11px] font-mono text-slate-300 space-y-1">
            <div>• Purchase Event: Active</div>
            <div>• AddToCart Event: Active</div>
            <div>• ViewContent Event: Active</div>
          </div>
        </div>

        {/* TikTok Events API */}
        <div className="bg-[#11192e]/90 border border-slate-800/80 p-5 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">TikTok Events API</h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30 font-mono font-bold">Active</span>
          </div>
          <div className="text-xs text-slate-400">Pixel Code: <code className="text-purple-300 font-mono">TT_PB_DIGITAL_984</code></div>
          <div className="p-3 bg-slate-900/60 rounded-xl text-[11px] font-mono text-slate-300 space-y-1">
            <div>• CompletePayment: Active</div>
            <div>• Lead Submit: Active</div>
            <div>• Real-time Conversions: 99.4%</div>
          </div>
        </div>

        {/* WhatsApp Channel */}
        <div className="bg-[#11192e]/90 border border-slate-800/80 p-5 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">WhatsApp Business API</h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30 font-mono font-bold">Connected</span>
          </div>
          <div className="text-xs text-slate-400">Phone: <code className="text-purple-300 font-mono">+92 300 1234567</code></div>
          <div className="p-3 bg-slate-900/60 rounded-xl text-[11px] font-mono text-slate-300 space-y-1">
            <div>• Auto-Reply Bot: Enabled</div>
            <div>• Daily Inquiries: 140+ chats</div>
            <div>• Average Reply Time: 45s</div>
          </div>
        </div>
      </div>
    </div>
  );
};
