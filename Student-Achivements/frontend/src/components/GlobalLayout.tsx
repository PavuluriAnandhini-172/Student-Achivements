import { Link, useLocation } from "react-router-dom";
import { UserPlus, LogIn, ShieldCheck } from "lucide-react";

export function GlobalLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard") || location.pathname === "/admin";
  const isAuthPage = ["/login", "/register", "/admin-login"].includes(location.pathname);

  return (
    <div className="min-h-screen relative">
      {/* Global background video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 w-full h-full object-cover z-0"
      >
        <source src="/bg-video.mp4" type="video/mp4" />
      </video>
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-0" />

      {/* Top-right auth buttons (shown when not logged into dashboard) */}
      {!isDashboard && (
        <header className="fixed top-0 right-0 left-0 z-50 flex items-center justify-between px-6 py-3">
          <Link to="/" className="font-bold text-foreground tracking-tighter text-lg">
            CSAPMS
          </Link>
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 bg-card/80 backdrop-blur-sm border border-border text-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-card transition-colors"
            >
              <LogIn className="w-4 h-4" />
              Student Login
            </Link>
            <Link
              to="/admin-login"
              className="inline-flex items-center gap-2 bg-card/80 backdrop-blur-sm border border-border text-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-card transition-colors"
            >
              <ShieldCheck className="w-4 h-4" />
              Admin Login
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <UserPlus className="w-4 h-4" />
              Register
            </Link>
          </div>
        </header>
      )}

      {/* Page content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
