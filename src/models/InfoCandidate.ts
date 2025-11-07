import mongoose, { Document, Schema } from 'mongoose';

export interface IFamilyMember {
  name: string;
  occupation: string;
  nationality: string;
  img_url?: string;
}

export interface IInfoCandidate extends Document {
  id: string;
  constituency: string;
  division?: string;
  district?: string;
  party: string;
  candidate_name: string;
  gender?: string;
  personal_info: {
    occupation_category?: string;
    profession_details?: string;
    education_category?: string;
    education_details?: string;
  };
  income?: string;
  tax?: string;
  assets?: string;
  liabilities?: string;
  expenditure?: string;
  controversial: Array<{
    NEWS: string;
    youtubes: string[];
  }>;
  family?: {
    spouse?: IFamilyMember;
    sons?: IFamilyMember[];
    daughters?: IFamilyMember[];
  };
  media: {
    img_url: string;
  };
  metadata: {
    created_at: string;
    source: string;
    record_index: number;
  };
}

const FamilyMemberSchema = new Schema<IFamilyMember>({
  name: { type: String, required: true },
  occupation: { type: String, default: '' },
  nationality: { type: String, default: '' },
  img_url: { type: String, default: '' }
}, { _id: false });

const InfoCandidateSchema = new Schema<IInfoCandidate>({
  id: { type: String, required: true, unique: true },
  constituency: { type: String, required: true },
  division: { type: String, default: '' },
  district: { type: String, default: '' },
  party: { type: String, required: true },
  candidate_name: { type: String, required: true },
  gender: { type: String, default: '' },
  personal_info: {
    occupation_category: { type: String, default: '' },
    profession_details: { type: String, default: '' },
    education_category: { type: String, default: '' },
    education_details: { type: String, default: '' }
  },
  income: { type: String, default: '' },
  tax: { type: String, default: '' },
  assets: { type: String, default: '' },
  liabilities: { type: String, default: '' },
  expenditure: { type: String, default: '' },
  controversial: [{
    NEWS: { type: String, default: '' },
    youtubes: [{ type: String }]
  }],
  family: {
    spouse: { type: FamilyMemberSchema, default: undefined },
    sons: { type: [FamilyMemberSchema], default: undefined },
    daughters: { type: [FamilyMemberSchema], default: undefined }
  },
  media: {
    img_url: { type: String, default: '' }
  },
  metadata: {
    created_at: { type: String, required: true },
    source: { type: String, required: true },
    record_index: { type: Number, required: true }
  }
}, {
  collection: 'info_candidate',
  timestamps: true
});

// Prevent model recompilation
export default mongoose.models.InfoCandidate || mongoose.model<IInfoCandidate>('InfoCandidate', InfoCandidateSchema);
