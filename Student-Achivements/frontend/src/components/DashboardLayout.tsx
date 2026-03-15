import { AppSidebar } from "./AppSidebar";
import { MobileNav } from "./MobileNav";

export function DashboardLayout({ children, type = "student" }: { children: React.ReactNode; type?: "student" | "admin" }) {
  return (
    <div className="min-h-screen">
      <MobileNav type={type} />
      <div className="flex">
        <AppSidebar type={type} />
        <main className="flex-1 p-4 md:p-8 lg:p-10 max-w-6xl">
          {children}
        </main>
      </div>
    </div>
  );
}
