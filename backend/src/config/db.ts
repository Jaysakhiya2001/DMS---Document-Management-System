import mysql from "mysql2/promise";

export const dbPool = mysql.createPool({
  host: process.env.DB_HOST ?? "localhost",
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER ?? "root",
  password: process.env.DB_PASSWORD ?? "",
  database: process.env.DB_NAME ?? "vistra_dms",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const testDbConnection = async () => {
  const connection = await dbPool.getConnection();
  connection.release();
};
