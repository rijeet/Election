import connectDB from '@/lib/mongodb';
import Poll from '@/models/Poll';
import type { PollDTO } from '@/types/poll';
import mongoose from 'mongoose';
import type { IPoll } from '@/models/Poll';

type PollLeanDoc = IPoll & {
  _id: mongoose.Types.ObjectId;
};

function toDTO(doc: PollLeanDoc): PollDTO {
  const { _id, slug, title, isGroup, questions, createdAt, updatedAt } = doc;
  return {
    _id: _id.toString(),
    slug,
    title,
    isGroup,
    questions,
    createdAt: createdAt?.toISOString?.() ?? new Date().toISOString(),
    updatedAt: updatedAt?.toISOString?.() ?? new Date().toISOString()
  };
}

export async function getPollBySlug(slug: string): Promise<PollDTO | null> {
  await connectDB();
  const poll = await Poll.findOne({ slug }).lean<PollLeanDoc>();
  if (!poll) return null;
  return toDTO(poll);
}

export async function getPollById(pollId: string): Promise<PollDTO | null> {
  await connectDB();
  if (!mongoose.Types.ObjectId.isValid(pollId)) return null;
  const poll = await Poll.findById(pollId).lean<PollLeanDoc>();
  if (!poll) return null;
  return toDTO(poll);
}


