import mongoose, { Document, Schema } from 'mongoose';

export interface IInfoCandidate extends Document {
  id: string;
  constituency: string;
  party: string;
  candidate_name: string;
  gender: string;
  personal_info: {
    occupation_category: string;
    profession_details: string;
    education_category: string;
    education_details: string;
  };
  controversial: Array<{
    NEWS: string;
    youtubes: string[];
  }>;
  media: {
    img_url: string;
  };
  metadata: {
    created_at: string;
    source: string;
    record_index: number;
  };
}

const InfoCandidateSchema = new Schema<IInfoCandidate>({
  id: { type: String, required: true, unique: true },
  constituency: { type: String, required: true },
  party: { type: String, required: true },
  candidate_name: { type: String, required: true },
  gender: { type: String, required: true },
  personal_info: {
    occupation_category: { type: String, required: true },
    profession_details: { type: String, required: true },
    education_category: { type: String, required: true },
    education_details: { type: String, required: true }
  },
  controversial: [{
    NEWS: { type: String, default: "" },
    youtubes: [{ type: String }]
  }],
  media: {
    img_url: { type: String, default: "" }
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
