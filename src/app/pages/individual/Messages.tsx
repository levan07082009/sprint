import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, ChevronLeft, Play, MapPin } from "lucide-react";
import { Haptics } from "../../../utils/design-system";
import { useChatEngine, ChatMessages, ChatInput, type ChatMessage } from "../../../utils/chat-engine";

export function IndividualMessages() {
  const [activeChat, setActiveChat] = useState<number | null>(null);

  const PIPELINE_GROUPS = [
    {
      groupTitle: "Local Tasks & Errands",
      status: "ACTIVE",
      candidates: [
        { 
          id: 1, 
          name: "Sandro B.", 
          lastMessage: "I can be there in 15 mins", 
          time: "10:42 AM", 
          avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100&h=100",
          isAudio: false,
          triggerOnSite: true,
          taskTitle: "Local Tasks & Errands",
          taskBudget: "₾15"
        }
      ]
    },
    {
      groupTitle: "Heavy Lifting",
      status: "REVIEWING",
      candidates: [
        { 
          id: 2, 
          name: "Nina V.", 
          lastMessage: "Audio Message (0:45)", 
          time: "Yesterday", 
          avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100&h=100",
          isAudio: true,
          triggerOnSite: false,
          taskTitle: "Heavy Lifting",
          taskBudget: "₾35"
        }
      ]
    }
  ];

  const allCandidates = PIPELINE_GROUPS.flatMap(g => g.candidates);

  return (
    <div className="flex flex-col h-full bg-canvas relative">
      <div className="pt-12 px-6 flex flex-col gap-4">
        <h1 className="text-display tracking-tight">Messages</h1>
        
        {/* Unified Search Engine Input */}
        <div className="relative mt-2">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-color" />
          <input 
            type="text" 
            placeholder="Search candidates or tasks..." 
            className="w-full bg-surface shadow-sm border-micro rounded-[12px] min-touch-target py-3 pl-10 pr-4 text-body-primary focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent placeholder:text-secondary-color"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-8 pb-24">
        {PIPELINE_GROUPS.map((group, idx) => (
          <div key={idx} className="flex flex-col gap-3">
            {/* Aggregated Listing Blocks Header */}
            <div className="flex justify-between items-end border-b border-micro pb-2">
               <h2 className="text-h2 font-bold">{group.groupTitle}</h2>
               <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${group.status === 'ACTIVE' ? 'bg-system-success/10 text-system-success' : 'bg-brand/10 text-brand'}`}>
                 {group.status}
               </span>
            </div>

            <div className="flex flex-col gap-3">
              {group.candidates.map(candidate => (
                <motion.div 
                  whileTap={{ scale: 0.98 }}
                  key={candidate.id}
                  onClick={() => {
                    Haptics.mediumTap();
                    setActiveChat(candidate.id);
                  }}
                  className="flex items-center gap-4 bg-surface p-4 rounded-card shadow-app border-micro cursor-pointer"
                >
                  <div className="relative shrink-0">
                    <img src={candidate.avatar} alt={candidate.name} className="w-12 h-12 rounded-full object-cover shadow-sm border border-black/5 dark:border-white/5" />
                  </div>
                  
                  <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-subheading font-bold truncate">{candidate.name}</span>
                      <span className="text-caption text-secondary-color shrink-0">{candidate.time}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-0.5">
                      {/* Contextual Progress Badge - ON SITE */}
                      {candidate.triggerOnSite && (
                        <span className="text-[9px] font-bold bg-system-warning text-white px-1.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-0.5 shrink-0">
                          <MapPin size={10} /> ON SITE
                        </span>
                      )}
                      
                      {candidate.isAudio ? (
                        <span className="text-body-primary font-medium text-brand truncate flex items-center gap-1">
                          <Play size={14} className="fill-brand" /> {candidate.lastMessage}
                        </span>
                      ) : (
                        <span className="text-body-primary text-secondary-color truncate">{candidate.lastMessage}</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {activeChat !== null && (
          <BusinessChatDetail 
            candidate={allCandidates.find(c => c.id === activeChat)!}
            onBack={() => {
              Haptics.mediumTap();
              setActiveChat(null);
            }} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Individual Chat Detail (with live messaging + @SprintBot) ─────────────────

const INDIVIDUAL_INITIAL_MESSAGES: ChatMessage[] = [
  { id: "b1", text: "Hey Sandro, are you available to help with some heavy lifting?", sender: "me", time: "09:15 AM" },
  { id: "b2", text: "I can be there in 15 mins", sender: "them", time: "10:42 AM" },
];

function BusinessChatDetail({ candidate, onBack }: { candidate: any; onBack: () => void }) {
  const { messages, sendMessage } = useChatEngine(INDIVIDUAL_INITIAL_MESSAGES);

  return (
    <motion.div 
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      className="absolute inset-0 bg-canvas z-30 flex flex-col"
    >
      {/* Header */}
      <div className="bg-surface/90 backdrop-blur-xl border-b border-micro pt-12 pb-3 px-4 flex flex-col z-10 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="min-touch-target w-10 flex items-center justify-center -ml-2 rounded-full active:bg-black/5 dark:active:bg-white/5 text-primary-color">
            <ChevronLeft size={24} />
          </button>
          <img src={candidate.avatar} alt={candidate.name} className="w-10 h-10 rounded-full object-cover shadow-sm" />
          <div className="flex flex-col">
            <span className="text-subheading font-semibold">{candidate.name}</span>
            <span className="text-[10px] text-brand font-bold uppercase tracking-wider">Candidate</span>
          </div>
        </div>
        
        {/* Context Header Element */}
        <div className="bg-canvas border-micro rounded-interactive p-3 flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-caption font-bold text-secondary-color">Task Context</span>
            <span className="text-body-primary font-bold text-primary-color mt-0.5">{candidate.taskTitle}</span>
          </div>
          <span className="text-h2 font-bold text-primary-color">{candidate.taskBudget}</span>
        </div>
      </div>

      {/* Messages */}
      <ChatMessages
        messages={messages}
        systemBanner={
          candidate.triggerOnSite ? (
            <div className="bg-system-warning/10 border border-system-warning/30 rounded-[12px] p-3 flex items-center justify-center gap-2 max-w-[80%] self-center">
              <MapPin size={14} className="text-system-warning" />
              <span className="text-caption text-system-warning font-bold">Worker arrived ON SITE</span>
            </div>
          ) : undefined
        }
      />

      {/* Input */}
      <ChatInput onSend={sendMessage} placeholder="Message candidate... (try @SprintBot)" />
    </motion.div>
  );
}
