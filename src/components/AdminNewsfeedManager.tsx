'use client';

import { useState, useEffect } from 'react';
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

interface AdminNewsfeedManagerProps {
  onBack: () => void;
}

export default function AdminNewsfeedManager({ onBack }: AdminNewsfeedManagerProps) {
  const [candidates, setCandidates] = useState<IInfoCandidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<IInfoCandidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedParty, setSelectedParty] = useState('all');
  const [selectedConstituency, setSelectedConstituency] = useState('all');
  const [newNewsUrl, setNewNewsUrl] = useState('');
  const [newYoutubeUrl, setNewYoutubeUrl] = useState('');
  // Future feature: inline editing
  // const [editingNewsIndex, setEditingNewsIndex] = useState<number | null>(null);
  // const [editingYoutubeIndex, setEditingYoutubeIndex] = useState<{ newsIndex: number; youtubeIndex: number } | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/candidates');
      if (!response.ok) {
        throw new Error('Failed to fetch candidates');
      }
      const data = await response.json();
      setCandidates(data.candidates);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch candidates');
    } finally {
      setLoading(false);
    }
  };

  const handleCandidateSelect = (candidate: IInfoCandidate) => {
    setSelectedCandidate(candidate);
    setNewNewsUrl('');
    setNewYoutubeUrl('');
  };

  const handleAddNews = async () => {
    if (!selectedCandidate || !newNewsUrl.trim()) return;

    try {
      setSaving(true);
      const updatedControversial = [...(selectedCandidate.controversial || [])];
      
      // Check if there's an existing entry with empty news
      const existingIndex = updatedControversial.findIndex(item => !item.NEWS);
      if (existingIndex >= 0) {
        updatedControversial[existingIndex].NEWS = newNewsUrl.trim();
      } else {
        updatedControversial.push({
          NEWS: newNewsUrl.trim(),
          youtubes: []
        });
      }

      const response = await fetch(`/api/candidates/${selectedCandidate.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          controversial: updatedControversial
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update candidate');
      }

      const updatedCandidate = await response.json();
      setSelectedCandidate(updatedCandidate);
      setNewNewsUrl('');
      
      // Update the candidates list
      setCandidates(prev => 
        prev.map(c => c.id === selectedCandidate.id ? updatedCandidate : c)
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add news');
    } finally {
      setSaving(false);
    }
  };

  const handleAddYoutube = async (newsIndex: number) => {
    if (!selectedCandidate || !newYoutubeUrl.trim()) return;

    try {
      setSaving(true);
      const updatedControversial = [...(selectedCandidate.controversial || [])];
      
      if (!updatedControversial[newsIndex]) {
        updatedControversial[newsIndex] = { NEWS: '', youtubes: [] };
      }
      
      if (!updatedControversial[newsIndex].youtubes) {
        updatedControversial[newsIndex].youtubes = [];
      }
      
      updatedControversial[newsIndex].youtubes.push(newYoutubeUrl.trim());

      const response = await fetch(`/api/candidates/${selectedCandidate.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          controversial: updatedControversial
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update candidate');
      }

      const updatedCandidate = await response.json();
      setSelectedCandidate(updatedCandidate);
      setNewYoutubeUrl('');
      
      // Update the candidates list
      setCandidates(prev => 
        prev.map(c => c.id === selectedCandidate.id ? updatedCandidate : c)
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add YouTube link');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteNews = async (newsIndex: number) => {
    if (!selectedCandidate) return;

    try {
      setSaving(true);
      const updatedControversial = [...(selectedCandidate.controversial || [])];
      updatedControversial.splice(newsIndex, 1);

      const response = await fetch(`/api/candidates/${selectedCandidate.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          controversial: updatedControversial
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update candidate');
      }

      const updatedCandidate = await response.json();
      setSelectedCandidate(updatedCandidate);
      
      // Update the candidates list
      setCandidates(prev => 
        prev.map(c => c.id === selectedCandidate.id ? updatedCandidate : c)
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete news');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteYoutube = async (newsIndex: number, youtubeIndex: number) => {
    if (!selectedCandidate) return;

    try {
      setSaving(true);
      const updatedControversial = [...(selectedCandidate.controversial || [])];
      updatedControversial[newsIndex].youtubes.splice(youtubeIndex, 1);

      const response = await fetch(`/api/candidates/${selectedCandidate.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          controversial: updatedControversial
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update candidate');
      }

      const updatedCandidate = await response.json();
      setSelectedCandidate(updatedCandidate);
      
      // Update the candidates list
      setCandidates(prev => 
        prev.map(c => c.id === selectedCandidate.id ? updatedCandidate : c)
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete YouTube link');
    } finally {
      setSaving(false);
    }
  };

  // Get unique parties and constituencies for filter dropdowns
  const uniqueParties = Array.from(new Set(candidates.map(c => c.party))).sort();
  const uniqueConstituencies = Array.from(new Set(candidates.map(c => c.constituency))).sort();

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = searchTerm === '' || 
      candidate.candidate_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.constituency.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.party.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesParty = selectedParty === 'all' || candidate.party === selectedParty;
    const matchesConstituency = selectedConstituency === 'all' || candidate.constituency === selectedConstituency;
    
    return matchesSearch && matchesParty && matchesConstituency;
  });

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedParty('all');
    setSelectedConstituency('all');
  };

  if (loading) {
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
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-white">Admin Newsfeed Manager</h1>
              <p className="text-purple-100">Manage candidate news and media links</p>
            </div>
            <button
              onClick={onBack}
              className="bg-white text-purple-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              Back to Main
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Candidate List */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6">প্রার্থী নির্বাচন করুন</h2>
              
              {/* Search Bar */}
              <div className="mb-6">
                <div className="flex space-x-3">
                  <input
                    type="text"
                    placeholder="প্রার্থীর নাম, দল বা নির্বাচনী এলাকা অনুসন্ধান করুন..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-sm"
                  />
                  <button
                    onClick={() => fetchCandidates()}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                  >
                    অনুসন্ধান
                  </button>
                  <button
                    onClick={handleClearFilters}
                    className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors font-medium text-sm"
                  >
                    সাফ করুন
                  </button>
                </div>
              </div>

              {/* Filter Dropdowns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">দল নির্বাচন করুন</label>
                  <select
                    value={selectedParty}
                    onChange={(e) => setSelectedParty(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-sm"
                  >
                    <option value="all">সব দল</option>
                    {uniqueParties.map(party => (
                      <option key={party} value={party}>{party}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">নির্বাচনী এলাকা</label>
                  <select
                    value={selectedConstituency}
                    onChange={(e) => setSelectedConstituency(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-sm"
                  >
                    <option value="all">সব এলাকা</option>
                    {uniqueConstituencies.map(constituency => (
                      <option key={constituency} value={constituency}>{constituency}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Results Count */}
              <div className="mt-4 text-sm text-gray-600">
                {filteredCandidates.length} জন প্রার্থী পাওয়া গেছে
              </div>
            </div>
            
            <div className="p-6 max-h-96 overflow-y-auto">
              {filteredCandidates.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-4">🔍</div>
                  <p>কোন প্রার্থী পাওয়া যায়নি</p>
                  <p className="text-sm">অনুসন্ধানের শর্ত পরিবর্তন করুন</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredCandidates.map((candidate) => (
                    <div
                      key={candidate.id}
                      onClick={() => handleCandidateSelect(candidate)}
                      className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                        selectedCandidate?.id === candidate.id
                          ? 'border-blue-500 bg-blue-50 shadow-md'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {candidate.media?.img_url ? (
                            <Image
                              src={candidate.media.img_url}
                              alt={candidate.candidate_name}
                              width={48}
                              height={48}
                              className="rounded-full object-cover"
                            />
                          ) : (
                            candidate.candidate_name.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-sm">{candidate.candidate_name}</h3>
                          <p className="text-xs text-gray-600">{candidate.constituency}</p>
                          <p className="text-xs text-gray-500">{candidate.party}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-2">
                            <div className="text-xs text-gray-500">
                              {candidate.controversial?.length || 0} সংবাদ
                            </div>
                            {candidate.controversial && candidate.controversial.length > 0 && (
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Newsfeed Management */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {selectedCandidate ? `${selectedCandidate.candidate_name} - নিউজফিড` : 'প্রার্থী নির্বাচন করুন'}
              </h2>
              {selectedCandidate && (
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                    {selectedCandidate.constituency}
                  </span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                    {selectedCandidate.party}
                  </span>
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                    {selectedCandidate.controversial?.length || 0} সংবাদ
                  </span>
                </div>
              )}
            </div>

            {selectedCandidate ? (
              <div className="p-6">
                {/* Add News URL */}
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">নতুন সংবাদ যোগ করুন</h3>
                  <div className="flex space-x-2">
                    <input
                      type="url"
                      placeholder="সংবাদপত্রের URL লিখুন (যেমন: https://prothomalo.com/news/...)"
                      value={newNewsUrl}
                      onChange={(e) => setNewNewsUrl(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-sm"
                    />
                    <button
                      onClick={handleAddNews}
                      disabled={!newNewsUrl.trim() || saving}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                    >
                      {saving ? 'যোগ করা হচ্ছে...' : 'যোগ করুন'}
                    </button>
                  </div>
                </div>

                {/* Existing News and YouTube Links */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">বর্তমান সংবাদ ও মিডিয়া</h3>
                  
                  {selectedCandidate.controversial && selectedCandidate.controversial.length > 0 ? (
                    <div className="space-y-4">
                      {selectedCandidate.controversial.map((item, newsIndex) => (
                        <div key={newsIndex} className="border border-gray-200 rounded-lg p-4">
                          {/* News URL */}
                          {item.NEWS && (
                            <div className="mb-3">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-gray-900 mb-1">📰 সংবাদ নিবন্ধ</h4>
                                <button
                                  onClick={() => handleDeleteNews(newsIndex)}
                                  className="text-red-600 hover:text-red-800 text-sm px-2 py-1 rounded hover:bg-red-50 transition-colors"
                                >
                                  মুছুন
                                </button>
                              </div>
                              <a
                                href={item.NEWS}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 underline text-sm break-all block bg-gray-50 p-2 rounded"
                              >
                                {item.NEWS}
                              </a>
                            </div>
                          )}

                          {/* YouTube Links */}
                          {item.youtubes && item.youtubes.length > 0 && (
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">▶️ ইউটিউব ভিডিও</h4>
                              <div className="space-y-2">
                                {item.youtubes.map((youtube, youtubeIndex) => (
                                  <div key={youtubeIndex} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                    <a
                                      href={youtube}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-red-600 hover:text-red-800 underline text-sm break-all flex-1 mr-2"
                                    >
                                      {youtube}
                                    </a>
                                    <button
                                      onClick={() => handleDeleteYoutube(newsIndex, youtubeIndex)}
                                      className="text-red-600 hover:text-red-800 text-sm px-2 py-1 rounded hover:bg-red-50 transition-colors"
                                    >
                                      মুছুন
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Add YouTube Link */}
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <h5 className="text-sm font-medium text-gray-700 mb-2">ইউটিউব ভিডিও যোগ করুন</h5>
                            <div className="flex space-x-2">
                              <input
                                type="url"
                                placeholder="ইউটিউব ভিডিও URL লিখুন"
                                value={newYoutubeUrl}
                                onChange={(e) => setNewYoutubeUrl(e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 text-sm"
                              />
                              <button
                                onClick={() => handleAddYoutube(newsIndex)}
                                disabled={!newYoutubeUrl.trim() || saving}
                                className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                              >
                                {saving ? 'যোগ করা হচ্ছে...' : 'যোগ করুন'}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <div className="text-4xl mb-4">📰</div>
                      <p>কোন সংবাদ বা মিডিয়া লিংক নেই</p>
                      <p className="text-sm">উপরে সংবাদ নিবন্ধ এবং ইউটিউব ভিডিও যোগ করুন</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500">
                <div className="text-4xl mb-4">👈</div>
                <p>তালিকা থেকে একটি প্রার্থী নির্বাচন করুন</p>
                <p className="text-sm">তাদের নিউজফিড পরিচালনা করতে</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
