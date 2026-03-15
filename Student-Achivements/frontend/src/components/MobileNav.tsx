import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Trophy, FileText, User, LogOut, LayoutDashboard, Menu, X } from "lucide-react";
import { logout } from "@/lib/store";
import { useState } from "react";

const studentLinks = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/dashboard/achievements", label: "Achievements", icon: Trophy },
  { to: "/dashboard/documents", label: "Documents", icon: FileText },
  { to: "/dashboard/profile", label: "Profile", icon: User },
];

export function MobileNav({ type }: { type: "student" | "admin" }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const links = type === "student" ? studentLinks : [
    { to: "/admin", label: "Search Students", icon: LayoutDashboard },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="md:hidden">
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <span className="font-bold text-foreground tracking-tighter">CSAPMS</span>
        <button onClick={() => setOpen(!open)} className="text-foreground">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
      {open && (
        <div className="border-b border-border bg-card p-4 flex flex-col gap-1">
          {links.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                  isActive ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold" : "text-muted-foreground"
                }`}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-destructive mt-2 w-full text-left">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
