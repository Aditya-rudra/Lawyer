const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret_for_production', {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @desc    Login admin
// @route   POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }
  });
};

// @desc    Update password
// @route   PUT /api/auth/password
exports.updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('+password');
    const { currentPassword, newPassword } = req.body;

    if (!(await user.matchPassword(currentPassword))) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    user.password = newPassword;
    await user.save();

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      message: 'Password updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Seed Admin User (Temporary for setup)
// @route   GET /api/auth/seed-admin
exports.seedAdmin = async (req, res, next) => {
  try {
    const adminExists = await User.findOne({ email: 'admin@bhatilawassociates.com' });
    if (adminExists) {
      return res.json({ success: true, message: 'Admin already exists! You can log in.' });
    }
    
    await User.create({
      name: 'Admin',
      email: 'admin@bhatilawassociates.com',
      password: 'Admin@123456',
      role: 'admin'
    });
    
    res.json({ success: true, message: 'Admin user created successfully! You can now log in with Admin@123456' });
  } catch (error) {
    next(error);
  }
};
