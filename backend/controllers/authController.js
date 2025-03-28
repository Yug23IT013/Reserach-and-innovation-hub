const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.register = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        // Validate required fields
        if (!name || !email || !password || !role) {
            return res.status(400).json({ 
                message: "All fields are required",
                missingFields: {
                    name: !name,
                    email: !email,
                    password: !password,
                    role: !role
                }
            });
        }

        // Validate password length
        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters long"
            });
        }

        // Validate role
        const validRoles = ["Researcher", "Entrepreneur", "Investor", "IPR Professional", "Government Official"];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ 
                message: "Invalid role selected",
                validRoles
            });
        }

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ 
                message: "User already exists with this email" 
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        user = new User({ 
            name, 
            email, 
            password: hashedPassword, 
            role 
        });

        // Save user
        await user.save();

        // Return success response
        res.status(201).json({ 
            message: "User registered successfully",
            user: {
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            message: "Error registering user",
            error: error.message
        });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token, user: { name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
