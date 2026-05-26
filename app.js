require("dotenv").config();

var express = require('express');
var path = require('path');
var session = require('express-session');
var cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var aboutRouter = require('./routes/about');
var dataRouter = require('./routes/data');
var signupRouter = require('./routes/signup');
var authRouter = require('./routes/auth');
var profileRouter = require('./routes/profile');
var loginRouter = require('./routes/login');
var flashcardsRouter = require('./routes/flashcards');

var connectDatabase = require('./database/db');

var app = express();

// =========================
// CONECTAR BANCO
// =========================
connectDatabase();

// =========================
// EJS
// =========================
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// =========================
// CORS
// =========================
const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {

  app.use(cors({
    origin: true,
    credentials: true
  }));

} else {

  app.use(cors());

}

// =========================
// PARSERS
// =========================
app.use(express.json());

app.use(express.urlencoded({
  extended: false
}));

// =========================
// ARQUIVOS PÚBLICOS
// =========================
app.use(express.static(
  path.join(__dirname, 'public')
));

// =========================
// TRUST PROXY
// =========================
app.set("trust proxy", 1);

// =========================
// SESSÃO
// =========================
app.use(session({

  name: 'fixly.sid',

  secret: process.env.SESSION_SECRET || "segredo",

  resave: false,

  saveUninitialized: false,

  proxy: true,

  cookie: {

    secure: isProduction,

    httpOnly: true,

    sameSite: isProduction ? 'none' : 'lax',

    maxAge: 10 * 365 * 24 * 60 * 60 * 1000

  }

}));

// =========================
// ROTAS
// =========================
app.use('/', indexRouter);

app.use('/about', aboutRouter);

app.use('/data', dataRouter);

app.use('/signup', signupRouter);

app.use('/auth', authRouter);

app.use('/profile', profileRouter);

app.use('/login', loginRouter);

app.use('/flashcards', flashcardsRouter);

app.use('/users', usersRouter);

// =========================
// 404
// =========================
app.use((req, res) => {

  res.status(404).send(
    'Página não encontrada - 404'
  );

});

// =========================
// EXPORT
// =========================
module.exports = app;