const express = require("express")
const authController = require("../controllers/auth.controller")
const authMiddelware = require("../middelware/auth.middelware")

const router = express.Router()
router.post("/register",authController.userRegisterController)
router.post("/login", authController.userLoginController)
router.post("/logout",authMiddelware.authMiddelware, authController.userLogoutController)
module.exports = router