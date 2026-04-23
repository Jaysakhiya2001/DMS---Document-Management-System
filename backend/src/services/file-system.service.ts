import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { dbPool } from "../config/db";
import { getPublicObjectUrl } from "../config/minio";
import type { PaginationMeta, FileSystemItem, User } from "../types/index";

interface CountRow extends RowDataPacket {
  total: number;
}

export interface ListItemsQuery {
  page: number;
  limit: number;
  folder_id?: number;
  search?: string;
  sort_by: string;
  sort_dir: "asc" | "desc";
}

export const listFileSystemItems = async (
  query: ListItemsQuery,
): Promise<{ data: FileSystemItem[]; pagination: PaginationMeta }> => {
  const isRoot = query.folder_id === undefined;
  const parentParam = isRoot ? "IS NULL" : "= ?";
  const params: any[] = [];
  
  if (!isRoot) {
    params.push(query.folder_id);
    params.push(query.folder_id);
  }

  let searchConditionF = "";
  let searchConditionD = "";
  if (query.search) {
    searchConditionF = " AND LOWER(f.name) LIKE LOWER(?)";
    searchConditionD = " AND LOWER(d.name) LIKE LOWER(?)";
    const likeSearch = `%${query.search}%`;
    params.splice(isRoot ? 0 : 1, 0, likeSearch);
    params.push(likeSearch);
  }

  const offset = (query.page - 1) * query.limit;

  const countQuery = `
    SELECT SUM(total) as total FROM (
      SELECT COUNT(*) as total FROM folders f WHERE f.parent_id ${parentParam}${searchConditionF}
      UNION ALL
      SELECT COUNT(*) as total FROM documents d WHERE d.folder_id ${parentParam}${searchConditionD}
    ) as counts
  `;

  const [countRows] = await dbPool.query<CountRow[]>(countQuery, params);
  const total = countRows[0]?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / query.limit));

  const itemsQuery = `
    (
      SELECT f.id, f.name, f.created_by, f.created_at, 'folder' as type, NULL as file_size, NULL as file_type, NULL as object_key,
             u.id AS user_id, u.name AS user_name, u.email AS user_email
      FROM folders f
      JOIN users u ON u.id = f.created_by
      WHERE f.parent_id ${parentParam}${searchConditionF}
    )
    UNION ALL
    (
      SELECT d.id, d.name, d.created_by, d.created_at, 'document' as type, d.file_size, d.file_type, d.object_key,
             u.id AS user_id, u.name AS user_name, u.email AS user_email
      FROM documents d
      JOIN users u ON u.id = d.created_by
      WHERE d.folder_id ${parentParam}${searchConditionD}
    )
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?
  `;

  const [rows] = await dbPool.query<RowDataPacket[]>(itemsQuery, [...params, query.limit, offset]);

  const data: FileSystemItem[] = rows.map((row: any) => ({
    id: row.id,
    name: row.name,
    type: row.type,
    file_size: row.file_size,
    file_type: row.file_type,
    file_url: row.object_key ? getPublicObjectUrl(row.object_key) : undefined,
    created_at: row.created_at.toISOString(),
    created_by: {
      id: row.user_id,
      name: row.user_name,
      email: row.user_email,
    },
  }));

  return {
    data,
    pagination: {
      page: query.page,
      limit: query.limit,
      total: Number(total),
      totalPages,
    },
  };
};
