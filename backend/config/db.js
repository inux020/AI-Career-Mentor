const mysql = require("mysql2/promise");

const config = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "ai_career_mentor",
  port: Number(process.env.DB_PORT || 3306),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

let pool;

try {
  pool = mysql.createPool(config);
} catch (error) {
  pool = null;
}

async function getDb() {
  if (!pool) {
    throw new Error("Database is not configured. Using fallback in-memory auth for now.");
  }
  return pool;
}

module.exports = { getDb };
