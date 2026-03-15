import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginAdmin } from "@/lib/store";
import { toast } from "sonner";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8000/api/auth/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      localStorage.setItem("admin_token", data.token);
      toast.success("Admin login successful");
      navigate("/admin");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const inputClass = "w-full px-3 py-2.5 border border-border rounded-md text-sm bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-20">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link to="/" className="font-bold text-foreground tracking-tighter text-lg">CSAPMS</Link>
          <h2 className="text-2xl font-bold text-foreground mt-4">Admin Login</h2>
          <p className="text-sm text-muted-foreground mt-1">Administrative access only</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-card/90 backdrop-blur-sm border border-border rounded-lg p-6 shadow-sm space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Username</label>
            <input required className={inputClass} placeholder="e.g. admin" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
            <input required type="password" className={inputClass} placeholder="Enter admin password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="w-full bg-primary text-primary-foreground py-2.5 rounded-md font-medium text-sm hover:opacity-90 transition-opacity">
            Sign In as Admin
          </button>
          <p className="text-center text-sm text-muted-foreground">
            <Link to="/login" className="text-muted-foreground hover:text-foreground">← Student Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
