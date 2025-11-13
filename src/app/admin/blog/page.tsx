'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import RichTextEditor from '@/components/admin/RichTextEditor';
import type { PostCategory, PostStatus } from '@/types/post';
import { HelpCircle, Save, Eye, Send, Loader2 } from 'lucide-react';

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

export default function AdminBlogPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState<FormState>(initialState);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const postId = searchParams.get('id');

  useEffect(() => {
    if (!postId) return;
    (async () => {
      const res = await fetch(`/api/posts/${postId}`);
      if (!res.ok) return;
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
    })();
  }, [postId]);

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (status: PostStatus) => {
    try {
      setSaving(true);
      setMessage(null);
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Failed to save post');
      }

      setMessage(status === 'published' ? 'পোস্ট প্রকাশিত হয়েছে!' : 'ড্রাফট সংরক্ষিত হয়েছে।');
      setForm((prev) => ({ ...prev, id: result.post._id }));
      if (status === 'published') {
        router.refresh();
      }
    } catch (error) {
      console.error(error);
      setMessage('কিছু ত্রুটি ঘটেছে। পুনরায় চেষ্টা করুন।');
    } finally {
      setSaving(false);
    }
  };

  const previewContent = useMemo(() => ({ __html: form.content || '<p>প্রিভিউ করার জন্য কিছু লিখুন...</p>' }), [form.content]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-red-50 py-10">
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-green-800 via-green-600 to-red-500 text-white rounded-3xl p-6 shadow-xl">
          <div>
            <h1 className="text-3xl font-bold">নতুন ব্লগ পোস্ট লিখুন</h1>
            <p className="text-green-100">ভোট, গণতন্ত্র ও রাজনৈতিক বিশ্লেষণ নিয়ে নতুন দৃষ্টিভঙ্গি যোগ করুন।</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowPreview((prev) => !prev)}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full text-sm font-semibold"
            >
              <Eye className="h-4 w-4" />
              Preview
            </button>
            <button
              onClick={() => handleSubmit('draft')}
              disabled={saving}
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold disabled:opacity-60"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Draft
            </button>
            <button
              onClick={() => handleSubmit('published')}
              disabled={saving}
              className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold disabled:opacity-60"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Publish
            </button>
          </div>
        </header>

        {message && (
          <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-green-700 text-sm shadow">
            {message}
          </div>
        )}

        <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
          <section className="space-y-6">
            <div className="rounded-3xl border border-green-200 bg-white p-6 shadow-sm">
              <label className="text-sm font-semibold text-gray-600 flex items-center gap-2 mb-2">
                <HelpCircle className="h-4 w-4 text-green-500" />
                পোস্টের শিরোনাম
              </label>
              <input
                type="text"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-green-400"
                placeholder="শিরোনাম লিখুন..."
                value={form.title}
                onChange={(e) => handleChange('title', e.target.value)}
              />
            </div>

            <div className="rounded-3xl border border-green-200 bg-white p-6 shadow-sm">
              <label className="text-sm font-semibold text-gray-600 mb-2 block">ফিচারড ছবি URL</label>
              <input
                type="text"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-green-400"
                placeholder="https://example.com/image.jpg"
                value={form.featuredImage}
                onChange={(e) => handleChange('featuredImage', e.target.value)}
              />
            </div>

            <div className="rounded-3xl border border-green-200 bg-white p-6 shadow-sm space-y-3">
              <label className="text-sm font-semibold text-gray-600">মূল বিষয়বস্তু</label>
              <RichTextEditor value={form.content} onChange={(value) => handleChange('content', value)} />
            </div>

            <div className="rounded-3xl border border-green-200 bg-white p-6 shadow-sm space-y-4">
              <label className="text-sm font-semibold text-gray-600">SEO সেটিংস</label>
              <input
                type="text"
                placeholder="SEO শিরোনাম..."
                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-green-400"
                value={form.seoTitle}
                onChange={(e) => handleChange('seoTitle', e.target.value)}
              />
              <textarea
                placeholder="মেটা বর্ণনা..."
                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-green-400 h-24"
                value={form.metaDescription}
                onChange={(e) => handleChange('metaDescription', e.target.value)}
              />
              <input
                type="text"
                placeholder="Canonical URL (ঐচ্ছিক)"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-green-400"
                value={form.canonicalUrl}
                onChange={(e) => handleChange('canonicalUrl', e.target.value)}
              />
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-green-200 bg-white p-6 shadow-sm space-y-3">
              <label className="text-sm font-semibold text-gray-600">বিভাগ নির্বাচন করুন</label>
              <select
                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-green-400 bg-white"
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

            <div className="rounded-3xl border border-green-200 bg-white p-6 shadow-sm space-y-3">
              <label className="text-sm font-semibold text-gray-600">ট্যাগসমূহ (কমা দিয়ে আলাদা করুন)</label>
              <input
                type="text"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-green-400"
                placeholder="ভোট, নির্বাচন, গণতন্ত্র"
                value={form.tags}
                onChange={(e) => handleChange('tags', e.target.value)}
              />
            </div>

            <div className="rounded-3xl border border-green-200 bg-white p-6 shadow-sm space-y-3">
              <label className="text-sm font-semibold text-gray-600">সংক্ষিপ্ত সারাংশ</label>
              <textarea
                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-green-400 h-32"
                value={form.excerpt}
                onChange={(e) => handleChange('excerpt', e.target.value)}
              />
            </div>

            <div className="rounded-3xl border border-green-200 bg-white p-6 shadow-sm space-y-3">
              <label className="text-sm font-semibold text-gray-600">স্ট্যাটাস</label>
              <select
                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-green-400 bg-white"
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
          <div className="rounded-3xl border border-red-200 bg-white shadow-lg p-6 md:p-10 space-y-6">
            <h2 className="text-2xl font-bold text-green-800">Preview</h2>
            {form.featuredImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.featuredImage} alt={form.title} className="w-full rounded-2xl" />
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
    </div>
  );
}


