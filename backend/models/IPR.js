const mongoose = require('mongoose');

const iprSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['Patent', 'Copyright', 'Trademark', 'Trade Secret']
    },
    status: {
        type: String,
        required: true,
        enum: ['Pending', 'Approved', 'Rejected', 'Under Review'],
        default: 'Pending'
    },
    filingDate: {
        type: Date,
        required: true
    },
    inventors: [{
        type: String,
        required: true
    }],
    documents: [{
        title: String,
        link: String,
        uploadDate: Date
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('IPR', iprSchema); 
