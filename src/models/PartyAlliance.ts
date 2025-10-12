import mongoose, { Document, Schema } from 'mongoose';

export interface IPartyAlliance extends Document {
  party_name: string;
  party_abbreviation: string;
  parliament_number: number;
  candidate_count: number;
  alliance_name: string;
  is_alliance_leader: boolean;
  alliance_color: string;
  party_logo?: string;
  description?: string;
  created_at: Date;
  updated_at: Date;
}

const PartyAllianceSchema = new Schema<IPartyAlliance>({
  party_name: {
    type: String,
    required: true,
    trim: true
  },
  party_abbreviation: {
    type: String,
    required: true,
    trim: true,
    uppercase: true
  },
  parliament_number: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  candidate_count: {
    type: Number,
    required: true,
    min: 0
  },
  alliance_name: {
    type: String,
    required: true,
    trim: true
  },
  is_alliance_leader: {
    type: Boolean,
    default: false
  },
  alliance_color: {
    type: String,
    required: true,
    enum: ['blue', 'pink', 'orange', 'green', 'purple', 'red', 'yellow', 'indigo']
  },
  party_logo: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

// Update the updated_at field before saving
PartyAllianceSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

// Create index for efficient queries
PartyAllianceSchema.index({ parliament_number: 1, alliance_name: 1 });
PartyAllianceSchema.index({ party_abbreviation: 1, parliament_number: 1 });

// Prevent model recompilation
const PartyAlliance = mongoose.models.PartyAlliance || mongoose.model<IPartyAlliance>('PartyAlliance', PartyAllianceSchema);

export default PartyAlliance;
