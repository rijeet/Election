import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Party2026 from '@/models/Party2026';

// GET /api/party2026/[name] - Get party by name
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    await connectDB();

    const { name } = await params;
    const decodedName = decodeURIComponent(name);
    const party = await Party2026.findOne({ 'party.name': decodedName });

    if (!party) {
      return NextResponse.json(
        { error: 'Party not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(party);
  } catch (error) {
    console.error('Error fetching party:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to fetch party', details: errorMessage },
      { status: 500 }
    );
  }
}

