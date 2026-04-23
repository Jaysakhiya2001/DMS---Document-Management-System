import { memo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./Button";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = memo(({ page, totalPages, onPageChange }: PaginationProps) => (
  <div className="flex items-center gap-3">
    <Button 
      onClick={() => onPageChange(page - 1)} 
      disabled={page <= 1} 
      size="sm" 
      variant="outline" 
      type="button"
      className="rounded-lg"
    >
      <ChevronLeft size={16} />
      <span>Previous</span>
    </Button>
    <div className="flex items-center gap-1">
      <span className="text-sm font-bold text-slate-900">{page}</span>
      <span className="text-sm text-slate-400">of</span>
      <span className="text-sm font-bold text-slate-900">{Math.max(1, totalPages)}</span>
    </div>
    <Button
      onClick={() => onPageChange(page + 1)}
      disabled={page >= totalPages}
      size="sm"
      variant="outline"
      type="button"
      className="rounded-lg"
    >
      <span>Next</span>
      <ChevronRight size={16} />
    </Button>
  </div>
));

Pagination.displayName = "Pagination";
