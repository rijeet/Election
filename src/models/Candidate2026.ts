import mongoose, { Document, Schema } from 'mongoose';

// TypeScript Interface for Candidate in candidate_list
export interface ICandidateListItem {
  candidate_name: string;
  candidate_ref: string; // links info_candidate
  candidate_img: string;
  party_name: string;
  party_ref: string; // links party2026
  party_symbol_img: string;
  popularity_vote: number; // user votes
  electoral_vote: number; // admin-only, hide if 0
}

// TypeScript Interface for Candidate2026 Document
export interface ICandidate2026 extends Document {
  division: string;
  district: string;
  constituency_id: string;
  election_date: Date;
  candidate_list: ICandidateListItem[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Mongoose Schema for Candidate List Item
const CandidateListItemSchema = new Schema<ICandidateListItem>({
  candidate_name: { type: String, required: true },
  candidate_ref: { type: String, required: true },
  candidate_img: { type: String, default: '' },
  party_name: { type: String, required: true },
  party_ref: { type: String, required: true },
  party_symbol_img: { type: String, default: '' },
  popularity_vote: { type: Number, default: 0 },
  electoral_vote: { type: Number, default: 0 }
}, { _id: false });

// Mongoose Schema for Candidate2026
const Candidate2026Schema = new Schema<ICandidate2026>({
  division: { type: String, required: true },
  district: { type: String, required: true },
  constituency_id: { type: String, required: true, unique: true },
  election_date: { type: Date, required: true },
  candidate_list: [CandidateListItemSchema]
}, {
  collection: 'candidate2026',
  timestamps: true
});

// Prevent model recompilation
export default mongoose.models.Candidate2026 || mongoose.model<ICandidate2026>('Candidate2026', Candidate2026Schema);

