import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Admin from '@/models/Admin';

export async function GET(request: NextRequest) {
  try {
    // Simple token validation (in production, use proper JWT validation)
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Extract admin ID from token (simple base64 decode for demo)
    const token = authHeader.replace('Bearer ', '');
    const decodedToken = Buffer.from(token, 'base64').toString('utf-8');
    const adminId = decodedToken.split(':')[0];

    await connectDB();

    // Fetch admin profile (excluding password)
    const admin = await Admin.findById(adminId, { password: 0 });

    if (!admin) {
      return NextResponse.json(
        { error: 'Admin not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      admin: {
        _id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        permissions: admin.permissions,
        is_active: admin.is_active,
        last_login: admin.last_login,
        created_at: admin.created_at
      }
    });

  } catch (error) {
    console.error('Admin profile fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
