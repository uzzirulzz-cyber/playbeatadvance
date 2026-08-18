import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { 
  User as UserIcon, 
  ShoppingBag, 
  Key, 
  RefreshCw, 
  Wallet, 
  MapPin, 
  Shield, 
  Headphones, 
  LogOut, 
  Copy, 
  Check, 
  ExternalLink, 
  Download, 
  FileText, 
  Plus, 
  Send, 
  Clock, 
  Sparkles, 
  CreditCard,
  CheckCircle2,
  AlertCircle,
  X
} from 'lucide-react';
import { Order, SupportTicket } from '../types';

export const CustomerDashboard: React.FC = () => {
  const { 
    user, 
    orders, 
    subscriptions, 
    supportTickets, 
    isCustomerDashboardOpen, 
    setIsCustomerDashboardOpen,
    cancelSubscription,
    addSupportTicket,
    addTicketMessage,
    updateUserWallet,
    customerLogout,
    setIsInvoiceModalOpen,
    setActiveInvoiceOrder,
    formatPKR
  } = useStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'vault' | 'subscriptions' | 'wallet' | 'tickets' | 'security'>('overview');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  
  // Wallet topup state
  const [topupAmount, setTopupAmount] = useState<number>(2000);
  const [topupSuccess, setTopupSuccess] = useState<boolean>(false);

  // New ticket state
  const [isNewTicketOpen, setIsNewTicketOpen] = useState<boolean>(false);
  const [ticketSubject, setTicketSubject] = useState<string>('');
  const [ticketCategory, setTicketCategory] = useState<SupportTicket['category']>('ORDER_ISSUE');
  const [ticketMessage, setTicketMessage] = useState<string>('');
  
  // Selected ticket for chat
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState<string>('');

  if (!isCustomerDashboardOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(text);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleTopup = (e: React.FormEvent) => {
    e.preventDefault();
    if (topupAmount <= 0) return;
    updateUserWallet(user.id, topupAmount, 'CREDIT', 'Customer Wallet Top-up');
    setTopupSuccess(true);
    setTimeout(() => setTopupSuccess(false), 3000);
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketMessage.trim()) return;

    addSupportTicket({
      customerName: user.name,
      customerEmail: user.email,
      subject: ticketSubject.trim(),
      category: ticketCategory,
      priority: 'MEDIUM',
      status: 'OPEN',
      messages: [
        {
          id: `m-${Date.now()}`,
          sender: 'CUSTOMER',
          senderName: user.name,
          message: ticketMessage.trim(),
          timestamp: new Date().toISOString()
        }
      ]
    });

    setTicketSubject('');
    setTicketMessage('');
    setIsNewTicketOpen(false);
  };

  const handleSendReply = (ticketId: string) => {
    if (!replyMessage.trim()) return;
    addTicketMessage(ticketId, replyMessage.trim(), 'CUSTOMER', user.name);
    setReplyMessage('');
  };

  const myOrders = orders;
  const activeSubs = subscriptions.filter(s => s.status === 'ACTIVE');
  const allVaultKeys = myOrders.flatMap(o => o.items.flatMap(i => (i.licenseKeys || []).map(k => ({
    key: k,
    productTitle: i.product.title,
    orderNumber: o.orderNumber,
    date: o.createdAt,
    instructions: i.instructions || 'Instant activation code.'
  }))));

  const selectedTicket = supportTickets.find(t => t.id === selectedTicketId);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-[#0b1120] border border-slate-800 rounded-3xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[92vh]">
        
        {/* Left Navigation Bar */}
        <aside className="w-full md:w-64 bg-[#070b14] border-r border-slate-800/80 p-5 flex flex-col justify-between shrink-0">
          <div className="space-y-6">
            {/* User Profile Header */}
            <div className="flex items-center gap-3">
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                alt={user.name}
                className="w-12 h-12 rounded-2xl object-cover border border-slate-700 shadow-md"
              />
              <div className="min-w-0">
                <h3 className="font-bold text-white text-sm truncate">{user.name}</h3>
                <p className="text-xs text-slate-400 truncate">{user.email}</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-yellow-400/10 text-[#fcb800] border border-yellow-400/20">
                  Verified Member
                </span>
              </div>
            </div>

            {/* Wallet Quick Balance */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Wallet className="w-3 h-3 text-[#fcb800]" />
                <span>Wallet Balance</span>
              </span>
              <div className="text-base font-black text-white font-mono">
                {formatPKR(user.balancePKR || 0)}
              </div>
            </div>

            {/* Nav Links */}
            <nav className="space-y-1 text-xs">
              {[
                { id: 'overview' as const, label: 'Overview', icon: Sparkles },
                { id: 'orders' as const, label: 'My Orders & Invoices', icon: ShoppingBag, count: myOrders.length },
                { id: 'vault' as const, label: 'Digital Keys Vault', icon: Key, count: allVaultKeys.length },
                { id: 'subscriptions' as const, label: 'Active Subscriptions', icon: RefreshCw, count: activeSubs.length },
                { id: 'wallet' as const, label: 'Wallet & Credits', icon: Wallet },
                { id: 'tickets' as const, label: 'Support Tickets', icon: Headphones, count: supportTickets.length },
                { id: 'security' as const, label: 'Security & Activity', icon: Shield },
              ].map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setSelectedTicketId(null);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#fcb800] text-slate-950 shadow-md shadow-yellow-500/20'
                        : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    {item.count !== undefined && item.count > 0 && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive ? 'bg-slate-950 text-[#fcb800]' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="pt-4 border-t border-slate-800/80">
            <button
              onClick={() => {
                customerLogout();
                setIsCustomerDashboardOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-400 hover:bg-red-950/40 text-xs font-bold transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Log out</span>
            </button>
          </div>
        </aside>

        {/* Right Content Area */}
        <main className="flex-1 p-5 sm:p-6 overflow-y-auto max-h-[calc(92vh-20px)] space-y-6">
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-black text-white capitalize">
                {activeTab === 'overview' && 'Account Dashboard Overview'}
                {activeTab === 'orders' && 'My Orders & Official Invoices'}
                {activeTab === 'vault' && 'Digital License Key Vault'}
                {activeTab === 'subscriptions' && 'Active Recurring Passes'}
                {activeTab === 'wallet' && 'PlayBeat Store Wallet & Credits'}
                {activeTab === 'tickets' && 'Customer Support Desk'}
                {activeTab === 'security' && 'Security & Account Activity'}
              </h2>
              <p className="text-xs text-slate-400">
                PlayBeat Digital Customer Portal • 24/7 Automated Fulfillment
              </p>
            </div>

            <button
              onClick={() => setIsCustomerDashboardOpen(false)}
              className="w-8 h-8 rounded-xl bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 1. OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-[#070b14] border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Total Orders</span>
                  <div className="text-xl font-black text-white font-mono">{myOrders.length}</div>
                </div>
                <div className="p-4 rounded-2xl bg-[#070b14] border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Active Subscriptions</span>
                  <div className="text-xl font-black text-emerald-400 font-mono">{activeSubs.length}</div>
                </div>
                <div className="p-4 rounded-2xl bg-[#070b14] border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Digital Keys Vault</span>
                  <div className="text-xl font-black text-purple-400 font-mono">{allVaultKeys.length}</div>
                </div>
                <div className="p-4 rounded-2xl bg-[#070b14] border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Wallet Balance</span>
                  <div className="text-xl font-black text-[#fcb800] font-mono">{formatPKR(user.balancePKR || 0)}</div>
                </div>
              </div>

              {/* Recent Orders Spotlight */}
              <div className="bg-[#070b14] border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-[#fcb800]" />
                    <span>Recent Purchases</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-[#fcb800] font-bold hover:underline cursor-pointer"
                  >
                    View all orders →
                  </button>
                </div>

                {myOrders.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4 text-center">No orders placed yet. Browse the catalog to get started.</p>
                ) : (
                  <div className="space-y-2">
                    {myOrders.slice(0, 3).map(order => (
                      <div key={order.id} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
                        <div className="space-y-0.5">
                          <span className="font-bold text-white font-mono">{order.orderNumber}</span>
                          <div className="text-[11px] text-slate-400">{order.items.map(i => i.product.title).join(', ')}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-[#fcb800] font-mono">{formatPKR(order.totalAmountPKR)}</div>
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 2. ORDERS & INVOICES TAB */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {myOrders.length === 0 ? (
                <div className="p-12 text-center space-y-3 bg-[#070b14] rounded-2xl border border-slate-800">
                  <ShoppingBag className="w-10 h-10 text-slate-600 mx-auto" />
                  <h4 className="font-bold text-white text-sm">No Orders Found</h4>
                  <p className="text-xs text-slate-400">Your completed purchases and dispatch tracking will appear here.</p>
                </div>
              ) : (
                myOrders.map(order => (
                  <div key={order.id} className="bg-[#070b14] border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-white font-mono text-sm">{order.orderNumber}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            {order.status}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400">{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setActiveInvoiceOrder(order);
                            setIsInvoiceModalOpen(true);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700 cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5 text-[#fcb800]" />
                          <span>View Invoice</span>
                        </button>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start justify-between text-xs">
                          <div className="space-y-1">
                            <span className="font-bold text-white">{item.product.title}</span>
                            <div className="text-[11px] text-slate-400">Qty: {item.quantity} • Qty Price: Rs {(item.unitPrice || item.product.price).toLocaleString()}</div>
                            {item.licenseKeys && item.licenseKeys.length > 0 && (
                              <div className="pt-1 flex flex-wrap items-center gap-2">
                                {item.licenseKeys.map((key, kidx) => (
                                  <div key={kidx} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 border border-yellow-500/30 text-yellow-300 font-mono text-[11px]">
                                    <span>{key}</span>
                                    <button
                                      onClick={() => handleCopy(key)}
                                      className="p-1 hover:text-white cursor-pointer"
                                    >
                                      {copiedKey === key ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="font-bold text-[#fcb800] font-mono">
                            Rs {((item.unitPrice || item.product.price) * item.quantity).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs font-bold">
                      <span className="text-slate-400">Total Paid ({order.paymentMethod.toUpperCase()})</span>
                      <span className="text-[#fcb800] font-mono text-sm">{formatPKR(order.totalAmountPKR)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* 3. DIGITAL KEYS VAULT */}
          {activeTab === 'vault' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 to-slate-900 border border-purple-500/30 flex items-center justify-between">
                <div className="space-y-0.5">
                  <h4 className="font-bold text-white text-xs">Automated License Key Vault</h4>
                  <p className="text-[11px] text-slate-400">All purchased software licenses, streaming passes, and tracking codes stored securely.</p>
                </div>
                <span className="px-3 py-1 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-mono font-bold">
                  {allVaultKeys.length} Keys
                </span>
              </div>

              {allVaultKeys.length === 0 ? (
                <div className="p-12 text-center space-y-2 bg-[#070b14] rounded-2xl border border-slate-800">
                  <Key className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-xs text-slate-400">No keys in vault yet. Purchase software or IPTV to populate your vault.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {allVaultKeys.map((item, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-[#070b14] border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white">{item.productTitle}</span>
                        <span className="text-slate-500 text-[10px] font-mono">Order {item.orderNumber}</span>
                      </div>

                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                        <code className="text-yellow-400 font-mono font-bold text-xs">{item.key}</code>
                        <button
                          onClick={() => handleCopy(item.key)}
                          className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700 cursor-pointer"
                        >
                          {copiedKey === item.key ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-[#fcb800]" />
                              <span>Copy Key</span>
                            </>
                          )}
                        </button>
                      </div>

                      <p className="text-[11px] text-slate-400">{item.instructions}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 4. SUBSCRIPTIONS TAB */}
          {activeTab === 'subscriptions' && (
            <div className="space-y-4">
              {subscriptions.length === 0 ? (
                <div className="p-12 text-center space-y-2 bg-[#070b14] rounded-2xl border border-slate-800">
                  <RefreshCw className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-xs text-slate-400">No active recurring subscriptions found.</p>
                </div>
              ) : (
                subscriptions.map(sub => (
                  <div key={sub.id} className="p-4 rounded-2xl bg-[#070b14] border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <h4 className="font-bold text-white text-sm">{sub.productTitle}</h4>
                        <span className="text-[11px] text-slate-400">{sub.planName} • Billing: {sub.billingPeriod}</span>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        sub.status === 'ACTIVE'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-red-500/10 text-red-400 border-red-500/30'
                      }`}>
                        {sub.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-[11px] p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <div>
                        <span className="text-slate-500">Next Billing Date:</span>
                        <div className="font-bold text-white font-mono">{sub.nextBillingDate}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Recurring Price:</span>
                        <div className="font-bold text-[#fcb800] font-mono">Rs {sub.pricePKR.toLocaleString()}</div>
                      </div>
                    </div>

                    {sub.status === 'ACTIVE' && (
                      <div className="flex justify-end">
                        <button
                          onClick={() => cancelSubscription(sub.id)}
                          className="px-3 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-400 text-xs font-bold border border-red-500/30 transition-colors cursor-pointer"
                        >
                          Cancel Subscription
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* 5. WALLET TAB */}
          {activeTab === 'wallet' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-[#070b14] to-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">PlayBeat Store Balance</span>
                  <Wallet className="w-5 h-5 text-[#fcb800]" />
                </div>
                <div className="text-3xl font-black text-white font-mono">
                  {formatPKR(user.balancePKR || 0)}
                </div>
                <p className="text-xs text-slate-400">
                  Use your store credits for 1-click instant checkouts on license keys and subscriptions without waiting for payment verification.
                </p>
              </div>

              {topupSuccess && (
                <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Wallet topped up successfully with Rs {topupAmount.toLocaleString()}!</span>
                </div>
              )}

              <form onSubmit={handleTopup} className="p-5 rounded-2xl bg-[#070b14] border border-slate-800 space-y-4">
                <h4 className="font-bold text-white text-xs">Top Up Wallet Credits</h4>
                <div className="grid grid-cols-3 gap-2">
                  {[1000, 2000, 5000, 10000, 20000].map(amt => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setTopupAmount(amt)}
                      className={`py-2 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
                        topupAmount === amt
                          ? 'bg-[#fcb800] text-slate-950 border-[#fcb800]'
                          : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      Rs {amt.toLocaleString()}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={topupAmount}
                    onChange={(e) => setTopupAmount(Number(e.target.value))}
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-[#fcb800]"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#fcb800] hover:bg-[#e5a700] text-slate-950 font-black text-xs transition-all shadow-lg shadow-yellow-500/20 cursor-pointer"
                  >
                    Top Up Now
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 6. SUPPORT TICKETS TAB */}
          {activeTab === 'tickets' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm">Customer Support Desk</h4>
                  <p className="text-xs text-slate-400">Open a ticket for license assistance or payment proof verification.</p>
                </div>
                <button
                  onClick={() => setIsNewTicketOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-[#fcb800] hover:bg-[#e5a700] text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Open New Ticket</span>
                </button>
              </div>

              {isNewTicketOpen && (
                <form onSubmit={handleCreateTicket} className="p-4 rounded-2xl bg-[#070b14] border border-slate-800 space-y-3 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-bold text-white">Create Support Ticket</span>
                    <button type="button" onClick={() => setIsNewTicketOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">✕</button>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Subject</label>
                    <input
                      type="text"
                      required
                      value={ticketSubject}
                      onChange={(e) => setTicketSubject(e.target.value)}
                      placeholder="e.g. License key activation error"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Category</label>
                    <select
                      value={ticketCategory}
                      onChange={(e) => setTicketCategory(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                    >
                      <option value="ORDER_ISSUE">Order Issue / Courier Tracking</option>
                      <option value="LICENSE_KEY">License Key Activation</option>
                      <option value="PAYMENT_PROOF">Payment Proof Confirmation</option>
                      <option value="IPTV_SETUP">IPTV 4K Setup & M3U Link</option>
                      <option value="REFUND">Refund / Warranty Claim</option>
                      <option value="GENERAL">General Inquiries</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Message</label>
                    <textarea
                      rows={3}
                      required
                      value={ticketMessage}
                      onChange={(e) => setTicketMessage(e.target.value)}
                      placeholder="Describe your issue with order number if applicable..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-[#fcb800] text-slate-950 font-black cursor-pointer shadow-md"
                  >
                    Submit Ticket
                  </button>
                </form>
              )}

              {/* Tickets List */}
              <div className="space-y-3">
                {supportTickets.map(ticket => (
                  <div key={ticket.id} className="p-4 rounded-2xl bg-[#070b14] border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[#fcb800]">{ticket.ticketNumber}</span>
                          <span className="font-bold text-white">{ticket.subject}</span>
                        </div>
                        <span className="text-[10px] text-slate-500">Category: {ticket.category} • Updated: {new Date(ticket.updatedAt).toLocaleDateString()}</span>
                      </div>

                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        ticket.status === 'RESOLVED'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
                      }`}>
                        {ticket.status}
                      </span>
                    </div>

                    {/* Messages */}
                    <div className="space-y-2 max-h-48 overflow-y-auto p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                      {ticket.messages.map(m => (
                        <div key={m.id} className={`p-2 rounded-lg ${m.sender === 'CUSTOMER' ? 'bg-slate-900 text-slate-200' : 'bg-purple-950/40 text-purple-200 border border-purple-500/20'}`}>
                          <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                            <span className="font-bold">{m.senderName}</span>
                            <span>{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <p>{m.message}</p>
                        </div>
                      ))}
                    </div>

                    {/* Reply bar */}
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Type reply message..."
                        value={selectedTicketId === ticket.id ? replyMessage : ''}
                        onChange={(e) => {
                          setSelectedTicketId(ticket.id);
                          setReplyMessage(e.target.value);
                        }}
                        className="flex-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-[#fcb800]"
                      />
                      <button
                        onClick={() => handleSendReply(ticket.id)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-[#fcb800] text-xs font-bold border border-slate-700 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. SECURITY & ACTIVITY */}
          {activeTab === 'security' && (
            <div className="space-y-5">
              <div className="p-5 rounded-2xl bg-[#070b14] border border-slate-800 space-y-4">
                <h4 className="font-bold text-white text-xs">Change Password</h4>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Current Password</label>
                    <input type="password" placeholder="••••••••" className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white" />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">New Password</label>
                    <input type="password" placeholder="••••••••" className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white" />
                  </div>
                  <button type="button" className="px-4 py-2 rounded-xl bg-[#fcb800] text-slate-950 font-black text-xs cursor-pointer shadow-md">
                    Update Password
                  </button>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#070b14] border border-slate-800 space-y-3">
                <h4 className="font-bold text-white text-xs">Recent Login Activity</h4>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white">Current Session (Karachi, Pakistan)</div>
                      <span className="text-[10px] text-slate-500">Chrome on Windows • IP 182.185.120.44</span>
                    </div>
                    <span className="text-emerald-400 font-bold text-[10px]">Active Now</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
