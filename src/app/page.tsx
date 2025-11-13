import Link from 'next/link';
import { getPublishedPosts } from '@/lib/blogService';
import PostCard from '@/components/blog/PostCard';
import Sidebar from '@/components/blog/Sidebar';

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
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gradient-to-r from-green-900 via-green-700 to-red-600 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-wide">
            বাংলাদেশ নির্বাচন ব্লগ
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/" className="hover:text-red-200">Blog</Link>
            <Link href="/polls" className="hover:text-red-200">Polls</Link>
            <Link href="/admin/blog" className="hover:text-red-200">Admin</Link>
          </nav>
        </div>
      </header>

      <section className="bg-gradient-to-r from-green-700 via-green-600 to-red-500 text-white">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            গণতন্ত্রের যাত্রায় সর্বশেষ বিশ্লেষণ ও অন্তর্দৃষ্টি
          </h1>
          <p className="text-lg text-green-100 max-w-3xl">
            বাংলাদেশের নির্বাচন, নীতি ও নাগরিক সমাজ নিয়ে গুরুত্বপূর্ণ রিপোর্ট, বিশ্লেষণ ও দৃষ্টিভঙ্গি। থাকুন এক কদম এগিয়ে।
          </p>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 py-10">
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

      <footer className="bg-green-900 text-green-100">
        <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p>© {new Date().getFullYear()} Bangladesh Election Insights</p>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/about" className="hover:text-red-300">About</Link>
            <Link href="/contact" className="hover:text-red-300">Contact</Link>
            <Link href="/admin/blog" className="hover:text-red-300">Publish an article</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}