import mongoose, { Document, Schema } from 'mongoose';

// TypeScript Interface for Fingerprint Log
export interface IFingerprintLog extends Document {
  fingerprint: string;
  candidate_name: string;
  constituency_id: string;
  createdAt?: Date;
}

// Mongoose Schema for Fingerprint Log (prevents duplicate votes)
const FingerprintLogSchema = new Schema<IFingerprintLog>({
  fingerprint: { type: String, required: true },
  candidate_name: { type: String, required: true },
  constituency_id: { type: String, required: true }
}, {
  collection: 'fingerprint_log',
  timestamps: true
});

// Compound index to prevent duplicate votes per fingerprint per candidate
FingerprintLogSchema.index({ fingerprint: 1, candidate_name: 1 }, { unique: true });

// Prevent model recompilation
export default mongoose.models.FingerprintLog || mongoose.model<IFingerprintLog>('FingerprintLog', FingerprintLogSchema);

