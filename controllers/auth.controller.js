const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Student, Teacher } = require('../models');
const { JWT_SECRET } = require('../middleware/auth');
const { isDisposableEmail } = require('../middleware/validators');

const SALT_ROUNDS = 12;

exports.register = async (req, res) => {
  try {
    const { name, email, password, role = 'STUDENT', ...profileData } = req.body;
    
    // Check for disposable email
    if (isDisposableEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Disposable email addresses are not allowed'
      });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    
    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role === 'TEACHER' ? 'TEACHER' : 'STUDENT',
      status: 'active'
    });
    
    // Create profile based on role
    if (user.role === 'STUDENT') {
      await Student.create({
        user_id: user.id,
        father_name: profileData.father_name || null,
        whatsapp: profileData.whatsapp || null,
        country: profileData.country || null,
        city: profileData.city || null,
        date_of_birth: profileData.date_of_birth || null,
        gender: profileData.gender || null,
        preferred_language: profileData.preferred_language || 'english'
      });
    }
    
    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );
    
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    // Check if user is banned
    if (user.status === 'banned') {
      return res.status(403).json({
        success: false,
        message: 'Your account has been banned. Please contact support.'
      });
    }
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    // Update last login
    await user.update({ last_login: new Date() });
    
    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );
    
    // Get profile data based on role
    let profile = null;
    if (user.role === 'STUDENT') {
      profile = await Student.findOne({ where: { user_id: user.id } });
    } else if (user.role === 'TEACHER') {
      profile = await Teacher.findOne({ where: { user_id: user.id } });
    }
    
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          profile_image: user.profile_image,
          preferred_language: user.preferred_language
        },
        profile,
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
};

exports.logout = async (req, res) => {
  // Client-side should remove the token
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    
    let profile = null;
    if (user.role === 'STUDENT') {
      profile = await Student.findOne({ where: { user_id: user.id } });
    } else if (user.role === 'TEACHER') {
      profile = await Teacher.findOne({ where: { user_id: user.id } });
    }
    
    res.json({
      success: true,
      data: {
        user,
        profile
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get user data',
      error: error.message
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const userUpdates = {};
    const profileUpdates = {};
    
    // Separate user fields from profile fields
    const userFields = ['name', 'phone', 'country', 'city', 'preferred_language'];
    const profileFields = ['father_name', 'whatsapp', 'date_of_birth', 'gender', 
                          'address', 'highest_qualification', 'experience'];
    
    for (const key in req.body) {
      if (userFields.includes(key)) {
        userUpdates[key] = req.body[key];
      } else if (profileFields.includes(key)) {
        profileUpdates[key] = req.body[key];
      }
    }
    
    // Update user
    if (Object.keys(userUpdates).length > 0) {
      await User.update(userUpdates, { where: { id: userId } });
    }
    
    // Update profile
    if (Object.keys(profileUpdates).length > 0) {
      if (req.user.role === 'STUDENT') {
        await Student.update(profileUpdates, { where: { user_id: userId } });
      } else if (req.user.role === 'TEACHER') {
        await Teacher.update(profileUpdates, { where: { user_id: userId } });
      }
    }
    
    res.json({
      success: true,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;
    
    const user = await User.findByPk(userId);
    
    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
    
    await User.update({ password: hashedPassword }, { where: { id: userId } });
    
    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to change password',
      error: error.message
    });
  }
};
