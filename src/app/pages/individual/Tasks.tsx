import { useState } from "react";
import { Plus, CheckCircle, FileText, ChevronRight, X, MapPin, Calculator, Info } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Haptics } from "../../../utils/design-system";

export function IndividualTasks() {
  const [isCreating, setIsCreating] = useState(false);

  return (
    <div className="flex flex-col h-full bg-canvas relative">
      <div className="pt-12 px-6 flex flex-col gap-4 pb-4">
        <h1 className="text-display tracking-tight">Job Pipeline</h1>
        
        {/* Pipeline Header Interface */}
        <div className="bg-surface rounded-card p-4 shadow-app border-micro flex justify-between items-center relative overflow-hidden">
           <div className="absolute top-0 right-0 w-24 h-24 bg-brand/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-xl" />
           <div className="flex flex-col z-10">
              <span className="text-caption font-bold text-secondary-color uppercase tracking-wider">Active Modules</span>
              <span className="text-h1 font-bold text-primary-color mt-1">4 Active Jobs</span>
           </div>
           
           <button 
             onClick={() => {
               Haptics.heavyImpact();
               setIsCreating(true);
             }}
             className="w-14 h-14 rounded-full bg-brand text-white flex items-center justify-center shadow-[0_4px_16px_rgba(93,61,189,0.4)] active:scale-95 transition-transform z-10 border-micro min-touch-target"
           >
             <Plus size={28} />
           </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-24 flex flex-col gap-5">
        
        <div className="flex flex-col gap-3">
          <h2 className="text-h2">Pipeline Tracker</h2>

          {/* Status Overview Board - Stackable job state blocks */}
          <div className="flex flex-col gap-3">
            <motion.div whileTap={{ scale: 0.98 }} onClick={() => Haptics.mediumTap()} className="bg-surface rounded-card p-4 shadow-app border-micro flex flex-col gap-3 cursor-pointer">
              <div className="flex justify-between items-center">
                <span className="text-[10px] bg-system-success/10 text-system-success px-2 py-1 rounded-md font-bold uppercase tracking-wider flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-system-success rounded-full animate-pulse" /> Active
                </span>
                <span className="text-h2 font-bold text-primary-color">₾15</span>
              </div>
              <h3 className="text-subheading font-bold">Router Diagnostics</h3>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex -space-x-2">
                  <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100&h=100" alt="" className="w-6 h-6 rounded-full border-2 border-surface object-cover" />
                  <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=100&h=100" alt="" className="w-6 h-6 rounded-full border-2 border-surface object-cover" />
                </div>
                <span className="text-caption font-semibold text-brand ml-1">3 Candidates Reviewing</span>
              </div>
            </motion.div>

            <motion.div whileTap={{ scale: 0.98 }} onClick={() => Haptics.mediumTap()} className="bg-surface rounded-card p-4 shadow-app border-micro flex flex-col gap-3 cursor-pointer">
              <div className="flex justify-between items-center">
                <span className="text-[10px] bg-black/5 dark:bg-white/10 text-secondary-color px-2 py-1 rounded-md font-bold uppercase tracking-wider">
                  Draft
                </span>
                <span className="text-h2 font-bold text-primary-color">₾30</span>
              </div>
              <h3 className="text-subheading font-bold">Office Network Setup</h3>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-6 h-6 rounded-full border-2 border-dashed border-secondary-color flex items-center justify-center text-secondary-color text-[10px]">
                  +
                </div>
                <span className="text-caption font-medium text-secondary-color ml-1">Pending Publication</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isCreating && (
          <CreateJobModal onClose={() => { Haptics.mediumTap(); setIsCreating(false); }} />
        )}
      </AnimatePresence>

    </div>
  );
}

// Conversational Task Creation Interface
function CreateJobModal({ onClose }: { onClose: () => void }) {
  const [budget, setBudget] = useState("");

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm z-30"
      />
      <motion.div 
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="absolute inset-x-0 bottom-0 top-12 bg-surface rounded-t-[24px] z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] flex flex-col overflow-hidden"
      >
        <div className="flex justify-center pt-3 pb-2 shrink-0">
          <div className="w-12 h-1.5 bg-black/10 dark:bg-white/10 rounded-full" />
        </div>
        
        <div className="px-6 flex justify-between items-center shrink-0 mb-4">
          <h2 className="text-h1 font-bold">Create Task</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center bg-black/5 dark:bg-white/10 rounded-full text-secondary-color min-touch-target">
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-32 flex flex-col gap-6">
          
          {/* Step Form Fields */}
          <div className="flex flex-col gap-2">
            <label className="text-caption font-bold text-secondary-color uppercase tracking-wider">Job Title</label>
            <input 
              type="text" 
              placeholder="e.g. Router Diagnostics in Saburtalo"
              className="w-full bg-canvas shadow-inner border-micro rounded-interactive min-touch-target px-4 py-3 text-body-primary font-medium focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent placeholder:text-secondary-color/70"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-caption font-bold text-secondary-color uppercase tracking-wider">Budget Target (₾)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-primary-color">₾</span>
              <input 
                type="number" 
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="0.00"
                className="w-full bg-canvas shadow-inner border-micro rounded-interactive min-touch-target py-3 pl-8 pr-4 text-body-primary font-bold focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent placeholder:text-secondary-color/70"
              />
            </div>
            
            {/* Smart Pricing Guidance */}
            <AnimatePresence>
              {budget && parseInt(budget) > 0 && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, y: -10 }} 
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  className="bg-brand/10 border border-brand/20 p-3 rounded-[12px] flex items-start gap-2 mt-1"
                >
                  <Info size={14} className="text-brand shrink-0 mt-0.5" />
                  <span className="text-[11px] text-brand font-medium leading-tight">
                    Average for Tech Support in this zone is ₾12–₾20. Your price is highly competitive.
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-caption font-bold text-secondary-color uppercase tracking-wider">Location Anchor</label>
            <div className="bg-canvas border-micro rounded-interactive p-3 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-transform">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand/10 text-brand rounded-full flex items-center justify-center shrink-0">
                  <MapPin size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-caption font-bold">Current Location</span>
                  <span className="text-[10px] text-secondary-color font-medium">Saburtalo, Tbilisi</span>
                </div>
              </div>
              <ChevronRight size={18} className="text-secondary-color" />
            </div>
          </div>

        </div>

        {/* Terminal Action Pin */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-surface border-t border-micro shadow-[0_-10px_30px_rgba(0,0,0,0.05)] pb-safe-offset-4">
           <button 
             onClick={() => {
               Haptics.heavyImpact();
               onClose();
             }}
             className="w-full bg-brand text-white py-4 rounded-[16px] flex items-center justify-center gap-2 text-subheading font-bold shadow-app active:scale-[0.98] transition-transform min-touch-target"
           >
             Post Job Now
           </button>
        </div>

      </motion.div>
    </>
  );
}
