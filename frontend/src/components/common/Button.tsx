import { memo, type ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { Spinner } from "./Spinner";
import { cn } from "@/utils/cn";

type Variant = "primary" | "secondary" | "danger" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  children?: ReactNode;
}

const variants = {
  primary: "bg-primary text-white hover:bg-primary-dark shadow-sm",
  secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 shadow-sm",
  danger: "bg-danger text-white hover:bg-red-600 shadow-sm",
  ghost: "text-slate-600 hover:bg-slate-100",
  outline: "border border-slate-200 bg-transparent hover:bg-slate-50",
};

const sizes = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2.5",
};

export const Button = memo(({
  className,
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) => {

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Spinner size="sm" /> : null}
      {children}
    </motion.button>
  );
});

Button.displayName = "Button";
