import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Trophy, FileText, User, LogOut, LayoutDashboard } from "lucide-react";
import { logout } from "@/lib/store";

const studentLinks = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/dashboard/achievements", label: "Achievements", icon: Trophy },
  { to: "/dashboard/documents", label: "Documents", icon: FileText },
  { to: "/dashboard/profile", label: "Profile Settings", icon: User },
];

export function AppSidebar({ type }: { type: "student" | "admin" }) {
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
    <nav className="hidden md:flex flex-col w-60 min-h-screen border-r border-border bg-card p-6">
      <div className="mb-8 px-2">
        <h5 className="font-bold text-foreground tracking-tighter text-lg">CSAPMS</h5>
        <span className="font-mono-id text-muted-foreground border border-border rounded px-2 py-0.5 text-xs">
          v1.0.4
        </span>
      </div>
      <div className="flex flex-col gap-1 flex-1">
        {links.map((link) => {
          const isActive = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <link.icon className="w-4 h-4" />
              {link.label}
            </Link>
          );
        })}
      </div>
      <hr className="my-4 border-border" />
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-destructive hover:bg-destructive/10 transition-colors w-full text-left"
      >
        <LogOut className="w-4 h-4" />
        Sign Out
      </button>
    </nav>
  );
}
