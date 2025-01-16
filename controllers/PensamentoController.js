const Pensamento = require("../models/Pensamento");
const User = require("../models/User");

module.exports = class PensamentoController {
  static async showPensamentos(req, res) {
    const pensamentos = Pensamento.findAll();
    try {
      res.render("pensamentos/home", { pensamentos });
    } catch (err) {
      res
        .status(400)
        .send("Erro ao tentar acessar o painel. Por favor tenta mais tarde!");
    }
  }

  static async addPensamento(req, res) {
    const title = req.body.title;
    const UserId = req.session.userid;
    try {
      await Pensamento.create({ title, UserId });
      req.flash("message", "Pesamento criado com sucesso.");
      req.session.save(() => {
        res.redirect("/painel/painel");
      });
    } catch (err) {
      console.log(err);
    }
  }

  static async deletePensamento(req, res) {
    const id = req.body.id;
    const UserId = req.session.userid;
    try {
      await Pensamento.destroy({ where: { id, UserId } });
      req.flash("message", "Pensamento apagado.");
      // res.render("painel/painel");
      req.session.save(()=>{
        res.redirect('/painel/painel')
      })
    } catch (err) {
      req.flash("message", "Erro ao tentar apagar pensamento.");
      res.render("painel/painel");
    }
  }
};
