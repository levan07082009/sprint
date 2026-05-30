import { Outlet, NavLink, useLocation } from "react-router";
import { Home, Compass, MessageSquare, User } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import { SprintBot } from "./SprintBot";

export function StudentShell() {
  const location = useLocation();

  useEffect(() => {
    // We already check auth in RootAuthGuard, so no need here unless for double-checking
  }, [location.pathname]);

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
            <NavItem to="/" icon={<Home size={24} />} label="Home" />
            <NavItem to="/browse" icon={<Compass size={24} />} label="Browse" />
            <NavItem to="/messages" icon={<MessageSquare size={24} />} label="Messages" />
            <NavItem to="/profile" icon={<User size={24} />} label="Profile" />
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
