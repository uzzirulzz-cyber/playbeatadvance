import React from 'react';
import { Search, RotateCcw, Bell, Shield, ExternalLink } from 'lucide-react';
import { useStore } from '../../store/useStore';

interface AdminHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onResetAll: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  searchQuery,
  setSearchQuery,
  onResetAll
}) => {
  const { setActiveView, notifications } = useStore();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="h-16 px-6 bg-[#0f172a]/95 backdrop-blur border-b border-slate-800/80 flex items-center justify-between gap-4 shrink-0">
      {/* Search Admin Input */}
      <div className="relative w-72 sm:w-96">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search admin..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-900/90 border border-slate-700 text-slate-200 placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-colors"
        />
      </div>

      {/* Right Action Tools */}
      <div className="flex items-center gap-3">
        {/* View Storefront Shortcut */}
        <button
          onClick={() => setActiveView('storefront')}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-purple-500/50 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <ExternalLink className="w-3.5 h-3.5 text-purple-400" />
          <span>View Store</span>
        </button>

        {/* Reset All Button */}
        <button
          onClick={onResetAll}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-500/30 bg-red-950/20 hover:bg-red-950/40 text-red-400 hover:text-red-300 text-xs font-bold transition-all cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All</span>
        </button>

        {/* Notification Bell */}
        <button className="relative p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-purple-500/50 transition-colors cursor-pointer">
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-purple-500 ring-2 ring-slate-900" />
          )}
        </button>

        {/* ADMIN Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-900/50 border border-purple-500/40 text-[#c084fc] text-xs font-extrabold tracking-wider">
          <Shield className="w-3.5 h-3.5" />
          <span>ADMIN</span>
        </div>
      </div>
    </header>
  );
};
