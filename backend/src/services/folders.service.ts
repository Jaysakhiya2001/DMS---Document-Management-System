import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { dbPool } from "../config/db";
import type { Folder } from "../types/index";

interface FolderRow extends RowDataPacket {
  id: number;
  name: string;
  parent_id: number | null;
  created_at: Date;
  user_id: number;
  user_name: string;
  user_email: string;
}

const mapFolder = (row: FolderRow): Folder => ({
  id: row.id,
  name: row.name,
  parent_id: row.parent_id,
  created_at: row.created_at.toISOString(),
  created_by: {
    id: row.user_id,
    name: row.user_name,
    email: row.user_email,
  },
});

export const getRootFolders = async (): Promise<Folder[]> => {
  const [rows] = await dbPool.query<FolderRow[]>(
    `SELECT f.id, f.name, f.parent_id, f.created_at, u.id AS user_id, u.name AS user_name, u.email AS user_email
     FROM folders f
     JOIN users u ON u.id = f.created_by
     WHERE f.parent_id IS NULL
     ORDER BY f.created_at DESC`,
  );

  return rows.map(mapFolder);
};

export const getFolderById = async (id: number): Promise<Folder | null> => {
  const [rows] = await dbPool.query<FolderRow[]>(
    `SELECT f.id, f.name, f.parent_id, f.created_at, u.id AS user_id, u.name AS user_name, u.email AS user_email
     FROM folders f
     JOIN users u ON u.id = f.created_by
     WHERE f.id = ?`,
    [id],
  );

  if (rows.length === 0) {
    return null;
  }

  return mapFolder(rows[0]);
};

export const getSubFolders = async (parentId: number): Promise<Folder[]> => {
  const [rows] = await dbPool.query<FolderRow[]>(
    `SELECT f.id, f.name, f.parent_id, f.created_at, u.id AS user_id, u.name AS user_name, u.email AS user_email
     FROM folders f
     JOIN users u ON u.id = f.created_by
     WHERE f.parent_id = ?
     ORDER BY f.created_at DESC`,
    [parentId],
  );

  return rows.map(mapFolder);
};

export const createFolder = async (name: string, parentId: number | null, createdBy = 1): Promise<Folder> => {
  const query = parentId === null 
    ? "SELECT id FROM folders WHERE name = ? AND parent_id IS NULL"
    : "SELECT id FROM folders WHERE name = ? AND parent_id = ?";
  const params = parentId === null ? [name] : [name, parentId];
  const [existing] = await dbPool.execute<RowDataPacket[]>(query, params);
  
  if (existing.length > 0) {
    throw new Error(`A folder named "${name}" already exists here.`);
  }

  const [result] = await dbPool.execute<ResultSetHeader>(
    "INSERT INTO folders (name, parent_id, created_by) VALUES (?, ?, ?)",
    [name, parentId, createdBy],
  );

  const folder = await getFolderById(result.insertId);
  if (!folder) {
    throw new Error("Created folder could not be loaded");
  }

  return folder;
};

export const updateFolder = async (id: number, name: string): Promise<Folder | null> => {
  const folder = await getFolderById(id);
  if (!folder) return null;

  const query = folder.parent_id === null 
    ? "SELECT id FROM folders WHERE name = ? AND parent_id IS NULL AND id != ?"
    : "SELECT id FROM folders WHERE name = ? AND parent_id = ? AND id != ?";
  const params = folder.parent_id === null ? [name, id] : [name, folder.parent_id, id];
  const [existing] = await dbPool.execute<RowDataPacket[]>(query, params);
  
  if (existing.length > 0) {
    throw new Error(`A folder named "${name}" already exists here.`);
  }

  await dbPool.execute("UPDATE folders SET name = ? WHERE id = ?", [name, id]);
  return getFolderById(id);
};

/**
 * Gets all subfolder IDs recursively
 */
const getRecursiveSubFolderIds = async (id: number): Promise<number[]> => {
  const ids: number[] = [id];
  const [rows] = await dbPool.query<RowDataPacket[]>("SELECT id FROM folders WHERE parent_id = ?", [id]);
  
  for (const row of rows) {
    const subIds = await getRecursiveSubFolderIds(row.id);
    ids.push(...subIds);
  }
  
  return ids;
};

export const deleteFolder = async (id: number, mode: "cascade" | "move" = "move"): Promise<boolean> => {
  const allFolderIds = mode === "cascade" ? await getRecursiveSubFolderIds(id) : [];
  
  const conn = await dbPool.getConnection();
  await conn.beginTransaction();
  try {
    let affectedRows = 0;
    if (mode === "cascade") {
      if (allFolderIds.length > 0) {
        await conn.query("DELETE FROM documents WHERE folder_id IN (?)", [allFolderIds]);
      }
      const [result] = await conn.execute<ResultSetHeader>("DELETE FROM folders WHERE id = ?", [id]);
      affectedRows = result.affectedRows;
    } else {
      await conn.execute("UPDATE folders SET parent_id = NULL WHERE parent_id = ?", [id]);
      await conn.execute("UPDATE documents SET folder_id = NULL WHERE folder_id = ?", [id]);
      const [result] = await conn.execute<ResultSetHeader>("DELETE FROM folders WHERE id = ?", [id]);
      affectedRows = result.affectedRows;
    }
    await conn.commit();
    return affectedRows > 0;
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};
