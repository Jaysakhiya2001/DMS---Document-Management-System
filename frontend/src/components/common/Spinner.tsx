import { memo } from "react";
import { cn } from "@/utils/cn";

export const Spinner = memo(({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const sizeMap = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-7 w-7",
  };

  return (
    <svg
      className={cn("animate-spin text-current", sizeMap[size])}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" className="opacity-25" stroke="currentColor" strokeWidth="3" />
      <path d="M22 12a10 10 0 0 1-10 10" className="opacity-75" stroke="currentColor" strokeWidth="3" />
    </svg>
  );
});

Spinner.displayName = "Spinner";
