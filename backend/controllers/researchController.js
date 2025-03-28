const Research = require('../models/Research');

// Create a new research project
exports.createResearch = async (req, res) => {
    try {
        console.log('Received research creation request:', req.body);
        const { title, description, field, researchers, status } = req.body;

        // Validate required fields
        if (!title || !description || !field || !researchers) {
            console.log('Missing required fields:', { title, description, field, researchers });
            return res.status(400).json({
                message: "Missing required fields",
                required: ["title", "description", "field", "researchers"]
            });
        }

        // Validate field value
        const validFields = ['AI/ML', 'Healthcare', 'Renewable Energy', 'Biotechnology', 'IoT', 'Other'];
        if (!validFields.includes(field)) {
            console.log('Invalid field value:', field);
            return res.status(400).json({
                message: "Invalid field value",
                validFields
            });
        }

        // Validate status value
        const validStatuses = ['In Progress', 'Completed', 'On Hold'];
        if (status && !validStatuses.includes(status)) {
            console.log('Invalid status value:', status);
            return res.status(400).json({
                message: "Invalid status value",
                validStatuses
            });
        }

        // Create new research project
        const research = new Research({
            title,
            description,
            field,
            status: status || 'In Progress',
            researchers: Array.isArray(researchers) ? researchers : researchers.split(',').map(r => r.trim()),
            createdBy: req.user.id
        });

        console.log('Attempting to save research:', research);
        await research.save();
        console.log('Research saved successfully');

        res.status(201).json({
            message: "Research project created successfully",
            research
        });
    } catch (error) {
        console.error('Error in createResearch:', error);
        res.status(500).json({
            message: "Error creating research project",
            error: error.message
        });
    }
};

// Get all research projects
exports.getAllResearch = async (req, res) => {
    try {
        const research = await Research.find()
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });

        res.json(research);
    } catch (error) {
        console.error('Error in getAllResearch:', error);
        res.status(500).json({
            message: "Error fetching research projects",
            error: error.message
        });
    }
};

// Get user's research projects
exports.getUserResearch = async (req, res) => {
    try {
        const research = await Research.find({ createdBy: req.user.id })
            .sort({ createdAt: -1 });

        res.json(research);
    } catch (error) {
        console.error('Error in getUserResearch:', error);
        res.status(500).json({
            message: "Error fetching user research projects",
            error: error.message
        });
    }
};

// Update research project
exports.updateResearch = async (req, res) => {
    try {
        const research = await Research.findById(req.params.id);

        if (!research) {
            return res.status(404).json({ message: "Research project not found" });
        }

        // Check if user owns the research project
        if (research.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to update this research project" });
        }

        const updatedResearch = await Research.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );

        res.json({
            message: "Research project updated successfully",
            research: updatedResearch
        });
    } catch (error) {
        console.error('Error in updateResearch:', error);
        res.status(500).json({
            message: "Error updating research project",
            error: error.message
        });
    }
};

// Delete research project
exports.deleteResearch = async (req, res) => {
    try {
        const research = await Research.findById(req.params.id);

        if (!research) {
            return res.status(404).json({ message: "Research project not found" });
        }

        // Check if user owns the research project
        if (research.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to delete this research project" });
        }

        await Research.findByIdAndDelete(req.params.id);

        res.json({ message: "Research project deleted successfully" });
    } catch (error) {
        console.error('Error in deleteResearch:', error);
        res.status(500).json({
            message: "Error deleting research project",
            error: error.message
        });
    }
};
