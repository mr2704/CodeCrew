import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const startServer = async () => {
  try {
    console.log("Connecting to MongoDB...");

    await connectDB();

    mongoose.connection.on("connected", () => {
      console.log("Mongoose Connected");
    });

    mongoose.connection.on("error", (err) => {
      console.log("Mongoose Error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("Mongoose Disconnected");
    });

    const app = express();

    // Middleware

    app.use(cors());
    app.use(express.json());

    // Test Route

    app.get("/", (req, res) => {
      res.json({
        message: "CodeCrew API Running",
      });
    });

    // Routes

    app.use("/api/auth", authRoutes);
    app.use("/api/users", userRoutes);
    
    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

startServer();