const Pensamento = require("../models/Pensamento");
const User = require("../models/User");

const { Op } = require('sequelize')

module.exports = class PensamentoController {
  static async showPensamentos(req, res) {
    let search = "";
    if (req.query.search) {
      search = req.query.search;
    }

    let order = 'DESC'

    if(req.query.order === 'old'){
      order = 'ASC'
    }else{
      order = 'DESC'
    }

    const pensamentosData = await Pensamento.findAll({
      include: User,
      where:{
        title:{[Op.like]:`%${search}%`},
      },
      order:[['createdAt', order]]
    });
    const pensamentos = pensamentosData.map((result) =>
      result.get({ plain: true })
    );

    let pensamentosQtd = pensamentos.length
    if(pensamentosQtd === 0){
      pensamentosQtd = false
    }
    // console.log(pensamentos)
    try {
      res.render("pensamentos/home", { pensamentos, search, pensamentosQtd });
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
      req.session.save(() => {
        res.redirect("/painel/painel");
      });
    } catch (err) {
      req.flash("message", "Erro ao tentar apagar pensamento.");
      res.render("painel/painel");
    }
  }

  static async updatePensamento(req, res) {
    const id = req.body.id;
    const pensamento = { title: req.body.title };

    if (id && pensamento) {
      try {
        await Pensamento.update(pensamento, { where: { id } });
        req.flash("message", "Pensamento atualizado com sucesso.");
        req.session.save(() => {
          res.redirect("/painel/painel");
        });
      } catch (err) {
        console.log(err.message);
        return;
      }
    } else {
      console.log("Os dados não foram encontrados");
    }
  }
};
