import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Sun, Moon, LogOut, Menu, X, Zap } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getNavLinkClass = (path: string) => 
    location.pathname === path 
      ? "text-slate-900 dark:text-white font-bold transition-all" 
      : "text-slate-500 hover:text-slate-900 dark:text-brand-gray dark:hover:text-white transition-all";

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="h-20 px-4 md:px-8 flex items-center justify-between border-b border-slate-200 dark:border-white/5 backdrop-blur-xl z-[60] sticky top-0 bg-white/70 dark:bg-black/50">
      <Link to="/" className="flex items-center gap-3 shrink-0" onClick={closeMenu}>
        <div className="w-8 h-8 md:w-10 md:h-10 bg-slate-900 dark:bg-white flex items-center justify-center rounded-lg md:rounded-xl shadow-lg shrink-0">
          <div className="w-4 h-4 md:w-5 md:h-5 bg-white dark:bg-black rounded-sm rotate-45"></div>
        </div>
        <span className="text-lg md:text-xl font-bold tracking-tighter uppercase whitespace-nowrap text-slate-900 dark:text-white">
          IMAGIX <span className="font-light opacity-60">AI</span>
        </span>
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center gap-8">
        <div className="flex gap-8 text-sm font-medium">
          <Link to="/generator" className={getNavLinkClass("/generator")}>Generator</Link>
          <Link to="/purchase" className={getNavLinkClass("/purchase")}>Credits</Link>
          {user?.role === "admin" && (
            <Link to="/admin" className={getNavLinkClass("/admin")}>Admin Hub</Link>
          )}
        </div>
        
        <div className="h-6 w-[1px] bg-slate-200 dark:bg-white/10"></div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme}
            className="p-2.5 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-slate-200 dark:hover:border-white/10"
          >
            {isDark ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
          </button>

          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end leading-tight">
                <span className="text-[9px] uppercase tracking-widest opacity-50 font-bold">Balance</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">{user.credits} <Zap className="w-3 h-3 inline fill-yellow-500 text-yellow-500 ml-0.5" /></span>
              </div>
              <button 
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="w-10 h-10 rounded-xl hover:bg-red-500/10 text-slate-500 hover:text-red-500 border border-slate-200 dark:border-white/10 flex items-center justify-center transition-all bg-white/50 dark:bg-white/5"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link 
              to="/signup" 
              className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-black text-xs font-bold rounded-xl uppercase tracking-wider hover:opacity-90 transition-all shadow-lg active:scale-95"
            >
              Start Free
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Controls */}
      <div className="flex lg:hidden items-center gap-3">
        <button 
          onClick={toggleTheme}
          className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors border border-slate-200 dark:border-white/10"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
        >
          {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
              className="fixed inset-0 bg-slate-900/40 dark:bg-black/80 backdrop-blur-md z-40 lg:hidden"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-[80%] max-w-sm bg-white dark:bg-slate-950 z-50 lg:hidden shadow-2xl border-l border-slate-200 dark:border-white/5 p-8"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-12">
                   <span className="text-xl font-bold tracking-tighter uppercase text-slate-900 dark:text-white">MENU</span>
                   <button onClick={closeMenu} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg text-slate-500">
                     <X className="w-6 h-6" />
                   </button>
                </div>

                <div className="flex flex-col gap-6">
                  <Link to="/generator" onClick={closeMenu} className={getNavLinkClass("/generator") + " text-2xl uppercase tracking-tighter"}>Generator</Link>
                  <Link to="/purchase" onClick={closeMenu} className={getNavLinkClass("/purchase") + " text-2xl uppercase tracking-tighter"}>Get Credits</Link>
                  {user?.role === "admin" && (
                    <Link to="/admin" onClick={closeMenu} className={getNavLinkClass("/admin") + " text-2xl uppercase tracking-tighter"}>Admin Hub</Link>
                  )}
                </div>

                <div className="mt-auto pt-8 border-t border-slate-200 dark:border-white/5">
                  {user ? (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                         <div className="flex flex-col">
                           <span className="text-xs uppercase tracking-widest opacity-50 font-bold mb-1">Signed in as</span>
                           <span className="font-bold text-slate-900 dark:text-white truncate max-w-[150px]">{user.name}</span>
                         </div>
                         <div className="flex flex-col items-end">
                            <span className="text-xs font-bold text-slate-900 dark:text-white">{user.credits} Credits</span>
                            <Zap className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                         </div>
                      </div>
                      <button 
                        onClick={() => {
                          logout();
                          navigate("/");
                          closeMenu();
                        }}
                        className="w-full py-4 bg-red-500/10 text-red-600 rounded-2xl font-bold text-sm uppercase tracking-widest"
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <Link 
                      to="/login" 
                      onClick={closeMenu}
                      className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl font-bold text-center block uppercase tracking-widest shadow-xl flex items-center justify-center gap-2"
                    >
                      Sign In <Zap className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
