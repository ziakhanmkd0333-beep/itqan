const bcrypt = require('bcryptjs');
const { User, Course } = require('../models');
const coursesData = require('./courses.data');

const SALT_ROUNDS = 12;

/**
 * Seed admin user with provided credentials
 */
async function seedAdmin() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'pass93630@gmail.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'WAQASkhan@5713079';
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ 
      where: { email: adminEmail } 
    });
    
    if (existingAdmin) {
      console.log('Admin user already exists:', adminEmail);
      return;
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, SALT_ROUNDS);
    
    // Create super admin
    const admin = await User.create({
      name: 'Al-Itqan Administrator',
      email: adminEmail,
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      status: 'active',
      preferred_language: 'english'
    });
    
    console.log('✅ Admin user created successfully:');
    console.log('   Email:', adminEmail);
    console.log('   Role:', admin.role);
  } catch (error) {
    console.error('❌ Error seeding admin:', error.message);
    throw error;
  }
}

/**
 * Seed all 24 courses
 */
async function seedCourses() {
  try {
    console.log('\n🚀 Starting to seed 24 courses...');
    
    // Check if courses already exist
    const existingCount = await Course.count();
    if (existingCount > 0) {
      console.log(`⚠️  ${existingCount} courses already exist in database.`);
      console.log('   Skipping course seeding to avoid duplicates.');
      console.log('   Delete existing courses first if you want to re-seed.');
      return;
    }
    
    // Insert all courses
    for (const courseData of coursesData) {
      await Course.create({
        ...courseData,
        status: 'active',
        students_count: 0
      });
    }
    
    console.log(`✅ ${coursesData.length} courses seeded successfully!`);
    
    // Print summary by category
    const categories = {};
    coursesData.forEach(course => {
      categories[course.category] = (categories[course.category] || 0) + 1;
    });
    
    console.log('\n📊 Course Distribution:');
    for (const [category, count] of Object.entries(categories)) {
      console.log(`   ${category}: ${count} courses`);
    }
  } catch (error) {
    console.error('❌ Error seeding courses:', error.message);
    throw error;
  }
}

/**
 * Main seed function
 */
async function seedAll() {
  try {
    console.log('=================================');
    console.log('  Al-Itqan Database Seeder');
    console.log('=================================\n');
    
    await seedAdmin();
    await seedCourses();
    
    console.log('\n=================================');
    console.log('  ✅ Seeding completed!');
    console.log('=================================');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seeding failed:', error.message);
    process.exit(1);
  }
}

// Run seed if called directly
if (require.main === module) {
  seedAll();
}

module.exports = { seedAdmin, seedCourses, seedAll };
