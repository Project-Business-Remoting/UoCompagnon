const userService = require("../services/userService");

const sendTokenResponse = (user, statusCode, res) => {
  const token = user.token;
  delete user.token; // Ne pas envoyer le token en clair dans le JSON

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 jours
  };

  res
    .status(statusCode)
    .cookie("uo_token", token, options)
    .json(user);
};

const register = async (req, res) => {
  try {
    // req.body contiendra nom, email, password, programme, arrivalDate, classStartDate
    const user = await userService.registerUser(req.body);
    sendTokenResponse(user, 201, res);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userService.loginUser(email, password);
    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

const logout = (req, res) => {
  res.clearCookie("uo_token");
  res.status(200).json({ message: "Déconnexion réussie" });
};

module.exports = { register, login, logout };
