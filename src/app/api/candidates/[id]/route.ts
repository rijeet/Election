import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import InfoCandidate from '@/models/InfoCandidate';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    const candidate = await InfoCandidate.findOne({ id });
    
    if (!candidate) {
      return NextResponse.json(
        { error: 'Candidate not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(candidate);
  } catch (error) {
    console.error('Error fetching candidate:', error);
    return NextResponse.json(
      { error: 'Failed to fetch candidate' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    const body = await request.json();
    const candidate = await InfoCandidate.findOneAndUpdate(
      { id },
      body,
      { new: true, runValidators: true }
    );
    
    if (!candidate) {
      return NextResponse.json(
        { error: 'Candidate not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(candidate);
  } catch (error) {
    console.error('Error updating candidate:', error);
    return NextResponse.json(
      { error: 'Failed to update candidate' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    const candidate = await InfoCandidate.findOneAndDelete({ id });
    
    if (!candidate) {
      return NextResponse.json(
        { error: 'Candidate not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Candidate deleted successfully' });
  } catch (error) {
    console.error('Error deleting candidate:', error);
    return NextResponse.json(
      { error: 'Failed to delete candidate' },
      { status: 500 }
    );
  }
}
