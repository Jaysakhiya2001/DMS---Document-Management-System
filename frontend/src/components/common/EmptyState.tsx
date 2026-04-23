import { memo } from "react";
import { Inbox } from "lucide-react";
import { Button } from "./Button";

interface EmptyStateProps {
  title: string;
  description?: string;
  ctaLabel?: string;
  onCta?: () => void;
}

export const EmptyState = memo(({ title, description, ctaLabel, onCta }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-white p-12 text-center shadow-sm">
    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-400">
      <Inbox size={32} />
    </div>
    <h3 className="text-xl font-bold text-slate-900">{title}</h3>
    {description ? <p className="mt-2 max-w-sm text-slate-500">{description}</p> : null}
    {ctaLabel && onCta ? (
      <Button className="mt-6 rounded-xl px-8" onClick={onCta} type="button">
        {ctaLabel}
      </Button>
    ) : null}
  </div>
));

EmptyState.displayName = "EmptyState";
