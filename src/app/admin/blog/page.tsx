'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import BlogManager from '@/components/admin/BlogManager';
import { Loader2 } from 'lucide-react';

export default function AdminBlogPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

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
        } else {
          setAuthenticated(true);
          setLoading(false);
        }
      })
      .catch(() => {
        localStorage.removeItem('admin_token');
        router.push('/admin/login');
      });
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <a
            href="/admin"
            className="text-blue-600 hover:text-blue-800 font-medium mb-4 inline-block"
          >
            ← Back to Admin Dashboard
          </a>
        </div>
        <BlogManager />
      </div>
    </div>
  );
}
