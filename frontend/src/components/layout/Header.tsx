import { Layout, Bell, User } from "lucide-react";

export const Header = () => (
  <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-md">
    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
      <div className="flex items-center gap-2.5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
          <Layout size={24} />
        </div>
        <h1 className="text-xl font-black tracking-tight text-slate-900">Vistra <span className="text-primary">DMS</span></h1>
      </div>
      <div className="flex items-center gap-4">
        <button className="flex h-10 w-10 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
          <Bell size={20} />
        </button>
        <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 pl-3 pr-1 py-1 transition-colors hover:border-slate-300">
          <span className="text-sm font-semibold text-slate-700">Admin</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
            <User size={18} />
          </div>
        </div>
      </div>
    </div>
  </header>
);
