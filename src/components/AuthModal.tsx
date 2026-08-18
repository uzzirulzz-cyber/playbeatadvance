import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { X, Lock, Mail, User, Shield, CheckCircle2, ArrowRight } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    customerLogin, 
    adminLogin,
    setActiveView
  } = useStore();

  const [mode, setMode] = useState<'login' | 'register' | 'admin'>('login');
  const [email, setEmail] = useState<string>('customer@playbeat.digital');
  const [name, setName] = useState<string>('Valued Customer');
  const [password, setPassword] = useState<string>('playbeat1122');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (mode === 'admin') {
      const res = adminLogin(password);
      if (res.success) {
        setSuccess('Super Admin authenticated!');
        setTimeout(() => {
          setIsAuthModalOpen(false);
          setActiveView('admin');
        }, 600);
      } else {
        setError(res.message);
      }
      return;
    }

    if (mode === 'register') {
      if (!name.trim()) {
        setError('Please enter your full name');
        return;
      }
      customerLogin(email, name);
      setSuccess(`Welcome to PlayBeat, ${name}!`);
      setTimeout(() => setIsAuthModalOpen(false), 500);
      return;
    }

    // Default Customer Login
    customerLogin(email, name || 'Customer');
    setSuccess('Signed in successfully!');
    setTimeout(() => setIsAuthModalOpen(false), 500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0b1120] border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="p-6 bg-[#070b14] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#fcb800] text-black font-black flex items-center justify-center text-sm">
              PB
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">PlayBeat Digital Portal</h3>
              <p className="text-[11px] text-slate-400">Secure Access & Instant Digital Key Vault</p>
            </div>
          </div>

          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="w-8 h-8 rounded-xl bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-3 p-2 bg-slate-900/50 border-b border-slate-800 text-xs font-bold text-center">
          <button
            onClick={() => { setMode('login'); setError(null); }}
            className={`py-2 rounded-xl transition-all cursor-pointer ${
              mode === 'login' ? 'bg-[#fcb800] text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setMode('register'); setError(null); }}
            className={`py-2 rounded-xl transition-all cursor-pointer ${
              mode === 'register' ? 'bg-[#fcb800] text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Register
          </button>
          <button
            onClick={() => { setMode('admin'); setError(null); }}
            className={`py-2 rounded-xl transition-all cursor-pointer ${
              mode === 'admin' ? 'bg-[#fcb800] text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Staff Admin
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/30 text-red-300 text-xs">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{success}</span>
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="block text-slate-300 font-bold mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ali Khan"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-[#fcb800]"
                />
              </div>
            </div>
          )}

          {mode !== 'admin' && (
            <div>
              <label className="block text-slate-300 font-bold mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="customer@playbeat.digital"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-[#fcb800]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-slate-300 font-bold mb-1">
              {mode === 'admin' ? 'Master Admin Password' : 'Password'}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-[#fcb800]"
              />
            </div>
            {mode === 'admin' && (
              <p className="text-[10px] text-slate-500 mt-1">
                Admin master password: <code className="text-[#fcb800]">playbeat1122</code>
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#fcb800] hover:bg-[#e5a700] text-slate-950 font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-yellow-500/20 transition-all"
          >
            <span>
              {mode === 'login' && 'Sign In to Account'}
              {mode === 'register' && 'Create Free Account'}
              {mode === 'admin' && 'Access Admin Console'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Quick Demo Credentials */}
          <div className="pt-2 border-t border-slate-800/80 text-center">
            <span className="text-[10px] text-slate-500">
              Quick Test Admin: <code className="text-yellow-400">admin@playbeat.digital</code> / <code className="text-yellow-400">playbeat1122</code>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};
