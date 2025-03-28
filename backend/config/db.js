const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is not defined in .env file!");
        }

        const options = {
            dbName: "Research_&_Innovation_Hub",
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        };

        await mongoose.connect(process.env.MONGO_URI, options);
        console.log("✅ MongoDB Connected Successfully");
        console.log("Database:", mongoose.connection.db.databaseName);
        console.log("Host:", mongoose.connection.host);
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", {
            message: error.message,
            code: error.code,
            name: error.name
        });
        process.exit(1);
    }
};

module.exports = connectDB;
