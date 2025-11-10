import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export interface BlunderConstituency {
  constituencyId: string;
  Difference: number;
  Difference_Percentage?: string;
  candidates: Array<{ name: string; party: string; votes: number }>;
  Winner: string;
  electionDate: string;
}

export interface BlunderResult {
  year: number;
  topParty: string;
  secondParty: string;
  topPartySeats: number;
  secondPartySeats: number;
  seatDifference: number;
  totalVotesNeeded: number;
  constituencyIds: string[];
  constituencies: BlunderConstituency[];
}

export async function getBlunderData(parliamentNumber: number): Promise<BlunderResult> {
  await connectDB();
  const db = mongoose.connection.db;
  if (!db) {
    throw new Error('Database not available');
  }

  // Step 1: Identify Top 2 parties by seat count for the selected parliament
  const topTwo = await db.collection('swing_state').aggregate([
    { $match: { parliamentNumber } },
    { $group: { _id: '$Winner', totalSeats: { $sum: 1 } } },
    { $sort: { totalSeats: -1 } },
    { $limit: 2 }
  ]).toArray() as Array<{ _id: string; totalSeats: number }>;

  if (topTwo.length < 2) {
    return {
      year: parliamentNumber,
      topParty: '',
      secondParty: '',
      topPartySeats: 0,
      secondPartySeats: 0,
      seatDifference: 0,
      totalVotesNeeded: 0,
      constituencyIds: [],
      constituencies: []
    };
  }

  const [first, second] = topTwo;
  const seatDifference = Math.max(0, (first.totalSeats ?? 0) - (second.totalSeats ?? 0));
  const topParty = first._id;
  const secondParty = second._id;
  const topPartySeats = first.totalSeats ?? 0;
  const secondPartySeats = second.totalSeats ?? 0;

  // Step 2: Find \"blunder\" constituencies for second party (closest losses)
  const blunders = await db.collection('swing_state').aggregate([
    { $match: { parliamentNumber, 'candidates.party': secondParty, Winner: { $ne: secondParty } } },
    { $sort: { Difference: 1 } },
    { $limit: Math.max(seatDifference, 30) } // safe guard: get up to max(seatDiff, 30) for UI
  ]).toArray() as unknown as BlunderConstituency[];

  const limited = blunders.slice(0, Math.max(1, seatDifference));

  const totalVotesNeeded = limited.reduce((sum, r) => sum + (r.Difference || 0), 0);
  const year = limited.length > 0 ? new Date(limited[0].electionDate).getFullYear() : new Date().getFullYear();
  const constituencyIds = limited.map(r => r.constituencyId);

  return {
    year,
    topParty,
    secondParty,
    topPartySeats,
    secondPartySeats,
    seatDifference,
    totalVotesNeeded,
    constituencyIds,
    constituencies: limited
  };
}



