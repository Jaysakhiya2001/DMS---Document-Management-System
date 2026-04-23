"use client";

import { useState } from "react";
import { AlertTriangle, Trash2, ArrowUpRight } from "lucide-react";
import { Button } from "../common/Button";
import { Modal } from "../common/Modal";

interface DeleteFolderConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  folderName: string;
  onConfirm: (mode: "cascade" | "move") => Promise<void>;
}

export const DeleteFolderConfirmationModal = ({
  isOpen,
  onClose,
  folderName,
  onConfirm,
}: DeleteFolderConfirmationModalProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (mode: "cascade" | "move") => {
    setIsDeleting(true);
    setError(null);
    try {
      await onConfirm(mode);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Deletion failed");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Folder">
      <div className="space-y-6">
        <div className="flex items-start gap-4 rounded-xl bg-amber-50 p-4 text-amber-800">
          <AlertTriangle className="mt-0.5 shrink-0" size={20} />
          <div>
            <p className="font-semibold">Confirm Deletion</p>
            <p className="text-sm opacity-90">
              You are about to delete <span className="font-bold underline">"{folderName}"</span>. How would you like to handle the items inside?
            </p>
          </div>
        </div>

        {error && <p className="text-sm font-medium text-red-500">{error}</p>}

        <div className="grid gap-3 sm:grid-cols-2">
          <button
            className="flex flex-col items-center gap-3 rounded-2xl border-2 border-slate-100 p-5 text-center transition-all hover:border-slate-200 hover:bg-slate-50 disabled:opacity-50"
            disabled={isDeleting}
            onClick={() => handleDelete("move")}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <ArrowUpRight size={24} />
            </div>
            <div>
              <p className="font-bold text-slate-900">Move to Root</p>
              <p className="text-xs text-slate-500">Keep documents but move them to the top level</p>
            </div>
          </button>

          <button
            className="flex flex-col items-center gap-3 rounded-2xl border-2 border-slate-100 p-5 text-center transition-all hover:border-red-100 hover:bg-red-50 disabled:opacity-50"
            disabled={isDeleting}
            onClick={() => handleDelete("cascade")}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
              <Trash2 size={24} />
            </div>
            <div>
              <p className="font-bold text-slate-900">Delete All</p>
              <p className="text-xs text-slate-500">Permanently delete folder and all contents</p>
            </div>
          </button>
        </div>

        <div className="flex justify-center">
          <Button disabled={isDeleting} onClick={onClose} variant="ghost">
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};
