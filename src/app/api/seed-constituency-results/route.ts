import { NextResponse } from 'next/server';
import { seedConstituencyResults } from '@/scripts/seedConstituencyResults';

export async function POST() {
  try {
    const result = await seedConstituencyResults();
    
    return NextResponse.json({
      message: 'Constituency results seeded successfully!',
      count: result.count
    });
  } catch (error) {
    console.error('Error seeding constituency results:', error);
    return NextResponse.json(
      { error: 'Failed to seed constituency results' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const result = await seedConstituencyResults();
    
    return NextResponse.json({
      message: 'Constituency results seeded successfully!',
      count: result.count
    });
  } catch (error) {
    console.error('Error seeding constituency results:', error);
    return NextResponse.json(
      { error: 'Failed to seed constituency results' },
      { status: 500 }
    );
  }
}
