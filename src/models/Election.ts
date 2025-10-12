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
  turnout: number;
}

export interface IElection extends Document {
  parliamentNumber: number;
  electionDate: Date;
  endDate?: Date;
  title: string;
  description?: string;
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
  upazilas: [{ type: String }],
  turnout: { type: Number, required: true }
});

const ElectionSchema = new Schema<IElection>({
  parliamentNumber: { type: Number, required: true, unique: true },
  electionDate: { type: Date, required: true },
  endDate: { type: Date },
  title: { type: String, required: true },
  description: { type: String },
  candidates: [CandidateSchema],
  voterStats: VoterStatsSchema
}, {
  timestamps: true
});

export default mongoose.models.Election || mongoose.model<IElection>('Election', ElectionSchema);
