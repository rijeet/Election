import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Parliament from '@/models/Parliament';

// Available election years in the database
const AVAILABLE_ELECTION_YEARS = ['1973', '1979', '1986', '1988', '1991', '1996', '2001', '2009', '2014', '2019', '2024'];

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const electionYear = searchParams.get('year');
    
    if (!electionYear) {
      return NextResponse.json(
        { error: 'Election year is required' },
        { status: 400 }
      );
    }
    
    if (!AVAILABLE_ELECTION_YEARS.includes(electionYear)) {
      return NextResponse.json(
        { error: `No data available for election year ${electionYear}. Available years: ${AVAILABLE_ELECTION_YEARS.join(', ')}` },
        { status: 400 }
      );
    }
    
    // Get all constituencies for the election year with their party and color information
    const constituencies = await Parliament.find(
      { parliament: parseInt(electionYear) },
      { 
        constituency_number: 1, 
        constituency_name: 1, 
        party: 1, 
        color: 1,
        candidate: 1,
        isWinner: 1
      }
    ).sort({ constituency_number: 1 });
    
    // Create a map of constituency number to party color
    const constituencyColors: Record<number, {
      party: string;
      color: string;
      candidate: string;
      isWinner: boolean;
    }> = {};
    const partyInfo: Record<string, {
      name: string;
      color: string;
      seats: number;
    }> = {};
    
    constituencies.forEach(constituency => {
      const key = constituency.constituency_number;
      constituencyColors[key] = {
        party: constituency.party,
        color: constituency.color,
        candidate: constituency.candidate,
        isWinner: constituency.isWinner || false
      };
      
      // Track party information
      if (!partyInfo[constituency.party]) {
        partyInfo[constituency.party] = {
          name: constituency.party,
          color: constituency.color,
          seats: 0
        };
      }
      partyInfo[constituency.party].seats++;
    });
    
    // Convert partyInfo to array
    const parties = Object.values(partyInfo).sort((a, b) => b.seats - a.seats);
    
    return NextResponse.json({
      electionYear: electionYear,
      constituencies: constituencyColors,
      parties: parties,
      totalSeats: constituencies.length
    });
  } catch (error) {
    console.error('Error fetching parliament visualization data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch parliament visualization data' },
      { status: 500 }
    );
  }
}
