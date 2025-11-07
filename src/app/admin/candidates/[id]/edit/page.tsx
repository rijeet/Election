'use client';

import { use, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import CandidateForm, { CandidateFormValues } from '@/components/admin/CandidateForm';

interface CandidateResponse extends CandidateFormValues {
  _id?: string;
  metadata?: {
    created_at?: string;
    source?: string;
    record_index?: number;
  };
}

export default function EditCandidatePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id: candidateId } = use(params);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [candidate, setCandidate] = useState<CandidateFormValues | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCandidate = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/candidates/${candidateId}`);
      if (!response.ok) {
        throw new Error('Candidate not found');
      }

      const data: CandidateResponse = await response.json();
      setCandidate({
        id: data.id,
        candidate_name: data.candidate_name,
        gender: data.gender || '',
        party: data.party,
        constituency: data.constituency,
        division: data.division || '',
        district: data.district || '',
        personal_info: {
          occupation_category: data.personal_info?.occupation_category || '',
          profession_details: data.personal_info?.profession_details || '',
          education_category: data.personal_info?.education_category || '',
          education_details: data.personal_info?.education_details || ''
        },
        income: data.income || '',
        tax: data.tax || '',
        assets: data.assets || '',
        liabilities: data.liabilities || '',
        expenditure: data.expenditure || '',
        media: {
          img_url: data.media?.img_url || ''
        },
        family: {
          spouse: data.family?.spouse || null,
          sons: data.family?.sons || [],
          daughters: data.family?.daughters || []
        }
      });
      setError(null);
    } catch (err) {
      console.error('Candidate fetch failed:', err);
      setError('প্রার্থী তথ্য লোড করতে ব্যর্থ হয়েছে');
    } finally {
      setLoading(false);
    }
  }, [candidateId]);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      toast.error('অ্যাডমিন হিসাবে লগইন করুন');
      router.push('/admin/login');
      return;
    }
    setAuthToken(token);
    fetchCandidate();
  }, [fetchCandidate, router]);

  const handleUpdateSuccess = () => {
    fetchCandidate();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <header className="border-b border-white/30 bg-white/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">প্রার্থী সম্পাদনা</h1>
            <p className="text-sm text-gray-600">আইডি: {candidateId}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/candidates"
              className="rounded-lg border border-blue-200 px-4 py-2 text-sm font-medium text-blue-700 shadow-sm hover:bg-blue-50"
            >
              ← প্রার্থী তালিকায় ফিরে যান
            </Link>
            <button
              type="button"
              onClick={() => router.refresh()}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              রিফ্রেশ
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        {loading && (
          <div className="rounded-2xl border border-blue-100 bg-white/90 p-6 text-center text-gray-600 shadow-lg">
            প্রার্থীর তথ্য লোড হচ্ছে...
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-600 shadow-lg">
            {error}
          </div>
        )}

        {!loading && !error && candidate && authToken && (
          <section className="rounded-2xl border border-blue-100 bg-white/90 p-6 shadow-lg">
            <CandidateForm
              mode="edit"
              defaultValues={candidate}
              onCancel={() => router.push('/admin/candidates')}
              onSuccess={handleUpdateSuccess}
            />
          </section>
        )}
      </main>
    </div>
  );
}


