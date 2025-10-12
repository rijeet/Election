import { NextResponse } from 'next/server';
import { seedComprehensiveData } from '@/scripts/comprehensiveSeedData';

export async function GET() {
  try {
    await seedComprehensiveData();
    return NextResponse.json({ 
      message: 'Comprehensive database seeded successfully!',
      elections: 12,
      constituencies: 70
    });
  } catch (error) {
    console.error('Error seeding comprehensive database:', error);
    return NextResponse.json(
      { error: 'Failed to seed comprehensive database' },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    await seedComprehensiveData();
    return NextResponse.json({ 
      message: 'Comprehensive database seeded successfully!',
      elections: 12,
      constituencies: 70
    });
  } catch (error) {
    console.error('Error seeding comprehensive database:', error);
    return NextResponse.json(
      { error: 'Failed to seed comprehensive database' },
      { status: 500 }
    );
  }
}
