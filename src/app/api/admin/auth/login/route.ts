import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Admin from '@/models/Admin';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find admin by email
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    
    if (!admin) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if admin is active
    if (!admin.is_active) {
      return NextResponse.json(
        { error: 'Admin account is inactive' },
        { status: 403 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    
    if (!isPasswordValid) {
      // Record failed login attempt
      await Admin.findByIdAndUpdate(admin._id, {
        $push: {
          login_attempts: {
            ip_address: request.headers.get('x-forwarded-for') || 'unknown',
            user_agent: request.headers.get('user-agent') || 'unknown',
            success: false,
            timestamp: new Date()
          }
        }
      });

      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Record successful login attempt
    await Admin.findByIdAndUpdate(admin._id, {
      $push: {
        login_attempts: {
          ip_address: request.headers.get('x-forwarded-for') || 'unknown',
          user_agent: request.headers.get('user-agent') || 'unknown',
          success: true,
          timestamp: new Date()
        }
      },
      last_login: new Date()
    });

    // Generate a simple token (in production, use JWT)
    const token = Buffer.from(`${admin._id}:${Date.now()}`).toString('base64');
    
    return NextResponse.json({
      success: true,
      message: 'Login successful',
      token,
      admin: {
        id: admin._id.toString(),
        email: admin.email,
        name: admin.name,
        role: admin.role,
        permissions: admin.permissions
      }
    });

  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
