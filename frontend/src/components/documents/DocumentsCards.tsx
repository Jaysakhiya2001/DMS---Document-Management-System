import { memo } from "react";
import Link from "next/link";
import { Folder as FolderIcon, FileText, FileCode, FileImage, FileArchive, File as FileIcon, Trash2, ExternalLink, Pencil } from "lucide-react";
import { motion } from "framer-motion";
import type { FileSystemItem } from "@/types";
import { formatDate, formatFileSize } from "@/utils/formatters";

const getFileIcon = (type: string) => {
// ... (keep icon logic)
  const t = type.toLowerCase();
  if (t === "pdf") return <FileText className="text-red-500" size={24} />;
  if (["docx", "doc", "txt"].includes(t)) return <FileText className="text-blue-500" size={24} />;
  if (["xlsx", "xls", "csv"].includes(t)) return <FileCode className="text-green-600" size={24} />;
  if (["pptx", "ppt"].includes(t)) return <FileText className="text-orange-500" size={24} />;
  if (["jpg", "jpeg", "png", "svg", "gif"].includes(t)) return <FileImage className="text-purple-500" size={24} />;
  if (["zip", "rar", "7z"].includes(t)) return <FileArchive className="text-amber-600" size={24} />;
  return <FileIcon className="text-slate-400" size={24} />;
};

interface DocumentsCardsProps {
  items: FileSystemItem[];
  onDeleteDocument: (id: number) => void;
  onEditDocument: (doc: any) => void;
  onDeleteFolder: (folder: any) => void;
  onEditFolder: (folder: any) => void;
}

export const DocumentsCards = memo(({ 
  items, 
  onDeleteDocument,
  onEditDocument,
  onDeleteFolder,
  onEditFolder
}: DocumentsCardsProps) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, index) => {
        if (item.type === "folder") {
          return (
            <motion.div
              key={`${item.type}-${item.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md ring-1 ring-slate-200"
            >
              <div className="absolute right-4 top-4 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="flex gap-1">
                  <button 
                    onClick={() => onEditFolder(item)}
                    className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-primary transition-colors"
                  >
                    <Pencil size={18} />
                  </button>
                  <button 
                    onClick={() => onDeleteFolder(item)}
                    className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-danger transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <Link href={`/documents/${item.id}`} className="block">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 ring-1 ring-indigo-100 group-hover:bg-indigo-100 transition-colors">
                  <FolderIcon className="fill-indigo-500 text-indigo-500" size={24} />
                </div>
                <h3 className="mb-1 truncate text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">
                  {item.name}
                </h3>
                <p className="text-sm text-slate-500">Folder • {formatDate(item.created_at)}</p>
              </Link>
            </motion.div>
          );
        }

        return (
          <motion.div
            key={`${item.type}-${item.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md ring-1 ring-slate-200"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 ring-1 ring-slate-100 group-hover:bg-white group-hover:shadow-inner transition-colors">
              {getFileIcon(item.file_type || "")}
            </div>
            
            <div className="absolute right-4 top-4 opacity-0 transition-opacity group-hover:opacity-100">
              <div className="flex gap-1">
                <button 
                  onClick={() => onEditDocument(item)}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-primary transition-colors"
                >
                  <Pencil size={18} />
                </button>
                {item.file_url && (
                  <a 
                    href={item.file_url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-primary transition-colors"
                  >
                    <ExternalLink size={18} />
                  </a>
                )}
                <button 
                  onClick={() => {
                    if (window.confirm(`Delete "${item.name}"?`)) onDeleteDocument(item.id);
                  }}
                  className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-danger transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <h3 className="mb-1 truncate text-lg font-bold text-slate-900" title={item.name}>
              {item.name}
            </h3>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span>{(item.file_type || "BIN").toUpperCase()}</span>
              <span>•</span>
              <span>{formatFileSize(item.file_size || 0)}</span>
            </div>
            <div className="mt-4 border-t border-slate-100 pt-4 text-xs text-slate-400">
              Added on {formatDate(item.created_at)} by {item.created_by.name}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
});

DocumentsCards.displayName = "DocumentsCards";
