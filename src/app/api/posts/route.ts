import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import type { PostStatus } from '@/types/post';
import { slugify } from '@/lib/slugify';

const ensureAdminAuthorized = (request: NextRequest): boolean => {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }

  try {
    const token = authHeader.replace('Bearer ', '');
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [adminId, timestamp] = decoded.split(':');
    return Boolean(adminId && timestamp);
  } catch (error) {
    console.error('Failed to validate admin token:', error);
    return false;
  }
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as PostStatus | null;
    const limit = Number(searchParams.get('limit') ?? '20');

    await connectDB();
    const query: Record<string, unknown> = {};
    
    // If no auth header, only return published posts
    const isAdmin = ensureAdminAuthorized(request);
    if (!isAdmin) {
      query.status = 'published';
    } else if (status) {
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
    // Require authentication for POST
    if (!ensureAdminAuthorized(request)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

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


