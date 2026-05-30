export default function OnboardingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-slate-950 text-slate-100">
      <h1 className="text-4xl font-bold tracking-tight mb-4">Welcome to Sprint</h1>
      <p className="text-slate-400 mb-8 max-w-lg text-center">
        To get started, please select how you plan to use the platform.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl hover:border-violet-500 transition-colors cursor-pointer group">
          <h2 className="text-xl font-bold group-hover:text-violet-400 transition-colors">Student / Freelancer</h2>
          <p className="text-slate-500 mt-2 text-sm">Find micro-gigs, tutoring opportunities, and local tasks to earn income.</p>
        </div>
        
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl hover:border-violet-500 transition-colors cursor-pointer group">
          <h2 className="text-xl font-bold group-hover:text-violet-400 transition-colors">Business / Enterprise</h2>
          <p className="text-slate-500 mt-2 text-sm">Hire on-demand temporary labor and fulfill scalable micro-tasks.</p>
        </div>
        
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl hover:border-violet-500 transition-colors cursor-pointer group">
          <h2 className="text-xl font-bold group-hover:text-violet-400 transition-colors">Individual / Parent</h2>
          <p className="text-slate-500 mt-2 text-sm">Request everyday help like home tutoring, photography, or moving.</p>
        </div>
      </div>
    </div>
  );
}
