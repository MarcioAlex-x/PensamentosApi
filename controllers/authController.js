const User = require("../models/User");
const bcrypt = require("bcryptjs");
module.exports = class auhtController {
  // Login
  static login(req, res) {
    res.render("auth/login");
  }

  // Register
  static register(req, res) {
    res.render("auth/register");
  }

  static async createUser(req, res) {
    const { name, email, password, confirmpassword } = req.body;
    const newUser = async () => {
      // validar campos
      if (!name || !email || !password || !confirmpassword) {
        req.flash("message", "Todos os campos são obrigatórios");
        return res.status(400).render("auth/register");
      }
      //   criptografar senha
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);
      const existingEmail = await User.findOne({ where: { email } });
      const existingName = await User.findOne({ where: { name } });

      //   validar confirmação de senha
      if (password !== confirmpassword) {
        req.flash("message", "As senhas não conferem. Tente novamente!");
        return res.status(400).render("auth/register");
      }
      //   Vaerifica se já tem nome registrado
      if (existingName) {
        req.flash("message", "Nome de usuário já cadastrado.");
        return res.status(400).render("auth/register");
      }
      //   Verifica se já tem o email cadastrado
      if (existingEmail) {
        req.flash("message", "Email já cadastrado.");
        return res.status(400).render("auth/register");
      }

      const user = {
        name,
        email,
        password: hashedPassword,
      };

      try {
        const createdUser = await User.create(user);
        // inicializa a sessão
        req.session.userid = createdUser.id;

        req.flash("message", "Usuário cadastrado com sucesso.");

        // salva a sessão com o usuário registrado
        req.session.save(() => {
          res.redirect("/");
        });
      } catch (err) {
        req.flash(
          "message",
          "Algo deu errado. Favor tentar novamente mais tarde!"
        );
        return res.status(500).render("auth/register");
        // console.log(err);
      }
    };
    newUser();
  }

  static logout(req, res) {
    req.flash("message", "Saída do sistema realizada.");
    try {
      req.session.destroy();
      res.redirect("/login");
    } catch (err) {
      req.flash("Aconteceu um erro ao tentar sair do sistema.");
      res.render("/");
    }
  }

  static async loginPost(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      req.flash("message", "Usuário não encontrado.");
      res.render("auth/login");

      return;
    }

    const decodedPassword = bcrypt.compareSync(password, user.password);

    if (!decodedPassword) {
      req.flash("message", " Senha inválida.");
      res.render("auth/login");

      return;
    }

    try {
      req.session.userid = user.id;

      req.flash("message", "Autenticação realizada com sucesso.");

      req.session.save(() => {
        res.redirect("/");
      });
    } catch (err) {
      req.flas('message','Ocorreu um erro inesperado. Favor tente outra vez mais tarde!')
      res.render('auth/login')
    }
  }
};
