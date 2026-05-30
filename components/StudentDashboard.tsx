"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, DollarSign, Star, Briefcase, ChevronRight } from "lucide-react";
import Link from "next/link";
import GigApplicationModal from "./GigApplicationModal";

interface StudentDashboardProps {
  recommendedGigs: any[];
}

export default function StudentDashboard({ recommendedGigs }: StudentDashboardProps) {
  const [selectedGig, setSelectedGig] = useState<any | null>(null);

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
          Find Work
        </h1>
        <p className="text-neutral-400">Discover local gigs matching your skills.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-gradient-to-br from-violet-600 to-indigo-600 p-6 rounded-3xl text-white relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-white/80 font-medium mb-1">Total Earnings</h3>
            <div className="text-4xl font-bold mb-4">$0.00</div>
            <Link href="/student/earnings" className="inline-flex items-center space-x-1 text-white/90 hover:text-white text-sm font-medium">
              <span>View History</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <DollarSign className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10" />
        </div>
        
        <StatCard 
          title="Active Applications" 
          value="0" 
          icon={Briefcase} 
          trend="In review"
          trendColor="text-orange-400"
        />
        <StatCard 
          title="Trust Score" 
          value="New" 
          icon={Star} 
          trend="Complete gigs to level up"
          trendColor="text-emerald-400"
        />
      </div>

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Recommended Gigs</h2>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input 
            type="text" 
            placeholder="Search gigs..." 
            className="bg-neutral-900 border border-neutral-800 rounded-full py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all w-64"
          />
        </div>
      </div>

      {recommendedGigs.length === 0 ? (
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-12 text-center">
          <Search className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No gigs available right now</h3>
          <p className="text-neutral-500">Check back later or update your skills to see more opportunities.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedGigs.map((gig, index) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              key={gig.id}
              onClick={() => setSelectedGig(gig)}
              className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 hover:border-violet-500/50 transition-colors group cursor-pointer flex flex-col"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="px-3 py-1 rounded-full bg-white/5 text-xs font-medium text-neutral-300">
                  {gig.requiredSkills[0] || "General"}
                </div>
                <div className="text-lg font-bold text-white">
                  {gig.currency} {gig.budget}
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-violet-400 transition-colors">
                {gig.title}
              </h3>
              
              <p className="text-neutral-400 text-sm mb-6 line-clamp-2 flex-1">
                {gig.description}
              </p>
              
              <div className="flex items-center justify-between pt-4 border-t border-neutral-800 mt-auto">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-orange-400 to-rose-400" />
                  <span className="text-xs font-medium text-neutral-400">
                    {gig.employer?.profile?.displayName || "Employer"}
                  </span>
                </div>
                <span className="text-xs text-neutral-500">
                  {gig.urgency === "ASAP" ? "🔥 ASAP" : "Standard"}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <GigApplicationModal 
        gig={selectedGig} 
        isOpen={!!selectedGig} 
        onClose={() => setSelectedGig(null)} 
      />
    </div>
  );
}

function StatCard({ title, value, icon: Icon, trend, trendColor = "text-violet-400" }: any) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-white/5 rounded-2xl">
          <Icon className="w-6 h-6 text-neutral-400" />
        </div>
      </div>
      <div>
        <h3 className="text-neutral-500 text-sm font-medium mb-1">{title}</h3>
        <div className="flex items-baseline space-x-3">
          <span className="text-3xl font-bold text-white">{value}</span>
          <span className={`text-sm font-medium ${trendColor}`}>{trend}</span>
        </div>
      </div>
    </div>
  );
}
