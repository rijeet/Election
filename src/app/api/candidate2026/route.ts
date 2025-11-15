import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Candidate2026, { ICandidateListItem } from '@/models/Candidate2026';
import Party2026 from '@/models/Party2026';

// GET /api/candidate2026?constituency=Dhaka-14
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const constituency = searchParams.get('constituency');
    const party = searchParams.get('party');
    const division = searchParams.get('division');
    const district = searchParams.get('district');

    const query: Record<string, string> = {};

    if (constituency) {
      query.constituency_id = constituency;
    }
    if (party) {
      query['candidate_list.party_name'] = party;
    }
    if (division) {
      query.division = division;
    }
    if (district) {
      query.district = district;
    }

    const constituencies = await Candidate2026.find(query);

    // Join party information for each candidate
    const constituenciesWithPartyInfo = await Promise.all(
      constituencies.map(async (constituency) => {
        const candidateListWithPartyInfo = await Promise.all(
          constituency.candidate_list.map(async (candidate: ICandidateListItem) => {
            const partyInfo = await Party2026.findOne({ 'party.name': candidate.party_name });
            // Convert subdocument to plain object if needed
            type CandidateWithToObject = ICandidateListItem & { toObject?: () => ICandidateListItem };
            const candidateWithMethod = candidate as CandidateWithToObject;
            const candidateObj = candidateWithMethod && typeof candidateWithMethod.toObject === 'function' 
              ? candidateWithMethod.toObject() 
              : candidate;
            return {
              ...candidateObj,
              party_info: partyInfo || null
            };
          })
        );

        return {
          ...constituency.toObject(),
          candidate_list: candidateListWithPartyInfo
        };
      })
    );

    return NextResponse.json(constituenciesWithPartyInfo);
  } catch (error) {
    console.error('Error fetching candidates:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to fetch candidates', details: errorMessage },
      { status: 500 }
    );
  }
}

// POST /api/candidate2026 - Create a new constituency
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    // Validation
    if (!body.division || !body.district || !body.constituency_id || !body.election_date) {
      return NextResponse.json(
        { error: 'Missing required fields: division, district, constituency_id, election_date' },
        { status: 400 }
      );
    }

    const constituency = new Candidate2026(body);
    await constituency.save();

    return NextResponse.json(constituency, { status: 201 });
  } catch (error) {
    console.error('Error creating constituency:', error);
    const mongoError = error as { code?: number; message?: string };
    if (mongoError.code === 11000) {
      return NextResponse.json(
        { error: 'Constituency already exists' },
        { status: 409 }
      );
    }
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to create constituency', details: errorMessage },
      { status: 500 }
    );
  }
}

