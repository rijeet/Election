import mongoose, { Schema, Document } from 'mongoose';

export interface IPollVote extends Document {
  pollId: Schema.Types.ObjectId;
  questionIndex: number;
  optionKey: string;
  ip: string;
  fingerprint: string;
  createdAt: Date;
}

const PollVoteSchema = new Schema<IPollVote>(
  {
    pollId: { type: Schema.Types.ObjectId, ref: 'Poll', required: true },
    questionIndex: { type: Number, required: true },
    optionKey: { type: String, required: true },
    ip: { type: String, required: true },
    fingerprint: { type: String, required: true }
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    collection: 'poll_votes'
  }
);

PollVoteSchema.index({ pollId: 1, questionIndex: 1, ip: 1 }, { unique: true });
PollVoteSchema.index({ pollId: 1, questionIndex: 1, fingerprint: 1 }, { unique: true });

export default mongoose.models.PollVote || mongoose.model<IPollVote>('PollVote', PollVoteSchema);


