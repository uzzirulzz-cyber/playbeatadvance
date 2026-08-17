import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { formatCurrency } from '../lib/utils';
import { 
  X, 
  Key, 
  Search, 
  Check, 
  Copy, 
  Download, 
  ShieldCheck, 
  Clock, 
  Package, 
  FileText,
  AlertCircle
} from 'lucide-react';

export const OrderLookupModal: React.FC = () => {
  const { 
    isOrderLookupOpen, 
    setIsOrderLookupOpen, 
    orders, 
    currency 
  } = useStore();

  const [lookupQuery, setLookupQuery] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOrderLookupOpen) return null;

  // Filter orders by search query (order number or email)
  const filteredOrders = lookupQuery.trim()
    ? orders.filter(o => 
        o.orderNumber.toLowerCase().includes(lookupQuery.toLowerCase()) ||
        o.customerEmail.toLowerCase().includes(lookupQuery.toLowerCase()) ||
        o.transactionRef.toLowerCase().includes(lookupQuery.toLowerCase())
      )
    : orders;

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-3xl glass-dropdown border border-emerald-500/30 shadow-2xl p-6 space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">License Key Vault & Order History</h3>
              <span className="text-xs text-slate-400">Search and retrieve your digital activation codes</span>
            </div>
          </div>

          <button
            onClick={() => setIsOrderLookupOpen(false)}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Filter Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Order # (e.g. PB-), Email, or Transaction Ref..."
            value={lookupQuery}
            onChange={(e) => setLookupQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 font-mono"
          />
        </div>

        {/* Orders List */}
        <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-1">
          {filteredOrders.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <AlertCircle className="w-10 h-10 text-slate-600 mx-auto" />
              <h4 className="font-bold text-white text-sm">No orders found</h4>
              <p className="text-xs text-slate-400">
                Try searching with a different order number or email address.
              </p>
            </div>
          ) : (
            filteredOrders.map(order => (
              <div 
                key={order.id}
                className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3"
              >
                {/* Order Top Info */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-emerald-400 text-sm">
                      {order.orderNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                      {order.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                    <span>•</span>
                    <span className="uppercase font-bold text-slate-300">{order.paymentMethod}</span>
                    <span>•</span>
                    <span className="font-bold text-white">
                      {formatCurrency(order.totalAmountPKR, currency)}
                    </span>
                  </div>
                </div>

                {/* Items & License Keys */}
                <div className="space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold text-white">
                        <span>{item.product.title} (x{item.quantity})</span>
                        <span className="text-slate-400">{item.product.category.name}</span>
                      </div>

                      {item.licenseKeys.length > 0 && (
                        <div className="space-y-1.5 pt-1">
                          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                            Delivered License Keys ({item.licenseKeys.length})
                          </div>
                          {item.licenseKeys.map((key, kIdx) => (
                            <div 
                              key={kIdx}
                              className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/60 font-mono text-xs"
                            >
                              <span className="text-emerald-400 font-bold select-all">{key}</span>
                              <button
                                onClick={() => handleCopyKey(key)}
                                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                                title="Copy Key"
                              >
                                {copiedKey === key ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {item.downloadUrl && (
                        <a
                          href={item.downloadUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-bold pt-1"
                        >
                          <Download className="w-3.5 h-3.5" /> Download Software Package
                        </a>
                      )}
                    </div>
                  ))}
                </div>

                {/* Customer recipient footer */}
                <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                  <span>Customer: <strong className="text-slate-200">{order.customerName}</strong> ({order.customerEmail})</span>
                  <span className="font-mono text-[10px] text-slate-500">Ref: {order.transactionRef}</span>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
