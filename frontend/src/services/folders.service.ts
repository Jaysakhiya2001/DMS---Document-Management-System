import { api } from "./api";
import type { ApiResponse, Folder, FolderContentsResponse } from "@/types";

export const getRootFolders = async () => {
  const { data } = await api.get<ApiResponse<Folder[]>>("/folders");
  return data;
};

export const getFolderContents = async (folderId: number) => {
  const { data } = await api.get<ApiResponse<FolderContentsResponse>>(
    `/folders/${folderId}/contents`,
  );
  return data;
};

export const createFolder = async (payload: { name: string; parent_id: number | null }) => {
  const { data } = await api.post<ApiResponse<Folder>>("/folders", payload);
  return data;
};

export const updateFolder = async (id: number, name: string) => {
  const { data } = await api.put<ApiResponse<Folder>>(`/folders/${id}`, { name });
  return data;
};

export const deleteFolder = async (id: number, mode: "cascade" | "move" = "move") => {
  await api.delete(`/folders/${id}`, { params: { mode } });
};
