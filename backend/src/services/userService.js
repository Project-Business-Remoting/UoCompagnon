const User = require("../models/User");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const registerUser = async (userData) => {
  const { name, email, password, program } = userData;
  const userExists = await User.findOne({ email });
  if (userExists) throw new Error("Utilisateur déjà existant");

  const user = await User.create({ name, email, password, program });
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    program: user.program,
    currentStep: user.currentStep,
    token: generateToken(user._id),
  };
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      program: user.program,
      currentStep: user.currentStep,
      readNotifications: user.readNotifications,
      token: generateToken(user._id),
    };
  }
  throw new Error("Email ou mot de passe invalide");
};

module.exports = { registerUser, loginUser };
