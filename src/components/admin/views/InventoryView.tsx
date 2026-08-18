import React, { useState } from 'react';
import { useStore } from '../../../store/useStore';
import { 
  Key, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Download, 
  Upload, 
  Search, 
  ShieldCheck,
  Copy,
  Check
} from 'lucide-react';
import { InventoryKey } from '../../../types';

export const InventoryView: React.FC = () => {
  const { 
    inventoryKeys, 
    products, 
    addInventoryKey, 
    deleteInventoryKey, 
    formatPKR 
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'AVAILABLE' | 'USED'>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [batchKeysText, setBatchKeysText] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(text);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleAddBatch = (e: React.FormEvent) => {
    e.preventDefault();
    const product = products.find(p => p.id === selectedProductId);
    if (!product || !batchKeysText.trim()) return;

    const lines = batchKeysText.split('\n').map(l => l.trim()).filter(Boolean);
    lines.forEach(keyStr => {
      addInventoryKey({
        productId: product.id,
        productTitle: product.title,
        key: keyStr,
        status: 'AVAILABLE',
        batchNumber: `BATCH-${Date.now().toString().slice(-4)}`
      });
    });

    setBatchKeysText('');
    setIsAddModalOpen(false);
  };

  const filteredKeys = inventoryKeys.filter(k => {
    const matchesStatus = statusFilter === 'ALL' || k.status === statusFilter;
    const matchesSearch = 
      k.productTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.key.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const availableCount = inventoryKeys.filter(k => k.status === 'AVAILABLE').length;
  const usedCount = inventoryKeys.filter(k => k.status === 'USED').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white">Digital License Inventory Vault</h2>
          <p className="text-xs text-slate-400">
            Automated key pools for Windows 11, Office, IPTV M3U accounts, and AI tool passes.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#fcb800] hover:bg-[#e5a700] text-slate-950 font-black text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-yellow-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add / Bulk Upload Keys</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#070b14] border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Total Keys Pool</span>
          <div className="text-2xl font-black text-white font-mono">{inventoryKeys.length}</div>
        </div>
        <div className="p-4 rounded-2xl bg-[#070b14] border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Available for Instant Fulfillment</span>
          <div className="text-2xl font-black text-emerald-400 font-mono">{availableCount}</div>
        </div>
        <div className="p-4 rounded-2xl bg-[#070b14] border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Delivered / Assigned</span>
          <div className="text-2xl font-black text-purple-400 font-mono">{usedCount}</div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#070b14] p-3 rounded-2xl border border-slate-800 text-xs">
        <div className="flex items-center gap-2 w-full sm:w-80 bg-slate-900 px-3 py-2 rounded-xl border border-slate-700">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search key or product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-white focus:outline-none w-full text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          {(['ALL', 'AVAILABLE', 'USED'] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                statusFilter === s
                  ? 'bg-[#fcb800] text-slate-950 shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="border border-slate-800 rounded-2xl overflow-hidden bg-[#070b14]">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
            <tr>
              <th className="p-3.5">Product Title</th>
              <th className="p-3.5">License Key / Serial</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5">Batch #</th>
              <th className="p-3.5">Added Date</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {filteredKeys.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">
                  No inventory keys found. Click "Add / Bulk Upload Keys" to deposit licenses.
                </td>
              </tr>
            ) : (
              filteredKeys.map(k => (
                <tr key={k.id} className="hover:bg-slate-900/40">
                  <td className="p-3.5 font-bold text-white max-w-[220px] truncate">{k.productTitle}</td>
                  <td className="p-3.5 font-mono text-yellow-300">
                    <div className="flex items-center gap-1.5">
                      <span>{k.key}</span>
                      <button onClick={() => handleCopy(k.key)} className="text-slate-500 hover:text-white cursor-pointer">
                        {copiedKey === k.key ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      k.status === 'AVAILABLE'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      {k.status}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono text-slate-400">{k.batchNumber || 'STANDARD'}</td>
                  <td className="p-3.5 text-slate-400">{k.addedAt}</td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => deleteInventoryKey(k.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-950/40 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Bulk Upload Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={handleAddBatch} className="bg-[#0b1120] border border-slate-800 rounded-3xl w-full max-w-lg p-6 space-y-4 shadow-2xl text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm">Bulk Add License Keys</h3>
              <button type="button" onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Target Product</label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
              >
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.title} ({p.sku})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">
                Enter Keys (1 per line)
              </label>
              <textarea
                rows={6}
                required
                value={batchKeysText}
                onChange={(e) => setBatchKeysText(e.target.value)}
                placeholder={"W269N-WFGWX-YVC9B-4J6C9-T83GX\nMH37W-N47XK-V7XM9-C7227-GCQG9\nNMMKJ-6RK4F-KMJVX-8D9MJ-6MWKP"}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#fcb800] text-slate-950 font-black text-xs cursor-pointer shadow-md"
            >
              Deposit Keys into Vault
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
