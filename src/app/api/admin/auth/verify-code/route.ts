import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { verification_token, verification_code } = await request.json();

    if (!verification_token || !verification_code) {
      return NextResponse.json(
        { error: 'Verification token and code are required' },
        { status: 400 }
      );
    }

    // For demo purposes, accept any 6-digit code
    if (verification_code.length !== 6) {
      return NextResponse.json(
        { error: 'Invalid verification code format' },
        { status: 400 }
      );
    }

    // Generate a simple token (in production, use JWT)
    const token = Buffer.from(`admin:${Date.now()}`).toString('base64');
    
    return NextResponse.json({
      success: true,
      message: 'Verification successful',
      token,
      admin: {
        email: 'admin@election.gov.bd',
        name: 'Election Administrator',
        role: 'super_admin'
      }
    });

  } catch (error) {
    console.error('Admin verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
