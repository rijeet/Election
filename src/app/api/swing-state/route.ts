import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Parliament from '@/models/Parliament';

interface PartyRecord {
  party: string;
  color: string;
  wins: number;
}

interface ConstituencyRecord {
  constituency_name: string;
  winners: Record<string, PartyRecord>;
  totalWins: number;
}

export async function GET() {
  try {
    await connectDB();
    
    // Target parliaments: 5, 7, 8, 9
    const targetParliaments = [5, 7, 8, 9];
    
    // Use aggregation to group by constituency and count winners
    const db = await import('mongoose').then(m => m.default.connection.db);
    const swingStates = await db.collection('swing_state').aggregate([
      {
        $match: {
          parliamentNumber: { $in: targetParliaments }
        }
      },
      {
        $group: {
          _id: '$constituencyId',
          winners: {
            $push: {
              parliamentNumber: '$parliamentNumber',
              party: '$Winner',
              parliament: '$parliamentNumber'
            }
          }
        }
      },
      {
        $project: {
          constituencyId: '$_id',
          winners: 1,
          _id: 0
        }
      }
    ]).toArray();
    
    // Map to calculate party counts per constituency
    const constituencyMap = new Map<string, ConstituencyRecord>();
    
    swingStates.forEach((swingState: { constituencyId: string; winners: Array<{ parliamentNumber: number; party: string }> }) => {
      const key = swingState.constituencyId;
      
      if (!constituencyMap.has(key)) {
        constituencyMap.set(key, {
          constituency_name: key,
          winners: {},
          totalWins: 0
        });
      }
      
      const record = constituencyMap.get(key)!;
      
      // Count wins by party
      swingState.winners.forEach((winner: { parliamentNumber: number; party: string }) => {
        const partyName = winner.party;
        
        if (!record.winners[partyName]) {
          // Use default colors for major parties
          record.winners[partyName] = {
            party: partyName,
            color: getPartyColor(partyName),
            wins: 0
          };
        }
        
        record.winners[partyName].wins++;
        record.totalWins++;
      });
    });
    
    function getPartyColor(partyName: string): string {
      const colorMap: Record<string, string> = {
        'Bangladesh Awami League': '#00A228',
        'Bangladesh Nationalist Party': '#FF6B35',
        'Jatiya Party': '#FDD60F',
        'Workers Party': '#E50305',
        'Jatiya Samajtantrik Dal': '#2C61E3'
      };
      return colorMap[partyName] || '#9CA3AF';
    }
    
    // Calculate swing state patterns
    const swingStatesResults = Array.from(constituencyMap.values()).map(record => {
      const parties = Object.values(record.winners);
      const maxWins = Math.max(...parties.map((p: PartyRecord) => p.wins));
      const partiesByWins = parties.filter((p: PartyRecord) => p.wins === maxWins);
      
      // Determine swing state
      let swingState: string;
      let dominantParty: { party: string; color: string } | null = null;
      let stability: string;
      
      if (maxWins === 4) {
        // Won by same party in all 4 elections
        swingState = 'solid';
        dominantParty = partiesByWins[0]!;
        stability = 'very_high';
      } else if (maxWins === 3) {
        // Won by same party in 3 of 4 elections
        swingState = 'leaning';
        dominantParty = partiesByWins[0]!;
        stability = 'high';
      } else if (maxWins === 2 && partiesByWins.length === 2) {
        // Split evenly between 2 parties (2-2)
        swingState = 'toss_up';
        dominantParty = null;
        stability = 'low';
      } else {
        // Multiple splits
        swingState = 'competitive';
        dominantParty = partiesByWins[0] || null;
        stability = 'moderate';
      }
      
      return {
        constituency_name: record.constituency_name,
        swingState,
        stability,
        dominantParty,
        wins: record.totalWins,
        partyBreakdown: Object.values(record.winners).map((p: PartyRecord) => ({
          party: p.party,
          color: p.color,
          wins: p.wins
        }))
      };
    });
    
    return NextResponse.json({
      parliaments: targetParliaments,
      totalConstituencies: swingStatesResults.length,
      swingStates: swingStatesResults
    });
  } catch (error) {
    console.error('Error fetching swing state data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch swing state data' },
      { status: 500 }
    );
  }
}
