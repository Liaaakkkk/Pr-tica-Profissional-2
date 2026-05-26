const jwt = require("jsonwebtoken");

function auth(req, res, next) {

    // sessão
    if (req.session && req.session.usuario) {

        req.usuarioId = req.session.usuario.id;

        return next();
    }

    // token JWT
    const authHeader = req.headers.authorization;

    if (!authHeader) {

        return res.status(401).json({
            msg: "Token não fornecido"
        });

    }

    const partes = authHeader.split(" ");

    if (partes.length !== 2) {

        return res.status(401).json({
            msg: "Token inválido"
        });

    }

    const [bearer, token] = partes;

    if (bearer !== "Bearer") {

        return res.status(401).json({
            msg: "Token mal formatado"
        });

    }

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.usuarioId = decoded.id;

        return next();

    } catch (erro) {

        return res.status(401).json({
            msg: "Token inválido ou expirado"
        });

    }

}

module.exports = {
    auth
};