import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Send, Sparkles } from "lucide-react";

export function SprintBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "bot" | "user"; content: string }[]>([
    { role: "bot", content: "Hi! I'm SprintBot. How can I assist you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setIsTyping(true);

    const mockResponse = "I can certainly help you with that! Whether it's finding a local tutor or getting help with chores, just let me know what you need.";
    let currentIndex = 0;
    
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "bot", content: "" }]);
      
      const interval = setInterval(() => {
        if (currentIndex < mockResponse.length) {
          const char = mockResponse[currentIndex];
          setMessages((prev) => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1].content += char;
            return newMessages;
          });
          currentIndex++;
        } else {
          clearInterval(interval);
          setIsTyping(false);
        }
      }, 30);
    }, 600);
  };

  return (
    <>
      <motion.button
        className="absolute right-5 bottom-28 z-40 p-4 bg-[#5D3DBD] text-white rounded-full shadow-xl flex items-center justify-center hover:bg-[#7C5CFF] transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ boxShadow: "0 8px 32px rgba(93, 61, 189, 0.4)" }}
      >
        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}>
          <Bot size={24} />
        </motion.div>
        
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-[#5D3DBD]"
          animate={{ scale: [1, 1.5], opacity: [0.8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="absolute inset-x-0 bottom-[80px] z-40 h-[72vh] bg-white rounded-t-[24px] shadow-2xl flex flex-col border-t border-[rgba(15,15,17,0.06)]"
          >
            <div className="flex items-center justify-between p-5 border-b border-[rgba(15,15,17,0.06)] bg-gradient-to-r from-[#FAF9F6] to-white rounded-t-[24px]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#5D3DBD] text-white flex items-center justify-center shadow-md">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-[#0F0F11] text-lg flex items-center gap-1">@SprintBot</h3>
                  <p className="text-xs text-[#5D3DBD] font-medium flex items-center gap-1"><Sparkles size={10} /> Powered by Groq Cloud — Lightning Fast</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#FAF9F6]">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === "bot" ? "justify-start" : "justify-end"}`}>
                  <div className={`max-w-[80%] rounded-[16px] p-3.5 text-[15px] leading-relaxed shadow-sm ${msg.role === "bot" ? "bg-white text-[#0F0F11] border border-[rgba(15,15,17,0.06)] rounded-tl-sm" : "bg-gradient-to-br from-[#5D3DBD] to-[#7C5CFF] text-white rounded-tr-sm"}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-[rgba(15,15,17,0.06)] rounded-[16px] rounded-tl-sm p-4 shadow-sm flex gap-1.5 items-center">
                    <motion.div className="w-2 h-2 rounded-full bg-[#5D3DBD]/60" animate={{ scale: [1, 1.4, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0 }} />
                    <motion.div className="w-2 h-2 rounded-full bg-[#5D3DBD]/60" animate={{ scale: [1, 1.4, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} />
                    <motion.div className="w-2 h-2 rounded-full bg-[#5D3DBD]/60" animate={{ scale: [1, 1.4, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white border-t border-[rgba(15,15,17,0.06)]">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask SprintBot anything..."
                  className="w-full bg-[#FAF9F6] border border-[rgba(15,15,17,0.1)] rounded-[16px] py-3.5 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-[#5D3DBD]/20 text-[15px] placeholder-gray-400"
                />
                <button onClick={handleSend} disabled={!input.trim()} className="absolute right-2 p-2 text-[#5D3DBD] hover:bg-[#5D3DBD]/10 rounded-full transition-colors disabled:opacity-50">
                  <Send size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
