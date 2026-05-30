import { Outlet, NavLink } from "react-router";
import { LayoutDashboard, Users, Briefcase, MessageSquare, Building } from "lucide-react";
import { motion } from "motion/react";
import { SprintBot } from "./SprintBot";

export function BusinessShell() {
  return (
    <div className="flex justify-center min-h-screen bg-black/5 dark:bg-black/40">
      <div className="w-full max-w-[430px] bg-canvas relative flex flex-col h-[100dvh] overflow-hidden shadow-2xl ring-1 ring-black/5">
        <div className="flex-1 overflow-y-auto no-scrollbar pb-24 relative">
          <Outlet />
        </div>
        <SprintBot />
        
        {/* Bottom Navigation */}
        <div className="absolute bottom-0 left-0 right-0 bg-surface/80 backdrop-blur-xl border-t border-black/5 dark:border-white/5 pb-safe pt-2 px-6 shadow-[0_-4px_24px_rgba(0,0,0,0.02)] z-50">
          <div className="flex justify-between items-center pb-4 relative">
            <NavItem to="/" icon={<LayoutDashboard size={24} />} label="Dashboard" />
            <NavItem to="/talent" icon={<Users size={24} />} label="Talent" />
            <NavItem to="/tasks" icon={<Briefcase size={24} />} label="Tasks" />
            <NavItem to="/messages" icon={<MessageSquare size={24} />} label="Messages" />
            <NavItem to="/profile" icon={<Building size={24} />} label="Profile" />
          </div>
        </div>
      </div>
    </div>
  );
}

function NavItem({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => 
        `flex flex-col items-center gap-1 p-2 transition-colors duration-200 ${
          isActive ? 'text-brand' : 'text-secondary-color hover:text-primary-color'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <div className="relative">
            {icon}
          </div>
          <span className="text-[10px] font-medium tracking-wide">{label}</span>
        </>
      )}
    </NavLink>
  );
}
