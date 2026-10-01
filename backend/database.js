const Database = require("better-sqlite3");

const db = new Database("reservas.db");

console.log("Banco de dados conectado!");


// CRIAR TABELA DE RESERVAS

db.prepare(`
    CREATE TABLE IF NOT EXISTS reservas (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        nome TEXT NOT NULL,

        whatsapp TEXT NOT NULL,

        local TEXT NOT NULL,

        data TEXT NOT NULL,

        horario TEXT NOT NULL,

        duracao INTEGER NOT NULL,

        preco REAL NOT NULL

    )
`).run();

console.log("Tabela de reservas pronta!");


module.exports = db;