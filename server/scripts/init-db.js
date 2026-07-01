/**
 * Inicializa la base de datos MySQL y carga datos demo desde JSON.
 * Uso: npm run db:init
 */
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");

const SCHEMA_PATH = path.join(__dirname, "..", "schema.sql");
const CARTA_PATH = path.join(__dirname, "..", "data", "carta-demo.json");
const LOCAL_PATH = path.join(__dirname, "..", "data", "local.json");

async function main() {
  const config = {
    host: process.env.MYSQL_HOST || "localhost",
    port: Number(process.env.MYSQL_PORT || 3306),
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "",
    multipleStatements: true,
  };

  console.log("\n  QResto — inicializar MySQL\n");

  const conn = await mysql.createConnection(config);
  const schema = fs.readFileSync(SCHEMA_PATH, "utf8");
  await conn.query(schema);

  const dbName = process.env.MYSQL_DATABASE || "qresto";
  await conn.changeUser({ database: dbName });

  const carta = JSON.parse(fs.readFileSync(CARTA_PATH, "utf8"));
  let local = { nombre: "Bar La Terraza", subtitulo: "Cocina canaria · Puerto de la Cruz" };
  try {
    local = JSON.parse(fs.readFileSync(LOCAL_PATH, "utf8"));
  } catch {
    /* usar default */
  }

  await conn.query("DELETE FROM ventas_lineas");
  await conn.query("DELETE FROM ventas_registros");
  await conn.query("DELETE FROM productos");
  await conn.query("DELETE FROM categorias");
  await conn.query("DELETE FROM local");

  await conn.query("INSERT INTO local (id, nombre, subtitulo) VALUES (1, ?, ?)", [
    local.nombre,
    local.subtitulo || "",
  ]);

  for (let i = 0; i < carta.categorias.length; i++) {
    const c = carta.categorias[i];
    await conn.query(
      "INSERT INTO categorias (id, nombre, icono, orden) VALUES (?, ?, ?, ?)",
      [c.id, c.nombre, c.icono || "", i]
    );
  }

  for (const p of carta.productos) {
    await conn.query(
      `INSERT INTO productos (id, categoria_id, nombre, descripcion, precio, imagen, agotado, alergenos)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        p.id,
        p.categoria,
        p.nombre,
        p.descripcion || "",
        p.precio,
        p.imagen || "",
        p.agotado ? 1 : 0,
        JSON.stringify(p.alergenos || []),
      ]
    );
  }

  await conn.end();
  console.log("  Base de datos lista:", dbName);
  console.log("  Productos cargados:", carta.productos.length);
  console.log("\n  Arranca el servidor con: npm start\n");
}

main().catch((err) => {
  console.error("\n  Error:", err.message);
  console.error("  ¿Tienes MySQL instalado y encendido?\n");
  process.exit(1);
});
