import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      <main className="flex-1 min-w-0 md:pl-0 pl-0 relative">
        <div className="h-full pt-16 md:pt-0 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
