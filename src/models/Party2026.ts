import mongoose, { Document, Schema } from 'mongoose';

// TypeScript Interface
export interface IParty2026 extends Document {
  party: {
    name: string;
    abbreviation: string;
    leader: string; // links to candidate_list (info view)
    symbol: {
      name: string;
      image_url: string;
    };
  };
  alliance: {
    name: string;
    type: string;
    member_parties: string[];
  };
  manifesto: {
    election_year: number;
    highlights: string[];
    full_document_url: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

// Mongoose Schema
const Party2026Schema = new Schema<IParty2026>({
  party: {
    name: { type: String, required: true, unique: true },
    abbreviation: { type: String, required: true },
    leader: { type: String, required: true },
    symbol: {
      name: { type: String, required: true },
      image_url: { type: String, required: true }
    }
  },
  alliance: {
    name: { type: String, required: true },
    type: { type: String, required: true },
    member_parties: [{ type: String }]
  },
  manifesto: {
    election_year: { type: Number, required: true, default: 2026 },
    highlights: [{ type: String }],
    full_document_url: { type: String, default: '' }
  }
}, {
  collection: 'party2026',
  timestamps: true
});

// Prevent model recompilation
export default mongoose.models.Party2026 || mongoose.model<IParty2026>('Party2026', Party2026Schema);

