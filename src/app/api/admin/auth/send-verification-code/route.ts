import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // For demo purposes, generate a simple verification token
    const verification_token = Buffer.from(`${email}:${Date.now()}`).toString('base64');
    
    return NextResponse.json({
      success: true,
      message: 'Verification code sent to your email address',
      verification_token
    });

  } catch (error) {
    console.error('Admin send verification code error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
