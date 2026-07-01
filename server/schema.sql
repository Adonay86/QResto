-- QResto — esquema MySQL
-- Ejecutar: npm run db:init

CREATE DATABASE IF NOT EXISTS qresto CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE qresto;

CREATE TABLE IF NOT EXISTS local (
  id INT PRIMARY KEY DEFAULT 1,
  nombre VARCHAR(255) NOT NULL DEFAULT 'Bar La Terraza',
  subtitulo VARCHAR(255) NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS categorias (
  id VARCHAR(50) PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  icono VARCHAR(10) NOT NULL DEFAULT '',
  orden INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  categoria_id VARCHAR(50) NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10, 2) NOT NULL,
  imagen TEXT,
  agotado TINYINT(1) NOT NULL DEFAULT 0,
  alergenos JSON,
  FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);

CREATE TABLE IF NOT EXISTS ventas_registros (
  id INT PRIMARY KEY,
  mesa INT NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  estado VARCHAR(20) NOT NULL DEFAULT 'pendiente',
  creado_en DATETIME NOT NULL,
  pagado_en DATETIME NULL,
  INDEX idx_ventas_fecha (creado_en)
);

CREATE TABLE IF NOT EXISTS ventas_lineas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  registro_id INT NOT NULL,
  producto_id INT NULL,
  nombre VARCHAR(255) NOT NULL,
  cantidad INT NOT NULL,
  precio DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (registro_id) REFERENCES ventas_registros(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ventas_meta (
  clave VARCHAR(50) PRIMARY KEY,
  valor VARCHAR(255) NOT NULL
);
