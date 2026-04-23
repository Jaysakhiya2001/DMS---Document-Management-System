import { useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/utils/cn";

interface ModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  size?: "sm" | "md" | "lg" | "xl";
  children: React.ReactNode;
}

export const Modal = ({ title, isOpen, onClose, size = "md", children }: ModalProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const portalRoot = useMemo(() => (typeof document !== "undefined" ? document.body : null), []);
  if (!portalRoot) return null;

  const sizes = {
    sm: "max-w-sm",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={cn(
              "relative w-full rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200",
              sizes[size]
            )}
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="text-xl font-bold text-slate-900">{title}</h2>
              <button
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                onClick={onClose}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
            <div className="px-6 py-6 max-h-[80vh] overflow-y-auto">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    portalRoot
  );
};
