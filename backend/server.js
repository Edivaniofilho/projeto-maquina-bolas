const express = require("express");
const cors = require("cors");
const db = require("./database");

const app = express();

const PORT = 3000;
app.use(cors());


// PERMITIR JSON

app.use(express.json());


// ROTA PRINCIPAL

app.get("/", function (req, res) {

    res.send("Servidor da Máquina de Bolas funcionando!");

});


// LISTAR RESERVAS

app.get("/reservas", function (req, res) {

    const reservas = db
        .prepare("SELECT * FROM reservas")
        .all();

    res.json(reservas);

});


// CRIAR RESERVA

app.post("/reservas", function (req, res) {

    const {
        nome,
        whatsapp,
        local,
        data,
        horario,
        duracao,
        preco
    } = req.body;


    const resultado = db.prepare(`
        INSERT INTO reservas (
            nome,
            whatsapp,
            local,
            data,
            horario,
            duracao,
            preco
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
        nome,
        whatsapp,
        local,
        data,
        horario,
        duracao,
        preco
    );


    res.json({
        mensagem: "Reserva criada com sucesso!",
        id: resultado.lastInsertRowid
    });

});


// INICIAR SERVIDOR

app.listen(PORT, function () {

    console.log(`Servidor rodando em http://localhost:${PORT}`);

});

