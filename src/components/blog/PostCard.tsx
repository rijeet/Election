'use client';

import Link from 'next/link';
import type { PostDTO } from '@/types/post';

interface PostCardProps {
  post: PostDTO;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="rounded-3xl bg-white shadow-lg border border-gray-200 overflow-hidden flex flex-col md:flex-row">
      {post.featuredImage && (
        <div className="md:w-1/3 w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover md:min-h-[240px]"
            loading="lazy"
          />
        </div>
      )}

      <div className="flex-1 p-6 md:p-8 space-y-4">
        <div className="flex flex-wrap gap-2 text-sm font-medium text-green-700">
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
            {post.category}
          </span>
          {post.tags.slice(0, 3).map(tag => (
            <span key={tag} className="bg-red-100 text-red-600 px-3 py-1 rounded-full">
              #{tag}
            </span>
          ))}
        </div>

        <Link href={`/post/${post.slug}`} className="block">
          <h2 className="text-2xl font-bold text-green-800 hover:text-red-600 transition">
            {post.title}
          </h2>
        </Link>

        <p className="text-gray-600 leading-relaxed">{post.excerpt}</p>

        <div
          className="text-sm text-gray-500 space-x-2"
          aria-label="Post meta information"
        >
          <span>{new Date(post.publishedAt || post.createdAt).toLocaleDateString('bn-BD')}</span>
          <span>•</span>
          <span>{post.tags.length} tags</span>
        </div>

        <Link
          href={`/post/${post.slug}`}
          className="inline-flex items-center text-green-700 font-semibold hover:text-red-600 transition"
        >
          পুরো নিবন্ধ পড়ুন →
        </Link>
      </div>
    </article>
  );
}


