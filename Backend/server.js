const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middlewares

app.use(cors());
app.use(express.json());

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

const uploadRoutes  = require("./routes/uploadRoutes");

app.use("/api", uploadRoutes);