const express = require("express")
const authMiddelware = require("../middelware/auth.middelware")
const transactionController = require("../controllers/transaction.controller")

const router = express.Router()

/**
 * -POST /api/transaction/
 * - create transaction
 */
  router.post("/", authMiddelware.authMiddelware, transactionController.createTransactionController)


  router.post("/system/initial-funds",authMiddelware.authSystemUserMiddleware,transactionController.createInitialFundTreansction)

  module.exports = router