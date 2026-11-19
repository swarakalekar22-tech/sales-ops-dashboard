import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <div className="max-w-xs space-y-1">
        <h2 className="text-sm font-semibold">{title}</h2>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      {actionLabel ? (
        <Button size="sm" onClick={onAction} className="mt-1">
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
