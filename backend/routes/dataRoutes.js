const express = require("express");
const router = express.Router();

let researchProjects = [];
let startups = [];
let iprRecords = [];

// Add Research Project
router.post("/research", (req, res) => {
    const { title, description } = req.body;
    researchProjects.push({ title, description });
    res.status(201).json({ message: "Research project added!" });
});

// Add Startup
router.post("/startup", (req, res) => {
    const { name, industry, funding } = req.body;
    startups.push({ name, industry, funding });
    res.status(201).json({ message: "Startup added!" });
});

// Add IPR Record
router.post("/ipr", (req, res) => {
    const { title, status } = req.body;
    iprRecords.push({ title, status });
    res.status(201).json({ message: "IPR record added!" });
});

module.exports = router;
