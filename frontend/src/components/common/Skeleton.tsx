import { cn } from "@/utils/cn";

interface SkeletonProps {
  className?: string;
}

export const Skeleton = ({ className }: SkeletonProps) => {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-slate-200 dark:bg-slate-700",
        className
      )}
    />
  );
};

export const TableSkeleton = ({ rows = 5 }: { rows?: number }) => (
  <div className="w-full space-y-4">
    <Skeleton className="h-10 w-full rounded-lg" />
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-16 w-full rounded-lg" />
      ))}
    </div>
  </div>
);

export const CardSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <Skeleton className="h-32 w-full rounded-lg mb-4" />
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    ))}
  </div>
);
