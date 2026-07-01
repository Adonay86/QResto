const mysql = require("mysql2/promise");

let pool = null;
let activo = false;

function getConfig() {
  return {
    host: process.env.MYSQL_HOST || "localhost",
    port: Number(process.env.MYSQL_PORT || 3306),
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "",
    database: process.env.MYSQL_DATABASE || "qresto",
    waitForConnections: true,
    connectionLimit: 10,
  };
}

async function init() {
  if (process.env.MYSQL_DISABLED === "1") {
    console.log("  MySQL: desactivado (MYSQL_DISABLED=1), usando JSON");
    return false;
  }

  try {
    pool = mysql.createPool(getConfig());
    await pool.query("SELECT 1");
    activo = true;
    console.log("  MySQL: conectado a", getConfig().database);
    return true;
  } catch (err) {
    console.log("  MySQL: no disponible, usando JSON —", err.message);
    pool = null;
    activo = false;
    return false;
  }
}

function enabled() {
  return activo && !!pool;
}

async function query(sql, params = []) {
  if (!enabled()) throw new Error("MySQL no está activo");
  const [rows] = await pool.execute(sql, params);
  return rows;
}

async function cerrar() {
  if (pool) {
    await pool.end();
    pool = null;
    activo = false;
  }
}

module.exports = { init, enabled, query, cerrar, getConfig };
