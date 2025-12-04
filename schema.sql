-- MySQL schema for Projeto Saboaria (generated)
CREATE DATABASE IF NOT EXISTS saboaria_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE saboaria_db;

CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) DEFAULT NULL,
  description TEXT,
  price DECIMAL(10,2) DEFAULT 0.00,
  image VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255),
  role ENUM('admin','user') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


  
  
  
  
  
  
  
  
USE saboaria_db;

-- Inserindo o Sabonete Oval Amarelo
INSERT INTO products (name, slug, description, price, image)
VALUES (
    'Sabonete Oval Artesanal Amarelo', 
    'sabonete-oval-amarelo', 
    'Sabonete artesanal em formato oval.', 
    15.90, 
    'oval.jpg'
);

-- Inserindo a Flor Pequena Azul
INSERT INTO products (name, slug, description, price, image)
VALUES (
    'Sabonete Flor Margarida Azul', 
    'sabonete-flor-margarida-azul', 
    'Ideal para lembrancinhas.', 
    5.50, 
    'flor-pequena.jpg'
);

-- Inserindo o Sabonete Retangular Roxo (na embalagem)
INSERT INTO products (name, slug, description, price, image)
VALUES (
    'Sabonete Retangular Lavanda', 
    'sabonete-retangular-lavanda', 
    'Sabonete artesanal retangular.', 
    12.00, 
    'quadrado.jpg'
);

-- Inserindo o Ursinho Azul
INSERT INTO products (name, slug, description, price, image)
VALUES (
    'Sabonete Ursinho Azul', 
    'sabonete-ursinho-azul', 
    'Sabonete infantil em formato de ursinho.', 
    8.90, 
    'urso.jpg'
);

-- Inserindo o Oval Verde Texturizado
INSERT INTO products (name, slug, description, price, image)
VALUES (
    'Sabonete Oval Verde Texturizado', 
    'sabonete-oval-verde', 
    'Sabonete oval.', 
    16.50, 
    'oval-desenho.jpg'
);

-- Inserindo o Trio de Cubos Coloridos
INSERT INTO products (name, slug, description, price, image)
VALUES (
    'Kit Trio Cubos Coloridos', 
    'kit-trio-cubos', 
    'Conjunto com 3 mini sabonetes em formato de cubo.', 
    18.00, 
    'quadradinho-desenho.jpg'
);

SELECT id, name, price, image 
FROM products;

SELECT * FROM products;