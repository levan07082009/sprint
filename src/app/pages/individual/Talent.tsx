import { useState } from "react";
import { Search, MapPin, Star, UserPlus, X, Briefcase, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Haptics } from "../../../utils/design-system";

const TALENT_POOL = [
  { id: 1, name: "Mariam D.", skills: ["Python", "Excel Automation"], dist: "1.2 km", trust: "99%", online: true, img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100&h=100" },
  { id: 2, name: "Luka G.", skills: ["Networking", "IT Support"], dist: "2.5 km", trust: "96%", online: true, img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=100&h=100" },
  { id: 3, name: "Elene K.", skills: ["Data Entry", "Translation"], dist: "3.1 km", trust: "98%", online: false, img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100" },
];

export function IndividualTalentNetwork() {
  const [selectedTalent, setSelectedTalent] = useState<any>(null);

  return (
    <div className="flex flex-col h-full bg-canvas relative">
      <div className="pt-12 px-6 flex flex-col gap-4 pb-4">
        <h1 className="text-display tracking-tight">Talent Pool</h1>
        
        {/* Talent Discovery Search Field */}
        <div className="relative mt-2">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-color" />
          <input 
            type="text" 
            placeholder="Search by skills (e.g. Python, Excel)..." 
            className="w-full bg-surface shadow-sm border-micro rounded-interactive min-touch-target py-3 pl-11 pr-4 text-body-primary focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent placeholder:text-secondary-color"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-24 flex flex-col gap-6">
        <h2 className="text-h2">Available Nearby</h2>
        
        {/* Sourcing Cards */}
        <div className="flex flex-col gap-4">
          {TALENT_POOL.map(talent => (
            <motion.div 
              key={talent.id}
              whileTap={{ scale: 0.98 }}
              className="bg-surface rounded-card p-4 shadow-app border-micro flex flex-col gap-4 relative overflow-hidden"
            >
              <div className="flex gap-4 items-start">
                {/* Portrait with Online Indicator */}
                <div className="relative shrink-0">
                  <div className={`w-14 h-14 rounded-full p-0.5 ${talent.online ? 'bg-system-success' : 'bg-transparent'}`}>
                    <img src={talent.img} alt={talent.name} className="w-full h-full rounded-full object-cover border-2 border-surface shadow-sm" />
                  </div>
                </div>
                
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-0.5">
                    <span className="text-h2 leading-tight">{talent.name}</span>
                    <div className="flex items-center gap-1 bg-brand/10 text-brand px-2 py-0.5 rounded-md">
                      <Star size={12} className="fill-brand" />
                      <span className="text-caption font-bold">{talent.trust} Trust</span>
                    </div>
                  </div>
                  
                  {/* Skill Indexes */}
                  <span className="text-caption font-medium text-secondary-color mb-1">
                    {talent.skills.join(" • ")}
                  </span>
                  
                  {/* Live Distance */}
                  <span className="text-[11px] text-primary-color font-semibold flex items-center gap-1 mt-1">
                    <MapPin size={12} /> {talent.dist} Away
                  </span>
                </div>
              </div>

              {/* Direct Invite Action Paradigm */}
              <button 
                onClick={() => {
                  Haptics.mediumTap();
                  setSelectedTalent(talent);
                }}
                className="w-full bg-brand text-white py-3 rounded-interactive flex items-center justify-center gap-2 text-caption font-bold shadow-md active:opacity-80 min-touch-target"
              >
                <UserPlus size={16} /> Direct Invite
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Slide-Up Overlay Menu for Direct Invite */}
      <AnimatePresence>
        {selectedTalent && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedTalent(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm z-30"
            />
            <motion.div 
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="absolute bottom-0 left-0 right-0 bg-surface rounded-t-[24px] z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] flex flex-col"
            >
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-12 h-1.5 bg-black/10 dark:bg-white/10 rounded-full" />
              </div>
              
              <div className="px-6 pb-6 pt-2 flex flex-col gap-5">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <img src={selectedTalent.img} alt="" className="w-10 h-10 rounded-full object-cover shadow-sm" />
                    <div className="flex flex-col">
                      <span className="text-subheading font-bold">Invite {selectedTalent.name}</span>
                      <span className="text-[10px] text-secondary-color font-medium">Select an open pipeline task</span>
                    </div>
                  </div>
                  <button onClick={() => setSelectedTalent(null)} className="w-8 h-8 flex items-center justify-center bg-black/5 dark:bg-white/10 rounded-full text-secondary-color min-touch-target">
                    <X size={16} />
                  </button>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="bg-canvas border-micro rounded-interactive p-4 flex items-center justify-between active:scale-95 transition-transform cursor-pointer" onClick={() => { Haptics.heavyImpact(); setSelectedTalent(null); }}>
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand/10 text-brand rounded-full flex items-center justify-center">
                           <Briefcase size={18} />
                        </div>
                        <div className="flex flex-col">
                           <span className="text-caption font-bold">Router Diagnostics</span>
                           <span className="text-[10px] text-system-success font-bold mt-0.5">₾15 • Active Draft</span>
                        </div>
                     </div>
                     <ChevronRight size={18} className="text-secondary-color" />
                  </div>
                  <div className="bg-canvas border-micro rounded-interactive p-4 flex items-center justify-between active:scale-95 transition-transform cursor-pointer" onClick={() => { Haptics.heavyImpact(); setSelectedTalent(null); }}>
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand/10 text-brand rounded-full flex items-center justify-center">
                           <Briefcase size={18} />
                        </div>
                        <div className="flex flex-col">
                           <span className="text-caption font-bold">Office Network Setup</span>
                           <span className="text-[10px] text-system-success font-bold mt-0.5">₾35 • Active Draft</span>
                        </div>
                     </div>
                     <ChevronRight size={18} className="text-secondary-color" />
                  </div>
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
