import mongoose, { Schema, Document } from 'mongoose';
import type { PollQuestion } from '@/types/poll';

export interface IPoll extends Document {
  slug: string;
  title: {
    bn: string;
    en: string;
  };
  isGroup: boolean;
  questions: PollQuestion[];
  createdAt: Date;
  updatedAt: Date;
}

const PollOptionSchema = new Schema(
  {
    key: { type: String, required: true },
    label: {
      bn: { type: String, required: true },
      en: { type: String, required: true }
    },
    votes: { type: Number, default: 0 }
  },
  { _id: false }
);

const PollQuestionSchema = new Schema(
  {
    question: {
      bn: { type: String, required: true },
      en: { type: String, required: true }
    },
    tooltip: {
      bn: { type: String, default: '' },
      en: { type: String, default: '' }
    },
    options: { type: [PollOptionSchema], required: true }
  },
  { _id: false }
);

const PollSchema = new Schema<IPoll>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: {
      bn: { type: String, required: true },
      en: { type: String, required: true }
    },
    isGroup: { type: Boolean, default: false },
    questions: { type: [PollQuestionSchema], required: true }
  },
  {
    timestamps: true,
    collection: 'polls'
  }
);

export default mongoose.models.Poll || mongoose.model<IPoll>('Poll', PollSchema);


