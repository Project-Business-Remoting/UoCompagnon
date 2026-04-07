const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

let io;


const initSocket = (httpServer, allowedOrigins) => {
  io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
    },
  });

  // --- Authentication middleware ---
  io.use(async (socket, next) => {
    try {
      // Extraire le token passé depuis le client (LocalStorage)
      const token = socket.handshake.auth?.token;


      if (!token) {
        return next(new Error("Authentication required"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return next(new Error("User not found"));
      }

   
      socket.user = user;
      next();
    } catch (err) {
      next(new Error("Invalid token"));
    }
  });

  // --- Connection handler ---
  io.on("connection", (socket) => {
    const { user } = socket;
    console.log(`[Socket.IO] ${user.name} connected (${user.role})`);

   
    socket.join(`user:${user._id}`);

   
    if (user.role === "admin") {
      socket.join("admins");
    }

    socket.on("disconnect", () => {
      console.log(`[Socket.IO] ${user.name} disconnected`);
    });
  });

  return io;
};


const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO has not been initialized");
  }
  return io;
};

module.exports = { initSocket, getIO };
