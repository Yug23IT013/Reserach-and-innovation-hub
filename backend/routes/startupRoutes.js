const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const { 
    createStartup, 
    getAllStartups, 
    getUserStartups,
    updateStartup,
    deleteStartup
} = require('../controllers/startupController');

// Create startup (Entrepreneurs only)
router.post('/', auth, checkRole(['Entrepreneur']), createStartup);

// Get all startups (Entrepreneurs and Investors only)
router.get('/', auth, checkRole(['Entrepreneur', 'Investor']), getAllStartups);

// Get user's startups (Entrepreneurs only)
router.get('/my-startups', auth, checkRole(['Entrepreneur']), getUserStartups);

// Update startup (Entrepreneurs only)
router.put('/:id', auth, checkRole(['Entrepreneur']), updateStartup);

// Delete startup (Entrepreneurs only)
router.delete('/:id', auth, checkRole(['Entrepreneur']), deleteStartup);

module.exports = router; 