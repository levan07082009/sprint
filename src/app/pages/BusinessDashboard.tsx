import { MapPin, TrendingUp, Users, Activity, Navigation, Clock, CreditCard, Sun, Moon, LogOut } from "lucide-react";
import { Haptics } from "../../utils/design-system";
import { motion } from "motion/react";
import { WalletBalance } from "../components/WalletBalance";

export function BusinessDashboard() {

  const toggleTheme = () => {
    Haptics.mediumTap();
    document.documentElement.classList.toggle("dark");
  };

  const handleSignOut = () => {
    Haptics.mediumTap();
    localStorage.removeItem("sprint_role");
    window.location.href = "/onboarding";
  };

  return (
    <div className="flex flex-col h-full bg-canvas relative">
      <div className="pt-12 px-6 pb-4 flex justify-between items-start z-10">
        <div className="flex flex-col gap-1">
          <p className="text-secondary-color text-caption uppercase tracking-wider font-semibold">Command Center</p>
          <div className="flex items-center gap-2">
            <h1 className="text-display tracking-tight">Dashboard</h1>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <button 
              onClick={toggleTheme}
              className="bg-black/5 dark:bg-white/10 text-[10px] px-2 py-1 rounded-full font-semibold uppercase tracking-wider text-secondary-color hover:text-primary-color transition-colors flex items-center gap-1 min-touch-target"
            >
              <Sun size={12} className="hidden dark:block" />
              <Moon size={12} className="block dark:hidden" />
              Theme
            </button>
            <button 
              onClick={handleSignOut}
              className="bg-black/5 dark:bg-white/10 text-[10px] px-2 py-1 rounded-full font-semibold uppercase tracking-wider text-secondary-color hover:text-primary-color transition-colors flex items-center gap-1 min-touch-target"
            >
              <LogOut size={12} />
              Switch Account
            </button>
          </div>
        </div>
        <div className="w-14 h-14 bg-brand text-white text-h1 font-bold rounded-full shadow-app flex items-center justify-center shrink-0 border-micro overflow-hidden">
          <img src="/Images/TBC.png" alt="TB Logo" className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto pb-24 z-10">
        <WalletBalance balance="₾1,450.00" escrow="₾120.00" role="business" />

        {/* Telemetry Tracking View */}
        <div className="flex flex-col gap-3 relative mt-2">
          <div className="bg-[#121214] rounded-card p-4 shadow-app overflow-hidden relative border-micro h-[240px] flex items-center justify-center">
            {/* Map Mockup Background */}
            <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay" />
            
            {/* Nodes and Vector Line */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 200">
              <path 
                d="M 50,150 Q 150,50 250,100 T 350,50" 
                fill="none" 
                stroke="rgba(124, 92, 255, 0.4)" 
                strokeWidth="2" 
                strokeDasharray="4 4" 
                className="animate-[dash_20s_linear_infinite]"
              />
            </svg>
            <style>{`@keyframes dash { to { stroke-dashoffset: -100; } }`}</style>
            
            {/* Origin Node */}
            <div className="absolute left-[12%] bottom-[25%] w-3 h-3 bg-surface rounded-full shadow-[0_0_0_4px_rgba(255,255,255,0.1)] border-2 border-[#121214]" />
            {/* Mid Node */}
            <div className="absolute left-[62%] top-[50%] w-3 h-3 bg-brand rounded-full shadow-[0_0_0_4px_rgba(93,61,189,0.3)] border-2 border-[#121214] animate-pulse" />
            {/* Target Node */}
            <div className="absolute right-[12%] top-[25%] w-4 h-4 bg-system-success rounded-full shadow-[0_0_0_4px_rgba(16,185,129,0.2)] border-2 border-[#121214]" />
            
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] text-white font-bold uppercase tracking-wider flex items-center gap-1.5 border border-white/10">
               <Activity size={12} className="text-brand" /> Live Dispatch
            </div>
          </div>

          {/* Live Status Floating Sheet */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="absolute -bottom-8 left-4 right-4 bg-surface rounded-interactive p-4 shadow-app border-micro flex items-center gap-3 z-20"
          >
            <div className="relative shrink-0">
               <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100&h=100" alt="Avatar" className="w-12 h-12 rounded-full object-cover border-2 border-surface shadow-sm" />
               <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-system-warning border-2 border-surface rounded-full shadow-sm" />
            </div>
            <div className="flex-1 flex flex-col">
               <div className="flex justify-between items-center mb-0.5">
                  <span className="text-subheading font-bold">Elene K.</span>
                  <span className="text-caption font-bold text-brand bg-brand/10 px-2 py-0.5 rounded-md flex items-center gap-1"><Clock size={12}/> 14m</span>
               </div>
               <span className="text-caption text-secondary-color truncate font-medium">In Transit • En route to structural cleaning</span>
            </div>
          </motion.div>
        </div>

        {/* Pipeline Metrics Overview Grid */}
        <div className="grid grid-cols-1 mt-8">
          <motion.div whileTap={{ scale: 0.98 }} onClick={() => Haptics.mediumTap()} className="bg-surface rounded-card p-4 shadow-app border-micro flex flex-col gap-3 cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-system-success/10 text-system-success flex items-center justify-center">
              <TrendingUp size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-caption text-secondary-color uppercase tracking-wider font-bold mb-1">Active Tasks</span>
              <span className="text-display">3</span>
            </div>
          </motion.div>
        </div>

        {/* Quick Operations Actions */}
        <div className="flex flex-col gap-3 mt-2">
          <h2 className="text-h2">Quick Operations</h2>
          <div className="flex gap-3">
             <button onClick={() => Haptics.mediumTap()} className="flex-1 bg-surface border-micro shadow-sm rounded-interactive py-3 flex flex-col items-center gap-1 min-touch-target active:bg-black/5 transition-colors">
               <Users size={20} className="text-secondary-color mb-1" />
               <span className="text-caption font-semibold">Talent Pool</span>
             </button>
             <button onClick={() => Haptics.mediumTap()} className="flex-1 bg-surface border-micro shadow-sm rounded-interactive py-3 flex flex-col items-center gap-1 min-touch-target active:bg-black/5 transition-colors">
               <Navigation size={20} className="text-secondary-color mb-1" />
               <span className="text-caption font-semibold">Dispatch</span>
             </button>
          </div>
        </div>

      </div>
    </div>
  );
}
