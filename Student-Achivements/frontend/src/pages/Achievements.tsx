import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentStudent, getStudentAchievements, addAchievement, type Student, type Achievement } from "@/lib/store";
import { DashboardLayout } from "@/components/DashboardLayout";
import { AchievementCard } from "@/components/AchievementCard";
import { toast } from "sonner";
import { Plus, X } from "lucide-react";

const activityTypes = ["Hackathon", "Internship", "Research Paper", "Sports", "Cultural", "Workshop", "Certification", "Other"];
const semesters = ["SEM-I", "SEM-II", "SEM-III", "SEM-IV", "SEM-V", "SEM-VI", "SEM-VII", "SEM-VIII"];

export default function Achievements() {
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "", activityType: "", academicYear: "", semester: "", description: "",
  });

  useEffect(() => {
    const s = getCurrentStudent();
    if (!s) { navigate("/login"); return; }
    setStudent(s);
    setAchievements(getStudentAchievements(s.id));
  }, [navigate]);

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!student) return;
    addAchievement({ ...form, studentId: student.id });
    toast.success("Achievement uploaded successfully!");
    setAchievements(getStudentAchievements(student.id));
    setForm({ title: "", activityType: "", academicYear: "", semester: "", description: "" });
    setShowForm(false);
  };

  if (!student) return null;

  const inputClass = "w-full px-3 py-2.5 border border-border rounded-md text-sm bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground";

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Achievements</h2>
          <p className="text-muted-foreground text-sm mt-1">{achievements.length} achievements recorded</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? "Cancel" : "New Achievement"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-6 shadow-sm mb-8 space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Title</label>
              <input required className={inputClass} placeholder="e.g. Smart India Hackathon 2023" value={form.title} onChange={(e) => update("title", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Activity Type</label>
              <select required className={inputClass} value={form.activityType} onChange={(e) => update("activityType", e.target.value)}>
                <option value="">Select type</option>
                {activityTypes.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Academic Year</label>
              <input required className={inputClass} placeholder="e.g. 2023-24" value={form.academicYear} onChange={(e) => update("academicYear", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Semester</label>
              <select required className={inputClass} value={form.semester} onChange={(e) => update("semester", e.target.value)}>
                <option value="">Select semester</option>
                {semesters.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Description</label>
            <textarea required className={inputClass + " min-h-[80px]"} placeholder="Describe your achievement..." value={form.description} onChange={(e) => update("description", e.target.value)} />
          </div>
          <button type="submit" className="bg-primary text-primary-foreground px-6 py-2.5 rounded-md font-medium text-sm hover:opacity-90 transition-opacity">
            Upload Achievement
          </button>
        </form>
      )}

      {achievements.length === 0 && !showForm ? (
        <div className="bg-card border border-border rounded-lg p-8 text-center">
          <p className="text-muted-foreground text-sm">No achievements uploaded yet.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((a) => (
            <AchievementCard key={a.id} achievement={a} />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
