import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
import Poll from '@/models/Poll';
import PollVote from '@/models/PollVote';
import { getClientIp } from '@/lib/getClientIp';
import { getPollById } from '@/lib/pollService';
import { MongoServerError } from 'mongodb';

interface VotePayload {
  pollId: string;
  questionIndex: number;
  optionKey: string;
  fingerprint: string;
}

export async function POST(request: Request) {
  try {
    const body: VotePayload = await request.json();
    const { pollId, questionIndex, optionKey, fingerprint } = body;

    if (!pollId || typeof questionIndex !== 'number' || !optionKey || !fingerprint) {
      return NextResponse.json({ error: 'Invalid vote payload' }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(pollId)) {
      return NextResponse.json({ error: 'Invalid poll id' }, { status: 400 });
    }

    const ip = getClientIp(request.headers);

    await connectDB();
    const poll = await Poll.findById(pollId);

    if (!poll) {
      return NextResponse.json({ error: 'Poll not found' }, { status: 404 });
    }

    if (questionIndex < 0 || questionIndex >= poll.questions.length) {
      return NextResponse.json({ error: 'Question not found' }, { status: 400 });
    }

    const question = poll.questions[questionIndex];
    const optionIndex = question.options.findIndex(
      (opt: { key: string }) => opt.key === optionKey
    );
    if (optionIndex === -1) {
      return NextResponse.json({ error: 'Option not found' }, { status: 400 });
    }

    // Duplicate vote check
    const existingVote = await PollVote.findOne({
      pollId,
      questionIndex,
      $or: [{ ip }, { fingerprint }]
    });

    if (existingVote) {
      return NextResponse.json({ error: 'You have already voted in this poll.' }, { status: 409 });
    }

    await PollVote.create({
      pollId,
      questionIndex,
      optionKey,
      ip,
      fingerprint
    });

    await Poll.updateOne(
      { _id: pollId },
      {
        $inc: {
          [`questions.${questionIndex}.options.${optionIndex}.votes`]: 1
        }
      }
    );

    const updatedPoll = await getPollById(pollId);
    return NextResponse.json({ success: true, poll: updatedPoll });
  } catch (error) {
    console.error('Vote submission failed:', error);
    if (error instanceof MongoServerError && error.code === 11000) {
      return NextResponse.json({ error: 'Duplicate vote detected.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to submit vote' }, { status: 500 });
  }
}


