import React, { useState, useEffect } from "react";
import { User, PaymentRequest } from "../types";
import { 
  Users, 
  CreditCard, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Plus, 
  Minus, 
  Loader2, 
  ArrowUpRight, 
  TrendingUp,
  LayoutDashboard,
  Bell,
  Shield
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"users" | "payments">("payments");
  const [users, setUsers] = useState<User[]>([]);
  const [payments, setPayments] = useState<PaymentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [processingId, setProcessingId] = useState<number | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, paymentsRes] = await Promise.all([
        fetch("/api/admin/users"),
        fetch("/api/admin/payments")
      ]);
      const usersData = await usersRes.json();
      const paymentsData = await paymentsRes.json();
      
      if (usersRes.ok) setUsers(usersData.users);
      if (paymentsRes.ok) setPayments(paymentsData.payments);
    } catch (err) {
      console.error("Failed to fetch admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (id: number) => {
    setProcessingId(id);
    try {
      const res = await fetch("/api/admin/payment/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId: id })
      });
      if (res.ok) fetchData();
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: number) => {
    setProcessingId(id);
    try {
      const res = await fetch("/api/admin/payment/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId: id })
      });
      if (res.ok) fetchData();
    } finally {
      setProcessingId(null);
    }
  };

  const adjustCredits = async (userId: number, amount: number, type: "added" | "deducted") => {
    try {
      const res = await fetch("/api/admin/user/credits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, amount, type, reason: "Admin adjustment" })
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error("Failed to adjust credits");
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const pendingCount = payments.filter(p => p.status === "pending").length;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-24 bg-slate-100 dark:bg-transparent transition-colors min-h-screen">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mb-16">
        <div>
          <div className="flex items-center gap-3 mb-4">
             <div className="w-10 h-10 rounded-xl glass flex items-center justify-center border border-slate-200 dark:border-white/10 shadow-sm bg-white dark:bg-transparent">
                <LayoutDashboard className="w-5 h-5 text-slate-900 dark:text-white" />
             </div>
             <span className="text-[10px] uppercase tracking-widest font-black text-slate-400 dark:text-brand-gray">Control Center</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-display font-bold tracking-tighter uppercase text-slate-900 dark:text-white leading-none">ADMIN <span className="opacity-30 text-slate-400 dark:text-white">HUB</span></h1>
        </div>

        <div className="flex gap-4">
          <StatCard label="Total Users" value={users.length} icon={<Users className="w-4 h-4" />} />
          <StatCard label="Pending" value={pendingCount} icon={<Bell className="w-4 h-4" />} highlight={pendingCount > 0} />
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white dark:bg-white/5 card-geometric glass rounded-[40px] border border-slate-200 dark:border-white/10 overflow-hidden shadow-2xl flex flex-col relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 dark:bg-white/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>

        {/* Toolbar */}
        <div className="p-4 md:p-8 border-b border-slate-200 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex gap-2 p-1.5 bg-slate-100 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/5">
            <button 
              onClick={() => setActiveTab("payments")}
              className={`px-6 py-3 rounded-xl text-xs md:text-sm font-black uppercase tracking-widest transition-all ${activeTab === "payments" ? "bg-slate-900 dark:bg-white text-white dark:text-black shadow-lg" : "text-slate-500 dark:text-brand-gray hover:bg-slate-200 dark:hover:bg-white/5"}`}
            >
              Requests
            </button>
            <button 
              onClick={() => setActiveTab("users")}
              className={`px-6 py-3 rounded-xl text-xs md:text-sm font-black uppercase tracking-widest transition-all ${activeTab === "users" ? "bg-slate-900 dark:bg-white text-white dark:text-black shadow-lg" : "text-slate-500 dark:text-brand-gray hover:bg-slate-200 dark:hover:bg-white/5"}`}
            >
              Users
            </button>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-brand-gray" />
            <input 
              type="text" 
              placeholder="Filter database..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-slate-900 dark:focus:border-brand-white text-sm text-slate-900 dark:text-white shadow-inner"
            />
          </div>
        </div>

        {/* Content Table */}
        <div className="flex-grow overflow-x-auto relative z-10">
          {loading ? (
            <div className="h-96 flex flex-col items-center justify-center gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-slate-300 dark:text-brand-gray" />
              <span className="text-[10px] font-black uppercase tracking-widest opacity-30">Fetching Data Stream...</span>
            </div>
          ) : activeTab === "payments" ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-white/5 border-b border-slate-200 dark:border-white/5 text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 dark:text-brand-gray">
                  <th className="px-8 py-6">User Identity</th>
                  <th className="px-8 py-6">Request Info</th>
                  <th className="px-8 py-6">Validation Key</th>
                  <th className="px-8 py-6">Current State</th>
                  <th className="px-8 py-6 text-right">Process</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {payments.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
                    <td className="px-8 py-6">
                      <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{p.user?.name}</p>
                      <p className="text-[10px] font-bold text-slate-400 dark:text-brand-gray uppercase tracking-widest">{p.user?.email}</p>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-black text-slate-900 dark:text-white">{p.plan}</p>
                      <p className="text-xs font-bold text-slate-500 dark:text-brand-gray">₹{p.amount}</p>
                    </td>
                    <td className="px-8 py-6">
                      <span className="font-mono text-[10px] font-bold bg-slate-900 dark:bg-white/10 text-white dark:text-brand-gray px-3 py-1.5 rounded-lg shadow-inner uppercase tracking-wider">{p.utrCode}</span>
                    </td>
                    <td className="px-8 py-6">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="px-8 py-6 text-right">
                      {p.status === "pending" && (
                        <div className="flex justify-end gap-3">
                          <button 
                            disabled={processingId === p.id}
                            onClick={() => handleApprove(p.id)}
                            className="p-3 bg-green-500/10 text-green-600 dark:text-green-500 hover:bg-green-600 dark:hover:bg-green-500 hover:text-white rounded-2xl transition-all shadow-sm"
                            title="Approve Credits"
                          >
                            <CheckCircle2 className="w-5 h-5" />
                          </button>
                          <button 
                            disabled={processingId === p.id}
                            onClick={() => handleReject(p.id)}
                            className="p-3 bg-red-500/10 text-red-600 dark:text-red-500 hover:bg-red-600 dark:hover:bg-red-500 hover:text-white rounded-2xl transition-all shadow-sm"
                            title="Reject Request"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-white/5 border-b border-slate-200 dark:border-white/5 text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 dark:text-brand-gray">
                  <th className="px-8 py-6">User Details</th>
                  <th className="px-8 py-6">Account Age</th>
                  <th className="px-8 py-6">Access Level</th>
                  <th className="px-8 py-6">Credit Balance</th>
                  <th className="px-8 py-6 text-right">Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
                    <td className="px-8 py-6">
                      <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{u.name}</p>
                      <p className="text-[10px] font-bold text-slate-400 dark:text-brand-gray uppercase tracking-widest">{u.email}</p>
                    </td>
                    <td className="px-8 py-6 text-[10px] font-black text-slate-500 dark:text-brand-gray uppercase italic">
                      {new Date(u.createdAt!).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-6">
                      <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border ${u.role === 'admin' ? 'bg-slate-900 dark:bg-white text-white dark:text-black shadow-lg border-slate-900 dark:border-white' : 'bg-slate-100 dark:bg-white/10 text-slate-400 dark:text-brand-gray border-slate-200 dark:border-white/5'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-8 py-6 font-display font-black text-lg text-slate-900 dark:text-white">
                      {u.credits}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-3">
                        <button 
                          onClick={() => adjustCredits(u.id, 5, "deducted")}
                          className="w-12 h-12 flex items-center justify-center bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-2xl hover:bg-slate-900 dark:hover:bg-white hover:text-white dark:hover:text-black transition-all shadow-sm"
                          title="Deduct Credits"
                        >
                          <Minus className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => adjustCredits(u.id, 50, "added")}
                          className="w-12 h-12 flex items-center justify-center bg-slate-900 dark:bg-brand-white text-white dark:text-brand-black rounded-2xl hover:translate-y-[-4px] active:scale-90 transition-all font-bold shadow-xl shadow-slate-900/10 dark:shadow-none"
                          title="Add Bundle"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, highlight = false }: { label: string, value: string | number, icon: React.ReactNode, highlight?: boolean }) {
  return (
    <div className={`p-4 md:p-6 rounded-3xl glass border-slate-200 dark:border-white/10 flex flex-col min-w-[140px] transition-all bg-white dark:bg-white/5 shadow-sm ${highlight ? 'border-slate-900 dark:border-brand-white shadow-xl scale-105' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-brand-gray">{label}</span>
        <div className="opacity-50 text-slate-900 dark:text-white">{icon}</div>
      </div>
      <div className="text-2xl md:text-3xl font-display font-black text-slate-900 dark:text-white">{value}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: "pending" | "approved" | "rejected" }) {
  const styles = {
    pending: "bg-yellow-100 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 border-yellow-200 dark:border-yellow-500/20",
    approved: "bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-500 border-green-200 dark:border-green-500/20",
    rejected: "bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-500 border-red-200 dark:border-red-500/20",
  };
  
  return (
    <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border ${styles[status]}`}>
      {status}
    </span>
  );
}
