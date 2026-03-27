const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const { sequelize } = require('../models');
const { seedAdmin, seedCourses } = require('./index');

/**
 * Migration runner
 * This script creates tables and seeds initial data
 */
async function migrate() {
  try {
    console.log('=================================');
    console.log('  Al-Itqan Database Migration');
    console.log('=================================\n');
    
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established.\n');
    
    // Sync all models
    console.log('🔄 Syncing database models...');
    await sequelize.sync({ alter: true });
    console.log('✅ Models synchronized.\n');
    
    // Seed data
    await seedAdmin();
    await seedCourses();
    
    console.log('\n=================================');
    console.log('  ✅ Migration completed!');
    console.log('=================================');
    console.log('\nYou can now start the server with:');
    console.log('  npm start');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// Run migration if called directly
if (require.main === module) {
  migrate();
}

module.exports = migrate;
