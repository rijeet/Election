import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Parliament from '@/models/Parliament';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const parliament = searchParams.get('parliament');
    
    if (!parliament) {
      return NextResponse.json(
        { error: 'Parliament number is required' },
        { status: 400 }
      );
    }
    
    const constituencyResults = await Parliament.find({ 
      parliament: parseInt(parliament) 
    })
    .sort({ constituency_number: 1 })
    .lean();
    
    return NextResponse.json(constituencyResults);
  } catch (error) {
    console.error('Error fetching constituency results:', error);
    return NextResponse.json(
      { error: 'Failed to fetch constituency results' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const constituencyResult = new Parliament(body);
    await constituencyResult.save();
    
    return NextResponse.json(constituencyResult, { status: 201 });
  } catch (error) {
    console.error('Error creating constituency result:', error);
    return NextResponse.json(
      { error: 'Failed to create constituency result' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    await connectDB();
    
    await Parliament.deleteMany({});
    
    return NextResponse.json({ message: 'All constituency results deleted successfully' });
  } catch (error) {
    console.error('Error deleting constituency results:', error);
    return NextResponse.json(
      { error: 'Failed to delete constituency results' },
      { status: 500 }
    );
  }
}
