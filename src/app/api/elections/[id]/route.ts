import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Election from '@/models/Election';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    const election = await Election.findOne({ parliamentNumber: parseInt(id) });
    
    if (!election) {
      return NextResponse.json(
        { error: 'Election not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(election);
  } catch (error) {
    console.error('Error fetching election:', error);
    return NextResponse.json(
      { error: 'Failed to fetch election' },
      { status: 500 }
    );
  }
}
