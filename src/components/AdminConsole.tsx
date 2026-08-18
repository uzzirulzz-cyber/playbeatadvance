import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { AdminSidebar, AdminTab } from './admin/AdminSidebar';
import { AdminHeader } from './admin/AdminHeader';
import { DashboardView } from './admin/views/DashboardView';
import { AnalyticsView } from './admin/views/AnalyticsView';
import { ProductsView } from './admin/views/ProductsView';
import { OrdersView } from './admin/views/OrdersView';
import { WooCommerceView } from './admin/views/WooCommerceView';
import { SubscriptionsView } from './admin/views/SubscriptionsView';
import { CouponsView } from './admin/views/CouponsView';
import { UsersView } from './admin/views/UsersView';
import { SupportView } from './admin/views/SupportView';
import { IptvView } from './admin/views/IptvView';
import { FinanceView } from './admin/views/FinanceView';
import { PaymentGatewaysView } from './admin/views/PaymentGatewaysView';
import { PaymentProofView } from './admin/views/PaymentProofView';
import { SocialMediaView } from './admin/views/SocialMediaView';
import { TikTokLeadsView } from './admin/views/TikTokLeadsView';
import { EmailView } from './admin/views/EmailView';
import { JazzCashView } from './admin/views/JazzCashView';
import { ReportsView } from './admin/views/ReportsView';
import { 
  ShieldCheck, 
  Lock, 
  Key, 
  Zap, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  RotateCcw 
} from 'lucide-react';

export const AdminConsole: React.FC = () => {
  const { 
    isAdminAuthenticated, 
    adminLogin, 
    adminLogout,
    setActiveView 
  } = useStore();

  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [passwordInput, setPasswordInput] = useState('');
  const [usernameInput, setUsernameInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [adminSearch, setAdminSearch] = useState('');
  const [resetToast, setResetToast] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const res = adminLogin(usernameInput, passwordInput);
    if (!res.success) {
      setLoginError(res.message);
    }
  };

  // Removed handleAutoFill() - credentials should never be hardcoded or auto-filled

  const handleResetAll = () => {
    setAdminSearch('');
    setActiveTab('dashboard');
    setResetToast(true);
    setTimeout(() => setResetToast(false), 2500);
  };

  // If user is not authenticated, show Admin Login gate
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#0d1322] border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 relative overflow-hidden">
          
          {/* Top glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-48 bg-purple-600/20 blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="text-center space-y-2 relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 mx-auto flex items-center justify-center shadow-lg shadow-purple-600/30">
              <Zap className="w-8 h-8 text-white fill-white" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white pt-2">
              <span>play</span><span className="text-[#a855f7]">beat</span>
              <span className="text-xs text-slate-400 font-mono block mt-0.5">playbeat.digital/adminpanel</span>
            </h1>
            <p className="text-xs text-slate-400">
              Admin Panel • Master Authorization Required
            </p>
          </div>

          {loginError && (
            <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1.5">Admin Username / Email</label>
              <input
                type="text"
                required
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors font-mono"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-slate-300 font-bold">Master Password</label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter master password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold transition-all shadow-lg shadow-purple-600/30 cursor-pointer flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>Log in to Admin Panel</span>
            </button>
          </form>

          {/* Security notice */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>Credentials must be entered securely. Never share or hardcode passwords.</span>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => setActiveView('storefront')}
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              ← Return to public Storefront
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated Admin View Matching Screenshot
  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col">
      {/* Toast */}
      {resetToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-purple-900 border border-purple-500 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-bold animate-in fade-in">
          <RotateCcw className="w-4 h-4 text-purple-300 animate-spin" />
          <span>Filters reset to default Dashboard view.</span>
        </div>
      )}

      {/* Main Container with Sidebar + Content */}
      <div className="flex flex-1">
        {/* Left Sidebar */}
        <AdminSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onLogout={adminLogout}
        />

        {/* Right Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <AdminHeader
            searchQuery={adminSearch}
            setSearchQuery={setAdminSearch}
            onResetAll={handleResetAll}
          />

          {/* View Container */}
          <main className="flex-1 p-6 overflow-y-auto max-h-[calc(100vh-65px)] bg-[#090e1a]">
            {activeTab === 'dashboard' && <DashboardView />}
            {activeTab === 'analytics' && <AnalyticsView />}
            {activeTab === 'products' && <ProductsView />}
            {activeTab === 'orders' && <OrdersView />}
            {activeTab === 'woocommerce' && <WooCommerceView />}
            {activeTab === 'subscriptions' && <SubscriptionsView />}
            {activeTab === 'coupons' && <CouponsView />}
            {activeTab === 'users' && <UsersView />}
            {activeTab === 'support' && <SupportView />}
            {activeTab === 'iptv' && <IptvView />}
            {activeTab === 'finance' && <FinanceView />}
            {activeTab === 'gateways' && <PaymentGatewaysView />}
            {activeTab === 'proofs' && <PaymentProofView />}
            {activeTab === 'social' && <SocialMediaView />}
            {activeTab === 'tiktok' && <TikTokLeadsView />}
            {activeTab === 'email' && <EmailView />}
            {activeTab === 'jazzcash' && <JazzCashView />}
            {activeTab === 'reports' && <ReportsView />}
          </main>
        </div>
      </div>
    </div>
  );
};
