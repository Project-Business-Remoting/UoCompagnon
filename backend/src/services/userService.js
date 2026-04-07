const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { calculateCurrentStep } = require("../config/constants");

const TOKEN_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN });
};

const registerUser = async (userData) => {
  // On récupère bien les dates depuis userData
  const { name, email, password, program, arrivalDate, classStartDate } =
    userData;

  const userExists = await User.findOne({ email });
  if (userExists) throw new Error("Utilisateur déjà existant");

  // On passe les dates à la création
  const user = await User.create({
    name,
    email,
    password,
    program,
    arrivalDate,
    classStartDate,
  });

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    program: user.program,
    arrivalDate: user.arrivalDate,
    classStartDate: user.classStartDate,
    profilePicture: user.profilePicture,
    role: user.role,
    currentStep: calculateCurrentStep(user.arrivalDate, user.classStartDate),
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
      arrivalDate: user.arrivalDate,
      classStartDate: user.classStartDate,
      profilePicture: user.profilePicture,
      role: user.role,
      // Calcul dynamique à chaque connexion
      currentStep: calculateCurrentStep(user.arrivalDate, user.classStartDate),
      readNotifications: user.readNotifications,
      token: generateToken(user._id),
    };
  }
  throw new Error("Email ou mot de passe invalide");
};

const updateUserProfile = async (userId, data) => {
  const { program, arrivalDate, classStartDate, profilePicture } = data;
  const user = await User.findById(userId);
  if (!user) throw new Error("Utilisateur non trouvé");

  if (program) user.program = program;
  if (arrivalDate) user.arrivalDate = arrivalDate;
  if (classStartDate) user.classStartDate = classStartDate;
  if (profilePicture !== undefined) user.profilePicture = profilePicture;

  await user.save();

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    program: user.program,
    arrivalDate: user.arrivalDate,
    classStartDate: user.classStartDate,
    profilePicture: user.profilePicture,
    role: user.role,
    currentStep: calculateCurrentStep(user.arrivalDate, user.classStartDate),
    readNotifications: user.readNotifications,
  };
};

const getAllStudents = async () => {
  const students = await User.find({ role: "student" }).select("-password");
  
  // Calculate dynamic currentStep for each student
  return students.map(student => {
    const studentObj = student.toObject();
    studentObj.currentStep = calculateCurrentStep(student.arrivalDate, student.classStartDate);
    return studentObj;
  });
};

module.exports = { registerUser, loginUser, updateUserProfile, getAllStudents };
