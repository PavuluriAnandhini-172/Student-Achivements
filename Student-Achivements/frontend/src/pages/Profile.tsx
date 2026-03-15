import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentStudent, updateStudent, type Student } from "@/lib/store";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

export default function Profile() {
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [avatarData, setAvatarData] = useState<string>("");

  useEffect(() => {
    const s = getCurrentStudent();
    if (!s) { navigate("/login"); return; }
    setStudent(s);
    setForm({ name: s.name, email: s.email, phone: s.phone });
    setAvatarData(s.avatar || "");
  }, [navigate]);

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!student) return;

    const updated = updateStudent(student.id, { ...form, avatar: avatarData });
    setStudent(updated);
    toast.success("Profile updated successfully!");
  };

  if (!student) return null;

  const inputClass = "w-full px-3 py-2.5 border border-border rounded-md text-sm bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground";

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setAvatarData("");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setAvatarData(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground">Profile Settings</h2>
        <p className="text-muted-foreground text-sm mt-1">Manage your account information</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-24 w-24">
              {avatarData ? (
                <AvatarImage src={avatarData} alt={`${student.name} avatar`} />
              ) : (
                <AvatarFallback>{student.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
              )}
            </Avatar>

            <div className="w-full">
              <label className="block text-sm font-medium text-foreground mb-1.5">Profile Photo</label>
              <input
                type="file"
                accept="image/*"
                className="w-full text-sm text-foreground"
                onChange={handleAvatarChange}
              />
            </div>
          </div>

          <div className="mt-6 space-y-3 text-sm">
            <div>
              <span className="text-muted-foreground block">Registration Number</span>
              <span className="font-mono-id text-foreground">{student.regNumber}</span>
            </div>
            <div>
              <span className="text-muted-foreground block">Admission Category</span>
              <span className="text-foreground">{student.admissionCategory}</span>
            </div>
            <div>
              <span className="text-muted-foreground block">Academic Program</span>
              <span className="text-foreground">{student.academicProgram}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="md:col-span-2 bg-card border border-border rounded-lg p-6 shadow-sm space-y-4">
          <h6 className="font-semibold text-foreground mb-2">Edit Profile</h6>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
            <input required className={inputClass} value={form.name} onChange={(e) => update("name", e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
            <input required type="email" className={inputClass} value={form.email} onChange={(e) => update("email", e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Phone</label>
            <input required className={inputClass} value={form.phone} onChange={(e) => update("phone", e.target.value)} />
          </div>
          <button type="submit" className="bg-primary text-primary-foreground px-6 py-2.5 rounded-md font-medium text-sm hover:opacity-90 transition-opacity">
            Save Changes
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
