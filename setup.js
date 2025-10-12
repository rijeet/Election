const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Bangladesh Election Timeline...\n');

// Check if .env.local exists
const envPath = path.join(__dirname, '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env.local file...');
  const envContent = `MONGODB_URI=mongodb://localhost:27017/election-db
`;
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env.local created with default MongoDB URI');
  console.log('   Please update MONGODB_URI if using MongoDB Atlas\n');
} else {
  console.log('✅ .env.local already exists\n');
}

// Check if node_modules exists
const nodeModulesPath = path.join(__dirname, 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.log('📦 Installing dependencies...');
  try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Dependencies installed\n');
  } catch (error) {
    console.error('❌ Failed to install dependencies:', error.message);
    process.exit(1);
  }
} else {
  console.log('✅ Dependencies already installed\n');
}

console.log('🎉 Setup complete! Next steps:');
console.log('1. Make sure MongoDB is running (local or Atlas)');
console.log('2. Run: npm run dev');
console.log('3. In another terminal, run: npm run seed');
console.log('4. Open http://localhost:3000 in your browser\n');

console.log('📚 For detailed instructions, see README.md');
