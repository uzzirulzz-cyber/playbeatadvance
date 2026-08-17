import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  ShieldCheck, 
  UserCheck, 
  Mail, 
  Phone, 
  DollarSign, 
  ShoppingBag,
  MoreVertical,
  CheckCircle2
} from 'lucide-react';
import { useStore } from '../../../store/useStore';

interface UserRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'CUSTOMER' | 'VENDOR' | 'AFFILIATE' | 'ADMIN';
  totalOrders: number;
  totalSpentPKR: number;
  joinedDate: string;
  status: 'ACTIVE' | 'BLOCKED';
}

export const UsersView: React.FC = () => {
  const [search, setSearch] = useState('');
  const [usersList, setUsersList] = useState<UserRecord[]>([
    {
      id: 'usr-1',
      name: 'Alex Vance',
      email: 'alex@playbeat.io',
      phone: '+92 300 1234567',
      role: 'CUSTOMER',
      totalOrders: 4,
      totalSpentPKR: 19490,
      joinedDate: '2026-06-12',
      status: 'ACTIVE'
    },
    {
      id: 'usr-2',
      name: 'Hamza Tariq',
      email: 'hamza.dev@gmail.com',
      phone: '+92 321 9876543',
      role: 'CUSTOMER',
      totalOrders: 2,
      totalSpentPKR: 8998,
      joinedDate: '2026-07-04',
      status: 'ACTIVE'
    },
    {
      id: 'usr-3',
      name: 'Lumix Cinema Official',
      email: 'vendor@lumix.pk',
      phone: '+92 333 4567890',
      role: 'VENDOR',
      totalOrders: 18,
      totalSpentPKR: 890000,
      joinedDate: '2026-05-01',
      status: 'ACTIVE'
    },
    {
      id: 'usr-4',
      name: 'Saad Affiliates',
      email: 'saad@growthhub.pk',
      phone: '+92 312 3456789',
      role: 'AFFILIATE',
      totalOrders: 32,
      totalSpentPKR: 45000,
      joinedDate: '2026-07-19',
      status: 'ACTIVE'
    }
  ]);

  const toggleStatus = (id: string) => {
    setUsersList(usersList.map(u => u.id === id ? { ...u, status: u.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE' } : u));
  };

  const filtered = usersList.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.phone.includes(search)
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#11192e]/90 border border-slate-800/80 p-4 rounded-2xl">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            <span>Registered Users & Customer Accounts</span>
          </h2>
          <p className="text-xs text-slate-400">View customer lifetime spending, verify vendor accounts and manage access permissions</p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-300 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
          <span>Total Users: <strong className="text-purple-400">{usersList.length}</strong></span>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by customer name, email address, or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-[#11192e]/90 border border-slate-800 text-slate-200 placeholder-slate-400 focus:outline-none focus:border-purple-500"
        />
      </div>

      {/* Users Table */}
      <div className="bg-[#11192e]/90 border border-slate-800/80 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold text-[10px] bg-slate-900/60">
                <th className="py-3 px-4">User Details</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Total Orders</th>
                <th className="py-3 px-4">Lifetime Spend</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-600/30 border border-purple-500/40 text-purple-300 font-black flex items-center justify-center text-xs">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-white">{user.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">Member since {user.joinedDate}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-slate-200">{user.email}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{user.phone}</div>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-200">
                    {user.totalOrders} Orders
                  </td>
                  <td className="py-3 px-4 font-bold text-[#fcb800]">
                    Rs {user.totalSpentPKR.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      user.status === 'ACTIVE'
                        ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-500/30'
                        : 'bg-red-950/50 text-red-400 border border-red-500/30'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => toggleStatus(user.id)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                        user.status === 'ACTIVE'
                          ? 'bg-red-950/40 border border-red-500/30 text-red-400 hover:bg-red-900/60'
                          : 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-900/60'
                      }`}
                    >
                      {user.status === 'ACTIVE' ? 'Block' : 'Unblock'}
                    </button>
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
