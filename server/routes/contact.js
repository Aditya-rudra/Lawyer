const express = require('express');
const router = express.Router();
const {
  createContact,
  getContacts,
  updateContact,
  deleteContact
} = require('../controllers/contactController');
const { protect } = require('../middleware/auth');
const { formLimiter } = require('../middleware/rateLimiter');

// Public
router.post('/', formLimiter, createContact);

// Admin
router.get('/', protect, getContacts);
router.put('/:id', protect, updateContact);
router.delete('/:id', protect, deleteContact);

module.exports = router;
