import { motion } from "framer-motion";
import { MessageSquare, CheckCircle } from "lucide-react";

export function PipelineChatPage() {
  const conversations = [
    { id: "c1", name: "Mike R.", role: "Local Handyman", avatar: "https://i.pravatar.cc/150?u=mike", lastMessage: "I can be there by 2 PM tomorrow to assemble the desk.", time: "2m ago", unread: 1, status: "Active Gig" },
    { id: "c2", name: "Sarah M.", role: "UI/UX Designer", avatar: "https://i.pravatar.cc/150?u=sarah", lastMessage: "Here is the Figma link for the new logos. Let me know what you think!", time: "1h ago", unread: 0, status: "Reviewing" },
    { id: "c3", name: "Davit S.", role: "Python Expert", avatar: "https://i.pravatar.cc/150?u=davit", lastMessage: "Thanks! Payment received.", time: "Yesterday", unread: 0, status: "Completed" }
  ];

  return (
    <div className="flex flex-col min-h-full pb-8 bg-[#FAF9F6]">
      <div className="px-6 pt-12 pb-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex justify-between items-end">
          <div>
            <h1 className="text-[28px] font-bold text-[#0F0F11] tracking-tight flex items-center gap-2"><MessageSquare className="text-[#5D3DBD]" /> Pipeline</h1>
            <p className="text-gray-500 text-[15px] mt-1.5 font-medium">Manage your active and past conversations.</p>
          </div>
        </motion.div>
      </div>

      <div className="px-4 mt-4 space-y-2">
        {conversations.map((conv, index) => (
          <motion.div key={conv.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: index * 0.1 }} whileTap={{ scale: 0.98 }} className="bg-white rounded-[20px] p-4 flex gap-4 items-center cursor-pointer border border-[rgba(15,15,17,0.04)] shadow-sm hover:shadow-md transition-shadow">
            <div className="relative">
              <div className="w-14 h-14 rounded-full overflow-hidden border border-gray-100"><img src={conv.avatar} alt={conv.name} className="w-full h-full object-cover" /></div>
              {conv.unread > 0 && <div className="absolute top-0 right-0 w-4 h-4 bg-rose-500 rounded-full border-2 border-white flex items-center justify-center"><span className="text-[9px] font-bold text-white leading-none">{conv.unread}</span></div>}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-0.5">
                <h3 className="text-[16px] font-bold text-[#0F0F11] truncate">{conv.name}</h3>
                <span className="text-[12px] text-gray-400 font-medium whitespace-nowrap ml-2">{conv.time}</span>
              </div>
              <p className={`text-[14px] truncate pr-4 ${conv.unread > 0 ? 'text-[#0F0F11] font-semibold' : 'text-gray-500 font-medium'}`}>{conv.lastMessage}</p>
              
              <div className="mt-2 flex items-center">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase ${conv.status === 'Completed' ? 'bg-green-100 text-green-600' : conv.status === 'Reviewing' ? 'bg-amber-100 text-amber-600' : 'bg-[#5D3DBD]/10 text-[#5D3DBD]'}`}>
                  {conv.status === 'Completed' && <CheckCircle className="inline w-3 h-3 mr-1 mb-0.5" />}
                  {conv.status}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
