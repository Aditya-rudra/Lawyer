const Contact = require('../models/Contact');
const { sendContactNotification } = require('../utils/email');

// @desc    Submit contact form (public)
// @route   POST /api/contact
exports.createContact = async (req, res, next) => {
  try {
    const contact = await Contact.create(req.body);

    // Send email notification (non-blocking)
    sendContactNotification(contact).catch(console.error);

    res.status(201).json({
      success: true,
      message: 'Thank you for reaching out. We will respond within 24 hours.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all inquiries (admin)
// @route   GET /api/contact
exports.getContacts = async (req, res, next) => {
  try {
    const { isRead, page = 1, limit = 20 } = req.query;
    const query = {};

    if (isRead !== undefined) query.isRead = isRead === 'true';

    const total = await Contact.countDocuments(query);
    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: contacts.length,
      total,
      pages: Math.ceil(total / limit),
      data: contacts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark inquiry as read (admin)
// @route   PUT /api/contact/:id
exports.updateContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { isRead: true, repliedAt: new Date() },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact inquiry not found'
      });
    }

    res.json({ success: true, data: contact });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete inquiry (admin)
// @route   DELETE /api/contact/:id
exports.deleteContact = async (req, res, next) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Inquiry deleted' });
  } catch (error) {
    next(error);
  }
};
