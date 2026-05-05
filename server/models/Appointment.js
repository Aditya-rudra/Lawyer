const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required']
  },
  caseType: {
    type: String,
    required: [true, 'Case type is required'],
    enum: ['criminal', 'family', 'property', 'corporate', 'civil', 'other']
  },
  preferredDate: {
    type: Date,
    required: [true, 'Preferred date is required']
  },
  preferredTime: {
    type: String,
    default: '10:00 AM'
  },
  message: {
    type: String,
    maxlength: 1000
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed'],
    default: 'pending'
  },
  adminNotes: {
    type: String
  }
}, {
  timestamps: true
});

// Index for efficient querying
appointmentSchema.index({ status: 1, createdAt: -1 });
appointmentSchema.index({ preferredDate: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
