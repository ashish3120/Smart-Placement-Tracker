import { cn } from "@/lib/utils";

type Status = "Applied" | "Interview" | "Selected" | "Rejected" | "Not Applied";

const statusConfig: Record<Status, { bg: string; dot: string }> = {
  "Not Applied": { bg: "bg-muted text-muted-foreground", dot: "bg-[hsl(var(--muted-foreground))]" },
  "Applied": { bg: "bg-status-info", dot: "bg-[hsl(var(--status-info))]" },
  "Interview": { bg: "bg-status-warning", dot: "bg-[hsl(var(--status-warning))]" },
  "Selected": { bg: "bg-status-success", dot: "bg-[hsl(var(--status-success))]" },
  "Rejected": { bg: "bg-status-urgent", dot: "bg-[hsl(var(--status-urgent))]" },
};

export function StatusBadge({ status }: { status: Status }) {
  const config = statusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide",
        config.bg
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", config.dot)} />
      {status}
    </span>
  );
}
