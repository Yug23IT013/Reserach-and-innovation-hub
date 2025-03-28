const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const { 
    createIPR,
    getAllIPR,
    getUserIPR,
    updateIPR,
    deleteIPR
} = require('../controllers/iprController');

// Create a new IPR record (IPR Professionals only)
router.post('/', auth, checkRole(['IPR Professional']), createIPR);

// Get all IPR records (IPR Professionals and Government Officials)
router.get('/', auth, checkRole(['IPR Professional', 'Government Official']), getAllIPR);

// Get user's IPR records (IPR Professionals only)
router.get('/user', auth, checkRole(['IPR Professional']), getUserIPR);

// Update an IPR record (IPR Professionals only)
router.put('/:id', auth, checkRole(['IPR Professional']), updateIPR);

// Delete an IPR record (IPR Professionals only)
router.delete('/:id', auth, checkRole(['IPR Professional']), deleteIPR);

module.exports = router; 