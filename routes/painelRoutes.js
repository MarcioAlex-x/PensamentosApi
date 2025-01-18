const express = require('express')
const router = express.Router()

const PainelController = require('../controllers/PainelController')

const checkAuth = require('../helpers/auth').checkAuth

router.get('/painel',checkAuth ,PainelController.showPainel)
router.get('/create',checkAuth, PainelController.createPainel)
router.get('/update/:id', checkAuth, PainelController.updatePainel)

module.exports = router
