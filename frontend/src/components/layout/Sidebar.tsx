import { Folder } from "lucide-react";
import Link from "next/link";

const sidebarItems = [
  { icon: Folder, label: "All Files", href: "/documents", active: true },
];

export const Sidebar = () => (
  <aside className="hidden w-64 flex-col border-r border-slate-200 bg-slate-50/50 py-8 lg:flex">
    <nav className="space-y-1 px-4">
      {sidebarItems.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${item.active
            ? "bg-white text-primary shadow-sm ring-1 ring-slate-200"
            : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            }`}
        >
          <item.icon size={18} />
          {item.label}
        </Link>
      ))}
    </nav>
  </aside>
);
