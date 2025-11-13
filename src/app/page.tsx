import Link from 'next/link';
import { getPublishedPosts } from '@/lib/blogService';
import PostCard from '@/components/blog/PostCard';
import Sidebar from '@/components/blog/Sidebar';
import Header from '@/components/Header';

export default async function HomePage() {
  const posts = await getPublishedPosts(10);
  const recentSidebar = posts.slice(0, 5);

  const categoryMap = new Map<string, number>();
  const tagSet = new Set<string>();

  posts.forEach((post) => {
    categoryMap.set(post.category, (categoryMap.get(post.category) ?? 0) + 1);
    post.tags.forEach((tag) => tagSet.add(tag));
  });

  const categories = Array.from(categoryMap.entries()).map(([name, count]) => ({ name, count }));
  const tags = Array.from(tagSet);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-6 shadow-lg">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            বাংলাদেশ নির্বাচন তথ্য ব্যবস্থা
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-6">
            Bangladesh Election Information System
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-12">
            Explore comprehensive election data, parliamentary history, constituency details, and interactive visualizations of Bangladesh&apos;s democratic journey from 1973 to 2024.
          </p>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Elections Card */}
            <Link
              href="/elections"
              className="bg-green-50 hover:bg-green-100 rounded-2xl p-6 transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-1"
            >
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Elections</h3>
              <p className="text-sm text-gray-600">Timeline & Details</p>
            </Link>

            {/* Candidates Card */}
            <Link
              href="/candidates"
              className="bg-blue-50 hover:bg-blue-100 rounded-2xl p-6 transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-1"
            >
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Candidates</h3>
              <p className="text-sm text-gray-600">Profile & Information</p>
            </Link>

            {/* Constituencies Card */}
            <Link
              href="/elections"
              className="bg-purple-50 hover:bg-purple-100 rounded-2xl p-6 transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-1"
            >
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Constituencies</h3>
              <p className="text-sm text-gray-600">Electoral Areas</p>
            </Link>

            {/* Visualization Card */}
            <Link
              href="/parliament-visualization"
              className="bg-orange-50 hover:bg-orange-100 rounded-2xl p-6 transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-1"
            >
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Visualization</h3>
              <p className="text-sm text-gray-600">Parliament Charts</p>
            </Link>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/elections"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <span>→ Explore Elections</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="bg-gradient-to-r from-green-700 via-green-600 to-red-500 text-white py-12 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            গণতন্ত্রের যাত্রায় সর্বশেষ বিশ্লেষণ ও অন্তর্দৃষ্টি
          </h2>
          <p className="text-lg text-green-100 max-w-3xl mx-auto">
            বাংলাদেশের নির্বাচন, নীতি ও নাগরিক সমাজ নিয়ে গুরুত্বপূর্ণ রিপোর্ট, বিশ্লেষণ ও দৃষ্টিভঙ্গি। থাকুন এক কদম এগিয়ে।
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-[2fr_1fr] gap-8">
          <div className="space-y-8">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
            {posts.length === 0 && (
              <div className="rounded-3xl bg-white border border-dashed border-green-300 p-12 text-center text-gray-500">
                কোন প্রকাশিত নিবন্ধ এখনও যুক্ত করা হয়নি। অনুগ্রহ করে প্রশাসনিক প্যানেল থেকে প্রথম পোস্ট তৈরি করুন।
              </div>
            )}
          </div>

          <Sidebar recentPosts={recentSidebar} categories={categories} tags={tags} />
        </div>
      </main>

      <footer className="bg-gradient-to-r from-green-800 to-green-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <p className="text-center md:text-left">© {new Date().getFullYear()} Bangladesh Election Insights</p>
              <div className="flex items-center justify-center md:justify-end gap-6 text-sm">
                <Link href="/contact" className="hover:text-green-200 transition-colors">Contact</Link>
                <Link href="/polls" className="hover:text-green-200 transition-colors">Polls</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}