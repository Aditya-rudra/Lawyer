const Blog = require('../models/Blog');

// @desc    Get published blogs (public)
// @route   GET /api/blogs
exports.getBlogs = async (req, res, next) => {
  try {
    const { category, search, page = 1, limit = 9 } = req.query;
    const query = { isPublished: true };

    if (category && category !== 'all') query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const total = await Blog.countDocuments(query);
    const blogs = await Blog.find(query)
      .select('-content')
      .sort({ publishedAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: blogs.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: blogs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single blog by slug (public)
// @route   GET /api/blogs/:slug
exports.getBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findOneAndUpdate(
      { slug: req.params.slug, isPublished: true },
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    res.json({ success: true, data: blog });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all blogs (admin)
// @route   GET /api/blogs/admin/all
exports.getAllBlogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const total = await Blog.countDocuments();
    const blogs = await Blog.find()
      .select('-content')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: blogs.length,
      total,
      pages: Math.ceil(total / limit),
      data: blogs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create blog (admin)
// @route   POST /api/blogs
exports.createBlog = async (req, res, next) => {
  try {
    const blog = await Blog.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Blog post created',
      data: blog
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update blog (admin)
// @route   PUT /api/blogs/:id
exports.updateBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    res.json({ success: true, data: blog });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete blog (admin)
// @route   DELETE /api/blogs/:id
exports.deleteBlog = async (req, res, next) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Blog post deleted' });
  } catch (error) {
    next(error);
  }
};
