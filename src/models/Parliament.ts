import mongoose, { Document, Schema } from 'mongoose';

export interface IParliament extends Document {
  _id: string;
  constituency_number: number;
  constituency_name: string;
  party: string;
  candidate: string;
  total_voters: number;
  parliament: number;
  color: string;
  votes?: number;
  isWinner?: boolean;
}

const ParliamentSchema = new Schema<IParliament>({
  constituency_number: { type: Number, required: true },
  constituency_name: { type: String, required: true },
  party: { type: String, required: true },
  candidate: { type: String, required: true },
  total_voters: { type: Number, required: true },
  parliament: { type: Number, required: true },
  color: { type: String, required: true },
  votes: { type: Number },
  isWinner: { type: Boolean, default: false }
}, { collection: 'parliament' });

// Prevent model recompilation
const Parliament = mongoose.models.Parliament || mongoose.model<IParliament>('Parliament', ParliamentSchema);

export default Parliament;
