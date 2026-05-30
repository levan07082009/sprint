"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Users, Clock, AlertCircle, MessageCircle, CheckCircle } from "lucide-react";
import Link from "next/link";
import CreateGigModal from "./CreateGigModal";
import QRCodePayment from "./QRCodePayment";
import { completeGigAndPay } from "@/app/actions/gigs";

// In a real app, this would be fetched from the server via getMyPostedGigs()
// For now we'll accept it as a prop or fetch it. To keep this client component simple,
// we'll pass the gigs in as props from the Server Component page.tsx
interface EmployerDashboardProps {
  gigs: any[];
}

export default function EmployerDashboard({ gigs }: EmployerDashboardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [payingGig, setPayingGig] = useState<any | null>(null);
  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">
            Dashboard
          </h1>
          <p className="text-neutral-400">Manage your active gigs and applicants.</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center space-x-2 bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-neutral-200 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Post a Gig</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
          title="Active Gigs" 
          value={gigs.filter(g => g.status === 'ACTIVE').length.toString()} 
          icon={Clock} 
          trend="+2 this week"
        />
        <StatCard 
          title="Total Applicants" 
          value={gigs.reduce((acc, gig) => acc + (gig._count?.applications || 0), 0).toString()} 
          icon={Users} 
          trend="12 awaiting review"
          trendColor="text-orange-400"
        />
        <StatCard 
          title="Action Required" 
          value="0" 
          icon={AlertCircle} 
          trend="All caught up"
          trendColor="text-emerald-400"
        />
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-neutral-800">
          <h2 className="text-lg font-semibold text-white">Your Posted Gigs</h2>
        </div>
        
        {gigs.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <BriefcaseIcon className="w-8 h-8 text-neutral-500" />
            </div>
            <h3 className="text-white font-medium mb-1">No gigs posted yet</h3>
            <p className="text-neutral-400 text-sm mb-6">Create your first gig to start receiving applications.</p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center space-x-2 text-violet-400 hover:text-violet-300 font-medium"
            >
              <Plus className="w-4 h-4" />
              <span>Create Gig</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-neutral-800">
            {gigs.map((gig, index) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                key={gig.id} 
                className="p-6 hover:bg-white/5 transition-colors group flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center space-x-3 mb-1">
                    <h3 className="text-white font-medium">{gig.title}</h3>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium">
                      {gig.status}
                    </span>
                  </div>
                  <p className="text-neutral-500 text-sm">{gig.currency} {gig.budget} • Posted {new Date(gig.createdAt).toLocaleDateString()}</p>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <span className="block text-2xl font-semibold text-white">{gig._count?.applications || 0}</span>
                    <span className="text-xs text-neutral-500">Applicants</span>
                  </div>
                  <Link href={`/messages/${gig.id}`} className="px-4 py-2 bg-neutral-800 rounded-lg text-sm text-white hover:bg-neutral-700 transition-colors inline-flex items-center space-x-2">
                    <MessageCircle className="w-4 h-4" />
                    <span>Chat</span>
                  </Link>
                  {gig.status === "ACTIVE" ? (
                    <button 
                      onClick={() => setPayingGig(gig)}
                      className="px-4 py-2 bg-emerald-600 border border-emerald-500 rounded-lg text-sm text-white hover:bg-emerald-700 transition-colors inline-flex items-center space-x-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Complete & Pay</span>
                    </button>
                  ) : (
                    <button className="px-4 py-2 border border-neutral-700 rounded-lg text-sm text-white hover:bg-neutral-800 transition-colors">
                      Manage
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <CreateGigModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

      {payingGig && (
        <QRCodePayment
          amount={payingGig.budget}
          gigId={payingGig.id}
          onClose={() => setPayingGig(null)}
          onPaymentSuccess={async () => {
            await completeGigAndPay(payingGig.id, payingGig.budget);
            setPayingGig(null);
          }}
        />
      )}
    </div>
  );
}

function StatCard({ title, value, icon: Icon, trend, trendColor = "text-violet-400" }: any) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-white/5 rounded-xl">
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

function BriefcaseIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      <rect width="20" height="14" x="2" y="6" rx="2" />
    </svg>
  );
}
