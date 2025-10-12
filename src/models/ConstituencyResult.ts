import mongoose, { Document, Schema } from 'mongoose';

export interface IConstituencyResult extends Document {
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

const ConstituencyResultSchema = new Schema<IConstituencyResult>({
  constituency_number: {
    type: Number,
    required: true
  },
  constituency_name: {
    type: String,
    required: true
  },
  party: {
    type: String,
    required: true
  },
  candidate: {
    type: String,
    required: true
  },
  total_voters: {
    type: Number,
    required: true
  },
  parliament: {
    type: Number,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  votes: {
    type: Number,
    default: 0
  },
  isWinner: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Create index for efficient queries
ConstituencyResultSchema.index({ parliament: 1, constituency_number: 1 });

export default mongoose.models.ConstituencyResult || mongoose.model<IConstituencyResult>('ConstituencyResult', ConstituencyResultSchema);
