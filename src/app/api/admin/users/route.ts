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

    await connectDB();

    // Fetch all admin users (excluding password field)
    const admins = await Admin.find({}, { password: 0 }).sort({ created_at: -1 });

    return NextResponse.json({
      success: true,
      admins: admins
    });

  } catch (error) {
    console.error('Admin users fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
