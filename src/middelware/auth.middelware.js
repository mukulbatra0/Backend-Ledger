const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")

async function authMiddelware(req, res, next){
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1]

  if(!token){
    return res.status(401).json({
      success:false,
      message: "access denied, no token provided"
    })
  }

  try{
    const decoded = jwt.verify(token, process.env.JWT_KEY)


    const user = await userModel.findById(decoded.userid)

    if(!user){
      return res.status(401).json({
        success:false,
        message:"user not found"
      })
    }
    req.user = user

    return next()

  }catch{
    return res.status(401).json({
      success:false,
      message:"invalid token"
    })
  }
}

module.exports = {
  authMiddelware
}