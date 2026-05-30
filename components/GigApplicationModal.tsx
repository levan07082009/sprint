"use client";

import { useActionState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { applyToGig } from "@/app/actions/gigs";

interface GigApplicationModalProps {
  gig: any | null;
  isOpen: boolean;
  onClose: () => void;
}

const initialState: { error?: string | null; success?: boolean } = { error: null, success: false };

export default function GigApplicationModal({ gig, isOpen, onClose }: GigApplicationModalProps) {
  const [state, formAction, pending] = useActionState(applyToGig, initialState);

  if (state?.success && isOpen) {
    onClose();
  }

  if (!gig) return null;

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

            <h2 className="text-2xl font-semibold text-white mb-2">Apply for Gig</h2>
            <div className="mb-6 p-4 bg-white/5 rounded-xl border border-white/10">
              <h3 className="text-white font-medium">{gig.title}</h3>
              <p className="text-neutral-400 text-sm mt-1">Budget: {gig.currency} {gig.budget}</p>
            </div>

            {state?.error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">
                {state.error}
              </div>
            )}

            <form action={formAction} className="space-y-5">
              <input type="hidden" name="gigId" value={gig.id} />
              
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">Cover Note</label>
                <textarea 
                  name="coverNote"
                  placeholder="Why are you a good fit for this gig?" 
                  required
                  rows={4}
                  className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">Proposed Rate ({gig.currency})</label>
                <input 
                  name="proposedRate"
                  type="number" 
                  placeholder={gig.budget.toString()} 
                  defaultValue={gig.budget}
                  min="1"
                  step="0.01"
                  className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                />
                <p className="text-xs text-neutral-500 mt-1">Leave as is to accept the employer's budget.</p>
              </div>

              <div className="pt-4 border-t border-neutral-800 flex items-center justify-end space-x-3">
                <button 
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 rounded-xl font-medium text-white hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={pending}
                  className="flex items-center justify-center space-x-2 bg-violet-600 hover:bg-violet-700 text-white px-8 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {pending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <span>Submit Application</span>
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
