import { NextResponse } from 'next/server';
import seedPartyAlliances from '@/scripts/seedPartyAlliances';

// POST - Seed party alliances data
export async function POST() {
  try {
    const result = await seedPartyAlliances();
    
    return NextResponse.json({
      success: true,
      message: result.message,
      count: result.count
    });
  } catch (error) {
    console.error('Error seeding party alliances:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to seed party alliances',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET - Seed party alliances data (for browser access)
export async function GET() {
  try {
    const result = await seedPartyAlliances();
    
    return NextResponse.json({
      success: true,
      message: result.message,
      count: result.count
    });
  } catch (error) {
    console.error('Error seeding party alliances:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to seed party alliances',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
