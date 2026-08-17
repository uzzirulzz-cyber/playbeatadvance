import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { 
  Headphones, 
  X, 
  Send, 
  Bot, 
  User, 
  HelpCircle, 
  Zap, 
  Key, 
  ShieldCheck, 
  Sparkles,
  MessageSquare
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
}

export const LiveSupportAssistant: React.FC = () => {
  const { isSupportOpen, setIsSupportOpen } = useStore();
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: 'Hello! I am the PlayBeat 24/7 Automated Desk. How can I assist you with license keys, activations, or payment methods today?',
      time: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');

  if (!isSupportOpen) {
    return (
      <button
        onClick={() => setIsSupportOpen(true)}
        className="fixed bottom-5 right-5 z-40 p-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-2xl shadow-indigo-600/50 flex items-center gap-2 font-bold text-xs cursor-pointer transform hover:scale-105 transition-all border border-indigo-400/30"
      >
        <Headphones className="w-5 h-5" />
        <span className="hidden sm:inline">24/7 Live Key Support</span>
        <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
      </button>
    );
  }

  const quickQuestions = [
    'How are license keys delivered?',
    'How do I activate Netflix 4K PIN?',
    'What payment methods are supported?',
    'What is the warranty policy?'
  ];

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      time: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    // Generate intelligent AI response
    setTimeout(() => {
      let reply = "Our automated systems operate 24/7. All license keys are generated instantly and visible in your License Vault and sent to your email address.";
      
      const lower = text.toLowerCase();
      if (lower.includes('deliver') || lower.includes('key')) {
        reply = "Keys are generated automatically via our cryptographic vault within 2 seconds of checkout. You can also view them anytime in the 'License Vault' button in the top menu.";
      } else if (lower.includes('netflix') || lower.includes('pin') || lower.includes('stream')) {
        reply = "For Netflix 4K, you receive a 16-digit voucher PIN. Go to netflix.com/redeem, paste your code, and your 12-month UHD access will activate immediately!";
      } else if (lower.includes('payment') || lower.includes('jazzcash') || lower.includes('card')) {
        reply = "We support instant JazzCash, EasyPaisa, Visa, Mastercard, American Express, PayPal, Lemon Squeezy, and Crypto (USDT/BTC).";
      } else if (lower.includes('warranty') || lower.includes('replace') || lower.includes('refund')) {
        reply = "All products come with a 100% replacement warranty for the duration of the plan. If any key ever fails, click 'License Vault' to request an instant automated replacement key.";
      }

      const aiMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        text: reply,
        time: 'Just now'
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 600);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 w-full max-w-sm rounded-3xl glass-dropdown border border-indigo-500/40 shadow-2xl overflow-hidden flex flex-col h-[480px] animate-in fade-in zoom-in-95 duration-200">
      
      {/* Header */}
      <div className="p-3.5 bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-600/30 text-indigo-400 flex items-center justify-center font-bold">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="font-extrabold text-xs text-white flex items-center gap-1.5">
              <span>PlayBeat AI Desk</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <span className="text-[10px] text-slate-400">Average response: Instant</span>
          </div>
        </div>

        <button
          onClick={() => setIsSupportOpen(false)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-3.5 space-y-3 overflow-y-auto text-xs bg-slate-950/60">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'ai' && (
              <div className="w-6 h-6 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5" />
              </div>
            )}
            
            <div
              className={`p-3 rounded-2xl max-w-[80%] leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-none font-medium'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {/* Quick Question suggestions */}
        <div className="pt-2 space-y-1.5">
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            Quick Topics:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {quickQuestions.map(q => (
              <button
                key={q}
                onClick={() => handleSendMessage(q)}
                className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-indigo-600/20 border border-slate-800 hover:border-indigo-500/30 text-[11px] text-slate-300 hover:text-indigo-200 transition-all text-left cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input bar */}
      <div className="p-2.5 bg-slate-900 border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-1.5"
        >
          <input
            type="text"
            placeholder="Type your question or query..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 h-9 px-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
};
