import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Constituency from '@/models/Constituency';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const division = searchParams.get('division');
    const parliamentNumber = searchParams.get('parliament');
    
    const query: Record<string, string | number> = {};
    
    if (division) {
      query.division = division;
    }
    
    if (parliamentNumber) {
      query.parliamentNumber = parseInt(parliamentNumber);
    }
    
    const constituencies = await Constituency.find(query)
      .sort({ constituencyId: 1 })
      .lean();
    
    return NextResponse.json(constituencies);
  } catch (error) {
    console.error('Error fetching constituencies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch constituencies' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const constituency = new Constituency(body);
    await constituency.save();
    
    return NextResponse.json(constituency, { status: 201 });
  } catch (error) {
    console.error('Error creating constituency:', error);
    return NextResponse.json(
      { error: 'Failed to create constituency' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    await connectDB();
    
    await Constituency.deleteMany({});
    
    return NextResponse.json({ message: 'All constituencies deleted successfully' });
  } catch (error) {
    console.error('Error deleting constituencies:', error);
    return NextResponse.json(
      { error: 'Failed to delete constituencies' },
      { status: 500 }
    );
  }
}
