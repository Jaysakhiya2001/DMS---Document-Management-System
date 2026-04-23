import { dbPool } from "./db";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS migrations (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  executed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS folders (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  parent_id INT UNSIGNED NULL DEFAULT NULL,
  created_by INT UNSIGNED NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_folder_parent FOREIGN KEY (parent_id) REFERENCES folders(id) ON DELETE CASCADE,
  CONSTRAINT fk_folder_creator FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS documents (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  file_type VARCHAR(50) NOT NULL,
  file_size INT UNSIGNED NOT NULL DEFAULT 0,
  folder_id INT UNSIGNED NULL DEFAULT NULL,
  object_key VARCHAR(500) NULL DEFAULT NULL,
  created_by INT UNSIGNED NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_doc_folder FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE SET NULL,
  CONSTRAINT fk_doc_creator FOREIGN KEY (created_by) REFERENCES users(id)
);
`;

const INDEXES_SQL = [
  "ALTER TABLE documents ADD COLUMN IF NOT EXISTS object_key VARCHAR(500) NULL DEFAULT NULL",
  "ALTER TABLE documents ADD FULLTEXT INDEX IF NOT EXISTS ft_doc_name (name)",
  "ALTER TABLE folders ADD FULLTEXT INDEX IF NOT EXISTS ft_fold_name (name)",
  "CREATE INDEX IF NOT EXISTS idx_doc_folder ON documents(folder_id)",
  "CREATE INDEX IF NOT EXISTS idx_fold_parent ON folders(parent_id)"
];

const SEED_SQL = [
  "INSERT IGNORE INTO users (id, name, email) VALUES (1, 'Admin User', 'admin@vistra.local')",
  "INSERT IGNORE INTO folders (id, name, parent_id, created_by) VALUES (1, 'Finance', NULL, 1), (2, 'Legal', NULL, 1), (3, 'Q1 Reports', 1, 1)",
  "INSERT IGNORE INTO documents (name, file_type, file_size, folder_id, created_by) VALUES ('Root Notes', 'txt', 1200, NULL, 1), ('Tax Filing 2025', 'pdf', 285400, 1, 1), ('Board Minutes', 'docx', 98500, 2, 1), ('Revenue Overview', 'xlsx', 66400, 3, 1)"
];

export const initializeDatabase = async () => {
  console.log("Checking database initialization...");
  
  const connection = await dbPool.getConnection();
  try {
    // 1. Create tables one by one (simplified for this exercise)
    const statements = SCHEMA_SQL.split(";").filter(s => s.trim() !== "");
    for (const statement of statements) {
      await connection.execute(statement);
    }

    // 2. Add fulltext indexes (ignore errors if they exist)
    for (const idx of INDEXES_SQL) {
      try {
        await connection.execute(idx);
      } catch (e) {
        // Silently skip if index already exists or table is being modified
      }
    }

    // 3. Check if seeding is needed
    const [rows] = await connection.execute<RowDataPacket[]>(
      "SELECT id FROM migrations WHERE name = 'initial_seed'"
    );

    if (rows.length === 0) {
      console.log("Running initial seed data...");
      for (const seed of SEED_SQL) {
        await connection.execute(seed);
      }
      await connection.execute(
        "INSERT INTO migrations (name) VALUES ('initial_seed')"
      );
      console.log("Seeding completed.");
    } else {
      console.log("Database already seeded.");
    }
    
  } finally {
    connection.release();
  }
};
