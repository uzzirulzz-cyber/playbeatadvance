import React, { useState } from 'react';
import { 
  Headphones, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Send, 
  User, 
  ShieldCheck,
  Search
} from 'lucide-react';

interface Ticket {
  id: string;
  ticketNo: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  message: string;
  priority: 'URGENT' | 'MEDIUM' | 'LOW';
  status: 'OPEN' | 'RESOLVED';
  createdAt: string;
  replies: Array<{ from: 'user' | 'admin'; text: string; time: string }>;
}

export const SupportView: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: 't-1',
      ticketNo: 'TICK-9842',
      customerName: 'Zain Ul Abideen',
      customerEmail: 'zain@live.com',
      subject: 'Netflix UHD Screen #4 PIN question',
      message: 'Hello, I received my license voucher for Netflix 4K but would like to change the profile name to Zain.',
      priority: 'MEDIUM',
      status: 'OPEN',
      createdAt: '2026-08-17 14:10',
      replies: [
        { from: 'user', text: 'Hello, I received my license voucher for Netflix 4K but would like to change the profile name to Zain.', time: '14:10' }
      ]
    },
    {
      id: 't-2',
      ticketNo: 'TICK-9841',
      customerName: 'Omer Farooq',
      customerEmail: 'omer@gmail.com',
      subject: 'JazzCash Instant IPN Verification',
      message: 'My transaction ID is JC-9820184. Please verify payment status.',
      priority: 'URGENT',
      status: 'RESOLVED',
      createdAt: '2026-08-16 18:30',
      replies: [
        { from: 'user', text: 'My transaction ID is JC-9820184. Please verify payment status.', time: '18:30' },
        { from: 'admin', text: 'Payment confirmed and keys automatically dispatched to your email.', time: '18:32' }
      ]
    }
  ]);

  const [activeTicketId, setActiveTicketId] = useState<string>('t-1');
  const [replyInput, setReplyInput] = useState('');

  const activeTicket = tickets.find(t => t.id === activeTicketId) || tickets[0];

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyInput.trim()) return;

    setTickets(tickets.map(t => {
      if (t.id === activeTicketId) {
        return {
          ...t,
          status: 'RESOLVED',
          replies: [
            ...t.replies,
            { from: 'admin', text: replyInput.trim(), time: 'Just now' }
          ]
        };
      }
      return t;
    }));

    setReplyInput('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#11192e]/90 border border-slate-800/80 p-4 rounded-2xl">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Headphones className="w-5 h-5 text-purple-400" />
            <span>24/7 Customer Support Desk & Live Tickets</span>
          </h2>
          <p className="text-xs text-slate-400">Resolve customer inquiries, payment verification requests, and key activations</p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-300 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
          <span>Open Tickets: <strong className="text-amber-400">{tickets.filter(t => t.status === 'OPEN').length}</strong></span>
        </div>
      </div>

      {/* Ticket Center */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Tickets List */}
        <div className="bg-[#11192e]/90 border border-slate-800/80 p-4 rounded-2xl space-y-3">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            Support Queue
          </div>

          <div className="space-y-2">
            {tickets.map(ticket => {
              const isActive = ticket.id === activeTicketId;
              return (
                <button
                  key={ticket.id}
                  onClick={() => setActiveTicketId(ticket.id)}
                  className={`w-full p-3 rounded-xl text-left transition-all border cursor-pointer ${
                    isActive
                      ? 'bg-purple-950/40 border-purple-500/50 shadow-md'
                      : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-slate-400">{ticket.ticketNo}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      ticket.priority === 'URGENT' 
                        ? 'bg-red-950 text-red-400 border border-red-500/30' 
                        : 'bg-blue-950 text-blue-400 border border-blue-500/30'
                    }`}>
                      {ticket.priority}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-white mt-1 line-clamp-1">{ticket.subject}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{ticket.customerName}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Chat / Ticket Reply Pane */}
        <div className="lg:col-span-2 bg-[#11192e]/90 border border-slate-800/80 p-5 rounded-2xl flex flex-col justify-between min-h-[420px]">
          {activeTicket ? (
            <>
              {/* Ticket Top Info */}
              <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>{activeTicket.subject}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      activeTicket.status === 'RESOLVED' 
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-amber-950 text-amber-400 border border-amber-500/30'
                    }`}>
                      {activeTicket.status}
                    </span>
                  </h3>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">
                    Customer: {activeTicket.customerName} ({activeTicket.customerEmail})
                  </div>
                </div>
              </div>

              {/* Message Feed */}
              <div className="space-y-3 my-4 flex-1 overflow-y-auto max-h-64 pr-2">
                {activeTicket.replies.map((reply, i) => (
                  <div
                    key={i}
                    className={`flex flex-col ${
                      reply.from === 'admin' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`max-w-md p-3 rounded-2xl text-xs ${
                        reply.from === 'admin'
                          ? 'bg-purple-600 text-white rounded-br-none'
                          : 'bg-slate-800 text-slate-200 rounded-bl-none'
                      }`}
                    >
                      {reply.text}
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1 font-mono">{reply.time}</span>
                  </div>
                ))}
              </div>

              {/* Reply Input Form */}
              <form onSubmit={handleSendReply} className="flex gap-2 pt-3 border-t border-slate-800">
                <input
                  type="text"
                  placeholder="Type support reply or canned response..."
                  value={replyInput}
                  onChange={(e) => setReplyInput(e.target.value)}
                  className="flex-1 px-4 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Reply</span>
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-16 text-slate-400 text-xs">
              Select a ticket from the left panel to inspect and reply.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
