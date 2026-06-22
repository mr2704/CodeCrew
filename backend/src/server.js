import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import swipeRoutes from "./routes/swipeRoutes.js";
import inviteRoutes from "./routes/inviteRoutes.js";

dotenv.config();

const startServer = async () => {
  try {
    console.log("Connecting to MongoDB...");

    await connectDB();

    mongoose.connection.on("connected", () => {
      console.log("Mongoose Connected");
    });

    mongoose.connection.on("error", (err) => {
      console.error("Mongoose Connection Error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("Mongoose Disconnected");
    });

    const app = express();

    // CORS configuration for production deployment
    const allowedOrigins = process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(",")
      : ["http://localhost:3000", "http://localhost:5173", "http://localhost:8080"];

    app.use(
      cors({
        origin: (origin, callback) => {
          // Allow requests with no origin (like mobile apps or curl requests)
          if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
          } else {
            callback(new Error("Not allowed by CORS"));
          }
        },
        credentials: true,
      })
    );

    app.use(express.json());

    // Health check route
    // Health check route
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "CodeCrew API Running",
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/swipes", swipeRoutes);
app.use("/api/invites", inviteRoutes);

// Unhandled route handler (404)
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} not found`,
  });
});

    // Global Error Handling Middleware (prevents raw stack trace leakages in production)
    app.use((err, req, res, next) => {
      console.error("Unhandled Exception:", err.stack || err);
      res.status(500).json({
        success: false,
        message: process.env.NODE_ENV === "production" ? "Internal Server Error" : err.message,
      });
    });

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();