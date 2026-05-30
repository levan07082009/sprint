import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ShieldCheck, MapPin, X, BadgeCheck } from "lucide-react";

const MOCK_STUDENT = {
  id: "st-1", name: "Davit S.", verified: true, rating: 4.9, trustScore: 99,
  gigsDone: "50+", skills: ["Math Tutoring", "Python Automation", "Excel Data"], avatarUrl: "https://i.pravatar.cc/150?u=davit",
};

const NODES = [
  { id: "node-1", top: "20%", left: "30%", size: 48, ...MOCK_STUDENT },
  { id: "node-2", top: "45%", left: "65%", size: 40, name: "Sarah M.", avatarUrl: "https://i.pravatar.cc/150?u=sarah" },
  { id: "node-3", top: "70%", left: "40%", size: 56, name: "Mike R.", avatarUrl: "https://i.pravatar.cc/150?u=mike" },
];

export function ExploreMapPage() {
  const [selectedStudent, setSelectedStudent] = useState<typeof MOCK_STUDENT | null>(null);

  return (
    <div className="flex flex-col min-h-full pb-8 bg-[#FAF9F6]">
      <div className="px-6 pt-10 pb-4">
        <h1 className="text-[24px] font-bold text-[#0F0F11] tracking-tight flex items-center gap-2">
          <MapPin className="text-[#5D3DBD] w-6 h-6" /> Explore Local Talent
        </h1>
        <p className="text-gray-500 text-[14px] mt-1 font-medium">Tap on an active student to view their profile.</p>
      </div>

      <div className="px-4">
        <div className="w-full h-[62vh] rounded-[24px] overflow-hidden relative shadow-inner bg-slate-100 border border-[rgba(15,15,17,0.06)]">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#5D3DBD 1px, transparent 1px), linear-gradient(90deg, #5D3DBD 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-100/80 to-transparent pointer-events-none" />

          {NODES.map((node) => (
            <motion.button
              key={node.id} className="absolute z-10" style={{ top: node.top, left: node.left }}
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={() => setSelectedStudent(MOCK_STUDENT)}
            >
              <div className="relative">
                <motion.div className="absolute inset-0 rounded-full bg-green-400 opacity-50" animate={{ scale: [1, 1.8], opacity: [0.6, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }} />
                <div className="relative rounded-full border-[3px] border-white shadow-lg bg-white overflow-hidden" style={{ width: node.size, height: node.size }}>
                  <img src={node.avatarUrl} alt={node.name} className="w-full h-full object-cover" />
                </div>
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full z-20 shadow-sm" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedStudent && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedStudent(null)} className="absolute inset-0 bg-black/20 backdrop-blur-sm z-40 rounded-[40px]" />
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", stiffness: 350, damping: 30 }} className="absolute bottom-0 left-0 right-0 z-50 bg-white rounded-t-[32px] pt-2 pb-8 px-6 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] border-t border-[rgba(15,15,17,0.06)]">
              <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" />
              <div className="flex justify-between items-start mb-5">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full border-2 border-[#FAF9F6] shadow-sm overflow-hidden">
                    <img src={selectedStudent.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h2 className="text-[20px] font-bold text-[#0F0F11] flex items-center gap-1.5">{selectedStudent.name} {selectedStudent.verified && <BadgeCheck className="w-5 h-5 text-[#7C5CFF]" />}</h2>
                    <p className="text-[#5D3DBD] text-sm font-semibold mt-0.5">Top Rated Student</p>
                  </div>
                </div>
                <button onClick={() => setSelectedStudent(null)} className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition"><X size={20} /></button>
              </div>

              <div className="flex items-center gap-4 py-4 border-y border-[rgba(15,15,17,0.06)] mb-5">
                <div className="flex items-center gap-1.5"><Star className="w-4 h-4 text-amber-400 fill-amber-400" /><span className="font-semibold text-[#0F0F11] text-[15px]">{selectedStudent.rating}</span></div>
                <div className="w-1 h-1 rounded-full bg-gray-300" />
                <div className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-green-500" /><span className="font-medium text-[#0F0F11] text-[15px]">{selectedStudent.trustScore}% Trust</span></div>
                <div className="w-1 h-1 rounded-full bg-gray-300" />
                <span className="text-gray-500 text-[14px] font-medium">{selectedStudent.gigsDone} Gigs</span>
              </div>

              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Verified Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedStudent.skills.map((skill) => <span key={skill} className="px-3.5 py-1.5 bg-[#FAF9F6] border border-[rgba(15,15,17,0.06)] rounded-full text-[13px] font-medium text-[#0F0F11]">{skill}</span>)}
                </div>
              </div>

              <button className="w-full bg-[#5D3DBD] hover:bg-[#7C5CFF] text-white font-semibold rounded-xl py-3.5 transition-all text-center text-[16px] shadow-lg shadow-[#5D3DBD]/20">+ Direct Invite to Task</button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
