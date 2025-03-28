const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const { 
    createResearch,
    getAllResearch,
    getUserResearch,
    updateResearch,
    deleteResearch
} = require('../controllers/researchController');

// Create a new research project (Researchers only)
router.post('/', auth, checkRole(['Researcher']), createResearch);

// Get all research projects (Researchers and Government Officials)
router.get('/', auth, checkRole(['Researcher', 'Government Official']), getAllResearch);

// Get user's research projects (Researchers only)
router.get('/user', auth, checkRole(['Researcher']), getUserResearch);

// Update a research project (Researchers only)
router.put('/:id', auth, checkRole(['Researcher']), updateResearch);

// Delete a research project (Researchers only)
router.delete('/:id', auth, checkRole(['Researcher']), deleteResearch);

module.exports = router; 