"use client";

import { useActionState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { createGig } from "@/app/actions/gigs";

interface CreateGigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const initialState: { error?: string | null; success?: boolean } = { error: null, success: false };

export default function CreateGigModal({ isOpen, onClose }: CreateGigModalProps) {
  const [state, formAction, pending] = useActionState(createGig, initialState);

  // If successful, we can close the modal
  if (state?.success && isOpen) {
    onClose();
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl p-8 shadow-2xl z-10"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-semibold text-white mb-6">Post a New Gig</h2>

            {state?.error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">
                {state.error}
              </div>
            )}

            <form action={formAction} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">Gig Title</label>
                <input 
                  name="title"
                  type="text" 
                  placeholder="e.g. Help moving a couch" 
                  required
                  className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">Description</label>
                <textarea 
                  name="description"
                  placeholder="Provide details about the task..." 
                  required
                  rows={3}
                  className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-1">Budget ($)</label>
                  <input 
                    name="budget"
                    type="number" 
                    placeholder="50.00" 
                    min="1"
                    step="0.01"
                    required
                    className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-1">Category</label>
                  <select 
                    name="category"
                    required
                    className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all appearance-none"
                  >
                    <option value="moving-assistance">Moving Assistance</option>
                    <option value="yard-work">Yard Work</option>
                    <option value="furniture-assembly">Furniture Assembly</option>
                    <option value="graphic-design">Graphic Design</option>
                    <option value="math-tutoring">Tutoring</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">Urgency</label>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="radio" name="urgency" value="STANDARD" defaultChecked className="text-violet-500 focus:ring-violet-500 bg-black border-neutral-700" />
                    <span className="text-sm text-neutral-300">Standard</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="radio" name="urgency" value="ASAP" className="text-violet-500 focus:ring-violet-500 bg-black border-neutral-700" />
                    <span className="text-sm text-neutral-300">ASAP 🔥</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-800">
                <button 
                  type="submit"
                  disabled={pending}
                  className="w-full flex items-center justify-center space-x-2 bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {pending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <span>Post Gig</span>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
