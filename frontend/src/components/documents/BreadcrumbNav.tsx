import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  id: number;
  name: string;
}

export const BreadcrumbNav = ({ items }: { items: BreadcrumbItem[] }) => (
  <nav className="flex items-center gap-2 text-sm text-slate-500">
    <Link 
      className="flex items-center gap-1.5 transition-colors hover:text-primary" 
      href="/documents"
    >
      <Home size={16} />
      <span>Root</span>
    </Link>
    {items.map((item, index) => (
      <div key={item.id} className="flex items-center gap-2">
        <ChevronRight size={14} className="text-slate-300" />
        {index === items.length - 1 ? (
          <span className="font-semibold text-slate-900">{item.name}</span>
        ) : (
          <Link 
            className="transition-colors hover:text-primary" 
            href={`/documents/${item.id}`}
          >
            {item.name}
          </Link>
        )}
      </div>
    ))}
  </nav>
);
