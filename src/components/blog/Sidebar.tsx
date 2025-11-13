import Link from 'next/link';
import type { PostDTO } from '@/types/post';

interface SidebarProps {
  recentPosts: PostDTO[];
  categories: { name: string; count: number }[];
  tags: string[];
}

export default function Sidebar({ recentPosts, categories, tags }: SidebarProps) {
  return (
    <aside className="space-y-6">
      <div className="rounded-3xl bg-white shadow-lg border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-green-800 mb-4">সর্বশেষ নিবন্ধ</h3>
        <ul className="space-y-4">
          {recentPosts.map((post) => (
            <li key={post._id}>
              <Link href={`/post/${post.slug}`} className="text-green-700 hover:text-red-600 font-medium">
                {post.title}
              </Link>
              <p className="text-xs text-gray-500">{new Date(post.publishedAt || post.createdAt).toLocaleDateString('bn-BD')}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-3xl bg-white shadow-lg border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-green-800 mb-4">বিভাগসমূহ</h3>
        <ul className="space-y-3 text-sm">
          {categories.map((category) => (
            <li key={category.name} className="flex items-center justify-between">
              <span className="text-gray-700">{category.name}</span>
              <span className="text-sm font-semibold text-green-700">{category.count}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-3xl bg-white shadow-lg border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-green-800 mb-4">ট্যাগসমূহ</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm hover:bg-red-50 hover:text-red-600 cursor-pointer"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
}


