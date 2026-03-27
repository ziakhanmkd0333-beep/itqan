const { Admission, Student, Teacher, User } = require('../models');
const { Op } = require('sequelize');
const { isDisposableEmail } = require('../middleware/validators');

exports.createStudentAdmission = async (req, res) => {
  try {
    const admissionData = req.body;
    
    // Check for disposable email
    if (isDisposableEmail(admissionData.email)) {
      return res.status(400).json({
        success: false,
        message: 'Disposable email addresses are not allowed'
      });
    }
    
    // Get IP and user agent
    const ip_address = req.ip || req.connection.remoteAddress;
    const user_agent = req.headers['user-agent'];
    
    const admission = await Admission.create({
      type: 'student',
      full_name: admissionData.full_name,
      email: admissionData.email,
      phone: admissionData.phone || admissionData.whatsapp,
      country: admissionData.country,
      city: admissionData.city,
      data: admissionData,
      ip_address,
      user_agent,
      status: 'pending'
    });
    
    // Emit real-time notification to admins
    if (req.io) {
      req.io.emit('new_admission', {
        type: 'student',
        admission: admission.toJSON()
      });
    }
    
    res.status(201).json({
      success: true,
      message: 'Student application submitted successfully. We will contact you soon.',
      data: { admission }
    });
  } catch (error) {
    console.error('Admission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit application',
      error: error.message
    });
  }
};

exports.createTeacherAdmission = async (req, res) => {
  try {
    const admissionData = req.body;
    
    // Check for disposable email
    if (isDisposableEmail(admissionData.email)) {
      return res.status(400).json({
        success: false,
        message: 'Disposable email addresses are not allowed'
      });
    }
    
    // Get IP and user agent
    const ip_address = req.ip || req.connection.remoteAddress;
    const user_agent = req.headers['user-agent'];
    
    const admission = await Admission.create({
      type: 'teacher',
      full_name: admissionData.full_name,
      email: admissionData.email,
      phone: admissionData.phone,
      country: admissionData.country,
      city: admissionData.city,
      data: admissionData,
      ip_address,
      user_agent,
      status: 'pending'
    });
    
    // Also create teacher record
    await Teacher.create({
      full_name: admissionData.full_name,
      email: admissionData.email,
      phone: admissionData.phone,
      country: admissionData.country,
      city: admissionData.city,
      highest_qualification: admissionData.highest_qualification,
      field_of_study: admissionData.field_of_study,
      institution_name: admissionData.institution_name,
      year_of_completion: admissionData.year_of_completion,
      total_experience: admissionData.total_experience,
      teaching_type: admissionData.teaching_type,
      previously_taught_subjects: admissionData.previously_taught_subjects,
      primary_specialization: admissionData.primary_specialization,
      secondary_specialization: admissionData.secondary_specialization,
      languages_known: admissionData.languages_known,
      preferred_teaching_language: admissionData.preferred_teaching_language,
      available_days: admissionData.available_days,
      available_time_slots: admissionData.available_time_slots,
      device_type: admissionData.device_type,
      internet_quality: admissionData.internet_quality,
      cv_file: admissionData.cv_file,
      certificates: admissionData.certificates,
      why_teach_at_itqan: admissionData.why_teach_at_itqan,
      short_bio: admissionData.short_bio,
      application_status: 'pending'
    });
    
    // Emit real-time notification to admins
    if (req.io) {
      req.io.emit('new_admission', {
        type: 'teacher',
        admission: admission.toJSON()
      });
    }
    
    res.status(201).json({
      success: true,
      message: 'Teacher application submitted successfully. We will review and contact you soon.',
      data: { admission }
    });
  } catch (error) {
    console.error('Teacher admission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit application',
      error: error.message
    });
  }
};

exports.getAllAdmissions = async (req, res) => {
  try {
    const { 
      type,
      status,
      search,
      page = 1, 
      limit = 10
    } = req.query;
    
    const whereClause = {};
    
    if (type) {
      whereClause.type = type;
    }
    
    if (status) {
      whereClause.status = status;
    }
    
    if (search) {
      whereClause[Op.or] = [
        { full_name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }
    
    const offset = (page - 1) * limit;
    
    const { count, rows: admissions } = await Admission.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'reviewer',
          attributes: ['id', 'name']
        }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    res.json({
      success: true,
      data: {
        admissions,
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
      message: 'Failed to fetch admissions',
      error: error.message
    });
  }
};

exports.updateAdmissionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    
    const admission = await Admission.findByPk(id);
    
    if (!admission) {
      return res.status(404).json({
        success: false,
        message: 'Admission not found'
      });
    }
    
    await admission.update({
      status,
      notes,
      reviewed_by: req.user.id,
      reviewed_at: new Date()
    });
    
    // If approved, create appropriate user account
    if (status === 'approved') {
      if (admission.type === 'student') {
        // Create student user
        await Student.create({
          // Link to the application data
        });
      } else if (admission.type === 'teacher') {
        await Teacher.update(
          { application_status: 'approved' },
          { where: { email: admission.email } }
        );
      }
    }
    
    // Emit real-time update
    if (req.io) {
      req.io.emit('admission_updated', admission);
    }
    
    res.json({
      success: true,
      message: 'Admission status updated successfully',
      data: { admission }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update admission',
      error: error.message
    });
  }
};

exports.getAdmissionById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const admission = await Admission.findByPk(id, {
      include: [
        {
          model: User,
          as: 'reviewer',
          attributes: ['id', 'name']
        }
      ]
    });
    
    if (!admission) {
      return res.status(404).json({
        success: false,
        message: 'Admission not found'
      });
    }
    
    res.json({
      success: true,
      data: { admission }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admission',
      error: error.message
    });
  }
};
