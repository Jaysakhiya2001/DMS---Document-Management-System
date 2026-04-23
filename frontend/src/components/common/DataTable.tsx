import { ReactNode } from "react";
import { ArrowUpDown } from "lucide-react";

export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  align?: "left" | "center" | "right";
  render?: (item: T) => ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onSort?: (columnKey: string) => void;
  keyExtractor: (item: T) => string;
}

export function DataTable<T>({ data, columns, onSort, keyExtractor }: DataTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ring-1 ring-slate-200">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50/50 text-slate-500">
          <tr>
            {columns.map((col) => (
              <th 
                key={col.key} 
                className={`px-4 py-3 font-semibold ${
                  col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"
                }`}
              >
                {col.sortable && onSort ? (
                  <button 
                    className={`flex items-center gap-1.5 transition-colors hover:text-primary ${col.align === "right" ? "ml-auto" : ""}`} 
                    onClick={() => onSort(col.key)} 
                    type="button"
                  >
                    {col.header} <ArrowUpDown size={14} />
                  </button>
                ) : (
                  col.header
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((item) => (
            <tr key={keyExtractor(item)} className="group transition-colors hover:bg-slate-50/50">
              {columns.map((col) => (
                <td 
                  key={col.key} 
                  className={`px-4 py-4 ${
                    col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"
                  }`}
                >
                  {col.render ? col.render(item) : String(item[col.key as keyof T])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
