import React, { useState } from 'react';
import { MessageCircle, X, Send, ExternalLink, ShieldCheck, Zap } from 'lucide-react';

export const WhatsAppFloatingButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const phoneNumber = '+923321029333';
  const cleanPhone = '923321029333';

  const quickMessages = [
    'Hi, I want to order a Smart Projector.',
    'Is the Magcubic HY300 PRO available in stock?',
    'I want to purchase a Windows 11 Pro / Office key.',
    'Need help with payment / JazzCash / EasyPaisa.'
  ];

  const handleSend = (text?: string) => {
    const query = encodeURIComponent(text || message || 'Hi PlayBeat Digital, I need assistance with an order.');
    window.open(`https://wa.me/${cleanPhone}?text=${query}`, '_blank');
    setIsOpen(false);
    setMessage('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Popover Card */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 rounded-2xl bg-[#0f172a] border border-slate-700 shadow-2xl shadow-black/80 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="p-4 bg-emerald-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white">
                  <MessageCircle className="w-6 h-6 fill-white" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-emerald-600 animate-pulse" />
              </div>
              <div>
                <h4 className="text-sm font-bold">PlayBeat Digital Support</h4>
                <p className="text-[11px] text-emerald-100 flex items-center gap-1">
                  <span>Online</span>
                  <span>•</span>
                  <span>{phoneNumber}</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 space-y-3 bg-[#0a0f1d]">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed">
              👋 Assalam-o-Alaikum! Welcome to <strong className="text-white">PlayBeat Digital & ZeroByte Store</strong>. How can we help you today with smart projectors or software licenses?
            </div>

            {/* Quick Prompts */}
            <div className="space-y-1.5">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Quick Inquiries:</div>
              {quickMessages.map((msg, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(msg)}
                  className="w-full text-left p-2 rounded-lg bg-slate-900/80 hover:bg-emerald-950/60 border border-slate-800 hover:border-emerald-500/40 text-xs text-slate-300 hover:text-emerald-300 transition-all cursor-pointer truncate"
                >
                  {msg}
                </button>
              ))}
            </div>

            {/* Custom Input */}
            <div className="pt-2 flex items-center gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={() => handleSend()}
                className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-all cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Footer badge */}
          <div className="px-4 py-2 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400">
              <Zap className="w-3 h-3" />
              Direct Official WhatsApp
            </span>
            <span>24/7 Priority Support</span>
          </div>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-950/50 hover:shadow-emerald-600/40 transition-all duration-300 cursor-pointer active:scale-95"
        title="Chat on WhatsApp +923321029333"
      >
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-300 border border-emerald-700" />
        </span>
        
        <MessageCircle className="w-5 h-5 fill-white shrink-0" />
        <span className="font-semibold tracking-wide">WhatsApp Us</span>
      </button>
    </div>
  );
};
