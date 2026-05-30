import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { QrCode, Wallet, ArrowUpRight, TrendingUp, X, ChevronDown, Camera, Image, CheckCircle2, Circle, ScanLine, Upload } from "lucide-react";

// ─── QR Payment Sheet (Agent / Business) ─────────────────────────────────────
function PaymentSheet({ balance, onClose }: { balance: string; onClose: () => void }) {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [generated, setGenerated] = useState(false);

  const qrData = `SPRINT_PAY:${amount}:${note || "Payment"}:${Date.now()}`;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-x-0 top-0 bottom-20 bg-black/40 backdrop-blur-sm z-[65]"
      />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed bottom-20 left-1/2 -translate-x-1/2 w-full max-w-[390px] z-[70] bg-[#FAF9F6] dark:bg-[#1A1A1E] rounded-t-[24px] shadow-[0_-16px_48px_rgba(0,0,0,0.18)] flex flex-col max-h-[72vh] overflow-hidden"
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-12 h-1.5 bg-black/10 dark:bg-white/10 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-6 pt-3 pb-4 flex justify-between items-center shrink-0 border-b border-black/5 dark:border-white/5">
          <div className="flex flex-col">
            <h2 className="text-[22px] font-bold tracking-tight">Send Payment</h2>
            <span className="text-[12px] text-gray-400 font-medium">Available: {balance}</span>
          </div>
          <button onClick={onClose} className="w-9 h-9 bg-black/5 dark:bg-white/10 rounded-full flex items-center justify-center active:scale-90 transition-transform">
            <X size={18} />
          </button>
        </div>

        <div className="px-5 py-4 flex flex-col gap-4 overflow-y-auto flex-1">
          {/* Amount Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Amount (GEL)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[22px] font-bold text-[#5D3DBD]">₾</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => { setAmount(e.target.value); setGenerated(false); }}
                placeholder="0.00"
                className="w-full bg-white dark:bg-white/5 border border-black/8 dark:border-white/10 rounded-[14px] py-3.5 pl-10 pr-4 text-[22px] font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5D3DBD]/30 placeholder:text-gray-200 shadow-sm"
              />
            </div>
          </div>

          {/* Note / Recipient */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Note (optional)</label>
            <input
              type="text"
              value={note}
              onChange={(e) => { setNote(e.target.value); setGenerated(false); }}
              placeholder="e.g. Router Diagnostics payment"
              className="w-full bg-white dark:bg-white/5 border border-black/8 dark:border-white/10 rounded-[14px] py-3 px-4 text-[14px] font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5D3DBD]/30 placeholder:text-gray-300 shadow-sm"
            />
          </div>

          {/* Generate Button */}
          <button
            onClick={() => { if (amount && parseFloat(amount) > 0) setGenerated(true); }}
            disabled={!amount || parseFloat(amount) <= 0}
            className="w-full bg-gradient-to-r from-[#5D3DBD] to-[#7C5CFF] text-white py-3.5 rounded-[14px] font-bold text-[15px] shadow-[0_6px_16px_rgba(93,61,189,0.35)] active:scale-[0.98] transition-transform disabled:opacity-40 disabled:shadow-none flex items-center justify-center gap-2 shrink-0"
          >
            <QrCode size={18} /> Generate QR Code
          </button>

          {/* Scroll cue */}
          {!generated && (
            <div className="flex items-center justify-center gap-2 text-gray-300 text-[12px] pb-2">
              <ChevronDown size={14} className="animate-bounce" /> Scroll down after generating
            </div>
          )}

          {/* Generated QR Section */}
          <AnimatePresence>
            {generated && (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 24 }}
                transition={{ type: "spring", stiffness: 200, damping: 22 }}
                className="flex flex-col gap-5 pb-10"
              >
                <div className="h-px w-full bg-black/6 dark:bg-white/6" />

                <div className="flex flex-col items-center gap-4">
                  <div className="text-center">
                    <p className="text-[13px] text-gray-400 font-medium">Present this to the worker to receive funds</p>
                    <p className="text-[28px] font-bold text-[#5D3DBD] mt-1">₾{parseFloat(amount).toFixed(2)}</p>
                    {note && <p className="text-[13px] text-gray-500 mt-0.5">"{note}"</p>}
                  </div>

                  {/* QR Code */}
                  <div className="bg-white p-4 rounded-[20px] shadow-[0_4px_24px_rgba(93,61,189,0.15)] border border-[#5D3DBD]/10">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qrData)}&color=5D3DBD&bgcolor=ffffff&qzone=2`}
                      alt="Payment QR"
                      className="w-[140px] h-[140px]"
                    />
                  </div>

                  {/* Status Steps */}
                  <div className="w-full bg-white dark:bg-white/5 border border-black/6 dark:border-white/6 rounded-[16px] p-4 flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 size={18} className="text-[#5D3DBD]" />
                      <span className="text-[13px] font-semibold">QR Signed & Compiled</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Circle size={18} className="text-gray-300" />
                      <span className="text-[13px] font-medium text-gray-400">Awaiting Worker Scan...</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Circle size={18} className="text-gray-300" />
                      <span className="text-[13px] font-medium text-gray-400">Funds Transfer</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
}

// ─── QR Scanner Sheet (Student) ───────────────────────────────────────────────
function ScannerSheet({ onClose }: { onClose: () => void }) {
  const [scanned, setScanned] = useState(false);
  const [mode, setMode] = useState<"scan" | "upload">("scan");
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
      />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed bottom-20 left-1/2 -translate-x-1/2 w-full max-w-[390px] z-[70] bg-[#FAF9F6] dark:bg-[#1A1A1E] rounded-t-[24px] shadow-[0_-16px_48px_rgba(0,0,0,0.18)] max-h-[72vh] flex flex-col overflow-hidden"
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-12 h-1.5 bg-black/10 dark:bg-white/10 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-6 pt-3 pb-4 flex justify-between items-center border-b border-black/5 dark:border-white/5">
          <div className="flex flex-col">
            <h2 className="text-[22px] font-bold tracking-tight">Scan to Receive</h2>
            <span className="text-[12px] text-gray-400 font-medium">Scan QR from Agent or Business</span>
          </div>
          <button onClick={onClose} className="w-9 h-9 bg-black/5 dark:bg-white/10 rounded-full flex items-center justify-center active:scale-90 transition-transform">
            <X size={18} />
          </button>
        </div>

        <div className="px-5 py-4 flex flex-col gap-4 overflow-y-auto flex-1">
          {/* Mode Toggle */}
          <div className="flex bg-black/5 dark:bg-white/5 rounded-[14px] p-1 gap-1">
            <button
              onClick={() => setMode("scan")}
              className={`flex-1 py-2.5 rounded-[10px] flex items-center justify-center gap-2 text-[13px] font-bold transition-all ${mode === "scan" ? "bg-white dark:bg-white/10 shadow-sm text-[#5D3DBD]" : "text-gray-400"}`}
            >
              <Camera size={16} /> Camera Scan
            </button>
            <button
              onClick={() => setMode("upload")}
              className={`flex-1 py-2.5 rounded-[10px] flex items-center justify-center gap-2 text-[13px] font-bold transition-all ${mode === "upload" ? "bg-white dark:bg-white/10 shadow-sm text-[#5D3DBD]" : "text-gray-400"}`}
            >
              <Image size={16} /> Upload Photo
            </button>
          </div>

          <AnimatePresence mode="wait">
            {mode === "scan" ? (
              <motion.div
                key="scan"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center gap-4"
              >
                {/* Camera viewfinder */}
                <div className="relative w-full rounded-[20px] overflow-hidden bg-black shadow-lg" style={{ height: '160px' }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black" />
                  {/* Scan frame corners */}
                  <div className="absolute top-6 left-6 w-10 h-10 border-t-4 border-l-4 border-[#5D3DBD] rounded-tl-[6px]" />
                  <div className="absolute top-6 right-6 w-10 h-10 border-t-4 border-r-4 border-[#5D3DBD] rounded-tr-[6px]" />
                  <div className="absolute bottom-6 left-6 w-10 h-10 border-b-4 border-l-4 border-[#5D3DBD] rounded-bl-[6px]" />
                  <div className="absolute bottom-6 right-6 w-10 h-10 border-b-4 border-r-4 border-[#5D3DBD] rounded-br-[6px]" />
                  {/* Scan line */}
                  <motion.div
                    animate={{ y: ["0%", "280px", "0%"] }}
                    transition={{ duration: 2.8, ease: "linear", repeat: Infinity }}
                    className="absolute left-6 right-6 top-6 h-[2px] bg-[#5D3DBD]/70 rounded-full shadow-[0_0_8px_rgba(93,61,189,0.8)]"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ScanLine size={40} className="text-white/20" />
                  </div>
                </div>

                <p className="text-[13px] text-gray-400 text-center">Point your camera at the QR code provided by the Agent or Business</p>

                {/* Simulate scan success */}
                {!scanned ? (
                  <button
                    onClick={() => setScanned(true)}
                    className="w-full bg-gradient-to-r from-[#5D3DBD] to-[#7C5CFF] text-white py-4 rounded-[16px] font-bold text-[15px] active:scale-[0.98] transition-transform shadow-[0_8px_20px_rgba(93,61,189,0.3)] flex items-center justify-center gap-2"
                  >
                    <Camera size={18} /> Scan QR Code
                  </button>
                ) : (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full bg-green-50 border border-green-200 rounded-[16px] p-4 flex items-center gap-3">
                    <CheckCircle2 size={24} className="text-green-500 shrink-0" />
                    <div className="flex flex-col">
                      <span className="font-bold text-green-700 text-[14px]">QR Scanned Successfully</span>
                      <span className="text-[12px] text-green-500">₾15.00 incoming from Agent</span>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="upload"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-4 pb-6"
              >
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={() => setScanned(true)} />
                <button
                  onClick={() => fileRef.current?.click()}
                  className="w-full border-2 border-dashed border-[#5D3DBD]/30 bg-[#5D3DBD]/5 rounded-[20px] py-10 flex flex-col items-center gap-3 active:bg-[#5D3DBD]/10 transition-colors"
                >
                  <div className="w-14 h-14 bg-[#5D3DBD]/10 rounded-full flex items-center justify-center">
                    <Upload size={24} className="text-[#5D3DBD]" />
                  </div>
                  <div className="text-center">
                    <p className="text-[15px] font-bold text-[#5D3DBD]">Upload Screenshot</p>
                    <p className="text-[12px] text-gray-400 mt-0.5">JPEG, PNG accepted</p>
                  </div>
                </button>

                {scanned && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full bg-green-50 border border-green-200 rounded-[16px] p-4 flex items-center gap-3">
                    <CheckCircle2 size={24} className="text-green-500 shrink-0" />
                    <div className="flex flex-col">
                      <span className="font-bold text-green-700 text-[14px]">QR Detected in Image</span>
                      <span className="text-[12px] text-green-500">Processing payment...</span>
                    </div>
                  </motion.div>
                )}

                <p className="text-[12px] text-center text-gray-400">Take a screenshot of the QR code shared by an Agent or Business and upload it here</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
}

// ─── Main WalletBalance Component ─────────────────────────────────────────────
export function WalletBalance({ balance, escrow, role = "agent" }: {
  balance: string;
  escrow?: string;
  role?: "student" | "agent" | "business";
}) {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <>
      <div className="rounded-[24px] p-6 shadow-[0_8px_32px_rgba(93,61,189,0.25)] flex flex-col gap-5 relative overflow-hidden shrink-0 bg-gradient-to-br from-[#5D3DBD] to-[#7C5CFF] text-white">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-xl translate-y-1/4 -translate-x-1/4 pointer-events-none" />
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.55) 1.5px, transparent 0)', backgroundSize: '20px 20px' }} />

        <div className="flex justify-between items-start z-10">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-white/80 uppercase tracking-wider text-[11px] font-bold">
              <Wallet size={14} /> {role === "student" ? "My Earnings" : "Total Balance"}
            </div>
            <span className="text-[36px] font-bold tracking-tight leading-none mt-1">{balance}</span>
          </div>

          <button
            onClick={() => setSheetOpen(true)}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-all border border-white/20 min-touch-target"
          >
            {role === "student" ? <ScanLine size={22} /> : <QrCode size={22} />}
          </button>
        </div>

        <div className="flex gap-3 z-10 mt-1">
          <button className="flex-1 bg-white text-[#5D3DBD] py-3 rounded-xl text-[13px] font-bold shadow-md active:scale-95 transition-transform flex items-center justify-center gap-1.5">
            <ArrowUpRight size={16} /> {role === "student" ? "Withdraw" : "Withdraw"}
          </button>
          {escrow && (
            <div className="flex-1 bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl py-3 px-4 flex flex-col justify-center">
              <span className="text-[10px] text-white/70 font-semibold uppercase tracking-wide flex items-center gap-1">
                <TrendingUp size={10} className="text-[#00E676]" /> In Escrow
              </span>
              <span className="text-[14px] font-bold">{escrow}</span>
            </div>
          )}
        </div>
      </div>

      {/* Sheets */}
      <AnimatePresence>
        {sheetOpen && role === "student" && (
          <ScannerSheet onClose={() => setSheetOpen(false)} />
        )}
        {sheetOpen && role !== "student" && (
          <PaymentSheet balance={balance} onClose={() => setSheetOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
