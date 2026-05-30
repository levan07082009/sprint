import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShieldCheck, Star, Edit3, MapPin, Phone, Bell, ChevronRight, Moon, Sun, LogOut, CreditCard, Users, CheckCircle } from "lucide-react";
import { Haptics } from "../../../utils/design-system";

const REVIEWS = [
  { id: 1, author: "Mariam D.", rating: 5, text: "Very clear instructions, paid instantly. Great to work with!", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=60&h=60" },
  { id: 2, author: "Luka G.", rating: 5, text: "Professional and responsive. Highly recommend hiring through Sprint.", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=60&h=60" },
  { id: 3, author: "Elene K.", rating: 4, text: "Good communication, task was well-defined.", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=60&h=60" },
];

function StarRow({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={12} className={i <= count ? "text-amber-400 fill-amber-400" : "text-gray-200"} />
      ))}
    </div>
  );
}

export function IndividualProfile() {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(d => {
      const next = !d;
      document.documentElement.classList.toggle("dark", next);
      Haptics.mediumTap();
      return next;
    });
  };

  return (
    <div className="flex flex-col h-full bg-canvas relative">
      {/* Hero Header */}
      <div className="pt-12 px-6 pb-6 bg-gradient-to-b from-[#5D3DBD]/8 to-transparent flex flex-col gap-5">
        <h1 className="text-display tracking-tight">My Profile</h1>

        {/* Identity Card */}
        <div className="bg-gradient-to-br from-[#5D3DBD] to-[#7C5CFF] rounded-[24px] p-5 text-white relative overflow-hidden shadow-[0_8px_32px_rgba(93,61,189,0.3)]">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
          <div className="flex items-center gap-4 z-10 relative">
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-full p-[2px] bg-white/30">
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200"
                  alt="Agent Avatar"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-md">
                <ShieldCheck size={14} className="text-[#5D3DBD]" />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-[22px] font-bold leading-tight">Alex T.</h2>
              <div className="flex items-center gap-1.5 text-white/80 text-[13px] font-medium">
                <MapPin size={13} /> Saburtalo, Tbilisi
              </div>
              <div className="flex items-center gap-2 mt-1">
                <div className="bg-white/20 border border-white/20 px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1">
                  <Star size={11} className="fill-amber-300 text-amber-300" /> 4.9 Rating
                </div>
                <div className="bg-white/20 border border-white/20 px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1">
                  <Users size={11} /> 18 Hired
                </div>
              </div>
            </div>
          </div>
          <button className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors">
            <Edit3 size={14} className="text-white" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-28 flex flex-col gap-6 no-scrollbar">

        {/* Trust Metrics */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Trust Score", value: "97%", color: "text-[#5D3DBD]" },
            { label: "Avg Pay Time", value: "< 1h", color: "text-system-success" },
            { label: "Jobs Posted", value: "12", color: "text-primary-color" },
          ].map(stat => (
            <div key={stat.label} className="bg-surface border-micro rounded-[16px] p-3 shadow-app flex flex-col items-center gap-1 text-center">
              <span className={`text-[20px] font-bold ${stat.color}`}>{stat.value}</span>
              <span className="text-[10px] text-secondary-color font-semibold leading-tight">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Verified Badges */}
        <div className="flex flex-col gap-3">
          <h3 className="text-h2 font-bold text-primary-color">Verification</h3>
          <div className="bg-surface border-micro rounded-card shadow-app overflow-hidden">
            {[
              { icon: <ShieldCheck size={18} className="text-system-success" />, label: "ID Verified", sub: "Georgian ID Card", done: true },
              { icon: <Phone size={18} className="text-brand" />, label: "Phone Confirmed", sub: "+995 555 *** ***", done: true },
              { icon: <CreditCard size={18} className="text-system-warning" />, label: "Payment Method", sub: "TBC Bank • Linked", done: true },
            ].map((item, i) => (
              <motion.div key={i} whileTap={{ scale: 0.98 }} className="flex items-center gap-4 p-4 active:bg-black/5 transition-colors cursor-pointer border-b last:border-b-0 border-micro">
                <div className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                <div className="flex-1 flex flex-col">
                  <span className="text-caption font-bold">{item.label}</span>
                  <span className="text-[11px] text-secondary-color">{item.sub}</span>
                </div>
                {item.done && <CheckCircle size={16} className="text-system-success shrink-0" />}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Reviews from Workers */}
        <div className="flex flex-col gap-3">
          <h3 className="text-h2 font-bold text-primary-color">Reviews from Workers</h3>
          <div className="flex flex-col gap-3">
            {REVIEWS.map(r => (
              <motion.div key={r.id} whileTap={{ scale: 0.99 }} className="bg-surface border-micro rounded-card p-4 shadow-app flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <img src={r.avatar} alt={r.author} className="w-9 h-9 rounded-full object-cover shadow-sm" />
                  <div className="flex flex-col flex-1">
                    <span className="text-caption font-bold">{r.author}</span>
                    <StarRow count={r.rating} />
                  </div>
                </div>
                <p className="text-[13px] text-secondary-color leading-relaxed">"{r.text}"</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div className="flex flex-col gap-3">
          <h3 className="text-h2 font-bold text-primary-color">Settings</h3>
          <div className="bg-surface border-micro rounded-card shadow-app overflow-hidden">
            <motion.div whileTap={{ scale: 0.98 }} onClick={toggleTheme} className="flex items-center gap-4 p-4 active:bg-black/5 transition-colors cursor-pointer border-b border-micro">
              <div className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center shrink-0">
                {isDark ? <Moon size={18} className="text-brand" /> : <Sun size={18} className="text-amber-400" />}
              </div>
              <span className="flex-1 text-caption font-bold">{isDark ? "Dark Mode" : "Light Mode"}</span>
              <ChevronRight size={16} className="text-secondary-color" />
            </motion.div>
            <motion.div whileTap={{ scale: 0.98 }} className="flex items-center gap-4 p-4 active:bg-black/5 transition-colors cursor-pointer border-b border-micro">
              <div className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center shrink-0">
                <Bell size={18} className="text-secondary-color" />
              </div>
              <span className="flex-1 text-caption font-bold">Notifications</span>
              <ChevronRight size={16} className="text-secondary-color" />
            </motion.div>
            <motion.div whileTap={{ scale: 0.98 }} onClick={() => { Haptics.heavyImpact(); localStorage.clear(); window.location.href = "/onboarding"; }} className="flex items-center gap-4 p-4 active:bg-red-50 transition-colors cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                <LogOut size={18} className="text-red-500" />
              </div>
              <span className="flex-1 text-caption font-bold text-red-500">Sign Out</span>
              <ChevronRight size={16} className="text-red-300" />
            </motion.div>
          </div>
        </div>

      </div>
    </div>
  );
}
