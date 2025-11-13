import { Metadata } from 'next';
import { getPostBySlug, getPublishedPosts } from '@/lib/blogService';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://bdvote2026.com';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) {
    return {
      title: 'পোস্ট খুঁজে পাওয়া যায়নি',
      description: 'Requested post could not be found.'
    };
  }

  const canonical = post.canonicalUrl || `${SITE_URL}/post/${post.slug}`;

  return {
    title: post.seoTitle || post.title,
    description: post.metaDescription || post.excerpt,
    alternates: {
      canonical
    },
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.metaDescription || post.excerpt,
      type: 'article',
      url: canonical,
      images: post.featuredImage ? [{ url: post.featuredImage }] : undefined
    },
    twitter: {
      card: 'summary_large_image',
      title: post.seoTitle || post.title,
      description: post.metaDescription || post.excerpt,
      images: post.featuredImage ? [post.featuredImage] : undefined
    },
    keywords: post.tags,
    other: {
      ...(post.publishedAt && { 'article:published_time': post.publishedAt })
    }
  };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post || post.status !== 'published') {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center text-gray-600">
        <h1 className="text-3xl font-bold text-green-800 mb-3">পোস্ট খুঁজে পাওয়া যায়নি</h1>
        <p>আপনি যে নিবন্ধটি খুঁজছেন সেটি হয় ড্রাফট অবস্থায় আছে বা প্রকাশ করা হয়নি।</p>
        <Link href="/" className="mt-6 inline-flex items-center text-green-700 font-semibold hover:text-red-600">
          ← হোমপেজে ফিরে যান
        </Link>
      </div>
    );
  }

  const relatedPosts = (await getPublishedPosts(4)).filter((p) => p._id !== post._id).slice(0, 3);

  return (
    <article className="bg-gray-100 min-h-screen py-10">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-3xl overflow-hidden">
        {post.featuredImage && (
          <div className="w-full h-72 md:h-96 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="p-6 md:p-10 space-y-6">
          <div className="flex flex-wrap items-center gap-3 text-sm text-green-700 font-medium">
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">{post.category}</span>
            <span>{new Date(post.publishedAt || post.createdAt).toLocaleDateString('bn-BD')}</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-green-900">{post.title}</h1>

          <p className="text-lg text-gray-600">{post.excerpt}</p>

          <div
            className="prose prose-green max-w-none text-gray-800 leading-8"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-semibold text-gray-600 mb-3">ট্যাগসমূহ</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {relatedPosts.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 mt-10">
          <h2 className="text-2xl font-bold text-green-900 mb-4">সম্পর্কিত নিবন্ধ</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {relatedPosts.map((related) => (
              <Link
                key={related._id}
                href={`/post/${related.slug}`}
                className="bg-white rounded-2xl shadow hover:shadow-lg border border-gray-200 p-4 transition"
              >
                <h3 className="font-semibold text-green-800">{related.title}</h3>
                <p className="text-sm text-gray-500 mt-2">{related.excerpt.slice(0, 90)}...</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}


