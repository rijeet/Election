'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import RichTextEditor from '@/components/admin/RichTextEditor';
import type { PostCategory, PostStatus } from '@/types/post';
import { HelpCircle, Save, Eye, Send, Loader2, Plus, Edit, Trash2, List } from 'lucide-react';

const categories: PostCategory[] = ['Politics', 'Election', 'Analysis', 'History', 'Opinion', 'Other'];

interface FormState {
  id?: string;
  title: string;
  featuredImage: string;
  content: string;
  category: PostCategory;
  tags: string;
  excerpt: string;
  seoTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  status: PostStatus;
}

interface Post {
  _id: string;
  title: string;
  slug: string;
  category: PostCategory;
  status: PostStatus;
  excerpt: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

const initialState: FormState = {
  title: '',
  featuredImage: '',
  content: '',
  category: 'Politics',
  tags: '',
  excerpt: '',
  seoTitle: '',
  metaDescription: '',
  canonicalUrl: '',
  status: 'draft'
};

function BlogEditor({ postId, onSave, onCancel }: { postId?: string; onSave: () => void; onCancel: () => void }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialState);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(!!postId);

  useEffect(() => {
    if (!postId) return;
    (async () => {
      try {
        const token = localStorage.getItem('admin_token');
        const res = await fetch(`/api/posts/${postId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!res.ok) {
          if (res.status === 401) {
            router.push('/admin/login');
            return;
          }
          throw new Error('Failed to load post');
        }
        const data = await res.json();
        setForm({
          id: data._id,
          title: data.title,
          featuredImage: data.featuredImage ?? '',
          content: data.content,
          category: data.category,
          tags: (data.tags ?? []).join(', '),
          excerpt: data.excerpt ?? '',
          seoTitle: data.seoTitle ?? '',
          metaDescription: data.metaDescription ?? '',
          canonicalUrl: data.canonicalUrl ?? '',
          status: data.status ?? 'draft'
        });
      } catch (error) {
        console.error(error);
        setMessage('Failed to load post');
      } finally {
        setLoading(false);
      }
    })();
  }, [postId, router]);

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (status: PostStatus) => {
    try {
      setSaving(true);
      setMessage(null);
      const token = localStorage.getItem('admin_token');
      const payload = {
        ...form,
        status,
        tags: form.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean)
      };

      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const result = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          router.push('/admin/login');
          return;
        }
        throw new Error(result.error || 'Failed to save post');
      }

      setMessage(status === 'published' ? 'পোস্ট প্রকাশিত হয়েছে!' : 'ড্রাফট সংরক্ষিত হয়েছে।');
      setForm((prev) => ({ ...prev, id: result.post._id }));
      if (status === 'published') {
        setTimeout(() => {
          onSave();
        }, 1000);
      }
    } catch (error) {
      console.error(error);
      setMessage('কিছু ত্রুটি ঘটেছে। পুনরায় চেষ্টা করুন।');
    } finally {
      setSaving(false);
    }
  };

  const previewContent = useMemo(() => ({ __html: form.content || '<p>প্রিভিউ করার জন্য কিছু লিখুন...</p>' }), [form.content]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-green-800 via-green-600 to-red-500 text-white rounded-2xl p-6 shadow-lg">
        <div>
          <h2 className="text-2xl font-bold">{postId ? 'Edit Post' : 'নতুন ব্লগ পোস্ট লিখুন'}</h2>
          <p className="text-green-100 text-sm">ভোট, গণতন্ত্র ও রাজনৈতিক বিশ্লেষণ নিয়ে নতুন দৃষ্টিভঙ্গি যোগ করুন।</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => setShowPreview((prev) => !prev)}
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-semibold"
          >
            <Eye className="h-4 w-4" />
            Preview
          </button>
          <button
            onClick={onCancel}
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-semibold"
          >
            <List className="h-4 w-4" />
            List
          </button>
          <button
            onClick={() => handleSubmit('draft')}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Draft
          </button>
          <button
            onClick={() => handleSubmit('published')}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Publish
          </button>
        </div>
      </header>

      {message && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-700 text-sm shadow">
          {message}
        </div>
      )}

      <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
        <section className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <label className="text-sm font-semibold text-gray-600 flex items-center gap-2 mb-2">
              <HelpCircle className="h-4 w-4 text-green-500" />
              পোস্টের শিরোনাম
            </label>
            <input
              type="text"
              className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-green-400"
              placeholder="শিরোনাম লিখুন..."
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
            />
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <label className="text-sm font-semibold text-gray-600 mb-2 block">ফিচারড ছবি URL</label>
            <input
              type="text"
              className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-green-400"
              placeholder="https://example.com/image.jpg"
              value={form.featuredImage}
              onChange={(e) => handleChange('featuredImage', e.target.value)}
            />
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-3">
            <label className="text-sm font-semibold text-gray-600">মূল বিষয়বস্তু</label>
            <RichTextEditor value={form.content} onChange={(value) => handleChange('content', value)} />
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
            <label className="text-sm font-semibold text-gray-600">SEO সেটিংস</label>
            <input
              type="text"
              placeholder="SEO শিরোনাম..."
              className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-green-400"
              value={form.seoTitle}
              onChange={(e) => handleChange('seoTitle', e.target.value)}
            />
            <textarea
              placeholder="মেটা বর্ণনা..."
              className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-green-400 h-24"
              value={form.metaDescription}
              onChange={(e) => handleChange('metaDescription', e.target.value)}
            />
            <input
              type="text"
              placeholder="Canonical URL (ঐচ্ছিক)"
              className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-green-400"
              value={form.canonicalUrl}
              onChange={(e) => handleChange('canonicalUrl', e.target.value)}
            />
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-3">
            <label className="text-sm font-semibold text-gray-600">বিভাগ নির্বাচন করুন</label>
            <select
              className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-green-400 bg-white"
              value={form.category}
              onChange={(e) => handleChange('category', e.target.value as PostCategory)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-3">
            <label className="text-sm font-semibold text-gray-600">ট্যাগসমূহ (কমা দিয়ে আলাদা করুন)</label>
            <input
              type="text"
              className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-green-400"
              placeholder="ভোট, নির্বাচন, গণতন্ত্র"
              value={form.tags}
              onChange={(e) => handleChange('tags', e.target.value)}
            />
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-3">
            <label className="text-sm font-semibold text-gray-600">সংক্ষিপ্ত সারাংশ</label>
            <textarea
              className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-green-400 h-32"
              value={form.excerpt}
              onChange={(e) => handleChange('excerpt', e.target.value)}
            />
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-3">
            <label className="text-sm font-semibold text-gray-600">স্ট্যাটাস</label>
            <select
              className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-green-400 bg-white"
              value={form.status}
              onChange={(e) => handleChange('status', e.target.value as PostStatus)}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </aside>
      </div>

      {showPreview && (
        <div className="rounded-xl border border-gray-200 bg-white shadow-lg p-6 md:p-10 space-y-6">
          <h2 className="text-2xl font-bold text-green-800">Preview</h2>
          {form.featuredImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={form.featuredImage} alt={form.title} className="w-full rounded-lg" />
          )}
          <h3 className="text-3xl font-bold text-green-900">{form.title}</h3>
          <p className="text-gray-600">{form.excerpt}</p>
          <div
            className="prose max-w-none text-gray-800 leading-7"
            dangerouslySetInnerHTML={previewContent}
          />
        </div>
      )}
    </div>
  );
}

function BlogList({ onEdit, onDelete, onNew, refreshTrigger }: { onEdit: (id: string) => void; onDelete: (id: string) => void; onNew: () => void; refreshTrigger?: number }) {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');
      const res = await fetch('/api/posts?limit=100', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        if (res.status === 401) {
          router.push('/admin/login');
          return;
        }
        throw new Error('Failed to fetch posts');
      }

      const data = await res.json();
      setPosts(data);
      setError(null);
    } catch (error) {
      console.error(error);
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTrigger]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        if (res.status === 401) {
          router.push('/admin/login');
          return;
        }
        throw new Error('Failed to delete post');
      }

      await fetchPosts();
      onDelete(id);
    } catch (error) {
      console.error(error);
      alert('Failed to delete post');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Blog Posts</h2>
        <button
          onClick={onNew}
          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold"
        >
          <Plus className="h-4 w-4" />
          New Post
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {posts.map((post) => (
              <tr key={post._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{post.title}</div>
                  <div className="text-sm text-gray-500">{post.excerpt.slice(0, 50)}...</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    {post.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    post.status === 'published' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {post.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => onEdit(post._id)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    <Edit className="h-4 w-4 inline" />
                  </button>
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-4 w-4 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {posts.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No posts found. Create your first post!
          </div>
        )}
      </div>
    </div>
  );
}

export default function BlogManager() {
  const router = useRouter();
  const [view, setView] = useState<'list' | 'editor'>('list');
  const [selectedPostId, setSelectedPostId] = useState<string | undefined>();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    // Verify token
    fetch('/api/admin/dashboard/stats', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) {
          localStorage.removeItem('admin_token');
          router.push('/admin/login');
        }
      })
      .catch(() => {
        localStorage.removeItem('admin_token');
        router.push('/admin/login');
      });
  }, [router]);

  const handleNewPost = () => {
    setSelectedPostId(undefined);
    setView('editor');
  };

  const handleEditPost = (id: string) => {
    setSelectedPostId(id);
    setView('editor');
  };

  const handleDeletePost = (_id: string) => {
    // Handled in BlogList component
  };

  const handleSave = () => {
    setView('list');
    setSelectedPostId(undefined);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleCancel = () => {
    setView('list');
    setSelectedPostId(undefined);
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-xl p-6 shadow-lg">
      {view === 'list' ? (
        <BlogList
          onEdit={handleEditPost}
          onDelete={handleDeletePost}
          onNew={handleNewPost}
          refreshTrigger={refreshTrigger}
        />
      ) : (
        <BlogEditor
          postId={selectedPostId}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}

