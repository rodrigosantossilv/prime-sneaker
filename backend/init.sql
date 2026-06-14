CREATE DATABASE IF NOT EXISTS prime_sneaker CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE prime_sneaker;

CREATE TABLE IF NOT EXISTS admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL DEFAULT 'Administrador',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  brand VARCHAR(100) NOT NULL,
  category VARCHAR(100) DEFAULT 'geral',
  image_url TEXT,
  images JSON,
  price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  old_price DECIMAL(10,2),
  promocao TINYINT(1) DEFAULT 0,
  destaque TINYINT(1) DEFAULT 0,
  badge VARCHAR(100),
  active TINYINT(1) DEFAULT 1,
  rating DECIMAL(3,1) DEFAULT 0.0,
  reviews INT DEFAULT 0,
  sales INT DEFAULT 0,
  installments INT DEFAULT 1,
  mercado_link TEXT,
  material VARCHAR(255),
  conforto VARCHAR(255),
  indicacao VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Exemplo de administrador.
INSERT IGNORE INTO admin_users (email, password, name)
VALUES ('admin@tenisprime.com', 'admin123', 'Administrador');
