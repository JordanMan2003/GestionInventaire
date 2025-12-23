import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";
import dotenv from "dotenv";
dotenv.config();

const connection = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USERNAME || "manoel_user",
  password: process.env.DB_PASSWORD || "manoel12345",
  database: process.env.DB_NAME || "InventoryDB",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const db = drizzle(connection, { schema, mode: "default" });

export const testConnection = async (): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    // Run a simple query to ensure everything is working
    await connection.query("SELECT 1");
    const [databases] = await connection.query("SHOW DATABASES LIKE ?", [
      "InventoryDB",
    ]);
    if (Array.isArray(databases) && databases.length === 0) {
      throw new Error("Database InventoryDB does not exist");
    }
    // Todos table existence check
    const [tables] = await connection.query("SHOW TABLES LIKE ?", ["users"]);
    if (Array.isArray(tables) && tables.length === 0) {
      throw new Error("Table users does not exist in the database");
    }
    console.log("Database connection successful and users table exists.");
    return { success: true };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown database error";
    console.error("Database connection failed:", errorMessage);
    return { success: false, error: errorMessage };
  }
};
