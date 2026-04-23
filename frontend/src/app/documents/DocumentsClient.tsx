"use client";

import { useCallback, useMemo, useState } from "react";
import { Plus, Upload, LayoutGrid, List, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AddDocumentModal } from "@/components/documents/AddDocumentModal";
import { AddFolderModal } from "@/components/documents/AddFolderModal";
import { BreadcrumbNav } from "@/components/documents/BreadcrumbNav";
import { DocumentsCards } from "@/components/documents/DocumentsCards";
import { DocumentsTable } from "@/components/documents/DocumentsTable";
import { EditNameModal } from "@/components/documents/EditNameModal";
import { DeleteFolderConfirmationModal } from "@/components/documents/DeleteFolderConfirmationModal";
import { Button } from "@/components/common/Button";
import { EmptyState } from "@/components/common/EmptyState";
import { Pagination } from "@/components/common/Pagination";
import { SearchBar } from "@/components/common/SearchBar";
import { TableSkeleton, CardSkeleton } from "@/components/common/Skeleton";
import { useDocuments } from "@/hooks/useDocuments";
import { useFolders } from "@/hooks/useFolders";
import { useFileSystem } from "@/hooks/useFileSystem";

export const DocumentsClient = ({
  folderId,
  breadcrumb: initialBreadcrumb = [],
}: {
  folderId: number | null;
  breadcrumb?: Array<{ id: number; name: string }>;
}) => {
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState<"name" | "created_at">("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [viewMode, setViewMode] = useState<"list" | "card">("list");

  const documentParams = useMemo(
    () => ({
      page,
      limit,
      folder_id: folderId,
      search,
      sort_by: sortBy,
      sort_dir: sortDir,
    }),
    [folderId, limit, page, search, sortBy, sortDir],
  );

  const { items, pagination, isLoading: isDocsLoading, error: docsError, refetch: refetchDocuments } = useDocuments(documentParams);
  const { currentFolder, folders, isLoading: isFoldersLoading, error: foldersError, refetch: refetchFolders } = useFolders(folderId ?? undefined);

  const breadcrumb = useMemo(() => {
    if (initialBreadcrumb.length > 0) return initialBreadcrumb;
    if (currentFolder) return [{ id: currentFolder.id, name: currentFolder.name }];
    return [];
  }, [initialBreadcrumb, currentFolder]);

  const isLoading = isDocsLoading || isFoldersLoading;
  const error = docsError || foldersError;

  const refreshAll = useCallback(async () => {
    await Promise.all([refetchDocuments(), refetchFolders()]);
  }, [refetchDocuments, refetchFolders]);

  const {
    editingItem,
    deletingFolder,
    handleDeleteDocument,
    handleRename,
    handleFolderDeletion,
    initiateRename,
    initiateFolderDeletion,
    cancelRename,
    cancelFolderDeletion,
  } = useFileSystem({ onRefresh: refreshAll });

  const onSort = useCallback((column: "name" | "created_at") => {
    setSortBy(column);
    setSortDir((current) => (current === "asc" ? "desc" : "asc"));
  }, []);

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-20">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Workspace</h2>
          <BreadcrumbNav items={breadcrumb} />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex rounded-xl bg-slate-100 p-1 ring-1 ring-slate-200">
            <button
              className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all ${viewMode === "list" ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              onClick={() => setViewMode("list")}
              title="List View"
            >
              <List size={18} />
            </button>
            <button
              className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all ${viewMode === "card" ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              onClick={() => setViewMode("card")}
              title="Grid View"
            >
              <LayoutGrid size={18} />
            </button>
          </div>
          <Button
            onClick={() => setIsDocumentModalOpen(true)}
            className="rounded-xl"
            variant="outline"
          >
            <Upload size={18} />
            <span>Upload</span>
          </Button>
          <Button
            onClick={() => setIsFolderModalOpen(true)}
            className="rounded-xl"
          >
            <Plus size={18} />
            <span>New Folder</span>
          </Button>
        </div>
      </motion.div>

      <div className="relative">
        <SearchBar onSearch={setSearch} />
      </div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {viewMode === "list" ? <TableSkeleton /> : <CardSkeleton />}
          </motion.div>
        ) : error ? (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-red-700"
          >
            <AlertCircle size={20} />
            <p className="font-medium">{error}</p>
          </motion.div>
        ) : items.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <EmptyState
              title={search ? "No results found" : "Your workspace is empty"}
              description={search ? "Try searching for something else or clear the filters." : "Start organizing your documents by creating a folder or uploading files."}
              ctaLabel={search ? "Clear Search" : "Upload a file"}
              onCta={() => search ? setSearch("") : setIsDocumentModalOpen(true)}
            />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {viewMode === "list" ? (
              <DocumentsTable
                items={items}
                onDeleteDocument={handleDeleteDocument}
                onEditDocument={(doc) => initiateRename("document", doc)}
                onDeleteFolder={initiateFolderDeletion}
                onEditFolder={(folder) => initiateRename("folder", folder)}
                onSort={onSort}
              />
            ) : (
              <DocumentsCards
                items={items}
                onDeleteDocument={handleDeleteDocument}
                onEditDocument={(doc) => initiateRename("document", doc)}
                onDeleteFolder={initiateFolderDeletion}
                onEditFolder={(folder) => initiateRename("folder", folder)}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-sm sm:flex-row"
      >
        <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
          <span>Show</span>
          <select
            className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={limit}
            onChange={(event) => {
              setLimit(Number(event.target.value));
              setPage(1);
            }}
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size} per page
              </option>
            ))}
          </select>
        </div>
        <Pagination page={pagination?.page ?? 1} totalPages={pagination?.totalPages ?? 1} onPageChange={setPage} />
      </motion.div>

      <AddFolderModal isOpen={isFolderModalOpen} onClose={() => setIsFolderModalOpen(false)} parentId={folderId} onSuccess={refreshAll} />
      <AddDocumentModal
        isOpen={isDocumentModalOpen}
        onClose={() => setIsDocumentModalOpen(false)}
        folderId={folderId}
        onSuccess={refreshAll}
      />

      <EditNameModal
        isOpen={!!editingItem}
        onClose={cancelRename}
        initialName={editingItem?.item.name ?? ""}
        title={editingItem?.type === "folder" ? "Rename Folder" : "Rename Document"}
        onConfirm={handleRename}
      />

      <DeleteFolderConfirmationModal
        isOpen={!!deletingFolder}
        onClose={cancelFolderDeletion}
        folderName={deletingFolder?.name ?? ""}
        onConfirm={handleFolderDeletion}
      />
    </div>
  );
};
