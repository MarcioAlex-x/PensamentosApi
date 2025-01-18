const User = require("../models/User");
const Pensamento = require("../models/Pensamento");
const { raw } = require("express");

module.exports = class PainelController {
  static async showPainel(req, res) {
    const userId = req.session.userid;
    const user = await User.findOne({
      where: {
        id: userId,
      },
      include: Pensamento,
      plain: true,
    });
    if (!user) {
      res.redirect("auth/login");
    }

    const pensamentos = user.Pensamentos.map((data) => data.dataValues);
    // console.log(pensamentos)
    let semPensamentos = false;

    if (pensamentos.length === 0) {
      semPensamentos = true;
    }

    try {
      res.render("painel/painel", { pensamentos, semPensamentos });
    } catch (err) {
      res.send("Erro ao tentar acessar o painel. Por favor tenta mais tarde!");
    }
  }

  static createPainel(req, res) {
    try {
      res.render("painel/create");
    } catch (err) {
      req.flash(
        "message",
        "Ocorreu um erro inesperado, Favor tentar mais tarde!"
      );
      res.render("/");
    }
  }
  
  static async updatePainel(req, res){
    const id = req.params.id
    try{
      const pensamento = await Pensamento.findOne({ where:{ id } })
      res.render('painel/update', { pensamento, raw: true })
      console.log(pensamento)
      
    }catch(err){
      console.log('Erro: ', err)
    }
    
    
  }
};
