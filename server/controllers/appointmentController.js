const Appointment = require('../models/Appointment');
const { sendAppointmentNotification } = require('../utils/email');

// @desc    Create appointment (public)
// @route   POST /api/appointments
exports.createAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.create(req.body);

    // Send email notification (non-blocking)
    sendAppointmentNotification(appointment).catch(console.error);

    res.status(201).json({
      success: true,
      message: 'Appointment request submitted successfully. We will contact you shortly.',
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all appointments (admin)
// @route   GET /api/appointments
exports.getAppointments = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status) query.status = status;

    const total = await Appointment.countDocuments(query);
    const appointments = await Appointment.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: appointments.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: appointments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single appointment (admin)
// @route   GET /api/appointments/:id
exports.getAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.json({ success: true, data: appointment });
  } catch (error) {
    next(error);
  }
};

// @desc    Update appointment status (admin)
// @route   PUT /api/appointments/:id
exports.updateAppointment = async (req, res, next) => {
  try {
    const { status, adminNotes } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status, adminNotes },
      { new: true, runValidators: true }
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.json({
      success: true,
      message: `Appointment ${status}`,
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete appointment (admin)
// @route   DELETE /api/appointments/:id
exports.deleteAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.json({ success: true, message: 'Appointment deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get appointment stats (admin)
// @route   GET /api/appointments/stats
exports.getStats = async (req, res, next) => {
  try {
    const stats = await Appointment.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const total = await Appointment.countDocuments();
    const today = await Appointment.countDocuments({
      createdAt: { $gte: new Date().setHours(0,0,0,0) }
    });

    res.json({
      success: true,
      data: { stats, total, today }
    });
  } catch (error) {
    next(error);
  }
};
