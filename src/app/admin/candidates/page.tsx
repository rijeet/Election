'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
import CandidateForm, { CandidateFormValues } from '@/components/admin/CandidateForm';

interface CandidateListItem extends CandidateFormValues {
  _id?: string;
  metadata?: {
    created_at?: string;
    source?: string;
    record_index?: number;
  };
}

export default function AdminCandidatesPage() {
  const router = useRouter();
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [candidates, setCandidates] = useState<CandidateListItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const totalCandidates = useMemo(() => candidates.length, [candidates]);

  const fetchCandidates = useCallback(
    async (token: string) => {
      try {
        setLoading(true);
        const response = await fetch('/api/candidates?limit=200', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to load candidates');
        }

        const data = await response.json();
        setCandidates(data.candidates || []);
        setError(null);
      } catch (err) {
        console.error('Candidate load error:', err);
        setError('প্রার্থীর তালিকা লোড করতে ব্যর্থ হয়েছে');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      toast.error('অ্যাডমিন হিসাবে লগইন করুন');
      router.push('/admin/login');
      return;
    }

    setAuthToken(token);
    fetchCandidates(token);
  }, [fetchCandidates, router]);

  const handleDelete = async (candidateId: string) => {
    if (!authToken) {
      toast.error('অ্যাডমিন হিসাবে লগইন করুন');
      router.push('/admin/login');
      return;
    }

    const confirmed = window.confirm('আপনি কি নিশ্চিত? এই প্রার্থী তথ্য মুছে যাবে।');
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/candidates/${candidateId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete candidate');
      }

      toast.success('প্রার্থী তথ্য মুছে ফেলা হয়েছে');
      fetchCandidates(authToken);
    } catch (error) {
      console.error('Delete candidate failed:', error);
      toast.error('প্রার্থী তথ্য মুছতে ব্যর্থ হয়েছে');
    }
  };

  const handleFormSuccess = () => {
    if (!authToken) return;
    setShowForm(false);
    fetchCandidates(authToken);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <header className="border-b border-white/30 bg-white/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">👥 প্রার্থী ব্যবস্থাপনা</h1>
            <p className="text-sm text-gray-600">প্রার্থীর তথ্য যোগ, সম্পাদনা ও মুছুন</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin"
              className="rounded-lg border border-blue-200 px-4 py-2 text-sm font-medium text-blue-700 shadow-sm hover:bg-blue-50"
            >
              ← ড্যাশবোর্ডে ফিরে যান
            </Link>
            <button
              type="button"
              onClick={() => setShowForm((prev) => !prev)}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700"
            >
              {showForm ? 'ফর্ম বন্ধ করুন' : 'নতুন প্রার্থী যোগ করুন'}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 space-y-6">
        {showForm && (
          <section className="rounded-2xl border border-blue-100 bg-white/90 p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold text-gray-800">নতুন প্রার্থী</h2>
            <CandidateForm
              mode="create"
              onCancel={() => setShowForm(false)}
              onSuccess={handleFormSuccess}
            />
          </section>
        )}

        <section className="space-y-4">
          <div className="rounded-2xl border border-white/40 bg-white/80 p-6 shadow-lg">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">প্রার্থী তালিকা</h2>
                <p className="text-sm text-gray-500">মোট {totalCandidates} জন প্রার্থীর তথ্য</p>
              </div>
              <div className="text-sm text-gray-500">
                {loading ? 'ডেটা লোড হচ্ছে...' : 'আপডেটেড তালিকা'}
              </div>
            </div>

            {error && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                {error}
              </div>
            )}

            {!loading && !error && candidates.length === 0 && (
              <div className="mt-6 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-gray-600">
                কোনও প্রার্থী পাওয়া যায়নি। নতুন প্রার্থী যোগ করুন।
              </div>
            )}

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {candidates.map((candidate) => (
                <article
                  key={candidate.id}
                  className="flex h-full flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{candidate.candidate_name}</h3>
                        <p className="text-sm text-gray-500">আইডি: {candidate.id}</p>
                      </div>
                      {candidate.media?.img_url && (
                        <Image
                          src={candidate.media.img_url}
                          alt={candidate.candidate_name}
                          width={56}
                          height={56}
                          className="h-14 w-14 rounded-lg border border-gray-200 object-cover"
                          unoptimized
                        />
                      )}
                    </div>
                    <div className="grid grid-cols-1 gap-2 text-sm text-gray-700">
                      <div>
                        <span className="font-medium text-gray-600">দল:</span> {candidate.party || 'তথ্য নেই'}
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">আসন:</span> {candidate.constituency}
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                        {candidate.division && <span className="rounded-full bg-blue-50 px-2 py-1">বিভাগ: {candidate.division}</span>}
                        {candidate.district && <span className="rounded-full bg-green-50 px-2 py-1">জেলা: {candidate.district}</span>}
                        {candidate.gender && <span className="rounded-full bg-purple-50 px-2 py-1">লিঙ্গ: {candidate.gender}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      href={`/admin/candidates/${candidate.id}/edit`}
                      className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
                    >
                      সম্পাদনা
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(candidate.id)}
                      className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                    >
                      মুছুন
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}


