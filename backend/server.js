const express = require("express");
const cors = require("cors");
const path = require("path");

const db = require("./database");

const app = express();

// ========================================
// CONFIGURAÇÕES
// ========================================

const PORT = process.env.PORT || 3000;

// ========================================
// MIDDLEWARES
// ========================================

app.use(cors());

app.use(express.json());

// ========================================
// SERVIR O FRONTEND
// ========================================

app.use(express.static(path.join(__dirname, "..")));

// ========================================
// ROTA PRINCIPAL
// ========================================

app.get("/", function (req, res) {
    res.sendFile(
        path.join(__dirname, "..", "index.html")
    );
});

// ========================================
// LISTAR RESERVAS
// ========================================

app.get("/reservas", function (req, res) {

    const reservas = db
        .prepare("SELECT * FROM reservas")
        .all();

    res.json(reservas);

});

// ========================================
// CRIAR RESERVA
// ========================================

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

    try {

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

    } catch (erro) {

        console.error("Erro ao criar reserva:", erro);

        res.status(500).json({
            erro: "Não foi possível criar a reserva."
        });

    }

});

// ========================================
// INICIAR SERVIDOR
// ========================================

app.listen(
    PORT,
    "0.0.0.0",
    function () {

        console.log(
            `Servidor rodando na porta ${PORT}`
        );

    }
);
