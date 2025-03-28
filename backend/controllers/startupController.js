const Startup = require('../models/Startup');

// Create a new startup
exports.createStartup = async (req, res) => {
    try {
        const { name, industry, description, funding, foundedDate, founderName, website } = req.body;

        // Validate required fields
        if (!name || !industry || !description || !funding || !foundedDate || !founderName) {
            return res.status(400).json({
                message: "Missing required fields",
                required: ["name", "industry", "description", "funding", "foundedDate", "founderName"]
            });
        }

        // Create new startup with user reference
        const startup = new Startup({
            name,
            industry,
            description,
            funding,
            foundedDate,
            founderName,
            website,
            createdBy: req.user.id
        });

        await startup.save();

        res.status(201).json({
            message: "Startup created successfully",
            startup
        });
    } catch (error) {
        res.status(500).json({
            message: "Error creating startup",
            error: error.message
        });
    }
};

// Get all startups (for Entrepreneurs and Investors)
exports.getAllStartups = async (req, res) => {
    try {
        const startups = await Startup.find()
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 }); // Most recent first

        res.json(startups);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching startups",
            error: error.message
        });
    }
};

// Get startups by user
exports.getUserStartups = async (req, res) => {
    try {
        const startups = await Startup.find({ createdBy: req.user.id })
            .sort({ createdAt: -1 });

        res.json(startups);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching user startups",
            error: error.message
        });
    }
};

// Update startup
exports.updateStartup = async (req, res) => {
    try {
        const startup = await Startup.findById(req.params.id);

        if (!startup) {
            return res.status(404).json({ message: "Startup not found" });
        }

        // Check if user owns the startup
        if (startup.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to update this startup" });
        }

        const updatedStartup = await Startup.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );

        res.json({
            message: "Startup updated successfully",
            startup: updatedStartup
        });
    } catch (error) {
        res.status(500).json({
            message: "Error updating startup",
            error: error.message
        });
    }
};

// Delete startup
exports.deleteStartup = async (req, res) => {
    try {
        const startup = await Startup.findById(req.params.id);

        if (!startup) {
            return res.status(404).json({ message: "Startup not found" });
        }

        // Check if user owns the startup
        if (startup.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to delete this startup" });
        }

        await startup.remove();

        res.json({ message: "Startup deleted successfully" });
    } catch (error) {
        res.status(500).json({
            message: "Error deleting startup",
            error: error.message
        });
    }
};
