import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Candidate2026, { ICandidateListItem } from '@/models/Candidate2026';
import FingerprintLog from '@/models/FingerprintLog';

// POST /api/popularity-vote
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { fp, candidate_name, constituency_id } = body;

    // Validation
    if (!fp || !candidate_name || !constituency_id) {
      return NextResponse.json(
        { error: 'Missing required fields: fp, candidate_name, constituency_id' },
        { status: 400 }
      );
    }

    // Check if this fingerprint has already voted for this candidate
    const existingVote = await FingerprintLog.findOne({
      fingerprint: fp,
      candidate_name: candidate_name
    });

    if (existingVote) {
      return NextResponse.json(
        { error: 'You have already voted for this candidate', voted: true },
        { status: 409 }
      );
    }

    // Find the constituency and candidate
    const constituency = await Candidate2026.findOne({ constituency_id });
    if (!constituency) {
      return NextResponse.json(
        { error: 'Constituency not found' },
        { status: 404 }
      );
    }

    const candidate = constituency.candidate_list.find(
      (c: ICandidateListItem) => c.candidate_name === candidate_name
    );

    if (!candidate) {
      return NextResponse.json(
        { error: 'Candidate not found in this constituency' },
        { status: 404 }
      );
    }

    // Log the fingerprint vote
    await FingerprintLog.create({
      fingerprint: fp,
      candidate_name: candidate_name,
      constituency_id: constituency_id
    });

    // Increment popularity vote
    candidate.popularity_vote += 1;
    await constituency.save();

    return NextResponse.json({
      success: true,
      message: 'Vote recorded successfully',
      popularity_vote: candidate.popularity_vote
    });
  } catch (error) {
    console.error('Error recording vote:', error);
    
    // Handle duplicate key error (race condition)
    const mongoError = error as { code?: number; message?: string };
    if (mongoError.code === 11000) {
      return NextResponse.json(
        { error: 'You have already voted for this candidate', voted: true },
        { status: 409 }
      );
    }

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to record vote', details: errorMessage },
      { status: 500 }
    );
  }
}

// GET /api/popularity-vote?fp=xxx&candidate_name=xxx - Check if user has voted
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const fp = searchParams.get('fp');
    const candidate_name = searchParams.get('candidate_name');

    if (!fp || !candidate_name) {
      return NextResponse.json(
        { error: 'Missing required parameters: fp, candidate_name' },
        { status: 400 }
      );
    }

    const existingVote = await FingerprintLog.findOne({
      fingerprint: fp,
      candidate_name: candidate_name
    });

    return NextResponse.json({
      hasVoted: !!existingVote
    });
  } catch (error) {
    console.error('Error checking vote status:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to check vote status', details: errorMessage },
      { status: 500 }
    );
  }
}

