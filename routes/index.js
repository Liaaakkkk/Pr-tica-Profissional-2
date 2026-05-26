var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  // Pega o usuário direto da sessão do servidor (mude 'usuario' se a sua variável de sessão tiver outro nome)
  var usuarioLogado = req.session && req.session.usuario ? req.session.usuario : undefined;

  res.render('index', { 
    title: 'Home', 
    usuario: usuarioLogado // 👈 Enviando o usuário para o EJS saber se você está logado!
  });
});

module.exports = router;