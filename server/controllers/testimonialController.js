const Testimonial = require('../models/Testimonial');

// @desc    Get active testimonials (public)
// @route   GET /api/testimonials
exports.getTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 });

    res.json({ success: true, data: testimonials });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all testimonials (admin)
// @route   GET /api/testimonials/admin/all
exports.getAllTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find()
      .sort({ order: 1, createdAt: -1 });

    res.json({ success: true, data: testimonials });
  } catch (error) {
    next(error);
  }
};

// @desc    Create testimonial (admin)
// @route   POST /api/testimonials
exports.createTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Testimonial added',
      data: testimonial
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update testimonial (admin)
// @route   PUT /api/testimonials/:id
exports.updateTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    res.json({ success: true, data: testimonial });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete testimonial (admin)
// @route   DELETE /api/testimonials/:id
exports.deleteTestimonial = async (req, res, next) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Testimonial deleted' });
  } catch (error) {
    next(error);
  }
};
