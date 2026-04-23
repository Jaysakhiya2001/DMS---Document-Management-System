import { api } from "./api";
import type { ApiResponse, Document, FileSystemItem, ListDocumentsParams } from "@/types";

export const getDocuments = async (params: ListDocumentsParams) => {
  const { data } = await api.get<ApiResponse<FileSystemItem[]>>("/documents", { params });
  return data;
};

export const createDocument = async (payload: {
  name: string;
  file_type: "pdf" | "docx" | "xlsx" | "pptx" | "txt";
  file_size: number;
  folder_id: number | null;
}) => {
  const { data } = await api.post<ApiResponse<Document>>("/documents", payload);
  return data;
};

export const updateDocument = async (id: number, name: string) => {
  const { data } = await api.put<ApiResponse<Document>>(`/documents/${id}`, { name });
  return data;
};

export const deleteDocument = async (id: number) => {
  await api.delete(`/documents/${id}`);
};

export const uploadDocumentFile = async (file: File, folderId: number | null) => {
  const formData = new FormData();
  formData.append("file", file);
  if (folderId !== null) {
    formData.append("folder_id", String(folderId));
  }

  const { data } = await api.post<ApiResponse<Document>>("/documents/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data;
};
