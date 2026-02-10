import { cn } from "@/lib/utils";

export function DeadlineIndicator({ deadline }: { deadline: string }) {
  const now = new Date();
  const dl = new Date(deadline);
  const hoursLeft = (dl.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (hoursLeft < 0) {
    return <span className="text-xs text-muted-foreground">Expired</span>;
  }

  const isUrgent = hoursLeft <= 24;
  const isWarning = hoursLeft <= 48;

  const label = hoursLeft < 1
    ? "< 1 hour left"
    : hoursLeft < 24
    ? `${Math.floor(hoursLeft)}h left`
    : `${Math.ceil(hoursLeft / 24)}d left`;

  return (
    <span
      className={cn(
        "text-xs font-medium",
        isUrgent ? "status-urgent" : isWarning ? "status-warning" : "text-muted-foreground"
      )}
    >
      {isUrgent && "⚠ "}
      {label}
    </span>
  );
}
