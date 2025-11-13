import Link from 'next/link';
import Poll from '@/models/Poll';
import connectDB from '@/lib/mongodb';
import { Types } from 'mongoose';

export const metadata = {
  title: 'Public Opinion Polls | People\'s Voice',
  description: 'Browse the latest public opinion polls about Bangladesh\'s democracy.'
};

interface PollListItem {
  _id: Types.ObjectId;
  slug: string;
  title: { bn: string; en: string };
}

export default async function PollsIndex() {
  await connectDB();
  const polls = await Poll.find()
    .select('slug title createdAt')
    .sort({ createdAt: -1 })
    .lean<PollListItem[]>();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900">Public Opinion Polls</h1>
      <p className="mt-2 text-gray-600">
        Discover the most important questions facing Bangladesh and share your voice.
      </p>

      <div className="mt-8 space-y-4">
        {polls.map((poll) => (
          <Link
            key={poll._id.toString()}
            href={`/polls/${poll.slug}`}
            className="block rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-green-400 hover:shadow-md"
          >
            <h2 className="text-xl font-semibold text-gray-900">{poll.title?.en ?? poll.slug}</h2>
            <p className="text-sm text-gray-500">
              {poll.title?.bn}
            </p>
          </Link>
        ))}
        {polls.length === 0 && (
          <p className="text-sm text-gray-500">
            No polls available yet. Check back soon!
          </p>
        )}
      </div>
    </div>
  );
}


