import React, { useState } from 'react';
import { useStore } from '../../../store/useStore';
import { 
  ShieldCheck, 
  Search, 
  Download, 
  Clock, 
  User, 
  FileText,
  AlertTriangle
} from 'lucide-react';

export const AuditLogsView: React.FC = () => {
  const { auditLogs } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  const filteredLogs = auditLogs.filter(log => {
    const matchesAction = actionFilter === 'ALL' || log.action.includes(actionFilter);
    const matchesSearch = 
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesAction && matchesSearch;
  });

  const handleExportCSV = () => {
    const headers = 'ID,User,Role,Action,TargetType,TargetId,Details,Timestamp\n';
    const rows = filteredLogs.map(l => 
      `"${l.id}","${l.userName}","${l.userRole}","${l.action}","${l.targetType}","${l.targetId}","${l.details.replace(/"/g, '""')}","${l.timestamp}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `playbeat-audit-logs-${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white">System Security & Financial Audit Logs</h2>
          <p className="text-xs text-slate-400">
            Immutable tracking of financial adjustments, order events, and catalog changes.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-2 cursor-pointer"
        >
          <Download className="w-4 h-4 text-[#fcb800]" />
          <span>Export Audit Log (CSV)</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#070b14] p-3 rounded-2xl border border-slate-800 text-xs">
        <div className="flex items-center gap-2 w-full sm:w-80 bg-slate-900 px-3 py-2 rounded-xl border border-slate-700">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search action, user, or details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-white focus:outline-none w-full text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          {['ALL', 'WALLET', 'ORDER', 'CATALOG'].map(f => (
            <button
              key={f}
              onClick={() => setActionFilter(f)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                actionFilter === f
                  ? 'bg-[#fcb800] text-slate-950 shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Logs Table */}
      <div className="border border-slate-800 rounded-2xl overflow-hidden bg-[#070b14]">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
            <tr>
              <th className="p-3.5">Timestamp</th>
              <th className="p-3.5">Actor / User</th>
              <th className="p-3.5">Action Type</th>
              <th className="p-3.5">Target</th>
              <th className="p-3.5">Details</th>
              <th className="p-3.5">IP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">
                  No audit logs found matching criteria.
                </td>
              </tr>
            ) : (
              filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-900/40">
                  <td className="p-3.5 font-mono text-slate-400 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="p-3.5">
                    <div className="font-bold text-white">{log.userName}</div>
                    <span className="text-[10px] text-slate-500 font-mono">{log.userRole}</span>
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-yellow-400/10 text-[#fcb800] border border-yellow-400/20">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono text-slate-300">
                    {log.targetType}: {log.targetId}
                  </td>
                  <td className="p-3.5 text-slate-300 max-w-xs">{log.details}</td>
                  <td className="p-3.5 font-mono text-slate-500">{log.ipAddress || '127.0.0.1'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
