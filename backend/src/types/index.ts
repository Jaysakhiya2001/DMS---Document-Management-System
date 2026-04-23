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

export interface DocumentItem {
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

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
