import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Post, { IPost } from '@/models/Post';
import mongoose from 'mongoose';

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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid post id' }, { status: 400 });
    }

    await connectDB();
    const post = await Post.findById(id).lean<IPost>();
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // If not admin, only return published posts
    const isAdmin = ensureAdminAuthorized(request);
    if (!isAdmin && post.status !== 'published') {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Failed to fetch post:', error);
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require authentication for PUT
    if (!ensureAdminAuthorized(request)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid post id' }, { status: 400 });
    }
    const body = await request.json();

    await connectDB();
    const updated = await Post.findByIdAndUpdate(id, body, { new: true });
    if (!updated) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, post: updated });
  } catch (error) {
    console.error('Failed to update post:', error);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require authentication for DELETE
    if (!ensureAdminAuthorized(request)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid post id' }, { status: 400 });
    }

    await connectDB();
    const deleted = await Post.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Failed to delete post:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}


