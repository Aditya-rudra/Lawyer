const express = require('express');
const router = express.Router();
const {
  createAppointment,
  getAppointments,
  getAppointment,
  updateAppointment,
  deleteAppointment,
  getStats
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/auth');
const { formLimiter } = require('../middleware/rateLimiter');

// Public
router.post('/', formLimiter, createAppointment);

// Admin
router.get('/', protect, getAppointments);
router.get('/stats', protect, getStats);
router.get('/:id', protect, getAppointment);
router.put('/:id', protect, updateAppointment);
router.delete('/:id', protect, deleteAppointment);

module.exports = router;
