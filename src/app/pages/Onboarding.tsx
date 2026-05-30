import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { Briefcase, User, Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";

export function Onboarding() {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark(!isDark);
  };

  const selectRole = (role: "student" | "enterprise" | "individual") => {
    localStorage.setItem("sprint_role", role);
    window.location.href = "/";
  };

  return (
    <div className="flex justify-center min-h-screen bg-black/5 dark:bg-black/40">
      <div className="w-full max-w-[430px] bg-surface relative flex flex-col h-[100dvh] overflow-hidden shadow-2xl ring-1 ring-black/5 p-6 transition-colors duration-300">
        
        {/* Theme Toggle */}
        <div className="absolute top-12 right-6 z-10">
          <button 
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center text-primary-color active:scale-95 transition-transform"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        <div className="flex-1 flex flex-col justify-center gap-6 z-0 overflow-y-auto no-scrollbar pb-8 pt-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center flex flex-col items-center shrink-0"
          >
            <div className="mb-2 mt-4">
              <img src="/Images/logo.png" alt="Sprint Logo" className="w-[220px] h-auto drop-shadow-2xl" />
            </div>
            <h1 className="text-display mb-2 text-brand">Sprint.</h1>
            <p className="text-body-primary text-secondary-color">Select your account type to continue.</p>
          </motion.div>
          
          <div className="flex flex-col gap-4">
            <motion.button 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              onClick={() => selectRole("student")}
              className="p-4 rounded-[20px] border-2 border-black/5 dark:border-white/5 bg-surface shadow-sm hover:border-brand dark:hover:border-brand transition-all text-left flex items-center gap-4 group"
            >
              <div className="w-12 h-12 rounded-full bg-brand/10 text-brand flex items-center justify-center group-hover:scale-110 transition-transform">
                <User size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-h3 font-semibold text-primary-color">Student / Worker</span>
                <span className="text-caption text-secondary-color">Find micro-gigs and earn GEL.</span>
              </div>
            </motion.button>

            <motion.button 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onClick={() => selectRole("individual")}
              className="p-4 rounded-[20px] border-2 border-black/5 dark:border-white/5 bg-surface shadow-sm hover:border-[#5D3DBD] dark:hover:border-[#5D3DBD] transition-all text-left flex items-center gap-4 group"
            >
              <div className="w-12 h-12 rounded-full bg-[#5D3DBD]/10 text-[#5D3DBD] flex items-center justify-center group-hover:scale-110 transition-transform">
                <User size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-h3 font-semibold text-primary-color">Individual / Agent</span>
                <span className="text-caption text-secondary-color">Get everyday tasks & errands done.</span>
              </div>
            </motion.button>

            <motion.button 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onClick={() => selectRole("enterprise")}
              className="p-4 rounded-[20px] border-2 border-black/5 dark:border-white/5 bg-surface shadow-sm hover:border-system-success dark:hover:border-system-success transition-all text-left flex items-center gap-4 group"
            >
              <div className="w-12 h-12 rounded-full bg-system-success/10 text-system-success flex items-center justify-center group-hover:scale-110 transition-transform">
                <Briefcase size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-h3 font-semibold text-primary-color">Business / Enterprise</span>
                <span className="text-caption text-secondary-color">Hire local talent on demand.</span>
              </div>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
