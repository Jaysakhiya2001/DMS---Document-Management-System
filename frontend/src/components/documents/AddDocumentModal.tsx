"use client";

import { useCallback, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { uploadDocumentFile } from "@/services/documents.service";
import { Button } from "../common/Button";
import { Modal } from "../common/Modal";

export const AddDocumentModal = ({
  isOpen,
  onClose,
  folderId,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  folderId: number | null;
  onSuccess: () => void;
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((previous) => [...previous, ...acceptedFiles]);
    setErrorMessage(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    maxSize: 20 * 1024 * 1024,
  });

  const totalSize = useMemo(
    () => files.reduce((sum, file) => sum + file.size, 0),
    [files],
  );

  const onSubmit = async () => {
    if (files.length === 0) {
      setErrorMessage("Please select at least one file.");
      return;
    }
    setIsUploading(true);
    setErrorMessage(null);
    try {
      for (const file of files) {
        await uploadDocumentFile(file, folderId);
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Upload failed");
      return;
    } finally {
      setIsUploading(false);
    }
    setFiles([]);
    onSuccess();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upload files">
      <div className="space-y-4">
        <div
          {...getRootProps()}
          className={`cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition ${
            isDragActive ? "border-blue-500 bg-blue-50" : "border-slate-300 bg-slate-50"
          }`}
        >
          <input {...getInputProps()} />
          <p className="font-medium text-slate-700">Drag and drop files here</p>
          <p className="text-sm text-slate-500">or click to choose files (max 20MB each)</p>
        </div>

        {files.length > 0 ? (
          <div className="rounded-lg border border-slate-200 bg-white p-3">
            <p className="mb-2 text-sm font-semibold text-slate-700">Selected files ({files.length})</p>
            <ul className="max-h-40 space-y-1 overflow-auto text-sm text-slate-600">
              {files.map((file, index) => (
                <li key={`${file.name}-${index}`} className="flex items-center justify-between">
                  <span className="truncate">{file.name}</span>
                  <span>{(file.size / 1024).toFixed(1)} KB</span>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs text-slate-500">
              Total size: {(totalSize / (1024 * 1024)).toFixed(2)} MB
            </p>
          </div>
        ) : null}

        {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}

        <div className="flex justify-between">
          <Button
            onClick={() => {
              setFiles([]);
              setErrorMessage(null);
            }}
            type="button"
            variant="ghost"
          >
            Clear
          </Button>
          <Button loading={isUploading} onClick={onSubmit} type="button">
            Upload
          </Button>
        </div>
      </div>
    </Modal>
  );
};
