import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentStudent, getStudentAchievements, getStudentDocuments, type Student, type Achievement } from "@/lib/store";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatCard } from "@/components/StatCard";
import { AchievementCard } from "@/components/AchievementCard";

export default function Dashboard() {
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [docCount, setDocCount] = useState(0);

  useEffect(() => {
    const s = getCurrentStudent();
    if (!s) { navigate("/login"); return; }
    setStudent(s);
    setAchievements(getStudentAchievements(s.id));
    setDocCount(getStudentDocuments(s.id).length);
  }, [navigate]);

  if (!student) return null;

  const verified = achievements.filter((a) => a.status === "Verified").length;

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground">Student Dashboard</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Welcome back, <span className="text-foreground font-medium">{student.name}</span>
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Achievements" value={achievements.length} />
        <StatCard label="Verified" value={String(verified).padStart(2, "0")} variant="success" />
        <StatCard label="Documents" value={docCount} />
        <StatCard label="Reg. Number" value={student.regNumber} />
      </div>

      <h5 className="font-bold text-foreground mb-4">Recent Achievements</h5>
      {achievements.length === 0 ? (
        <div className="bg-card border border-border rounded-lg p-8 text-center">
          <p className="text-muted-foreground text-sm">No achievements yet. Start by uploading your first achievement.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.slice(0, 6).map((a) => (
            <AchievementCard key={a.id} achievement={a} />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
