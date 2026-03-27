const { Course, Teacher, Student } = require('../models');
const { Op } = require('sequelize');

exports.getAllCourses = async (req, res) => {
  try {
    const { 
      category, 
      level, 
      status = 'active',
      search,
      page = 1, 
      limit = 12,
      sortBy = 'sort_order',
      order = 'ASC'
    } = req.query;
    
    const whereClause = { status };
    
    if (category) {
      whereClause.category = category;
    }
    
    if (level) {
      whereClause.level = level;
    }
    
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }
    
    const offset = (page - 1) * limit;
    
    const { count, rows: courses } = await Course.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Teacher,
          as: 'teacher',
          attributes: ['id', 'full_name']
        }
      ],
      order: [[sortBy, order]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    res.json({
      success: true,
      data: {
        courses,
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
      message: 'Failed to fetch courses',
      error: error.message
    });
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const course = await Course.findByPk(id, {
      include: [
        {
          model: Teacher,
          as: 'teacher',
          attributes: ['id', 'full_name', 'qualification', 'experience']
        },
        {
          model: Student,
          as: 'students',
          where: { enrollment_status: 'approved' },
          required: false,
          include: ['user']
        }
      ]
    });
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    res.json({
      success: true,
      data: { course }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch course',
      error: error.message
    });
  }
};

exports.createCourse = async (req, res) => {
  try {
    const courseData = req.body;
    
    const course = await Course.create(courseData);
    
    // Emit real-time update
    if (req.io) {
      req.io.emit('course_created', course);
    }
    
    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: { course }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create course',
      error: error.message
    });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const courseData = req.body;
    
    const course = await Course.findByPk(id);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    await course.update(courseData);
    
    // Emit real-time update
    if (req.io) {
      req.io.emit('course_updated', course);
    }
    
    res.json({
      success: true,
      message: 'Course updated successfully',
      data: { course }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update course',
      error: error.message
    });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    
    const course = await Course.findByPk(id);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    // Soft delete - change status instead of removing
    await course.update({ status: 'inactive' });
    
    // Emit real-time update
    if (req.io) {
      req.io.emit('course_deleted', { id });
    }
    
    res.json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete course',
      error: error.message
    });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = [
      { value: 'Quran', label: 'Quran', label_ar: 'القرآن الكريم', count: 0 },
      { value: 'Arabic', label: 'Arabic Language', label_ar: 'اللغة العربية', count: 0 },
      { value: 'Fiqh', label: 'Fiqh', label_ar: 'الفقه', count: 0 },
      { value: 'Sarf', label: 'Sarf & Nahw', label_ar: 'الصرف والنحو', count: 0 },
      { value: 'Hadith', label: 'Hadith', label_ar: 'الحديث الشريف', count: 0 }
    ];
    
    // Get actual counts
    for (const cat of categories) {
      const count = await Course.count({ 
        where: { 
          category: cat.value,
          status: 'active'
        } 
      });
      cat.count = count;
    }
    
    res.json({
      success: true,
      data: { categories }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error.message
    });
  }
};

exports.getLevels = async (req, res) => {
  try {
    const levels = [
      { value: 'Beginner', label: 'Beginner', label_ar: 'مبتدئ' },
      { value: 'Intermediate', label: 'Intermediate', label_ar: 'متوسط' },
      { value: 'Advanced', label: 'Advanced', label_ar: 'متقدم' },
      { value: 'Specialized', label: 'Specialized', label_ar: 'متخصص' }
    ];
    
    res.json({
      success: true,
      data: { levels }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch levels',
      error: error.message
    });
  }
};
