import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import type { PostStatus } from '@/types/post';
import { slugify } from '@/lib/slugify';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as PostStatus | null;
    const limit = Number(searchParams.get('limit') ?? '20');

    await connectDB();
    const query: Record<string, unknown> = {};
    if (status) {
      query.status = status;
    }

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .limit(Number.isNaN(limit) ? 20 : limit)
      .lean();

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      id,
      title,
      featuredImage,
      content,
      category,
      tags,
      excerpt,
      seoTitle,
      metaDescription,
      canonicalUrl,
      status
    } = body;

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    await connectDB();

    const slug = slugify(title);
    const postData = {
      title,
      slug,
      featuredImage,
      content,
      category,
      tags,
      excerpt,
      seoTitle,
      metaDescription,
      canonicalUrl,
      status: status as PostStatus,
      publishedAt: status === 'published' ? new Date() : undefined
    };

    const post = id
      ? await Post.findByIdAndUpdate(id, { ...postData, slug }, { new: true })
      : await Post.create(postData);

    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error('Failed to save post:', error);
    return NextResponse.json({ error: 'Failed to save post' }, { status: 500 });
  }
}


