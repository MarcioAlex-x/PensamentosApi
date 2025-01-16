const express = require('express')
const router = express.Router()

const PainelController = require('../controllers/PainelController')

const checkAuth = require('../helpers/auth').checkAuth

router.get('/painel',checkAuth ,PainelController.showPainel)
router.get('/create',checkAuth, PainelController.createPainel)

module.exports = router
