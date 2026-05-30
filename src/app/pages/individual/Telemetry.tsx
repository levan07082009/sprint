import { motion } from "framer-motion";
import { Activity, TrendingUp, Clock, CheckCircle2, BarChart3 } from "lucide-react";

export function TelemetryPage() {
  const stats = [
    { label: "Total Spend", value: "$450", icon: <TrendingUp className="text-[#5D3DBD]" />, trend: "+12% this month" },
    { label: "Hours Saved", value: "24h", icon: <Clock className="text-blue-500" />, trend: "8h this week" },
    { label: "Tasks Done", value: "12", icon: <CheckCircle2 className="text-green-500" />, trend: "3 recent" },
  ];

  return (
    <div className="flex flex-col min-h-full pb-8 bg-[#FAF9F6]">
      <div className="px-6 pt-12 pb-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="text-[28px] font-bold text-[#0F0F11] tracking-tight flex items-center gap-2"><Activity className="text-[#5D3DBD]" /> Telemetry</h1>
          <p className="text-gray-500 text-[15px] mt-1.5 font-medium">Your personal usage metrics & insights.</p>
        </motion.div>
      </div>

      <div className="px-6 grid grid-cols-2 gap-4 mb-8">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: i * 0.1 }} className={`bg-white rounded-[16px] p-5 shadow-sm border border-[rgba(15,15,17,0.06)] ${i === 0 ? 'col-span-2' : ''}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 bg-gray-50 rounded-[12px]">{stat.icon}</div>
              <span className="text-[12px] font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">{stat.trend}</span>
            </div>
            <h3 className="text-gray-500 text-[14px] font-medium">{stat.label}</h3>
            <p className="text-[#0F0F11] text-[28px] font-bold mt-1 tracking-tight">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="px-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }} className="bg-white rounded-[24px] p-6 shadow-sm border border-[rgba(15,15,17,0.06)]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[17px] font-semibold text-[#0F0F11] flex items-center gap-2"><BarChart3 className="text-gray-400 w-5 h-5" /> Activity Overview</h2>
            <select className="bg-gray-50 border-none text-[13px] font-medium text-gray-500 rounded-lg outline-none cursor-pointer p-1">
              <option>This Week</option>
              <option>This Month</option>
            </select>
          </div>
          
          <div className="h-40 flex items-end justify-between gap-2 mt-4">
            {[40, 70, 35, 90, 50, 60, 20].map((height, i) => (
              <div key={i} className="flex flex-col items-center gap-2 flex-1">
                <motion.div initial={{ height: 0 }} animate={{ height: `${height}%` }} transition={{ duration: 0.8, delay: 0.4 + (i * 0.05), type: "spring" }} className={`w-full rounded-t-[6px] ${i === 3 ? 'bg-[#5D3DBD]' : 'bg-[#5D3DBD]/20'}`} />
                <span className="text-[10px] font-medium text-gray-400">{['M','T','W','T','F','S','S'][i]}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
