export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Folder {
  id: number;
  name: string;
  parent_id: number | null;
  created_by: User;
  created_at: string;
}

export interface Document {
  id: number;
  name: string;
  file_type: string;
  file_size: number;
  folder_id: number | null;
  file_url?: string;
  created_by: User;
  created_at: string;
}

export interface FileSystemItem {
  id: number;
  name: string;
  type: "folder" | "document";
  file_size: number | null;
  file_type?: string;
  file_url?: string;
  created_by: User;
  created_at: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  pagination?: Pagination;
}

export interface FolderContentsResponse {
  currentFolder: Folder | null;
  folders: Folder[];
  documents: Document[];
}

export interface ListDocumentsParams {
  page?: number;
  limit?: number;
  folder_id?: number | null;
  search?: string;
  sort_by?: "name" | "created_at" | "file_size";
  sort_dir?: "asc" | "desc";
}
