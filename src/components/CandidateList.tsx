'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

interface IInfoCandidate {
  _id: string;
  id: string;
  constituency: string;
  party: string;
  candidate_name: string;
  gender: string;
  personal_info: {
    occupation_category: string;
    profession_details: string;
    education_category: string;
    education_details: string;
  };
  controversial: Array<{
    NEWS: string;
    youtubes: string[];
  }>;
  media: {
    img_url: string;
  };
  metadata: {
    created_at: string;
    source: string;
    record_index: number;
  };
}

interface CandidateListProps {
  onSelectCandidate: (candidateId: string) => void;
}

export default function CandidateList({ onSelectCandidate }: CandidateListProps) {
  const [candidates, setCandidates] = useState<IInfoCandidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedParty, setSelectedParty] = useState('');
  const [selectedConstituency, setSelectedConstituency] = useState('');
  const [parties, setParties] = useState<string[]>([]);
  const [constituencies, setConstituencies] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCandidates, setTotalCandidates] = useState(0);

  const fetchCandidates = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12'
      });
      
      if (searchTerm) params.append('search', searchTerm);
      if (selectedParty) params.append('party', selectedParty);
      if (selectedConstituency) params.append('constituency', selectedConstituency);
      
      const response = await fetch(`/api/candidates?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch candidates');
      }
      
      const data = await response.json();
      setCandidates(data.candidates);
      setTotalPages(data.pagination.pages);
      setTotalCandidates(data.pagination.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch candidates');
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, selectedParty, selectedConstituency]);

  const fetchFilters = useCallback(async () => {
    try {
      const response = await fetch('/api/candidates');
      if (response.ok) {
        const data = await response.json();
        const uniqueParties = [...new Set(data.candidates.map((c: IInfoCandidate) => c.party))] as string[];
        const uniqueConstituencies = [...new Set(data.candidates.map((c: IInfoCandidate) => c.constituency))] as string[];
        setParties(uniqueParties.sort());
        setConstituencies(uniqueConstituencies.sort());
      }
    } catch (err) {
      console.error('Failed to fetch filter options:', err);
    }
  }, []);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  useEffect(() => {
    fetchFilters();
  }, [fetchFilters]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchCandidates();
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedParty('');
    setSelectedConstituency('');
    setCurrentPage(1);
  };

  if (loading && candidates.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchCandidates}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2 text-white">প্রার্থীদের তথ্য বিশ্লেষণ</h1>
          <p className="text-blue-100">প্রার্থীর তথ্য তালিকা</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border-b border-gray-200 py-6 shadow-sm">
        <div className="container mx-auto px-4">
          <form onSubmit={handleSearch} className="space-y-4">
            {/* Search Bar */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="প্রার্থীর নাম, দল বা নির্বাচনী এলাকা অনুসন্ধান করুন..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 bg-white"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                অনুসন্ধান
              </button>
              <button
                type="button"
                onClick={clearFilters}
                className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors font-medium"
              >
                সাফ করুন
              </button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  দল নির্বাচন করুন
                </label>
                <select
                  value={selectedParty}
                  onChange={(e) => setSelectedParty(e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                >
                  <option value="">সব দল</option>
                  {parties.map((party) => (
                    <option key={party} value={party}>
                      {party}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  নির্বাচনী এলাকা
                </label>
                <select
                  value={selectedConstituency}
                  onChange={(e) => setSelectedConstituency(e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                >
                  <option value="">সব এলাকা</option>
                  {constituencies.map((constituency) => (
                    <option key={constituency} value={constituency}>
                      {constituency}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Results Count */}
      <div className="bg-gray-50 border-b border-gray-200 py-4">
        <div className="container mx-auto px-4">
          <p className="text-gray-700 font-medium">
            মোট {totalCandidates} জন প্রার্থী পাওয়া গেছে
          </p>
        </div>
      </div>

      {/* Candidates Grid */}
      <div className="container mx-auto px-4 py-8">
        {candidates.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">কোন প্রার্থী পাওয়া যায়নি</h3>
            <p className="text-gray-600">আপনার অনুসন্ধান শর্ত পরিবর্তন করে আবার চেষ্টা করুন</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {candidates.map((candidate) => (
              <div
                key={candidate.id}
                className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:-translate-y-1"
                onClick={() => onSelectCandidate(candidate.id)}
              >
                {/* Candidate Photo */}
                <div className="aspect-w-3 aspect-h-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg overflow-hidden">
                  {candidate.media?.img_url ? (
                    <Image
                      src={candidate.media.img_url}
                      alt={candidate.candidate_name}
                      width={300}
                      height={400}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 flex items-center justify-center text-gray-500 text-6xl bg-gradient-to-br from-gray-100 to-gray-200">
                      👤
                    </div>
                  )}
                </div>

                {/* Candidate Info */}
                <div className="p-5 bg-white">
                  <h3 className="font-bold text-lg text-gray-900 mb-3 line-clamp-2">
                    {candidate.candidate_name}
                  </h3>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start">
                      <span className="font-semibold text-gray-600 w-16 flex-shrink-0">দল:</span>
                      <span className="text-gray-800 truncate">{candidate.party}</span>
                    </div>
                    
                    <div className="flex items-start">
                      <span className="font-semibold text-gray-600 w-16 flex-shrink-0">এলাকা:</span>
                      <span className="text-gray-800 truncate">{candidate.constituency}</span>
                    </div>
                    
                    <div className="flex items-start">
                      <span className="font-semibold text-gray-600 w-16 flex-shrink-0">পেশা:</span>
                      <span className="text-gray-800 truncate">{candidate.personal_info.occupation_category}</span>
                    </div>
                    
                    <div className="flex items-start">
                      <span className="font-semibold text-gray-600 w-16 flex-shrink-0">শিক্ষা:</span>
                      <span className="text-gray-800 truncate">{candidate.personal_info.education_category}</span>
                    </div>
                  </div>

                  {/* News/Media Indicator */}
                  {candidate.controversial && candidate.controversial.length > 0 && (
                    <div className="mt-4 flex items-center text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                      <span className="mr-1">📰</span>
                      <span>নিউজ ও মিডিয়া উপলব্ধ</span>
                    </div>
                  )}

                  {/* View Profile Button */}
                  <button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 text-sm font-medium shadow-sm">
                    প্রোফাইল দেখুন
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                পূর্ববর্তী
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 border rounded-lg ${
                      currentPage === page
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                পরবর্তী
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
