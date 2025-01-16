const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')

// Login
router.get('/login',authController.login)
router.get('/logout', authController.logout)
router.post('/loginPost',authController.loginPost)

// Register
router.get('/register',authController.register)
router.post('/register',authController.createUser)

module.exports = router
