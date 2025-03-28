const IPR = require('../models/IPR');

// Create a new IPR record
exports.createIPR = async (req, res) => {
    try {
        const { title, description, type, filingDate, inventors } = req.body;

        // Validate required fields
        if (!title || !description || !type || !filingDate || !inventors) {
            return res.status(400).json({
                message: "Missing required fields",
                required: ["title", "description", "type", "filingDate", "inventors"]
            });
        }

        // Create new IPR record
        const ipr = new IPR({
            ...req.body,
            createdBy: req.user.id
        });

        await ipr.save();

        res.status(201).json({
            message: "IPR record created successfully",
            ipr
        });
    } catch (error) {
        res.status(500).json({
            message: "Error creating IPR record",
            error: error.message
        });
    }
};

// Get all IPR records
exports.getAllIPR = async (req, res) => {
    try {
        const iprs = await IPR.find()
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });

        res.json(iprs);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching IPR records",
            error: error.message
        });
    }
};

// Get user's IPR records
exports.getUserIPR = async (req, res) => {
    try {
        const iprs = await IPR.find({ createdBy: req.user.id })
            .sort({ createdAt: -1 });

        res.json(iprs);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching user IPR records",
            error: error.message
        });
    }
};

// Update IPR record
exports.updateIPR = async (req, res) => {
    try {
        const ipr = await IPR.findById(req.params.id);

        if (!ipr) {
            return res.status(404).json({ message: "IPR record not found" });
        }

        // Check if user owns the IPR record
        if (ipr.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to update this IPR record" });
        }

        const updatedIPR = await IPR.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );

        res.json({
            message: "IPR record updated successfully",
            ipr: updatedIPR
        });
    } catch (error) {
        res.status(500).json({
            message: "Error updating IPR record",
            error: error.message
        });
    }
};

// Delete IPR record
exports.deleteIPR = async (req, res) => {
    try {
        const ipr = await IPR.findById(req.params.id);

        if (!ipr) {
            return res.status(404).json({ message: "IPR record not found" });
        }

        // Check if user owns the IPR record
        if (ipr.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to delete this IPR record" });
        }

        await ipr.remove();

        res.json({ message: "IPR record deleted successfully" });
    } catch (error) {
        res.status(500).json({
            message: "Error deleting IPR record",
            error: error.message
        });
    }
};
