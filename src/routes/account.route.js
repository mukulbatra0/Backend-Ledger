const express = require("express")
const authMiddelware = require("../middelware/auth.middelware")
const accountController = require("../controllers/account.controller")

const router = express.Router()

/**
 * -POST /api/account/
 * - create account
 */
  router.post("/", authMiddelware.authMiddelware, accountController.createAccountController)
   



module.exports = router