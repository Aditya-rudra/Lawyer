const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
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
    type: String
  },
  subject: {
    type: String,
    required: [true, 'Subject is required']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    maxlength: 2000
  },
  isRead: {
    type: Boolean,
    default: false
  },
  repliedAt: {
    type: Date
  }
}, {
  timestamps: true
});

contactSchema.index({ isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Contact', contactSchema);
