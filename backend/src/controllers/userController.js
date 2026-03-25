const userService = require("../services/userService");

const register = async (req, res) => {
  try {
    // req.body contiendra nom, email, password, programme, arrivalDate, classStartDate
    const user = await userService.registerUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userService.loginUser(email, password);
    res.status(200).json(user);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

module.exports = { register, login };
