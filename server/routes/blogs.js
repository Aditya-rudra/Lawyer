const express = require('express');
const router = express.Router();
const {
  getBlogs,
  getBlog,
  getAllBlogs,
  createBlog,
  updateBlog,
  deleteBlog
} = require('../controllers/blogController');
const { protect } = require('../middleware/auth');

// Public
router.get('/', getBlogs);
router.get('/:slug', getBlog);

// Admin
router.get('/admin/all', protect, getAllBlogs);
router.post('/', protect, createBlog);
router.put('/:id', protect, updateBlog);
router.delete('/:id', protect, deleteBlog);

module.exports = router;
