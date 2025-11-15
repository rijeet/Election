import { seedAdminData } from './seedAdminData';

async function runSeed() {
  console.log('🌱 Starting admin data seeding...');
  const result = await seedAdminData();
  
  if (result.success) {
    console.log('✅ Admin seeding completed successfully!');
    console.log('\n📋 Admin Login Credentials:');
    console.log('================================');
    console.log('🔑 Super Admin:');
    console.log('   Email: rijeet2025@gmail.com');
    console.log('   Password: TIME4@nonr');
    console.log('   Role: super_admin (full permissions)');
    console.log('');
    console.log('🔑 Moderator:');
    console.log('   Email: moderator@election.gov.bd');
    console.log('   Password: mod123');
    console.log('   Role: moderator (limited permissions)');
    console.log('');
    console.log('🔑 Data Analyst:');
    console.log('   Email: analyst@election.gov.bd');
    console.log('   Password: analyst123');
    console.log('   Role: admin (analytics permissions)');
    console.log('================================');
  } else {
    console.log('❌ Admin seeding failed:', result.message);
  }
}

runSeed().catch(console.error);

