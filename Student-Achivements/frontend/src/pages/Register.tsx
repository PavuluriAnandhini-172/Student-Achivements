import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerStudent } from "@/lib/store";
import { toast } from "sonner";

const admissionCategories = ["VSAT", "EAMCET", "JEE", "Management", "NRI", "Other"];
const academicPrograms = ["B.Tech", "M.Tech", "MBA", "BBA", "B.Sc", "M.Sc", "B.Com", "Other"];

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", regNumber: "", email: "", phone: "",
    admissionCategory: "", academicProgram: "", password: "", confirmPassword: "",
  });

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    try {
      const { confirmPassword, ...data } = form;
      registerStudent(data);
      toast.success("Registration successful! Please login.");
      navigate("/login");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const inputClass = "w-full px-3 py-2.5 border border-border rounded-md text-sm bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground";
  const labelClass = "block text-sm font-medium text-foreground mb-1.5";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-20">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <Link to="/" className="font-bold text-foreground tracking-tighter text-lg">CSAPMS</Link>
          <h2 className="text-2xl font-bold text-foreground mt-4">Create your account</h2>
          <p className="text-sm text-muted-foreground mt-1">Enter your details to get started</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-card/90 backdrop-blur-sm border border-border rounded-lg p-6 shadow-sm space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Full Name</label>
              <input required className={inputClass} placeholder="e.g. Arjun Kumar" value={form.name} onChange={(e) => update("name", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Registration Number</label>
              <input required className={inputClass} placeholder="e.g. 21BCE10234" value={form.regNumber} onChange={(e) => update("regNumber", e.target.value)} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input required type="email" className={inputClass} placeholder="e.g. arjun@university.edu" value={form.email} onChange={(e) => update("email", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Phone Number</label>
            <input required className={inputClass} placeholder="e.g. +91 9876543210" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Admission Category</label>
              <select required className={inputClass} value={form.admissionCategory} onChange={(e) => update("admissionCategory", e.target.value)}>
                <option value="">Select category</option>
                {admissionCategories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Academic Program</label>
              <select required className={inputClass} value={form.academicProgram} onChange={(e) => update("academicProgram", e.target.value)}>
                <option value="">Select program</option>
                {academicPrograms.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Password</label>
              <input required type="password" className={inputClass} placeholder="Min 6 characters" value={form.password} onChange={(e) => update("password", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Confirm Password</label>
              <input required type="password" className={inputClass} placeholder="Re-enter password" value={form.confirmPassword} onChange={(e) => update("confirmPassword", e.target.value)} />
            </div>
          </div>
          <button type="submit" className="w-full bg-primary text-primary-foreground py-2.5 rounded-md font-medium text-sm hover:opacity-90 transition-opacity">
            Create Account
          </button>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
