const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const app = express();

// connect DB
connectDB();

// Middlewares

app.use(cors());
app.use(express.json());

// Routes
const uploadRoutes  = require("./routes/uploadRoutes");
app.use("/api", uploadRoutes);

// Test Routes

app.get("/", (req,res) => {
    res.send("Backend is running...");
});

// PORT

const PORT = process.env.PORT || 5000;

// Start Server

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);