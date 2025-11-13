import Link from 'next/link';
import Poll from '@/models/Poll';
import connectDB from '@/lib/mongodb';
import { Types } from 'mongoose';
import Header from '@/components/Header';

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-brand-700 via-brand-600 to-brand-500 text-white py-12 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6 shadow-lg">
              <svg className="w-8 h-8 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
              জনমত জরিপ
            </h1>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white/90 mb-4 md:mb-6">
              Public Opinion Polls
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-3xl mx-auto mb-8 md:mb-10">
              বাংলাদেশের গণতন্ত্র, নির্বাচন ও নীতি সম্পর্কে আপনার মতামত জানান। গুরুত্বপূর্ণ প্রশ্নে আপনার কণ্ঠস্বর যোগ করুন।
            </p>
            <p className="text-sm sm:text-base md:text-lg text-white/70 max-w-2xl mx-auto">
              Share your voice on Bangladesh&apos;s democracy, elections, and policies. Participate in important questions that matter.
            </p>
          </div>
        </div>
      </section>

      {/* Polls List Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-6 md:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            সক্রিয় জরিপসমূহ
          </h2>
          <p className="text-base sm:text-lg text-muted">
            Active Polls
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {polls.map((poll) => (
            <Link
              key={poll._id.toString()}
              href={`/polls/${poll.slug}`}
              className="group block rounded-2xl border-2 border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-brand-500 hover:shadow-lg hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-brand-700 transition-colors">
                    {poll.title?.en ?? poll.slug}
                  </h3>
                  <p className="text-sm sm:text-base text-muted mb-4">
                    {poll.title?.bn}
                  </p>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-brand-100 rounded-full flex items-center justify-center group-hover:bg-brand-200 transition-colors">
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="flex items-center text-sm text-brand-600 font-medium">
                <span>ভোট দিন</span>
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        {polls.length === 0 && (
          <div className="text-center py-12 md:py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-full mb-4">
              <svg className="w-8 h-8 md:w-10 md:h-10 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
              এখনও কোন জরিপ নেই
            </h3>
            <p className="text-base sm:text-lg text-muted">
              No polls available yet. Check back soon!
            </p>
          </div>
        )}
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


