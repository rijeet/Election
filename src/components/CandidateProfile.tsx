'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import URLPreview from './URLPreview';

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

interface CandidateProfileProps {
  candidateId: string;
  onBack: () => void;
}

export default function CandidateProfile({ candidateId, onBack }: CandidateProfileProps) {
  const [candidate, setCandidate] = useState<IInfoCandidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('affidavit');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/candidates/${candidateId}`);
        if (!response.ok) {
          throw new Error('Candidate not found');
        }
        const data = await response.json();
        setCandidate(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch candidate');
      } finally {
        setLoading(false);
      }
    };

    if (candidateId) {
      fetchCandidate();
    }
  }, [candidateId]);

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
            onClick={onBack}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to List
          </button>
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-4">Candidate Not Found</h2>
          <button
            onClick={onBack}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to List
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'affidavit', name: 'হলফনামা', icon: '📄' },
    { id: 'income', name: 'আয়কর', icon: '💰' },
    { id: 'assets', name: 'সম্পদ, দায়', icon: '🏠' },
    { id: 'expenses', name: 'ব্যায়বিবরণী', icon: '📊' },
    { id: 'newsfeed', name: 'নিউজফিড', icon: '📰' }
  ];

  const renderAffidavitContent = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-red-100 p-4 rounded-lg">
          <h3 className="font-bold text-red-800 mb-2">শিক্ষা</h3>
          <p className="text-sm text-gray-900 font-medium">{candidate.personal_info.education_category}</p>
          <p className="text-xs text-gray-700 mt-1">{candidate.personal_info.education_details}</p>
        </div>
        
        <div className="bg-green-100 p-4 rounded-lg">
          <h3 className="font-bold text-green-800 mb-2">পেশা/জীবিকা</h3>
          <p className="text-sm text-gray-900 font-medium">{candidate.personal_info.occupation_category}</p>
          <p className="text-xs text-gray-700 mt-1">{candidate.personal_info.profession_details}</p>
        </div>
        
        <div className="bg-purple-100 p-4 rounded-lg">
          <h3 className="font-bold text-purple-800 mb-2">মামলা</h3>
          <p className="text-sm text-gray-900 font-medium">Present: 0</p>
          <p className="text-sm text-gray-900 font-medium">Past: 0</p>
        </div>
        
        <div className="bg-teal-100 p-4 rounded-lg">
          <h3 className="font-bold text-teal-800 mb-2">আয়</h3>
          <p className="text-sm text-gray-900 font-medium">Not Available</p>
        </div>
        
        <div className="bg-orange-100 p-4 rounded-lg">
          <h3 className="font-bold text-orange-800 mb-2">ধনসম্পত্তি</h3>
          <p className="text-sm text-gray-900 font-medium">Not Available</p>
        </div>
        
        <div className="bg-red-100 p-4 rounded-lg">
          <h3 className="font-bold text-red-800 mb-2">দায়</h3>
          <p className="text-sm text-gray-900 font-medium">Not Available</p>
        </div>
        
        <div className="bg-green-100 p-4 rounded-lg">
          <h3 className="font-bold text-green-800 mb-2">কর</h3>
          <p className="text-sm text-gray-900 font-medium">Not Available</p>
        </div>
        
        <div className="bg-purple-100 p-4 rounded-lg">
          <h3 className="font-bold text-purple-800 mb-2">ঋণ</h3>
          <p className="text-sm text-gray-900 font-medium">Not Available</p>
        </div>
      </div>
    </div>
  );

  const renderNewsfeedContent = () => (
    <div className="space-y-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">নিউজ ও মিডিয়া</h3>
      
      {candidate.controversial && candidate.controversial.length > 0 ? (
        <div className="space-y-6">
          {candidate.controversial.map((item, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                {item.NEWS && (
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-blue-600 text-lg">📰</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2 text-lg">সংবাদপত্র</h4>
                      <URLPreview url={item.NEWS} type="news">
                        <a 
                          href={item.NEWS} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline text-sm break-all bg-blue-50 px-3 py-2 rounded-lg inline-block hover:bg-blue-100 transition-colors"
                        >
                          {item.NEWS}
                        </a>
                      </URLPreview>
                    </div>
                  </div>
                )}
                
                {item.youtubes && item.youtubes.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 text-lg">ইউটিউব ভিডিও</h4>
                    {item.youtubes.map((youtube, yIndex) => (
                      <div key={yIndex} className="flex items-start space-x-4">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-red-600 text-lg">▶️</span>
                        </div>
                        <div className="flex-1">
                          <URLPreview url={youtube} type="youtube">
                            <a 
                              href={youtube} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-red-600 hover:text-red-800 underline text-sm break-all bg-red-50 px-3 py-2 rounded-lg inline-block hover:bg-red-100 transition-colors"
                            >
                              {youtube}
                            </a>
                          </URLPreview>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-800">
          <div className="text-6xl mb-6">📰</div>
          <h3 className="text-xl font-semibold mb-2 text-gray-900">কোন নিউজ বা মিডিয়া লিংক পাওয়া যায়নি</h3>
          <p className="text-gray-700">শীঘ্রই এই বিভাগে নিউজ ও মিডিয়া লিংক যোগ করা হবে</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2 text-white">প্রার্থীদের তথ্য বিশ্লেষণ</h1>
          <p className="text-blue-100">প্রার্থীর তথ্য তালিকা</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          {/* Candidate Header */}
          <div className="p-8 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-start space-x-8">
              {/* Candidate Photo */}
              <div className="flex-shrink-0">
                <div className="w-36 h-44 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center shadow-md">
                  {candidate.media?.img_url ? (
                    <Image
                      src={candidate.media.img_url}
                      alt={candidate.candidate_name}
                      width={144}
                      height={176}
                      className="rounded-xl object-cover"
                    />
                  ) : (
                    <div className="text-gray-500 text-5xl">👤</div>
                  )}
                </div>
                <p className="text-center text-sm font-semibold mt-3 text-gray-800">
                  {candidate.candidate_name}
                </p>
              </div>

              {/* Candidate Info */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-gray-900">
                    {candidate.candidate_name} | {candidate.constituency}
                  </h2>
                  <button
                    onClick={onBack}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-md"
                  >
                    তালিকায় ফিরে আসুন
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-base">
                  <div className="flex items-center">
                    <span className="font-semibold text-gray-700 w-20">দল:</span>
                    <span className="text-gray-900 font-medium">{candidate.party}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold text-gray-700 w-20">লিঙ্গ:</span>
                    <span className="text-gray-900 font-medium">{candidate.gender}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold text-gray-700 w-20">পেশা:</span>
                    <span className="text-gray-900 font-medium">{candidate.personal_info.occupation_category}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold text-gray-700 w-20">শিক্ষা:</span>
                    <span className="text-gray-900 font-medium">{candidate.personal_info.education_category}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-8 bg-gray-50">
            {activeTab === 'affidavit' && renderAffidavitContent()}
            {activeTab === 'newsfeed' && renderNewsfeedContent()}
            {(activeTab === 'income' || activeTab === 'assets' || activeTab === 'expenses') && (
              <div className="text-center py-12 text-gray-800">
                <div className="text-6xl mb-6">📊</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">এই বিভাগের তথ্য এখনও উপলব্ধ নয়</h3>
                <p className="text-gray-700">শীঘ্রই এই বিভাগে আরও তথ্য যোগ করা হবে</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
