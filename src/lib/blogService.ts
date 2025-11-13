import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import type { PostDTO, PostStatus } from '@/types/post';
import mongoose from 'mongoose';

type PostLean = {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  featuredImage?: string;
  content: string;
  category: string;
  tags: string[];
  excerpt: string;
  seoTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  status: PostStatus;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};

function toPostDTO(doc: PostLean): PostDTO {
  return {
    _id: doc._id.toString(),
    title: doc.title,
    slug: doc.slug,
    featuredImage: doc.featuredImage,
    content: doc.content,
    category: doc.category as PostDTO['category'],
    tags: doc.tags,
    excerpt: doc.excerpt,
    seoTitle: doc.seoTitle,
    metaDescription: doc.metaDescription,
    canonicalUrl: doc.canonicalUrl,
    status: doc.status,
    publishedAt: doc.publishedAt?.toISOString(),
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString()
  };
}

export async function getPublishedPosts(limit = 10): Promise<PostDTO[]> {
  await connectDB();
  const posts = await Post.find({ status: 'published' })
    .sort({ publishedAt: -1 })
    .limit(limit)
    .lean<PostLean[]>();
  return posts.map(toPostDTO);
}

export async function getLatestPostsByCategory(category: string, limit = 5): Promise<PostDTO[]> {
  await connectDB();
  const posts = await Post.find({ status: 'published', category })
    .sort({ publishedAt: -1 })
    .limit(limit)
    .lean<PostLean[]>();
  return posts.map(toPostDTO);
}

export async function getPostBySlug(slug: string): Promise<PostDTO | null> {
  await connectDB();
  const post = await Post.findOne({ slug }).lean<PostLean | null>();
  return post ? toPostDTO(post) : null;
}

export async function getPostById(id: string): Promise<PostDTO | null> {
  await connectDB();
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  const post = await Post.findById(id).lean<PostLean | null>();
  return post ? toPostDTO(post) : null;
}


