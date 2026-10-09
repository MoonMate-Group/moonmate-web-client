import { Badge } from "@/components/ui/badge";
import type { BusinessStatus } from "@/data/businesses";
import { cn } from "@/lib/utils";

const dot: Record<BusinessStatus, string> = {
  Operational: "bg-success",
  "Planned venture": "bg-warn",
  "Long-term concept": "bg-primary",
};

export function StatusBadge({ status }: { status: BusinessStatus }) {
  return (
    <Badge variant="outline" className="h-6 gap-2 px-3 font-mono text-[10px] tracking-[0.14em] uppercase">
      <span className={cn("size-1.5 rounded-full", dot[status])} aria-hidden="true" />
      {status}
    </Badge>
  );
}
