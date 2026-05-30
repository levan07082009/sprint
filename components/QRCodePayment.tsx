"use client";

import { QRCodeCanvas } from "qrcode.react";
import { useState } from "react";
import { CheckCircle, X } from "lucide-react";

interface QRCodePaymentProps {
  amount: number;
  gigId: string;
  paymentLink?: string;
  onClose: () => void;
  onPaymentSuccess: () => void;
}

export default function QRCodePayment({
  amount,
  gigId,
  paymentLink = "https://sprint-demo.vercel.app/pay/mock",
  onClose,
  onPaymentSuccess,
}: QRCodePaymentProps) {
  const [status, setStatus] = useState<"pending" | "success">("pending");

  // Mock payment verification function
  const simulatePayment = () => {
    setStatus("success");
    setTimeout(() => {
      onPaymentSuccess();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-sm rounded-3xl bg-neutral-900 p-8 shadow-2xl border border-neutral-800">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-neutral-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-white mb-2">
            Secure Payment
          </h2>
          <p className="text-neutral-400 text-sm mb-8">
            Scan with your mobile banking app to authorize payment for ${amount.toFixed(2)}.
          </p>

          <div className="flex justify-center mb-8">
            {status === "pending" ? (
              <div className="p-4 bg-white rounded-2xl relative overflow-hidden group">
                <QRCodeCanvas
                  value={paymentLink}
                  size={200}
                  bgColor={"#ffffff"}
                  fgColor={"#000000"}
                  level={"H"}
                  includeMargin={false}
                />
                {/* For demo purposes, clicking the QR code simulates payment */}
                <div 
                  className="absolute inset-0 bg-black/0 group-hover:bg-black/5 cursor-pointer transition-colors" 
                  onClick={simulatePayment}
                  title="Click to simulate scan"
                />
              </div>
            ) : (
              <div className="w-[200px] h-[200px] flex items-center justify-center bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                <CheckCircle className="w-20 h-20 text-emerald-500" />
              </div>
            )}
          </div>

          {status === "pending" ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2 text-sm text-neutral-500">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Waiting for scan...</span>
              </div>
              <button 
                onClick={simulatePayment}
                className="text-xs text-neutral-600 hover:text-neutral-400 underline"
              >
                (Demo) Simulate Scan
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-emerald-400 font-medium">Payment Successful!</p>
              <p className="text-xs text-neutral-500">Redirecting back to gig...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
