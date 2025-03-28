const mongoose = require('mongoose');

const researchSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    field: {
        type: String,
        required: true,
        enum: ['AI/ML', 'Healthcare', 'Renewable Energy', 'Biotechnology', 'IoT', 'Other']
    },
    status: {
        type: String,
        required: true,
        enum: ['In Progress', 'Completed', 'On Hold'],
        default: 'In Progress'
    },
    researchers: [{
        type: String,
        required: true
    }],
    publications: [{
        title: String,
        link: String,
        date: Date
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Research', researchSchema); 
