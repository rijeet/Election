'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import URLPreview from './URLPreview';

interface FamilyMember {
  name: string;
  occupation?: string;
  nationality?: string;
  img_url?: string;
}

interface IInfoCandidate {
  _id: string;
  id: string;
  constituency: string;
  division?: string;
  district?: string;
  party: string;
  candidate_name: string;
  gender?: string;
  personal_info: {
    occupation_category?: string;
    profession_details?: string;
    education_category?: string;
    education_details?: string;
  };
  controversial?: Array<{
    NEWS: string;
    youtubes: string[];
  }>;
  family?: {
    spouse?: FamilyMember;
    sons?: FamilyMember[];
    daughters?: FamilyMember[];
  };
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
    { id: 'family', name: 'পরিবার', icon: '👨‍👩‍👧‍👦' },
    { id: 'income', name: 'আয়কর', icon: '💰' },
    { id: 'assets', name: 'সম্পদ, দায়', icon: '🏠' },
    { id: 'expenses', name: 'ব্যায়বিবরণী', icon: '📊' },
    { id: 'newsfeed', name: 'নিউজফিড', icon: '📰' }
  ];

  const renderAffidavitContent = () => (
    <section aria-labelledby="affidavit-heading" className="space-y-6">
      <header>
        <h3 id="affidavit-heading" className="text-2xl font-semibold text-gray-900">ব্যক্তিগত তথ্য</h3>
        <p className="text-sm text-gray-600">প্রার্থীর শিক্ষাগত ও পেশাগত প্রেক্ষাপটের সারসংক্ষেপ</p>
      </header>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <article className="rounded-2xl bg-red-100 p-5 shadow-sm">
          <h4 className="mb-2 font-semibold text-red-800">শিক্ষা</h4>
          <p className="text-sm font-medium text-gray-900">{candidate.personal_info.education_category || 'তথ্য নেই'}</p>
          {candidate.personal_info.education_details && (
            <p className="mt-1 text-xs text-gray-700">{candidate.personal_info.education_details}</p>
          )}
        </article>

        <article className="rounded-2xl bg-green-100 p-5 shadow-sm">
          <h4 className="mb-2 font-semibold text-green-800">পেশা/জীবিকা</h4>
          <p className="text-sm font-medium text-gray-900">{candidate.personal_info.occupation_category || 'তথ্য নেই'}</p>
          {candidate.personal_info.profession_details && (
            <p className="mt-1 text-xs text-gray-700">{candidate.personal_info.profession_details}</p>
          )}
        </article>

        <article className="rounded-2xl bg-purple-100 p-5 shadow-sm">
          <h4 className="mb-2 font-semibold text-purple-800">মামলা</h4>
          <p className="text-sm font-medium text-gray-900">Present: 0</p>
          <p className="text-sm font-medium text-gray-900">Past: 0</p>
        </article>

        <article className="rounded-2xl bg-teal-100 p-5 shadow-sm">
          <h4 className="mb-2 font-semibold text-teal-800">আয়</h4>
          <p className="text-sm font-medium text-gray-900">Not Available</p>
        </article>

        <article className="rounded-2xl bg-orange-100 p-5 shadow-sm">
          <h4 className="mb-2 font-semibold text-orange-800">ধনসম্পত্তি</h4>
          <p className="text-sm font-medium text-gray-900">Not Available</p>
        </article>

        <article className="rounded-2xl bg-red-100 p-5 shadow-sm">
          <h4 className="mb-2 font-semibold text-red-800">দায়</h4>
          <p className="text-sm font-medium text-gray-900">Not Available</p>
        </article>

        <article className="rounded-2xl bg-green-100 p-5 shadow-sm">
          <h4 className="mb-2 font-semibold text-green-800">কর</h4>
          <p className="text-sm font-medium text-gray-900">Not Available</p>
        </article>

        <article className="rounded-2xl bg-purple-100 p-5 shadow-sm">
          <h4 className="mb-2 font-semibold text-purple-800">ঋণ</h4>
          <p className="text-sm font-medium text-gray-900">Not Available</p>
        </article>
      </div>
    </section>
  );

  const renderFamilyContent = () => {
    const { family } = candidate;
    const hasFamilyContent = family && (
      !!family.spouse || (family.sons && family.sons.length > 0) || (family.daughters && family.daughters.length > 0)
    );

    if (!hasFamilyContent) {
      return (
        <section className="py-12 text-center text-gray-700">
          <div className="text-6xl mb-4">👨‍👩‍👧‍👦</div>
          <h3 className="text-xl font-semibold text-gray-900">পরিবার সংক্রান্ত তথ্য পাওয়া যায়নি</h3>
          <p className="mt-2 text-sm text-gray-600">যথাযথ তথ্য প্রাপ্তি সাপেক্ষে এই বিভাগ হালনাগাদ করা হবে।</p>
        </section>
      );
    }

    const renderFamilyMember = (member: FamilyMember, label?: string) => (
      <article key={`${label ?? ''}-${member.name}`} className="flex flex-col items-center gap-4 rounded-2xl bg-white p-4 text-center shadow-md transition hover:shadow-lg sm:flex-row sm:text-left">
        <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-blue-50">
          {member.img_url ? (
            <Image
              src={member.img_url}
              alt={member.name}
              width={80}
              height={80}
              className="h-20 w-20 rounded-full object-cover"
            />
          ) : (
            <span className="text-3xl">👤</span>
          )}
        </div>
        <div className="space-y-1">
          <h4 className="text-lg font-semibold text-gray-900">{member.name}</h4>
          {member.occupation && <p className="text-sm text-gray-700">পেশা: {member.occupation}</p>}
          {member.nationality && <p className="text-sm text-gray-700">জাতীয়তা: {member.nationality}</p>}
        </div>
      </article>
    );

    return (
      <section aria-labelledby="family-heading" className="space-y-8">
        <header>
          <h3 id="family-heading" className="text-2xl font-semibold text-gray-900">পরিবার</h3>
          <p className="text-sm text-gray-600">প্রার্থীর নিকটতম পরিবার সদস্যদের তথ্য</p>
        </header>

        {family?.spouse && (
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-gray-800">সঙ্গী</h4>
            {renderFamilyMember(family.spouse, 'spouse')}
          </div>
        )}

        {family?.sons && family.sons.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-gray-800">পুত্র</h4>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {family.sons.map((son, index) => renderFamilyMember(son, `son-${index}`))}
            </div>
          </div>
        )}

        {family?.daughters && family.daughters.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-gray-800">কন্যা</h4>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {family.daughters.map((daughter, index) => renderFamilyMember(daughter, `daughter-${index}`))}
            </div>
          </div>
        )}
      </section>
    );
  };

  const renderNewsfeedContent = () => (
    <section aria-labelledby="news-heading" className="space-y-8">
      <header>
        <h3 id="news-heading" className="text-2xl font-semibold text-gray-900">নিউজ ও মিডিয়া</h3>
        <p className="text-sm text-gray-600">প্রার্থীর সাথে সম্পর্কিত সংবাদ ও ভিডিও</p>
      </header>

      {candidate.controversial && candidate.controversial.length > 0 ? (
        <div className="space-y-6">
          {candidate.controversial.map((item, index) => (
            <article
              key={index}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md transition hover:shadow-lg"
            >
              <div className="space-y-4">
                {item.NEWS && (
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                      <span className="text-lg text-blue-600">📰</span>
                    </div>
                    <div className="flex-1 space-y-2">
                      <h4 className="text-lg font-semibold text-gray-900">সংবাদপত্র</h4>
                      <URLPreview
                        url={item.NEWS}
                        type="news"
                        displayMode="inline"
                      />
                    </div>
                  </div>
                )}

                {item.youtubes && item.youtubes.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-gray-900">ইউটিউব ভিডিও</h4>
                    {item.youtubes.map((youtube, yIndex) => (
                      <div key={yIndex} className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
                          <span className="text-lg text-red-600">▶️</span>
                        </div>
                        <div className="flex-1">
                          <URLPreview
                            url={youtube}
                            type="youtube"
                            displayMode="inline"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center text-gray-800">
          <div className="mb-6 text-6xl">📰</div>
          <h3 className="text-xl font-semibold text-gray-900">কোন নিউজ বা মিডিয়া লিংক পাওয়া যায়নি</h3>
          <p className="text-gray-700">শীঘ্রই এই বিভাগে নিউজ ও মিডিয়া লিংক যোগ করা হবে</p>
        </div>
      )}
    </section>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-[SolaimanLipi]">
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 py-8 text-white">
        <div className="mx-auto max-w-6xl px-4">
          <h1 className="mb-2 text-3xl font-bold text-white">প্রার্থীদের তথ্য বিশ্লেষণ</h1>
          <p className="text-blue-100">প্রার্থীর তথ্য তালিকা</p>
        </div>
      </header>

      <nav className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap px-5 py-4 text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'border-b-2 border-blue-500 bg-blue-50 text-blue-600'
                    : 'border-b-2 border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
          <header className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white p-6 sm:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between md:gap-10">
              <div className="flex flex-col items-center gap-4 md:flex-row md:items-start">
                <div className="flex h-44 w-36 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 shadow-md">
                  {candidate.media?.img_url ? (
                    <Image
                      src={candidate.media.img_url}
                      alt={candidate.candidate_name}
                      width={144}
                      height={176}
                      className="h-44 w-36 rounded-xl object-cover"
                    />
                  ) : (
                    <span className="text-5xl text-gray-500">👤</span>
                  )}
                </div>
                <div className="space-y-4 text-center md:text-left">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">{candidate.candidate_name}</h2>
                    <p className="text-lg font-medium text-gray-700">{candidate.constituency}</p>
                    <div className="grid grid-cols-1 gap-2 text-sm text-gray-600 sm:grid-cols-2">
                      {candidate.division && (
                        <p><span className="font-semibold text-gray-700">বিভাগ:</span> {candidate.division}</p>
                      )}
                      {candidate.district && (
                        <p><span className="font-semibold text-gray-700">জেলা:</span> {candidate.district}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 text-sm text-gray-700 sm:grid-cols-2">
                    <p><span className="inline-block w-20 font-semibold text-gray-800">দল:</span> {candidate.party || 'তথ্য নেই'}</p>
                    <p><span className="inline-block w-20 font-semibold text-gray-800">লিঙ্গ:</span> {candidate.gender || 'তথ্য নেই'}</p>
                    <p><span className="inline-block w-20 font-semibold text-gray-800">পেশা:</span> {candidate.personal_info.occupation_category || 'তথ্য নেই'}</p>
                    <p><span className="inline-block w-20 font-semibold text-gray-800">শিক্ষা:</span> {candidate.personal_info.education_category || 'তথ্য নেই'}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center md:justify-end">
                <button
                  onClick={onBack}
                  className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 font-medium text-white shadow-md transition-all duration-200 hover:from-blue-700 hover:to-blue-800"
                >
                  তালিকায় ফিরে আসুন
                </button>
              </div>
            </div>
          </header>

          <div className="bg-gray-50 p-6 sm:p-8">
            {activeTab === 'affidavit' && renderAffidavitContent()}
            {activeTab === 'family' && renderFamilyContent()}
            {activeTab === 'newsfeed' && renderNewsfeedContent()}
            {(activeTab === 'income' || activeTab === 'assets' || activeTab === 'expenses') && (
              <section className="py-12 text-center text-gray-800">
                <div className="mb-6 text-6xl">📊</div>
                <h3 className="text-xl font-semibold text-gray-900">এই বিভাগের তথ্য এখনও উপলব্ধ নয়</h3>
                <p className="text-gray-700">শীঘ্রই এই বিভাগে আরও তথ্য যোগ করা হবে</p>
              </section>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
