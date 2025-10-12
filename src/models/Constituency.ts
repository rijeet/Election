import mongoose, { Document, Schema } from 'mongoose';

export interface ICandidate {
  name: string;
  party: string;
  symbol: string;
  votes: number;
  centersCounted: number;
  isWinner: boolean;
  isNearestCandidate: boolean;
  imageUrl?: string;
}

export interface IVoterStats {
  totalVoters: number;
  maleVoters: number;
  femaleVoters: number;
  totalCenters: number;
  upazilas: string[];
}

export interface IConstituency extends Document {
  constituencyId: string; // e.g., "Dhaka-1", "Dhaka-2"
  division: string; // e.g., "Dhaka", "Rangpur"
  district: string; // e.g., "Dhaka", "Gazipur"
  parliamentNumber: number;
  electionDate: Date;
  candidates: ICandidate[];
  voterStats: IVoterStats;
  createdAt: Date;
  updatedAt: Date;
}

const CandidateSchema = new Schema<ICandidate>({
  name: { type: String, required: true },
  party: { type: String, required: true },
  symbol: { type: String, required: true },
  votes: { type: Number, required: true },
  centersCounted: { type: Number, required: true },
  isWinner: { type: Boolean, default: false },
  isNearestCandidate: { type: Boolean, default: false },
  imageUrl: { type: String }
});

const VoterStatsSchema = new Schema<IVoterStats>({
  totalVoters: { type: Number, required: true },
  maleVoters: { type: Number, required: true },
  femaleVoters: { type: Number, required: true },
  totalCenters: { type: Number, required: true },
  upazilas: [{ type: String }]
});

const ConstituencySchema = new Schema<IConstituency>({
  constituencyId: { type: String, required: true, unique: true },
  division: { type: String, required: true },
  district: { type: String, required: true },
  parliamentNumber: { type: Number, required: true },
  electionDate: { type: Date, required: true },
  candidates: [CandidateSchema],
  voterStats: VoterStatsSchema
}, {
  timestamps: true
});

export default mongoose.models.Constituency || mongoose.model<IConstituency>('Constituency', ConstituencySchema);
