import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "motion/react";
import { CreditCard, QrCode, CheckCircle2, History, AlertCircle, Loader2, Send } from "lucide-react";
import { PaymentRequest } from "../types";

const PLANS = [
  { id: "50-credits", name: "50 Credits", price: 199, credits: 50 },
  { id: "100-credits", name: "100 Credits", price: 299, credits: 100 },
  { id: "200-credits", name: "200 Credits", price: 499, credits: 200 },
];

export default function PaymentPage() {
  const [selectedPlan, setSelectedPlan] = useState(PLANS[1]);
  const [utrCode, setUtrCode] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [history, setHistory] = useState<PaymentRequest[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const { user } = useAuth();

  const fetchHistory = async () => {
    try {
      const demoHistory = localStorage.getItem("imagix_demo_payments");
      if (demoHistory) {
        setHistory(JSON.parse(demoHistory));
      } else {
        setHistory([]);
      }
    } catch (err) {
      console.error("Failed to fetch payment history");
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!utrCode) return;
    
    setIsSubmitting(true);
    setMessage("");
    setError("");

    try {
      // Simulate quick fake submission
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newRequest: PaymentRequest = {
        id: "req-" + Math.random().toString(36).substr(2, 9),
        userId: user?.id || "demo-user",
        plan: selectedPlan.name,
        amount: selectedPlan.price,
        utrCode,
        date: new Date().toISOString(),
        note: note,
        status: "pending",
        createdAt: new Date().toISOString()
      };

      const existingHistory = JSON.parse(localStorage.getItem("imagix_demo_payments") || "[]");
      const updatedHistory = [newRequest, ...existingHistory];
      localStorage.setItem("imagix_demo_payments", JSON.stringify(updatedHistory));

      setMessage("Payment request submitted. Admin will review within 24h.");
      setUtrCode("");
      setNote("");
      fetchHistory();
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-24 bg-slate-100 dark:bg-transparent transition-colors">
      <div className="text-center mb-16 md:mb-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-200 dark:bg-white/5 rounded-full text-[9px] font-bold uppercase tracking-widest mb-6 border border-slate-300 dark:border-white/10 text-slate-500 dark:text-brand-gray">
          <CreditCard className="w-3 h-3" /> Secure Billing
        </div>
        <h1 className="text-4xl md:text-7xl font-display font-bold tracking-tighter mb-4 text-slate-900 dark:text-white uppercase leading-none">REPLENISH <span className="opacity-30">CREDITS</span></h1>
        <p className="text-slate-500 dark:text-brand-gray max-w-xl mx-auto text-sm md:text-base font-medium">Select a plan and complete the manual UPI payment to unlock more generations.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
        {/* Left Side: Plans & Payment Form */}
        <div className="lg:col-span-2 space-y-8 md:space-y-12">
          {/* Plan Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {PLANS.map((plan) => (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(plan)}
                className={`group p-8 rounded-[32px] text-left transition-all relative overflow-hidden active:scale-95 ${
                  selectedPlan.id === plan.id 
                  ? "bg-slate-900 dark:bg-brand-white text-white dark:text-brand-black shadow-2xl scale-[1.02]" 
                  : "bg-white dark:bg-white/5 card-geometric glass border border-slate-200 dark:border-white/5 hover:border-slate-400 dark:hover:border-white/20 text-slate-900 dark:text-white"
                }`}
              >
                {selectedPlan.id === plan.id && (
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 dark:bg-black/5 rounded-full -mr-12 -mt-12 blur-2xl"></div>
                )}
                <div className="flex flex-col h-full justify-between relative z-10">
                  <div>
                    <h3 className="text-xl md:text-2xl font-display font-bold mb-1 uppercase tracking-tight">{plan.name}</h3>
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${selectedPlan.id === plan.id ? "opacity-60" : "text-slate-400 dark:text-brand-gray"}`}>
                      {plan.credits} Vision Tokens
                    </p>
                  </div>
                  <div className="mt-10">
                    <span className="text-3xl md:text-4xl font-display font-bold tracking-tighter">₹{plan.price}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Payment Steps */}
          <div className="bg-white dark:bg-white/5 card-geometric glass p-8 md:p-12 shadow-2xl relative overflow-hidden border border-slate-200 dark:border-white/10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 dark:bg-white/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>
            
            <div className="flex flex-col md:flex-row gap-12 relative z-10">
              {/* QR Code Section */}
              <div className="flex-shrink-0 flex flex-col items-center">
                <div className="w-52 h-52 bg-white p-5 rounded-[32px] mb-6 relative group shadow-inner border border-slate-100">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=omjain1401@okicici&am=${selectedPlan.price}&cu=INR&tn=ImagixPurchase`} 
                    alt="UPI QR Code"
                    className="w-full h-full grayscale transition-all group-hover:grayscale-0 duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 border-2 border-dashed border-slate-900/5 dark:border-black/10 rounded-3xl pointer-events-none"></div>
                </div>
                <div className="text-center group cursor-pointer">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-brand-gray mb-1">OFFICIAL UPI ID</p>
                  <p className="text-sm font-mono font-bold text-slate-900 dark:text-brand-white bg-slate-100 dark:bg-white/5 px-4 py-1.5 rounded-full group-hover:scale-105 transition-transform">omjain1401@okicici</p>
                </div>
              </div>

              {/* Form Section */}
              <div className="flex-grow space-y-8">
                <div>
                  <h3 className="text-3xl font-display font-bold mb-3 text-slate-900 dark:text-white uppercase tracking-tighter">Instant <span className="opacity-30">Validation</span></h3>
                  <p className="text-slate-500 dark:text-brand-gray text-sm font-medium leading-relaxed">Scan the QR code, pay exactly <span className="text-slate-900 dark:text-white font-black">₹{selectedPlan.price}</span>, and submit your UTR code for verification.</p>
                </div>

                {message && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 bg-green-100 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 text-green-700 dark:text-green-400 text-sm rounded-2xl flex items-center gap-3 shadow-sm"
                  >
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                    <span className="font-bold">{message}</span>
                  </motion.div>
                )}

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 bg-red-100 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 text-sm rounded-2xl flex items-center gap-3 shadow-sm"
                  >
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span className="font-bold">{error}</span>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-brand-gray ml-1">UTR Code / Transaction ID</label>
                    <input 
                      type="text"
                      required
                      placeholder="12 Digit Transaction Number"
                      value={utrCode}
                      onChange={(e) => setUtrCode(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-4.5 px-6 focus:outline-none focus:border-slate-900 dark:focus:border-brand-white transition-all font-mono text-slate-900 dark:text-white shadow-inner placeholder:text-slate-300 dark:placeholder:text-white/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-brand-gray ml-1">Add Note (Optional)</label>
                    <input 
                      type="text"
                      placeholder="e.g. For office use"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-4.5 px-6 focus:outline-none focus:border-slate-900 dark:focus:border-brand-white transition-all text-slate-900 dark:text-white shadow-inner placeholder:text-slate-300 dark:placeholder:text-white/10"
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={isSubmitting || !utrCode}
                    className="w-full bg-slate-900 dark:bg-brand-white text-white dark:text-brand-black py-5 rounded-2xl font-black text-lg uppercase tracking-widest flex items-center justify-center gap-3 hover:translate-y-[-2px] active:scale-95 transition-all disabled:opacity-50 shadow-xl"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        VALIDATE PAYMENT
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: History Section */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-white/5 card-geometric glass p-8 rounded-[40px] border border-slate-200 dark:border-white/5 h-full flex flex-col shadow-xl">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-2xl font-display font-bold flex items-center gap-3 text-slate-900 dark:text-white uppercase tracking-tighter">
                <History className="w-6 h-6 text-slate-400 dark:text-brand-gray" />
                History
              </h3>
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center border border-slate-200 dark:border-white/10">
                <span className="text-[10px] font-black text-slate-900 dark:text-white">{history.length}</span>
              </div>
            </div>

            <div className="space-y-4 overflow-y-auto max-h-[600px] flex-grow pr-2 scrollbar-hide">
              {loadingHistory ? (
                <div className="flex justify-center p-12">
                  <Loader2 className="w-6 h-6 animate-spin text-slate-300 dark:text-brand-gray" />
                </div>
              ) : history.length === 0 ? (
                <div className="text-center py-20 opacity-30">
                  <QrCode className="w-16 h-16 mx-auto mb-6 opacity-10" />
                  <p className="text-[10px] font-black uppercase tracking-widest mb-2 text-slate-900 dark:text-white">Clean Slate</p>
                  <p className="text-[8px] max-w-[150px] mx-auto font-medium text-slate-900 dark:text-white">Your payment requests will materialize here.</p>
                </div>
              ) : (
                <AnimatePresence>
                  {history.map((item, i) => (
                    <motion.div 
                      key={item.id} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="p-5 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 transition-all group overflow-hidden relative shadow-sm"
                    >
                      <div className="absolute top-0 right-0 w-2 h-full bg-slate-900 dark:bg-brand-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-sm font-black uppercase tracking-tight text-slate-900 dark:text-white">{item.plan}</p>
                          <p className="text-[10px] text-slate-400 dark:text-brand-gray font-mono font-bold">{item.utrCode}</p>
                        </div>
                        <StatusBadge status={item.status} />
                      </div>
                      <div className="flex justify-between items-center bg-white dark:bg-white/5 p-3 rounded-2xl border border-slate-100 dark:border-white/5">
                        <p className="text-base font-black text-slate-900 dark:text-white">₹{item.amount}</p>
                        <p className="text-[10px] text-slate-400 dark:text-brand-gray uppercase font-black italic">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: "pending" | "approved" | "rejected" }) {
  const styles = {
    pending: "bg-yellow-500/10 text-yellow-500",
    approved: "bg-green-500/10 text-green-500",
    rejected: "bg-red-500/10 text-red-500",
  };
  
  return (
    <span className={`text-[8px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${styles[status]}`}>
      {status}
    </span>
  );
}
