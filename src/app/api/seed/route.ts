import { NextResponse } from 'next/server';
import { seedDatabase } from '@/scripts/seedData';

export async function GET() {
  try {
    await seedDatabase();
    return NextResponse.json({ message: 'Database seeded successfully!' });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json(
      { error: 'Failed to seed database' },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    await seedDatabase();
    return NextResponse.json({ message: 'Database seeded successfully!' });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json(
      { error: 'Failed to seed database' },
      { status: 500 }
    );
  }
}
