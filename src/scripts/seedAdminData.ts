import connectDB from '@/lib/mongodb';
import Admin from '@/models/Admin';
import bcrypt from 'bcryptjs';

const adminData = [
  {
    email: 'rijeet2025@gmail.com',
    password: 'admin123',
    name: 'Election Administrator',
    role: 'super_admin' as const,
    permissions: [
      'manage_elections',
      'manage_candidates', 
      'manage_constituencies',
      'manage_newsfeed',
      'view_analytics',
      'manage_users',
      'system_settings'
    ],
    is_active: true
  },
  {
    email: 'moderator@election.gov.bd',
    password: 'mod123',
    name: 'Election Moderator',
    role: 'moderator' as const,
    permissions: [
      'manage_newsfeed',
      'view_analytics'
    ],
    is_active: true
  },
  {
    email: 'analyst@election.gov.bd',
    password: 'analyst123',
    name: 'Data Analyst',
    role: 'admin' as const,
    permissions: [
      'view_analytics',
      'manage_candidates'
    ],
    is_active: true
  }
];

export async function seedAdminData() {
  try {
    await connectDB();
    console.log('Connected to MongoDB for admin seeding...');

    // Clear existing admin data
    await Admin.deleteMany({});
    console.log('Cleared existing admin data...');

    // Hash passwords and create admin users
    const hashedAdmins = await Promise.all(
      adminData.map(async (admin) => ({
        ...admin,
        password: await bcrypt.hash(admin.password, 12)
      }))
    );

    // Insert admin data
    const createdAdmins = await Admin.insertMany(hashedAdmins);
    console.log(`✅ Successfully seeded ${createdAdmins.length} admin users:`);
    
    createdAdmins.forEach(admin => {
      console.log(`   - ${admin.name} (${admin.email}) - Role: ${admin.role}`);
    });

    return {
      success: true,
      message: `Successfully seeded ${createdAdmins.length} admin users`,
      count: createdAdmins.length
    };

  } catch (error) {
    console.error('❌ Error seeding admin data:', error);
    return {
      success: false,
      message: 'Failed to seed admin data',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Run if called directly
if (require.main === module) {
  seedAdminData()
    .then(result => {
      console.log('Admin seeding result:', result);
      process.exit(0);
    })
    .catch(error => {
      console.error('Admin seeding failed:', error);
      process.exit(1);
    });
}
