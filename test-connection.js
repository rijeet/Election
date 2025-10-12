const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function testConnection() {
  try {
    console.log('🔌 Testing MongoDB connection...');
    console.log('URI:', process.env.MONGODB_URI);
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Successfully connected to local MongoDB!');
    
    // Test a simple operation
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📊 Available collections:', collections.map(c => c.name));
    
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    
    if (error.message.includes('authentication failed')) {
      console.log('\n🔍 Authentication Error - Check:');
      console.log('1. Username: rijeet2025_db_user');
      console.log('2. Password: Make sure it matches your MongoDB Atlas password');
      console.log('3. User permissions: Should have "Atlas admin" role');
    } else if (error.message.includes('network')) {
      console.log('\n🔍 Network Error - Check:');
      console.log('1. IP whitelist in MongoDB Atlas');
      console.log('2. Internet connection');
    }
  }
}

testConnection();
