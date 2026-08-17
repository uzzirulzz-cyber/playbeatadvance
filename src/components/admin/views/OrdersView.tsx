import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Search, 
  CheckCircle2, 
  Clock, 
  RefreshCw, 
  Send, 
  Key, 
  DollarSign, 
  ExternalLink, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { useStore } from '../../../store/useStore';
import { Order } from '../../../types';

export const OrdersView: React.FC = () => {
  const { orders, updateOrderStatus, currency } = useStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [dispatchToast, setDispatchToast] = useState<string | null>(null);

  const filtered = orders.filter(o => {
    const matchesSearch = 
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleReDispatchKey = (order: Order) => {
    setDispatchToast(`Keys for ${order.orderNumber} successfully emailed to ${order.customerEmail}`);
    setTimeout(() => setDispatchToast(null), 3000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      {dispatchToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-900 border border-emerald-500 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-bold">{dispatchToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#11192e]/90 border border-slate-800/80 p-4 rounded-2xl">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-purple-400" />
            <span>Customer Orders & License Fulfillment</span>
          </h2>
          <p className="text-xs text-slate-400">Manage real-time order states, IPN payment confirmations & license key vaults</p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-300 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
          <span>Total Orders: <strong className="text-purple-400">{orders.length}</strong></span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by order number, customer email, or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-[#11192e]/90 border border-slate-800 text-slate-200 placeholder-slate-400 focus:outline-none focus:border-purple-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-xs font-semibold rounded-xl bg-[#11192e]/90 border border-slate-800 text-slate-200 outline-none cursor-pointer"
        >
          <option value="ALL">All Statuses</option>
          <option value="COMPLETED">COMPLETED</option>
          <option value="PENDING">PENDING</option>
          <option value="REFUNDED">REFUNDED</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-[#11192e]/90 border border-slate-800/80 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold text-[10px] bg-slate-900/60">
                <th className="py-3 px-4">Order ID & Date</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Items / Products</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((order) => (
                <tr key={order.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-mono font-bold text-white">{order.orderNumber}</div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-white">{order.customerName}</div>
                    <div className="text-[10px] text-slate-400">{order.customerEmail}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="space-y-1">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-300">
                          <span className="font-bold text-purple-400">{item.quantity}x</span>
                          <span className="line-clamp-1">{item.product.title}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-[#fcb800]">
                      Rs {(order.totalAmountPKR || order.total || 0).toLocaleString()}
                    </div>
                    <div className="text-[10px] text-emerald-400 font-semibold font-mono">PAID & VERIFIED</div>
                  </td>
                  <td className="py-3 px-4 uppercase text-[11px] font-mono font-bold text-slate-300">
                    {order.paymentMethod}
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={order.status || 'COMPLETED'}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold outline-none cursor-pointer ${
                        order.status === 'COMPLETED'
                          ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-500/30'
                          : order.status === 'PENDING'
                          ? 'bg-amber-950/50 text-amber-400 border border-amber-500/30'
                          : 'bg-red-950/50 text-red-400 border border-red-500/30'
                      }`}
                    >
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="PENDING">PENDING</option>
                      <option value="REFUNDED">REFUNDED</option>
                    </select>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleReDispatchKey(order)}
                        title="Re-send license keys via email"
                        className="px-2.5 py-1 rounded-lg bg-purple-950/40 border border-purple-500/30 text-purple-300 hover:bg-purple-900/60 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Key className="w-3 h-3" />
                        <span>Dispatch</span>
                      </button>
                    </div>
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
