import mongoose, { Schema, Document } from 'mongoose';
import type { PostCategory, PostStatus } from '@/types/post';

export interface IPost extends Document {
  title: string;
  slug: string;
  featuredImage?: string;
  content: string;
  category: PostCategory;
  tags: string[];
  excerpt: string;
  seoTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  status: PostStatus;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    featuredImage: { type: String, default: '' },
    content: { type: String, required: true },
    category: {
      type: String,
      enum: ['Politics', 'Election', 'Analysis', 'History', 'Opinion', 'Other'],
      default: 'Politics'
    },
    tags: { type: [String], default: [] },
    excerpt: { type: String, default: '' },
    seoTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    canonicalUrl: { type: String, default: '' },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft'
    },
    publishedAt: { type: Date }
  },
  {
    timestamps: true,
    collection: 'posts'
  }
);

export default mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);


