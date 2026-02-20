const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
const blacklistModel = require("../models/blacklist.model")

async function authMiddelware(req, res, next){
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1]

  if(!token){
    return res.status(401).json({
      success:false,
      message: "access denied, no token provided"
    })
  }

  try{
    // Check if token is blacklisted
    const isBlacklisted = await blacklistModel.findOne({ token });
    if(isBlacklisted){
      return res.status(401).json({
        success:false,
        message:"token has been revoked, please login again"
      })
    }

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

  }catch(err){
    return res.status(401).json({
      success:false,
      message:"invalid token"
    })
  }
}

async function authSystemUserMiddleware(req, res, next){
 const token = req.cookies.token || req.headers.authorization?.split(" ")[1]

  if(!token){
    return res.status(401).json({
      success:false,
      message: "access denied, no token provided"
    })
  }

  try{
    // Check if token is blacklisted
    const isBlacklisted = await blacklistModel.findOne({ token });
    if(isBlacklisted){
      return res.status(401).json({
        success:false,
        message:"token has been revoked, please login again"
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_KEY)

    const user = await userModel.findById(decoded.userid).select("+systemUser")

    if(!user.systemUser){
      return res.status(403).json({
        success:false,
        message:"forbidden: access denied for regular user" 
      })
    }
    req.user = user

    return next()

  }catch(err){
    return res.status(401).json({
      success:false,
      message:"invalid token"
    })
  }
}

module.exports = {
  authMiddelware,
  authSystemUserMiddleware
}