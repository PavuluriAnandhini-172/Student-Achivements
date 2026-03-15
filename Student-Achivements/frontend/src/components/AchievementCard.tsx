import { Achievement } from "@/lib/store";
import { format } from "date-fns";

const statusColors: Record<string, string> = {
  Verified: "text-success",
  Pending: "text-warning",
  Rejected: "text-destructive",
};

const statusDots: Record<string, string> = {
  Verified: "●",
  Pending: "◐",
  Rejected: "○",
};

export function AchievementCard({ achievement }: { achievement: Achievement }) {
  return (
    <div className="bg-card border border-border rounded-lg p-5 shadow-sm flex flex-col h-full">
      <div className="flex justify-between items-start mb-3">
        <span className="bg-primary/10 text-primary text-xs font-medium px-2.5 py-1 rounded">
          {achievement.activityType}
        </span>
        <span className="font-mono-id text-muted-foreground">{achievement.semester}</span>
      </div>
      <h6 className="font-bold text-foreground text-sm mb-1">{achievement.title}</h6>
      <p className="text-muted-foreground text-sm mb-4 flex-1 line-clamp-2">{achievement.description}</p>
      <div className="pt-3 border-t border-border flex justify-between items-center">
        <span className={`text-sm ${statusColors[achievement.status]}`}>
          {statusDots[achievement.status]} {achievement.status}
        </span>
        <span className="text-muted-foreground text-xs">
          {format(new Date(achievement.createdAt), "MMM dd, yyyy")}
        </span>
      </div>
    </div>
  );
}
