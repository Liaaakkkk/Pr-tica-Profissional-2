const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");

const Flashcard = require("../models/Flashcard");

const { auth } = require("../middlewares/middleware");

// =========================
// PÁGINA EJS
// =========================
router.get("/", (req, res) => {
    res.render("flashcards");
});

// =========================
// FUNÇÃO AUXILIAR
// sessão OU JWT
// =========================
function obterUsuarioId(req) {

    // sessão
    if (req.session && req.session.usuario) {
        return req.session.usuario.id;
    }

    // token JWT
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {

        try {

            const token = authHeader.split(" ")[1];

            const decodificado = jwt.verify(
                token,
                process.env.JWT_SECRET
            );

            return decodificado.id;

        } catch (erro) {

            console.log(
                "Erro ao decodificar token:",
                erro.message
            );

            return null;
        }
    }

    return null;
}

// =========================
// CRIAR FLASHCARD
// =========================
router.post("/", auth, async (req, res) => {

    console.log("Dados recebidos:", req.body);

    try {

        const { pergunta, resposta, materia } = req.body;

        const donoDoCard = obterUsuarioId(req);

        if (!donoDoCard) {

            return res.status(401).json({
                msg: "Você precisa estar logado"
            });

        }

        const novoFlashcard = new Flashcard({
            pergunta,
            resposta,
            materia: materia || "Geral",
            usuarioId: donoDoCard
        });

        await novoFlashcard.save();

        return res.status(201).json({
            sucesso: true,
            msg: "Flashcard salvo com sucesso!"
        });

    } catch (erro) {

        console.log(erro);

        return res.status(500).json({
            sucesso: false,
            erro: erro.message
        });

    }

});

// =========================
// LISTAR FLASHCARDS
// =========================
router.get("/dados", auth, async (req, res) => {

    try {

        const donoDoCard = obterUsuarioId(req);

        if (!donoDoCard) {

            return res.status(401).json({
                msg: "Você precisa estar logado"
            });

        }

        const flashcards = await Flashcard.find({
            usuarioId: donoDoCard
        });

        return res.json(flashcards);

    } catch (erro) {

        return res.status(500).json({
            erro: erro.message
        });

    }

});

module.exports = router;