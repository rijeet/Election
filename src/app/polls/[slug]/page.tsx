import { Metadata } from 'next';
import PollClient from '@/components/poll/PollClient';
import { getPollBySlug } from '@/lib/pollService';
import type { PollDTO } from '@/types/poll';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const poll = await getPollBySlug(slug);
  if (!poll) {
    return {
      title: 'Poll not found',
      description: 'The requested poll could not be located.'
    };
  }

  const title = `${poll.title.en} | People's Voice`;
  const description = poll.questions[0]?.question.en ?? poll.title.en;
  const canonical = `https://bdvote2026.com/polls/${poll.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical
    },
    openGraph: {
      title,
      description,
      type: 'article',
      url: canonical
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description
    }
  };
}

export default async function PollPage({ params }: PageProps) {
  const { slug } = await params;
  const poll = await getPollBySlug(slug);

  if (!poll) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold text-gray-900">Poll not found</h1>
        <p className="mt-2 text-gray-600">
          The poll you&apos;re looking for does not exist or has been removed.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <PollClient poll={poll as PollDTO} />
    </div>
  );
}


