const express = require('express');
const router = express.Router();
const {
  getCases,
  getAllCases,
  createCase,
  updateCase,
  deleteCase
} = require('../controllers/caseController');
const { protect } = require('../middleware/auth');

// Public
router.get('/', getCases);

// Admin
router.get('/admin/all', protect, getAllCases);
router.post('/', protect, createCase);
router.put('/:id', protect, updateCase);
router.delete('/:id', protect, deleteCase);

module.exports = router;
