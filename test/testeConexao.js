// Importa a biblioteca mysql2
const mysql = require("mysql2");

// Cria a conexão simples
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root1234!",
  database: "saboaria_db"
});

// Tenta conectar
connection.connect(err => {
  if (err) {
    console.error("Erro ao conectar:", err.message);
    return;
  }
  console.log("✅ Conectado ao MySQL com sucesso!");
  connection.end(); // encerra a conexão
});