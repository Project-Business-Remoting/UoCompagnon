const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./src/config/db");

// Chargement des variables d'environnement
dotenv.config();

// Connexion à la base de données
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", require("./src/routes/userRoutes"));
app.use("/api/contents", require("./src/routes/contentRoutes"));
app.use("/api/notifications", require("./src/routes/notificationRoutes"));
app.use("/api/dashboard", require("./src/routes/dashboardRoutes"));
app.use("/api/questions", require("./src/routes/questionRoutes"));

app.get("/", (req, res) => {
  res.send("API UO-Compagnon is running...");
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
