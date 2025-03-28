const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const authRoutes = require('./routes/authRoutes');
const startupRoutes = require('./routes/startupRoutes');
const researchRoutes = require('./routes/researchRoutes');
const iprRoutes = require('./routes/iprRoutes');

require("dotenv").config();
const app = express();

// Connect to MongoDB
connectDB();

// CORS Configuration
app.use(cors({
    origin: ['http://localhost:5000', 'http://localhost:5001', 'http://127.0.0.1:5000', 'http://127.0.0.1:5001'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`, req.body);
    next();
});

// Serve static files from frontend directory
app.use(express.static(path.join(__dirname, "../frontend")));

// Default route to serve index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "index.html"));
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/startups", startupRoutes);
app.use("/api/research", researchRoutes);
app.use("/api/ipr", iprRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        message: "Something went wrong!",
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
