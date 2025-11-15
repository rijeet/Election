import Link from 'next/link';
import { getPublishedPosts } from '@/lib/blogService';
import PostCard from '@/components/blog/PostCard';
import Sidebar from '@/components/blog/Sidebar';
import Header from '@/components/Header';

export default async function BlogPage() {
  const posts = await getPublishedPosts(50); // Show more posts on the blog page
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

