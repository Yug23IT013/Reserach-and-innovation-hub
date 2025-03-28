const mongoose = require('mongoose');

const startupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    industry: {
        type: String,
        required: true,
        enum: ['Sustainable Energy', 'Smart Farming', 'Healthcare', 'EdTech', 'FinTech', 'AI/ML']
    },
    description: {
        type: String,
        required: true
    },
    funding: {
        type: String,
        required: true
    },
    foundedDate: {
        type: Date,
        required: true
    },
    founderName: {
        type: String,
        required: true
    },
    website: {
        type: String,
        required: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Startup', startupSchema); 
