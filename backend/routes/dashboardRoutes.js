const express = require("express");
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');

// Sample Data (Replace with MongoDB later)
const researchProjects = [
    { id: 1, title: "AI for Healthcare", description: "Using AI to improve diagnosis." },
    { id: 2, title: "Renewable Energy", description: "Innovative solar energy solutions." }
];

const startups = [
    { id: 1, name: "GreenTech", industry: "Sustainable Energy", funding: "$500K" },
    { id: 2, name: "AgriTech", industry: "Smart Farming", funding: "$300K" }
];

const iprRecords = [
    { id: 1, title: "AI-Powered Diagnostics", status: "Approved" },
    { id: 2, title: "Eco-Friendly Batteries", status: "Pending" }
];

// Route to get research projects (accessible by Researchers and IPR Professionals)
router.get("/research", auth, checkRole(["Researcher", "IPR Professional"]), (req, res) => {
    res.json(researchProjects);
});

// Route to get startup details (accessible by Entrepreneurs and Investors)
router.get("/startups", auth, checkRole(["Entrepreneur", "Investor"]), (req, res) => {
    res.json(startups);
});

// Route to add new startup
router.post("/startups", auth, checkRole(["Entrepreneur"]), (req, res) => {
    try {
        const { name, industry, funding, foundedDate, founderName, description, website } = req.body;
        
        // Validate required fields
        if (!name || !industry || !funding || !foundedDate || !founderName || !description) {
            return res.status(400).json({ 
                message: "Missing required fields",
                required: ["name", "industry", "funding", "foundedDate", "founderName", "description"]
            });
        }

        // Create new startup with generated ID
        const newStartup = {
            id: startups.length + 1,
            name,
            industry,
            funding,
            foundedDate,
            founderName,
            description,
            website: website || null
        };

        // Add to startups array
        startups.push(newStartup);

        // Return success response
        res.status(201).json({
            message: "Startup added successfully",
            startup: newStartup
        });
    } catch (error) {
        console.error("Error adding startup:", error);
        res.status(500).json({ message: "Failed to add startup" });
    }
});

// Route to get IPR records (accessible by IPR Professionals only)
router.get("/ipr", auth, checkRole(["IPR Professional"]), (req, res) => {
    res.json(iprRecords);
});

// Route to get dashboard data based on user role
router.get("/dashboard", auth, (req, res) => {
    const userRole = req.user.role;
    let dashboardData = {};

    switch (userRole) {
        case "Researcher":
            dashboardData = { researchProjects };
            break;
        case "Entrepreneur":
        case "Investor":
            dashboardData = { startups };
            break;
        case "IPR Professional":
            dashboardData = { iprRecords };
            break;
        case "Government Official":
            dashboardData = {
                researchProjects: researchProjects.map(p => ({ id: p.id, title: p.title })),
                iprRecords: iprRecords.map(i => ({ id: i.id, title: i.title }))
            };
            break;
        default:
            return res.status(403).json({ message: "Invalid user role" });
    }

    res.json(dashboardData);
});

module.exports = router;
