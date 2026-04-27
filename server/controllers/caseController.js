const Case = require('../models/Case');

// @desc    Get published cases (public)
// @route   GET /api/cases
exports.getCases = async (req, res, next) => {
  try {
    const { caseType } = req.query;
    const query = { isPublished: true };

    if (caseType && caseType !== 'all') query.caseType = caseType;

    const cases = await Case.find(query)
      .sort({ order: 1, createdAt: -1 });

    res.json({ success: true, data: cases });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all cases (admin)
// @route   GET /api/cases/admin/all
exports.getAllCases = async (req, res, next) => {
  try {
    const cases = await Case.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: cases });
  } catch (error) {
    next(error);
  }
};

// @desc    Create case (admin)
// @route   POST /api/cases
exports.createCase = async (req, res, next) => {
  try {
    const caseResult = await Case.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Case result added',
      data: caseResult
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update case (admin)
// @route   PUT /api/cases/:id
exports.updateCase = async (req, res, next) => {
  try {
    const caseResult = await Case.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!caseResult) {
      return res.status(404).json({
        success: false,
        message: 'Case not found'
      });
    }

    res.json({ success: true, data: caseResult });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete case (admin)
// @route   DELETE /api/cases/:id
exports.deleteCase = async (req, res, next) => {
  try {
    await Case.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Case deleted' });
  } catch (error) {
    next(error);
  }
};
