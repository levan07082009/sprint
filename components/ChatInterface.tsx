"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { sendMessage } from "@/app/actions/messages";

interface ChatInterfaceProps {
  initialMessages: any[];
  conversationId: string;
  currentUserId: string; // The Prisma User ID, not Clerk ID
}

export default function ChatInterface({ initialMessages, conversationId, currentUserId }: ChatInterfaceProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [isPending, startTransition] = useTransition();
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Supabase Realtime Subscription
  useEffect(() => {
    const channel = supabase.channel(`chat_${conversationId}`);
    
    channel
      .on(
        'broadcast',
        { event: 'new_message' },
        (payload) => {
          // If the message is from someone else, append it
          if (payload.payload.senderId !== currentUserId) {
            setMessages((prev) => [...prev, payload.payload]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, currentUserId]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const content = input;
    setInput("");

    // Optimistic UI update
    const optimisticMessage = {
      id: Math.random().toString(),
      content,
      senderId: currentUserId,
      createdAt: new Date(),
      sender: null // we don't have the full profile for optimistic UI immediately
    };
    
    setMessages((prev) => [...prev, optimisticMessage]);

    startTransition(async () => {
      const result = await sendMessage(conversationId, content);
      if (result.error) {
        // Revert optimistic update on failure
        setMessages((prev) => prev.filter(m => m.id !== optimisticMessage.id));
        alert(result.error);
      } else if (result.success && result.message) {
        // Replace optimistic message with actual DB message
        setMessages((prev) => prev.map(m => m.id === optimisticMessage.id ? result.message : m));
      }
    });
  };

  return (
    <div className="flex flex-col h-full bg-black">
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-neutral-500">
            <p>No messages yet.</p>
            <p className="text-sm">Start the conversation!</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((msg, idx) => {
              const isMine = msg.senderId === currentUserId;
              
              return (
                <motion.div 
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[75%] rounded-3xl px-5 py-3 ${
                    isMine 
                      ? 'bg-violet-600 text-white rounded-br-none' 
                      : 'bg-neutral-800 text-white rounded-bl-none'
                  }`}>
                    {!isMine && msg.sender?.profile?.displayName && (
                      <p className="text-xs text-neutral-400 font-medium mb-1">
                        {msg.sender.profile.displayName}
                      </p>
                    )}
                    <p className="text-sm md:text-base leading-relaxed">{msg.content}</p>
                    <div className={`text-[10px] mt-1 ${isMine ? 'text-violet-200' : 'text-neutral-500'} text-right`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 bg-neutral-900 border-t border-neutral-800">
        <form onSubmit={handleSend} className="flex items-center space-x-3 max-w-4xl mx-auto">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-black border border-neutral-800 rounded-full px-6 py-3 text-sm text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
            disabled={isPending}
          />
          <button 
            type="submit"
            disabled={!input.trim() || isPending}
            className="w-12 h-12 rounded-full bg-violet-600 flex items-center justify-center text-white hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 -ml-1 mt-1" />}
          </button>
        </form>
      </div>
    </div>
  );
}
