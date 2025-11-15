import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Party2026 from '@/models/Party2026';

// GET /api/party2026 - Get all parties
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');
    const alliance = searchParams.get('alliance');

    if (name) {
      // Get specific party by name
      const party = await Party2026.findOne({ 'party.name': name });
      if (!party) {
        return NextResponse.json(
          { error: 'Party not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(party);
    }

    if (alliance) {
      // Get parties by alliance
      const parties = await Party2026.find({ 'alliance.name': alliance });
      return NextResponse.json(parties);
    }

    // Get all parties
    const parties = await Party2026.find({}).sort({ 'party.name': 1 });
    return NextResponse.json(parties);
  } catch (error) {
    console.error('Error fetching parties:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to fetch parties', details: errorMessage },
      { status: 500 }
    );
  }
}

// POST /api/party2026 - Create a new party
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    // Validation
    if (!body.party?.name || !body.party?.abbreviation || !body.party?.leader) {
      return NextResponse.json(
        { error: 'Missing required fields: party.name, party.abbreviation, party.leader' },
        { status: 400 }
      );
    }

    const party = new Party2026(body);
    await party.save();

    return NextResponse.json(party, { status: 201 });
  } catch (error) {
    console.error('Error creating party:', error);
    const mongoError = error as { code?: number; message?: string };
    if (mongoError.code === 11000) {
      return NextResponse.json(
        { error: 'Party already exists' },
        { status: 409 }
      );
    }
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to create party', details: errorMessage },
      { status: 500 }
    );
  }
}

