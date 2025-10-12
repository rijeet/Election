import { NextRequest, NextResponse } from 'next/server';
import { seedAdminData } from '@/scripts/seedAdminData';

export async function POST(request: NextRequest) {
  try {
    const result = await seedAdminData();
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
        count: result.count
      });
    } else {
      return NextResponse.json({
        success: false,
        message: result.message,
        error: result.error
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Admin seeding API error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to seed admin data',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const result = await seedAdminData();
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
        count: result.count
      });
    } else {
      return NextResponse.json({
        success: false,
        message: result.message,
        error: result.error
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Admin seeding API error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to seed admin data',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
