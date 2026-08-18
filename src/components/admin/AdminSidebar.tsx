import React from 'react';
import { 
  LayoutDashboard, 
  BarChart3, 
  Package, 
  ShoppingCart, 
  ShoppingBag, 
  RefreshCw, 
  Ticket, 
  Users, 
  Headphones, 
  Tv, 
  DollarSign, 
  CreditCard, 
  FileCheck2, 
  Share2, 
  Sparkles, 
  Mail, 
  Wallet, 
  FileSpreadsheet,
  LogOut,
  Zap,
  Layout,
  Key,
  ShieldCheck,
  Sliders
} from 'lucide-react';

export type AdminTab = 
  | 'dashboard'
  | 'builder'
  | 'analytics'
  | 'products'
  | 'inventory'
  | 'orders'
  | 'woocommerce'
  | 'subscriptions'
  | 'coupons'
  | 'users'
  | 'support'
  | 'iptv'
  | 'finance'
  | 'gateways'
  | 'proofs'
  | 'audit'
  | 'social'
  | 'tiktok'
  | 'email'
  | 'jazzcash'
  | 'reports';

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  onLogout: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  setActiveTab,
  onLogout
}) => {
  const sections = [
    {
      title: 'OVERVIEW',
      items: [
        { id: 'dashboard' as AdminTab, label: 'Dashboard', icon: LayoutDashboard },
        { id: 'builder' as AdminTab, label: 'Website Builder CMS', icon: Layout },
        { id: 'analytics' as AdminTab, label: 'Analytics & Traffic', icon: BarChart3 },
      ]
    },
    {
      title: 'COMMERCE & INVENTORY',
      items: [
        { id: 'products' as AdminTab, label: 'Catalog Products', icon: Package },
        { id: 'inventory' as AdminTab, label: 'Digital License Vault', icon: Key },
        { id: 'orders' as AdminTab, label: 'Orders & Fulfillment', icon: ShoppingCart },
        { id: 'subscriptions' as AdminTab, label: 'Subscriptions', icon: RefreshCw },
        { id: 'coupons' as AdminTab, label: 'Discounts & Coupons', icon: Ticket },
      ]
    },
    {
      title: 'CUSTOMERS & SUPPORT',
      items: [
        { id: 'users' as AdminTab, label: 'Customer Accounts', icon: Users },
        { id: 'support' as AdminTab, label: 'Support Tickets', icon: Headphones },
      ]
    },
    {
      title: 'IPTV & SERVICES',
      items: [
        { id: 'iptv' as AdminTab, label: 'IPTV M3U Servers', icon: Tv },
      ]
    },
    {
      title: 'PAYMENTS & SECURITY',
      items: [
        { id: 'finance' as AdminTab, label: 'Financial Balance', icon: DollarSign },
        { id: 'gateways' as AdminTab, label: 'Payment Gateways', icon: CreditCard },
        { id: 'jazzcash' as AdminTab, label: 'JazzCash & Merchant', icon: Wallet },
        { id: 'proofs' as AdminTab, label: 'Payment Proofs', icon: FileCheck2 },
        { id: 'audit' as AdminTab, label: 'Security & Audit Logs', icon: ShieldCheck },
        { id: 'reports' as AdminTab, label: 'Accounting Reports', icon: FileSpreadsheet },
      ]
    }
  ];

  return (
    <aside className="w-64 shrink-0 bg-[#070b14] border-r border-slate-800 flex flex-col justify-between min-h-[calc(100vh-65px)] select-none">
      <div className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-140px)] custom-scrollbar">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-2 py-1">
          <div className="w-8 h-8 rounded-xl bg-[#fcb800] text-slate-950 font-black flex items-center justify-center shadow-lg shadow-yellow-500/20 text-sm">
            PB
          </div>
          <div>
            <div className="text-base font-black tracking-tight text-white flex items-center gap-1">
              <span>PlayBeat</span>
              <span className="text-[#fcb800] text-xs font-bold uppercase">Admin</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">playbeat.digital</div>
          </div>
        </div>

        {/* Menu Navigation */}
        <nav className="space-y-5">
          {sections.map((section) => (
            <div key={section.title} className="space-y-1">
              <div className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                {section.title}
              </div>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer ${
                        isActive
                          ? 'bg-[#fcb800] text-slate-950 shadow-md font-black'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      {isActive && (
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-slate-800 bg-[#05080e]">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Exit Admin Session</span>
        </button>
      </div>
    </aside>
  );
};
