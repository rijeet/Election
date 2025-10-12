import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Election from '@/models/Election';

export async function GET() {
  try {
    await connectDB();
    
    const elections = await Election.find({})
      .sort({ parliamentNumber: 1 })
      .lean();
    
    return NextResponse.json(elections);
  } catch (error) {
    console.error('Error fetching elections:', error);
    return NextResponse.json(
      { error: 'Failed to fetch elections' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const election = new Election(body);
    await election.save();
    
    return NextResponse.json(election, { status: 201 });
  } catch (error) {
    console.error('Error creating election:', error);
    return NextResponse.json(
      { error: 'Failed to create election' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    await connectDB();
    
    await Election.deleteMany({});
    
    return NextResponse.json({ message: 'All elections deleted successfully' });
  } catch (error) {
    console.error('Error deleting elections:', error);
    return NextResponse.json(
      { error: 'Failed to delete elections' },
      { status: 500 }
    );
  }
}
