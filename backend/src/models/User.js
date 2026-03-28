const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { 
    type: String, 
    required: true, 
    unique: true,
    match: [/^\w+([\.-]?\w+)*@uottawa\.ca$/, 'Veuillez utiliser votre adresse email @uottawa.ca']
  },
    password: { type: String, required: true },
    role: { type: String, enum: ["student", "admin"], default: "student" },
    program: { type: String, required: true },
    arrivalDate: { type: Date, required: true }, // Arrivée au pays
    classStartDate: { type: Date, required: true }, // Premier jour de cours
    readNotifications: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Notification" },
    ],
  },
  { timestamps: true },
);

// Hashage du mot de passe avant sauvegarde
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Méthode pour comparer les mots de passe
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
