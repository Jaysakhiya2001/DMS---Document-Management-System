"use client";

import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "./Input";
import { useDebounce } from "@/hooks/useDebounce";

interface SearchBarProps {
  value?: string;
  onSearch: (value: string) => void;
}

export const SearchBar = ({ value = "", onSearch }: SearchBarProps) => {
  const [term, setTerm] = useState(value);
  const debounced = useDebounce(term, 300);

  useEffect(() => {
    onSearch(debounced);
  }, [debounced, onSearch]);

  return (
    <Input
      placeholder="Search documents and folders..."
      value={term}
      onChange={(event) => setTerm(event.target.value)}
      prefix={<Search size={18} />}
      suffix={
        term ? (
          <button 
            className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-slate-200 text-slate-400 transition-colors" 
            onClick={() => setTerm("")} 
            type="button"
          >
            <X size={14} />
          </button>
        ) : null
      }
    />
  );
};
