const express = require("express");
const router = express.Router();
const PensamentoController = require("../controllers/PensamentoController");

const checkAuth = require("../helpers/auth").checkAuth;

router.get("/", checkAuth ,PensamentoController.showPensamentos);
router.post("/add", checkAuth, PensamentoController.addPensamento);
router.post('/delete', checkAuth, PensamentoController.deletePensamento)
router.post('/update',checkAuth, PensamentoController.updatePensamento)

module.exports = router;
