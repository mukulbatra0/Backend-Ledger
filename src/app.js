const express = require("express")
const authRouter = require("./routes/auth.route")
const cookieParser = require("cookie-parser")
const accountRouter = require("./routes/account.route")

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use("/api/auth",authRouter)

app.use("/api/account",accountRouter)


module.exports = app