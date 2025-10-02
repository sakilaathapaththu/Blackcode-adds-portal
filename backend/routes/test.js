// server.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./db/db");

// Load environment variables (dotenv) - no extra logs
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB()
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

// Define PORT
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
