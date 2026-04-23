import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils/cn";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "prefix" | "suffix"> {
  label?: string;
  error?: string;
  helperText?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
}

export const Input = ({ label, error, helperText, prefix, suffix, className, ...props }: InputProps) => (
  <div className="flex w-full flex-col gap-1.5">
    {label ? <span className="text-sm font-semibold text-slate-700">{label}</span> : null}
    <div 
      className={cn(
        "flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 transition-all focus-within:border-primary focus-within:bg-white focus-within:ring-4 focus-within:ring-primary/10",
        error && "border-red-300 bg-red-50 focus-within:border-red-500 focus-within:ring-red-100"
      )}
    >
      {prefix && <div className="text-slate-400">{prefix}</div>}
      <input 
        className={cn("h-11 w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400", className)} 
        {...props} 
      />
      {suffix && <div className="text-slate-400">{suffix}</div>}
    </div>
    {error ? <span className="text-xs font-medium text-red-500">{error}</span> : null}
    {!error && helperText ? <span className="text-xs text-slate-500">{helperText}</span> : null}
  </div>
);
