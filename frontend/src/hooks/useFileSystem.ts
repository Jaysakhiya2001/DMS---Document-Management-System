import { useCallback, useState } from "react";
import { deleteDocument, updateDocument } from "@/services/documents.service";
import { deleteFolder, updateFolder } from "@/services/folders.service";
import type { Document, Folder } from "@/types";

interface UseFileSystemOptions {
  onRefresh: () => Promise<void>;
}

export const useFileSystem = ({ onRefresh }: UseFileSystemOptions) => {
  const [editingItem, setEditingItem] = useState<{ type: "folder" | "document"; item: Folder | Document } | null>(null);
  const [deletingFolder, setDeletingFolder] = useState<Folder | null>(null);

  const handleDeleteDocument = useCallback(async (id: number) => {
    try {
      await deleteDocument(id);
      await onRefresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to delete document");
    }
  }, [onRefresh]);

  const handleRename = useCallback(async (newName: string) => {
    if (!editingItem) return;
    const { type, item } = editingItem;
    try {
      if (type === "folder") {
        await updateFolder(item.id, newName);
      } else {
        await updateDocument(item.id, newName);
      }
      await onRefresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Rename failed");
      throw error;
    }
  }, [editingItem, onRefresh]);

  const handleFolderDeletion = useCallback(async (mode: "cascade" | "move") => {
    if (!deletingFolder) return;
    try {
      await deleteFolder(deletingFolder.id, mode);
      await onRefresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Deletion failed");
      throw error;
    }
  }, [deletingFolder, onRefresh]);

  const initiateRename = useCallback((type: "folder" | "document", item: Folder | Document) => {
    setEditingItem({ type, item });
  }, []);

  const initiateFolderDeletion = useCallback((folder: Folder) => {
    setDeletingFolder(folder);
  }, []);

  const cancelRename = useCallback(() => {
    setEditingItem(null);
  }, []);

  const cancelFolderDeletion = useCallback(() => {
    setDeletingFolder(null);
  }, []);

  return {
    editingItem,
    deletingFolder,
    handleDeleteDocument,
    handleRename,
    handleFolderDeletion,
    initiateRename,
    initiateFolderDeletion,
    cancelRename,
    cancelFolderDeletion,
  };
};
