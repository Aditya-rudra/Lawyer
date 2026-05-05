const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Case title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  caseType: {
    type: String,
    required: [true, 'Case type is required'],
    enum: ['criminal', 'family', 'property', 'corporate', 'civil', 'debt', 'other']
  },
  result: {
    type: String,
    required: [true, 'Result is required']
  },
  resultBadge: {
    type: String,
    enum: ['won', 'settled', 'dismissed', 'acquitted', 'favorable', 'recovered'],
    default: 'won'
  },
  timeline: {
    type: String
  },
  court: {
    type: String
  },
  year: {
    type: Number
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

caseSchema.index({ isPublished: 1, order: 1 });

module.exports = mongoose.model('Case', caseSchema);
