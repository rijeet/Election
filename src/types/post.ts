export type PostStatus = 'draft' | 'published';

export type PostCategory =
  | 'Politics'
  | 'Election'
  | 'Analysis'
  | 'History'
  | 'Opinion'
  | 'Other';

export interface PostDTO {
  _id: string;
  slug: string;
  title: string;
  featuredImage?: string;
  content: string;
  category: PostCategory;
  tags: string[];
  excerpt: string;
  seoTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  status: PostStatus;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}


