const mongoose = require('mongoose');

async function testConnection() {
  try {
    console.log('🔌 Testing MongoDB connection...');
    const uri = 'mongodb://localhost:27017/election-db';
    console.log('URI:', uri);
    
    await mongoose.connect(uri);
    console.log('✅ Successfully connected to local MongoDB!');
    
    // Test a simple operation
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📊 Available collections:', collections.map(c => c.name));
    
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  }
}

testConnection();
