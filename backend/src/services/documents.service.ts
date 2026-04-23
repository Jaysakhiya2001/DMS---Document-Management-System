import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { dbPool } from "../config/db";
import { getPublicObjectUrl } from "../config/minio";
import type { DocumentItem, PaginationMeta } from "../types/index";

interface DocumentRow extends RowDataPacket {
  id: number;
  name: string;
  file_type: string;
  file_size: number;
  folder_id: number | null;
  object_key: string | null;
  created_at: Date;
  user_id: number;
  user_name: string;
  user_email: string;
}

interface CountRow extends RowDataPacket {
  total: number;
}

export interface ListDocumentsQuery {
  page: number;
  limit: number;
  folder_id?: number;
  search?: string;
  sort_by: "name" | "created_at" | "file_size";
  sort_dir: "asc" | "desc";
}

const DOCUMENT_SELECT = `SELECT d.id, d.name, d.file_type, d.file_size, d.folder_id, d.object_key, d.created_at,
                                u.id AS user_id, u.name AS user_name, u.email AS user_email
                         FROM documents d
                         JOIN users u ON u.id = d.created_by`;

const mapDocument = (row: DocumentRow): DocumentItem => ({
  id: row.id,
  name: row.name,
  file_type: row.file_type,
  file_size: row.file_size,
  folder_id: row.folder_id,
  file_url: row.object_key ? getPublicObjectUrl(row.object_key) : undefined,
  created_at: row.created_at.toISOString(),
  created_by: {
    id: row.user_id,
    name: row.user_name,
    email: row.user_email,
  },
});

export const listDocuments = async (
  query: ListDocumentsQuery,
): Promise<{ data: DocumentItem[]; pagination: PaginationMeta }> => {
  const whereClauses: string[] = [];
  const values: Array<string | number | null> = [];

  if (query.folder_id === undefined) {
    whereClauses.push("d.folder_id IS NULL");
  } else {
    whereClauses.push("d.folder_id = ?");
    values.push(query.folder_id);
  }

  if (query.search) {
    whereClauses.push("(LOWER(d.name) LIKE LOWER(?) OR LOWER(COALESCE(f.name, '')) LIKE LOWER(?))");
    values.push(`%${query.search}%`, `%${query.search}%`);
  }

  const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";
  const sortBy = query.sort_by;
  const sortDir = query.sort_dir.toUpperCase();
  const offset = (query.page - 1) * query.limit;

  const [countRows] = await dbPool.query<CountRow[]>(
    `SELECT COUNT(*) AS total
     FROM documents d
     LEFT JOIN folders f ON f.id = d.folder_id
     ${whereSql}`,
    values,
  );

  const [rows] = await dbPool.query<DocumentRow[]>(
    `${DOCUMENT_SELECT}
     LEFT JOIN folders f ON f.id = d.folder_id
     ${whereSql}
     ORDER BY d.${sortBy} ${sortDir}
     LIMIT ? OFFSET ?`,
    [...values, query.limit, offset],
  );

  const total = countRows[0]?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / query.limit));

  return {
    data: rows.map(mapDocument),
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages,
    },
  };
};

export const getDocumentsForFolder = async (folderId: number): Promise<DocumentItem[]> => {
  const [rows] = await dbPool.query<DocumentRow[]>(
    `${DOCUMENT_SELECT}
     WHERE d.folder_id = ?
     ORDER BY d.created_at DESC`,
    [folderId],
  );

  return rows.map(mapDocument);
};

export const getDocumentById = async (id: number): Promise<DocumentItem | null> => {
  const [rows] = await dbPool.query<DocumentRow[]>(
    `${DOCUMENT_SELECT} WHERE d.id = ?`,
    [id],
  );

  if (rows.length === 0) {
    return null;
  }

  return mapDocument(rows[0]);
};

export const createDocument = async (
  name: string,
  fileType: string,
  fileSize: number,
  folderId: number | null,
  objectKey: string | null = null,
  createdBy = 1,
): Promise<DocumentItem> => {
  const query = folderId === null 
    ? "SELECT id FROM documents WHERE name = ? AND folder_id IS NULL"
    : "SELECT id FROM documents WHERE name = ? AND folder_id = ?";
  const params = folderId === null ? [name] : [name, folderId];
  const [existing] = await dbPool.execute<RowDataPacket[]>(query, params);
  
  if (existing.length > 0) {
    throw new Error(`A document named "${name}" already exists here.`);
  }

  const [result] = await dbPool.execute<ResultSetHeader>(
    `INSERT INTO documents (name, file_type, file_size, folder_id, object_key, created_by)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [name, fileType, fileSize, folderId, objectKey, createdBy],
  );

  const created = await getDocumentById(result.insertId);
  if (!created) {
    throw new Error("Created document could not be loaded");
  }

  return created;
};

export const updateDocument = async (id: number, name: string): Promise<DocumentItem | null> => {
  const doc = await getDocumentById(id);
  if (!doc) return null;

  const query = doc.folder_id === null 
    ? "SELECT id FROM documents WHERE name = ? AND folder_id IS NULL AND id != ?"
    : "SELECT id FROM documents WHERE name = ? AND folder_id = ? AND id != ?";
  const params = doc.folder_id === null ? [name, id] : [name, doc.folder_id, id];
  const [existing] = await dbPool.execute<RowDataPacket[]>(query, params);
  
  if (existing.length > 0) {
    throw new Error(`A document named "${name}" already exists here.`);
  }

  await dbPool.execute("UPDATE documents SET name = ? WHERE id = ?", [name, id]);
  return getDocumentById(id);
};

export const deleteDocument = async (id: number): Promise<boolean> => {
  const [result] = await dbPool.execute<ResultSetHeader>("DELETE FROM documents WHERE id = ?", [id]);
  return result.affectedRows > 0;
};
