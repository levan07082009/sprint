import { Outlet, useNavigate, useLocation } from "react-router";
import { LayoutDashboard, Users, Briefcase, MessageSquare, User } from "lucide-react";
import { SprintBot } from "./SprintBot";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function IndividualShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  const links = [
    { name: "Dashboard", href: "/individual", icon: LayoutDashboard },
    { name: "Talent", href: "/individual/talent", icon: Users },
    { name: "Tasks", href: "/individual/tasks", icon: Briefcase },
    { name: "Messages", href: "/individual/messages", icon: MessageSquare },
    { name: "Profile", href: "/individual/profile", icon: User },
  ];

  return (
    <div className="flex justify-center min-h-screen bg-black/5 dark:bg-black/40">
      <div className="w-full max-w-[430px] bg-[#FAF9F6] relative flex flex-col h-[100dvh] overflow-hidden shadow-2xl ring-1 ring-black/5">
        <div className="flex-1 overflow-y-auto no-scrollbar pb-24 relative">
          <Outlet />
        </div>

        {/* SprintBot sits at z-30, below the nav at z-40 */}
        <SprintBot />

        {/* Bottom Navigation */}
        <div className="absolute bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-xl border-t border-[rgba(15,15,17,0.06)] pb-safe">
          <div className="px-2 h-20 flex items-center justify-around">
            {links.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/individual" && pathname.startsWith(link.href));
              const Icon = link.icon;
              return (
                <button
                  key={link.href}
                  onClick={() => navigate(link.href)}
                  className="flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-xl transition-all"
                >
                  <Icon
                    size={22}
                    className={cn(
                      "transition-colors",
                      isActive ? "text-[#5D3DBD]" : "text-[#8E8E93]"
                    )}
                  />
                  <span className={cn(
                    "text-[10px] font-medium transition-colors",
                    isActive ? "text-[#5D3DBD]" : "text-[#8E8E93]"
                  )}>
                    {link.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
