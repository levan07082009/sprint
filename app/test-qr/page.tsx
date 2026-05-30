import { PaymentQRCode } from "@/components/ui/PaymentQRCode";

export default function TestQRPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-8">
      <div className="w-full">
        <h1 className="text-3xl font-bold tracking-tight text-center mb-8 text-slate-900 dark:text-slate-100">
          Payment UI Preview
        </h1>
        
        <PaymentQRCode 
          paymentUrl="https://buy.stripe.com/test_123456789" 
          amount={45.00}
          gigTitle="Move living room furniture to moving truck"
        />
      </div>
    </div>
  );
}
