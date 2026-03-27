const { Blog, User } = require('../models');
const { Op } = require('sequelize');
const slugify = require('../utils/slugify');

exports.getAllBlogs = async (req, res) => {
  try {
    const { 
      category,
      featured,
      status = 'published',
      search,
      page = 1, 
      limit = 10,
      sortBy = 'published_at',
      order = 'DESC'
    } = req.query;
    
    const whereClause = { status };
    
    if (category) {
      whereClause.category = category;
    }
    
    if (featured === 'true') {
      whereClause.featured = true;
    }
    
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { content: { [Op.like]: `%${search}%` } }
      ];
    }
    
    const offset = (page - 1) * limit;
    
    const { count, rows: blogs } = await Blog.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name']
        }
      ],
      order: [[sortBy, order]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    res.json({
      success: true,
      data: {
        blogs,
        pagination: {
          total: count,
          page: parseInt(page),
          pages: Math.ceil(count / limit),
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blogs',
      error: error.message
    });
  }
};

exports.getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const blog = await Blog.findByPk(id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name']
        }
      ]
    });
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }
    
    // Increment views
    await blog.update({ views: blog.views + 1 });
    
    res.json({
      success: true,
      data: { blog }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blog',
      error: error.message
    });
  }
};

exports.getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    
    const blog = await Blog.findOne({
      where: { slug, status: 'published' },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name']
        }
      ]
    });
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }
    
    // Increment views
    await blog.update({ views: blog.views + 1 });
    
    res.json({
      success: true,
      data: { blog }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blog',
      error: error.message
    });
  }
};

exports.createBlog = async (req, res) => {
  try {
    const blogData = req.body;
    
    // Generate slug if not provided
    if (!blogData.slug) {
      blogData.slug = slugify(blogData.title);
    }
    
    // Check for duplicate slug
    const existing = await Blog.findOne({ where: { slug: blogData.slug } });
    if (existing) {
      blogData.slug = `${blogData.slug}-${Date.now()}`;
    }
    
    blogData.author_id = req.user.id;
    blogData.published_at = new Date();
    
    const blog = await Blog.create(blogData);
    
    // Emit real-time update
    if (req.io) {
      req.io.emit('blog_created', blog);
    }
    
    res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      data: { blog }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create blog',
      error: error.message
    });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blogData = req.body;
    
    const blog = await Blog.findByPk(id);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }
    
    // Generate new slug if title changed and slug not provided
    if (blogData.title && !blogData.slug && blogData.title !== blog.title) {
      blogData.slug = slugify(blogData.title);
    }
    
    await blog.update(blogData);
    
    // Emit real-time update
    if (req.io) {
      req.io.emit('blog_updated', blog);
    }
    
    res.json({
      success: true,
      message: 'Blog updated successfully',
      data: { blog }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update blog',
      error: error.message
    });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    
    const blog = await Blog.findByPk(id);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }
    
    await blog.destroy();
    
    // Emit real-time update
    if (req.io) {
      req.io.emit('blog_deleted', { id });
    }
    
    res.json({
      success: true,
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete blog',
      error: error.message
    });
  }
};

exports.getFeaturedBlogs = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 3;
    
    const blogs = await Blog.findAll({
      where: {
        status: 'published',
        featured: true
      },
      order: [['published_at', 'DESC']],
      limit
    });
    
    res.json({
      success: true,
      data: { blogs }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured blogs',
      error: error.message
    });
  }
};
