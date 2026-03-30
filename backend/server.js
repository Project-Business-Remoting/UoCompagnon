const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const connectDB = require("./src/config/db");

// Chargement des variables d'environnement
dotenv.config();

// Connexion à la base de données
connectDB();

const app = express();

const allowedOrigins = (
  process.env.CORS_ORIGINS || "http://localhost:5173,http://localhost:5174"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Trop de tentatives, veuillez reessayer plus tard" },
});

// Middlewares
app.use(helmet());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());
app.use("/api/users/login", authRateLimit);
app.use("/api/users/register", authRateLimit);

// Routes
app.use("/api/users", require("./src/routes/userRoutes"));
app.use("/api/contents", require("./src/routes/contentRoutes"));
app.use("/api/notifications", require("./src/routes/notificationRoutes"));
app.use("/api/dashboard", require("./src/routes/dashboardRoutes"));
app.use("/api/questions", require("./src/routes/questionRoutes"));

app.get("/", (req, res) => {
  res.send("API UO-Compagnon is running...");
});

app.use((req, res) => {
  res.status(404).json({ message: "Route introuvable" });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
