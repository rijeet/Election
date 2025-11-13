import { Metadata } from 'next';
import PollClient from '@/components/poll/PollClient';
import { getPollBySlug } from '@/lib/pollService';
import type { PollDTO } from '@/types/poll';
import Header from '@/components/Header';
import Link from 'next/link';

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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Header />
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <h1 className="text-2xl font-semibold text-gray-900">Poll not found</h1>
          <p className="mt-2 text-gray-600">
            The poll you&apos;re looking for does not exist or has been removed.
          </p>
          <Link
            href="/polls"
            className="mt-4 inline-block text-brand-600 hover:text-brand-700 font-medium"
          >
            ← Back to Polls
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-brand-700 via-brand-600 to-brand-500 text-white py-8 md:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-4">
            <Link
              href="/polls"
              className="inline-flex items-center text-sm sm:text-base text-white/80 hover:text-white transition-colors mb-4"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>সকল জরিপে ফিরে যান</span>
            </Link>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-white/20 backdrop-blur-sm rounded-full mb-4 md:mb-6 shadow-lg">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">
              {poll.title.bn}
            </h1>
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-white/90 mb-4 md:mb-6">
              {poll.title.en}
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-white/80 max-w-3xl mx-auto">
              আপনার মতামত জানান এবং গণতান্ত্রিক প্রক্রিয়ায় অংশগ্রহণ করুন
            </p>
            <p className="text-xs sm:text-sm md:text-base text-white/70 max-w-2xl mx-auto mt-2">
              Share your opinion and participate in the democratic process
            </p>
          </div>
        </div>
      </section>

      {/* Poll Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <PollClient poll={poll as PollDTO} />
      </main>

      {/* Footer Section */}
      <footer className="bg-bgdark text-white py-8 md:py-12 mt-12 md:mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm sm:text-base text-white/80">
              © {new Date().getFullYear()} Bangladesh Election Insights. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}


