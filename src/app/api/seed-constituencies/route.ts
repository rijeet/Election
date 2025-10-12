import { NextResponse } from 'next/server';
import { seedConstituencies } from '@/scripts/seedConstituencies';

export async function GET() {
  try {
    await seedConstituencies();
    return NextResponse.json({ message: 'Constituency database seeded successfully!' });
  } catch (error) {
    console.error('Error seeding constituency database:', error);
    return NextResponse.json(
      { error: 'Failed to seed constituency database' },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    await seedConstituencies();
    return NextResponse.json({ message: 'Constituency database seeded successfully!' });
  } catch (error) {
    console.error('Error seeding constituency database:', error);
    return NextResponse.json(
      { error: 'Failed to seed constituency database' },
      { status: 500 }
    );
  }
}
