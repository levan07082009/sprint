"use client";

import { QRCodeSVG } from "qrcode.react";

interface PaymentQRCodeProps {
  paymentUrl: string;
  amount?: number;
  gigTitle?: string;
}

export function PaymentQRCode({ paymentUrl, amount, gigTitle }: PaymentQRCodeProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-slate-900 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-slate-100 dark:border-slate-800 max-w-sm mx-auto">
      <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-2">
        Secure Payment
      </h3>
      {gigTitle && (
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-1 text-center">
          {gigTitle}
        </p>
      )}
      {amount !== undefined && (
        <p className="text-2xl font-bold text-violet-500 mb-6">
          ${amount.toFixed(2)}
        </p>
      )}
      
      <div className="bg-white p-4 rounded-xl shadow-inner border border-slate-100">
        <QRCodeSVG 
          value={paymentUrl}
          size={200}
          bgColor={"#ffffff"}
          fgColor={"#09090B"}
          level={"Q"}
        />
      </div>

      <p className="text-xs text-slate-400 dark:text-slate-500 mt-6 text-center max-w-xs">
        Have the payer scan this code with their phone camera to instantly complete the transaction.
      </p>
    </div>
  );
}
