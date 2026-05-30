import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sprint - Hyper-Local Micro-Gig Marketplace",
  description: "Find local talent and immediate demand.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${inter.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col bg-[#FAF9F6] dark:bg-[#09090B] text-slate-900 dark:text-slate-100 font-sans">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
