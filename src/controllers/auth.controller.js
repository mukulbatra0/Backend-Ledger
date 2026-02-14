const { compare } = require("bcryptjs");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const emailService = require("../service/email.service")

/**
 * - Register user controller
 * - POST /api/auth/register
 */

async function userRegisterController(req, res) {
  const { email, password, name } = req.body;

  const isExist = await userModel.findOne({
    email: email,
  });

  if (isExist) {
    return res.status(422).json({
      message: "User already exist with this email",
      status: "failed",
    });
  }

  const user = await userModel.create({ name, email, password });
  const token = jwt.sign(
    {
      userid: user._id,
    },
    process.env.JWT_KEY,
    {
      expiresIn: "30d",
    },
  );
  res.cookie("token", token);
  res.status(201).json({
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
    token,
  });

  await emailService.sendRegistermail(
    user.email,
    user.name)
}


/**
 * - Login user controller
 * - POST /api/auth/login
 */

async function userLoginController(req, res) {
  const {email, password } = req.body
  const user = await userModel.findOne({
    email: email,
  }).select("+password")

  if(!user){
    return res
      .status(401).json({message:"Invalid credentials"})
  }

  const isValidPassword = await user.comparePassword(password)

  if(!isValidPassword) 
    return res.status(401).json({message:"Invalid credentials"} )


    const token = jwt.sign(
    {
      userid: user._id,
    },
    process.env.JWT_KEY,
    {
      expiresIn: "30d",
    },
  );
  res.cookie("token", token);
  res.status(200).json({
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
    token,
  });
}

module.exports = {
  userRegisterController,
  userLoginController
};
