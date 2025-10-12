import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import InfoCandidate from '@/models/InfoCandidate';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const constituency = searchParams.get('constituency');
    const party = searchParams.get('party');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    const query: Record<string, unknown> = {};
    
    if (constituency) {
      query.constituency = { $regex: constituency, $options: 'i' };
    }
    
    if (party) {
      query.party = { $regex: party, $options: 'i' };
    }
    
    if (search) {
      query.$or = [
        { candidate_name: { $regex: search, $options: 'i' } },
        { constituency: { $regex: search, $options: 'i' } },
        { party: { $regex: search, $options: 'i' } }
      ];
    }
    
    const skip = (page - 1) * limit;
    
    const candidates = await InfoCandidate.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ candidate_name: 1 });
    
    const total = await InfoCandidate.countDocuments(query);
    
    return NextResponse.json({
      candidates,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching candidates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch candidates' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const candidate = new InfoCandidate(body);
    await candidate.save();
    
    return NextResponse.json(candidate, { status: 201 });
  } catch (error) {
    console.error('Error creating candidate:', error);
    return NextResponse.json(
      { error: 'Failed to create candidate' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    await connectDB();
    
    await InfoCandidate.deleteMany({});
    
    return NextResponse.json({ message: 'All candidates deleted successfully' });
  } catch (error) {
    console.error('Error deleting candidates:', error);
    return NextResponse.json(
      { error: 'Failed to delete candidates' },
      { status: 500 }
    );
  }
}
