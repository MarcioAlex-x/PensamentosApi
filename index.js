// pacotes
const express = require("express");
const exphbs = require("express-handlebars");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const flash = require("express-flash");
// const core = reaquire('core')

// Models
const Pesnamento = require("./models/Pensamento");
const User = require("./models/User");

// Rotas
const pensamentosRoutes = require("./routes/pensamentosRoutes");
const authRoutes = require("./routes/authRoutes");
const painelRoutes = require("./routes/painelRoutes");

// inicialização do app
const app = express();

// app.use(core())
// conexão
const conn = require("./db/conn");
const PensamentoController = require("./controllers/PensamentoController");

// engine
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");

// middlewares
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());
app.use(
  session({
    name: "session",
    secret: "SECRET", //colocar em local seguro
    resave: false,
    saveUninitialized: false,
    store: new FileStore({
      logFn: function () {},
      path: require("path").join(require("os").tmpdir(), "sessions"),
    }),
    cookie: {
      secure: false,
      maxAge: 60 * 60 * 24 * 1000,
      expires: new Date(Date.now() + 60 * 60 * 24 * 1000),
      httpOnly: true,
    },
  })
);
app.use(flash());
app.use(express.static("public"));
// middleware para localizar a sessão do usuário
app.use((req, res, next) => {
  if (req.session.userid) {
    res.locals.session = req.session;
  }
  next();
});

app.use("/pensamentos", pensamentosRoutes);
app.use("/painel", painelRoutes);
app.use("/", authRoutes);
app.get("/", PensamentoController.showPensamentos);

// servidor
conn
  .sync({ force: false })
  .then(() => {
    app.listen(3000, () => {
      console.log("Conectado em http://localhost:3000");
    });
  })
  .catch((err) => {
    console.log("Erro ", err.message);
  });
