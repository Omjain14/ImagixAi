import { ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="h-16 md:h-12 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between border-t border-slate-200 dark:border-white/5 text-[9px] md:text-[10px] tracking-[0.2em] text-slate-400 dark:text-white/20 font-black uppercase z-10 glass bg-white/50 dark:bg-transparent transition-colors py-4 md:py-0">
      <div className="flex flex-col md:flex-row gap-4 md:gap-10 items-center">
        <span>Copyright © {new Date().getFullYear()} Omjain</span>
        <span className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
          Node Status: <span className="text-slate-900 dark:text-white/60">Operational</span>
        </span>
      </div>
      <div className="flex gap-6 md:gap-10 items-center mt-3 md:mt-0">
        <span className="text-slate-900 dark:text-white/40 hidden lg:flex items-center gap-1.5">
          <ShieldCheck className="w-3 h-3" /> Encrypted by Imagix AI
        </span>
        <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors border-b border-transparent hover:border-slate-900 dark:hover:border-white">Privacy</a>
        <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors border-b border-transparent hover:border-slate-900 dark:hover:border-white">Terms</a>
      </div>
    </footer>
  );
}
