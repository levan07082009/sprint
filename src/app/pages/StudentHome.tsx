import { useState } from "react";
import { Zap, MapPin, Clock, Sun, Moon, LogOut, Navigation } from "lucide-react";
import * as Switch from "@radix-ui/react-switch";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Haptics, SPRINT_DESIGN_SYSTEM } from "../../utils/design-system";
import { WalletBalance } from "../components/WalletBalance";

export function StudentHome() {
  const [isAvailable, setIsAvailable] = useState(true);

  const toggleTheme = () => {
    Haptics.mediumTap();
    document.documentElement.classList.toggle("dark");
  };

  const navigate = useNavigate();

  const handleSignOut = () => {
    Haptics.mediumTap();
    localStorage.removeItem("sprint_role");
    window.location.replace("/onboarding");
  };

  const handleToggleAvailable = (val: boolean) => {
    Haptics.heavyImpact();
    setIsAvailable(val);
  };

  return (
    <div className="flex flex-col min-h-full pb-8">
      {/* Header Context */}
      <div className="pt-12 px-6 pb-4 flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <p className="text-secondary-color text-caption uppercase tracking-wider font-semibold">
            {new Date().getHours() < 12 ? "Good Morning" : "Good Afternoon"}
          </p>
          <div className="flex items-center gap-2">
            <h1 className="text-display">Davit N.</h1>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <button
              onClick={toggleTheme}
              className="bg-black/5 dark:bg-white/10 text-[10px] px-2 py-1 rounded-full font-semibold uppercase tracking-wider text-secondary-color hover:text-primary-color transition-colors flex items-center gap-1 min-touch-target"
            >
              <Sun size={12} className="hidden dark:block" />
              <Moon size={12} className="block dark:hidden" />
              Theme
            </button>
            <button
              onClick={handleSignOut}
              className="bg-black/5 dark:bg-white/10 text-[10px] px-2 py-1 rounded-full font-semibold uppercase tracking-wider text-secondary-color hover:text-primary-color transition-colors flex items-center gap-1 min-touch-target"
            >
              <LogOut size={12} />
              Switch Account
            </button>
          </div>
        </div>
        <div className="relative shrink-0">
          <div className="w-14 h-14 bg-surface rounded-full shadow-app flex items-center justify-center overflow-hidden border-micro shrink-0">
            <img src="/Images/Davit.N.png" alt="Avatar" className="w-full h-full object-cover" />
          </div>
          {isAvailable && (
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-system-success border-2 border-surface rounded-full shadow-sm animate-pulse" />
          )}
        </div>
      </div>

      <div className="flex flex-col gap-6 px-6 mt-2">
        <WalletBalance balance="₾95.00" escrow="₾30.00" role="student" />

        {/* Availability Card */}
        <motion.div
          className="rounded-card p-4 flex flex-col gap-4 border-micro transition-all duration-300 bg-surface shadow-app mt-2"
          layout
        >
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-subheading font-semibold">Available Now</span>
              <span className="text-caption text-secondary-color">Local dispatch ready</span>
            </div>
            <Switch.Root
              checked={isAvailable}
              onCheckedChange={handleToggleAvailable}
              className="min-touch-target flex items-center"
            >
              <div className={`w-[50px] h-[30px] rounded-full relative shadow-inner transition-colors duration-300 ${isAvailable ? 'bg-system-success' : 'bg-black/10 dark:bg-white/10'}`}>
                <Switch.Thumb className="block w-[26px] h-[26px] bg-white rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.1)] transition-transform duration-300 translate-x-[2px] data-[state=checked]:translate-x-[22px] mt-[2px]" />
              </div>
            </Switch.Root>
          </div>
        </motion.div>

        {/* Trust Metrics */}
        <div className="bg-surface rounded-card p-4 shadow-app flex flex-col gap-4 border-micro">
          <div className="flex justify-between items-center">
            <div className="flex flex-col items-center gap-1">
              <span className="text-primary-color text-h2 font-bold">98%</span>
              <span className="text-caption text-secondary-color">Trust Score</span>
            </div>
            <div className="w-px h-8 bg-black/5 dark:bg-white/5" />
            <div className="flex flex-col items-center gap-1">
              <span className="text-primary-color text-h2 font-bold">42</span>
              <span className="text-caption text-secondary-color">Completed</span>
            </div>
            <div className="w-px h-8 bg-black/5 dark:bg-white/5" />
            <div className="flex flex-col items-center gap-1">
              <span className="text-primary-color text-h2 font-bold flex items-center gap-1"><Zap size={16} className="text-system-warning fill-system-warning" /> 5d</span>
              <span className="text-caption text-secondary-color">Streak</span>
            </div>
          </div>
        </div>

        {/* Urgent Nearby Feed */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-end">
            <h2 className="text-h2">Urgent Nearby</h2>
            <span className="text-caption text-brand font-bold active:opacity-70 transition-opacity">View Map</span>
          </div>

          <div className="flex overflow-x-auto no-scrollbar gap-4 pb-4 -mx-6 px-6 snap-x">
            {[
              { title: "Router Diagnostics", cat: "Tech Support", price: "₾15", dist: "1.2 km", time: "High Urgency" },
              { title: "Excel Formatting", cat: "Data Entry", price: "₾12", dist: "2.5 km", time: "Flexible" },
              { title: "Delivery Assist", cat: "Logistics", price: "₾10", dist: "3.1 km", time: "High Urgency" }
            ].map((job, i) => (
              <motion.div
                key={i}
                whileTap={{ scale: 0.98 }}
                onClick={() => Haptics.mediumTap()}
                className="bg-surface rounded-card p-4 shadow-app border-micro min-w-[240px] snap-center flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] bg-black/5 dark:bg-white/5 px-2 py-1 rounded-md text-secondary-color font-bold uppercase tracking-wider">{job.cat}</span>
                    <span className="text-h2 font-bold text-primary-color">{job.price}</span>
                  </div>
                  <h3 className="text-subheading font-bold mb-3">{job.title}</h3>
                </div>
                <div className="flex items-center gap-3 text-caption text-secondary-color">
                  <span className="flex items-center gap-1 font-medium"><Navigation size={12} /> {job.dist}</span>
                  <span className="w-1 h-1 rounded-full bg-black/20 dark:bg-white/20" />
                  <span className={`flex items-center gap-1 font-medium ${job.time.includes('Urgency') ? 'text-system-warning' : ''}`}>
                    <Clock size={12} /> {job.time}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
