import { memo, useMemo } from "react";
import Link from "next/link";
import { Folder as FolderIcon, FileText, FileCode, FileImage, FileArchive, File as FileIcon, Trash2, ExternalLink, Pencil, ChevronRight } from "lucide-react";
import type { Document, Folder, FileSystemItem } from "@/types";
import { formatDate, formatFileSize } from "@/utils/formatters";
import { DataTable, type Column } from "../common/DataTable";

const getFileIcon = (type: string) => {
  const t = type.toLowerCase();
  if (t === "pdf") return <FileText className="text-red-500" size={18} />;
  if (["docx", "doc", "txt"].includes(t)) return <FileText className="text-blue-500" size={18} />;
  if (["xlsx", "xls", "csv"].includes(t)) return <FileCode className="text-green-600" size={18} />;
  if (["pptx", "ppt"].includes(t)) return <FileText className="text-orange-500" size={18} />;
  if (["jpg", "jpeg", "png", "svg", "gif"].includes(t)) return <FileImage className="text-purple-500" size={18} />;
  if (["zip", "rar", "7z"].includes(t)) return <FileArchive className="text-amber-600" size={18} />;
  return <FileIcon className="text-slate-400" size={18} />;
};

interface DocumentsTableProps {
  items: FileSystemItem[];
  onDeleteDocument: (id: number) => void;
  onEditDocument: (document: any) => void;
  onDeleteFolder: (folder: any) => void;
  onEditFolder: (folder: any) => void;
  onSort: (column: "name" | "created_at") => void;
}

export const DocumentsTable = memo(({ 
  items, 
  onDeleteDocument, 
  onEditDocument,
  onDeleteFolder,
  onEditFolder,
  onSort 
}: DocumentsTableProps) => {

  const columns: Column<FileSystemItem>[] = useMemo(() => [
    {
      key: "name",
      header: "Name",
      sortable: true,
      render: (item) => (
        item.type === "folder" ? (
          <Link className="flex items-center gap-3" href={`/documents/${item.id}`}>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 ring-1 ring-indigo-200 transition-colors group-hover:bg-white group-hover:shadow-sm">
              <FolderIcon className="fill-indigo-500 text-indigo-500" size={18} />
            </div>
            <span className="font-semibold text-slate-900 group-hover:text-primary transition-colors">
              {item.name}
            </span>
          </Link>
        ) : (
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 ring-1 ring-slate-200 transition-colors group-hover:bg-white group-hover:shadow-sm">
              {getFileIcon(item.file_type || "")}
            </div>
            <span className="font-medium text-slate-700">{item.name}</span>
          </div>
        )
      ),
    },
    {
      key: "created_by",
      header: "Created by",
      render: (item) => <span className="text-slate-500">{item.created_by.name}</span>,
    },
    {
      key: "created_at",
      header: "Date",
      sortable: true,
      render: (item) => <span className="text-slate-500">{formatDate(item.created_at)}</span>,
    },
    {
      key: "size",
      header: "File size",
      render: (item) => (
        <span className="text-slate-500">
          {item.type === "folder" ? (
            <span className="text-xs font-medium uppercase tracking-wider bg-slate-100 px-2 py-1 rounded text-slate-400">Folder</span>
          ) : (
            formatFileSize(item.file_size || 0)
          )}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (item) => (
        <div className="flex items-center justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-primary"
            onClick={() => item.type === "folder" ? onEditFolder(item) : onEditDocument(item)}
            type="button"
            title="Rename"
          >
            <Pencil size={16} />
          </button>
          
          {item.type === "document" && item.file_url && (
            <a
              className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-primary"
              href={item.file_url}
              rel="noreferrer"
              target="_blank"
              title="Open"
            >
              <ExternalLink size={16} />
            </a>
          )}
          
          <button
            className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-red-50 hover:text-danger"
            onClick={() => {
              if (item.type === "folder") {
                onDeleteFolder(item);
              } else {
                if (window.confirm(`Are you sure you want to delete "${item.name}"?`)) {
                  onDeleteDocument(item.id);
                }
              }
            }}
            type="button"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>

          {item.type === "folder" && (
            <Link 
              href={`/documents/${item.id}`}
              className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-primary"
              title="View"
            >
              <ChevronRight size={16} />
            </Link>
          )}
        </div>
      ),
    },
  ], [onDeleteDocument, onEditDocument, onDeleteFolder, onEditFolder]);

  return (
    <DataTable
      data={items}
      columns={columns}
      onSort={(key) => onSort(key as "name" | "created_at")}
      keyExtractor={(item) => `${item.type}-${item.id}`}
    />
  );
});

DocumentsTable.displayName = "DocumentsTable";
