import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import PartyAlliance from '@/models/PartyAlliance';

// GET - Fetch all party alliances or filter by parliament
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const parliament = searchParams.get('parliament');
    const alliance = searchParams.get('alliance');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    
    const query: Record<string, unknown> = {};
    
    if (parliament) {
      query.parliament_number = parseInt(parliament);
    }
    
    if (alliance) {
      query.alliance_name = { $regex: alliance, $options: 'i' };
    }
    
    const skip = (page - 1) * limit;
    
    const [alliances, total] = await Promise.all([
      PartyAlliance.find(query)
        .sort({ parliament_number: -1, alliance_name: 1, is_alliance_leader: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      PartyAlliance.countDocuments(query)
    ]);
    
    return NextResponse.json({
      success: true,
      data: alliances,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching party alliances:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch party alliances' },
      { status: 500 }
    );
  }
}

// POST - Create new party alliance
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    const alliance = new PartyAlliance(body);
    await alliance.save();
    
    return NextResponse.json({
      success: true,
      data: alliance,
      message: 'Party alliance created successfully'
    });
  } catch (error) {
    console.error('Error creating party alliance:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create party alliance' },
      { status: 500 }
    );
  }
}

// DELETE - Clear all party alliances
export async function DELETE() {
  try {
    await connectDB();
    
    await PartyAlliance.deleteMany({});
    
    return NextResponse.json({
      success: true,
      message: 'All party alliances cleared successfully'
    });
  } catch (error) {
    console.error('Error clearing party alliances:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to clear party alliances' },
      { status: 500 }
    );
  }
}
