const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Contact = require('../models/Contact');

// @desc    Client login via mobile number
// @route   POST /api/client/login
router.post('/login', async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone || !/^[0-9]{10}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid 10-digit mobile number.'
      });
    }

    // Search for phone in appointments and contacts
    const appointment = await Appointment.findOne({ phone: { $regex: phone } });
    const contact = await Contact.findOne({ phone: { $regex: phone } });

    if (!appointment && !contact) {
      return res.status(404).json({
        success: false,
        message: 'No records found for this mobile number. Please submit an inquiry or book an appointment first.'
      });
    }

    // Return the client name from whichever record was found
    const clientName = appointment ? appointment.name : contact.name;

    res.json({
      success: true,
      clientName,
      message: 'Login successful'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again.'
    });
  }
});

// @desc    Get client data by phone number
// @route   GET /api/client/data
router.get('/data', async (req, res) => {
  try {
    const { phone } = req.query;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required.'
      });
    }

    // Find all appointments and contacts matching this phone
    const appointments = await Appointment.find({ phone: { $regex: phone } }).sort({ createdAt: -1 });
    const queries = await Contact.find({ phone: { $regex: phone } }).sort({ createdAt: -1 });

    res.json({
      success: true,
      appointments,
      queries
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to load data.'
    });
  }
});

module.exports = router;
