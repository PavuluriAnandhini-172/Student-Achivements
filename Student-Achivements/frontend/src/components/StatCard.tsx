export function StatCard({ label, value, variant }: { label: string; value: string | number; variant?: "success" }) {
  return (
    <div className="bg-card border border-border rounded-lg p-5 shadow-sm">
      <small className="text-muted-foreground text-sm block mb-1">{label}</small>
      <h3 className={`text-2xl font-bold ${variant === "success" ? "text-success" : "text-foreground"}`}>
        {value}
      </h3>
    </div>
  );
}
