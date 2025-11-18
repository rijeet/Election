'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useFingerprint } from '@/hooks/useFingerprint';
import ConstituencyMap from '@/components/ConstituencyMap';
import toast from 'react-hot-toast';
import { IParty2026 } from '@/models/Party2026';

interface CandidateListItem {
  candidate_name: string;
  candidate_ref: string;
  candidate_img: string;
  party_name: string;
  party_ref: string;
  party_symbol_img: string;
  popularity_vote: number;
  electoral_vote: number;
  party_info?: IParty2026 | null;
}

interface ConstituencyData {
  _id: string;
  division: string;
  district: string;
  constituency_id: string;
  election_date: string;
  candidate_list: CandidateListItem[];
}

type ViewMode = 'candidate' | 'party';

export default function Election2026Page() {
  const fingerprint = useFingerprint();
  const [constituencies, setConstituencies] = useState<ConstituencyData[]>([]);
  const [selectedConstituency, setSelectedConstituency] = useState<ConstituencyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('candidate');
  
  // Filters
  const [divisions, setDivisions] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [parties, setParties] = useState<string[]>([]);
  
  const [selectedDivision, setSelectedDivision] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedConstituencyId, setSelectedConstituencyId] = useState<string>('');
  const [selectedParty, setSelectedParty] = useState<string>('');
  
  const [votedCandidates, setVotedCandidates] = useState<Set<string>>(new Set());
  const [, setSelectedCandidateId] = useState<string | null>(null);
  const [, setSelectedPartyName] = useState<string | null>(null);

  // Fetch all constituencies and populate filters
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/candidate2026');
        if (!response.ok) throw new Error('Failed to fetch data');
        
        const data: ConstituencyData[] = await response.json();
        setConstituencies(data);
        
        // Extract unique divisions
        const uniqueDivisions = Array.from(new Set(data.map(c => c.division))).sort();
        setDivisions(uniqueDivisions);
        
        // Extract unique districts
        const uniqueDistricts = Array.from(new Set(data.map(c => c.district))).sort();
        setDistricts(uniqueDistricts);
        
        // Extract unique parties
        const allParties = data.flatMap(c => c.candidate_list.map(cl => cl.party_name));
        const uniqueParties = Array.from(new Set(allParties)).sort();
        setParties(uniqueParties);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load election data');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Filter districts based on selected division
  const filteredDistricts = selectedDivision
    ? districts.filter(d => {
        const constituency = constituencies.find(c => c.district === d && c.division === selectedDivision);
        return !!constituency;
      })
    : districts;

  // Filter constituencies based on selected district
  const filteredConstituencies = selectedDistrict
    ? constituencies.filter(c => c.district === selectedDistrict && (!selectedDivision || c.division === selectedDivision))
    : constituencies;

  // Fetch constituency data when selected
  useEffect(() => {
    if (selectedConstituencyId) {
      const fetchConstituency = async () => {
        try {
          const response = await fetch(`/api/candidate2026?constituency=${selectedConstituencyId}`);
          if (!response.ok) throw new Error('Failed to fetch constituency');
          
          const data: ConstituencyData[] = await response.json();
          if (data.length > 0) {
            setSelectedConstituency(data[0]);
            
            // Check which candidates user has voted for
            if (fingerprint) {
              const votedSet = new Set<string>();
              await Promise.all(
                data[0].candidate_list.map(async (candidate) => {
                  const voteCheck = await fetch(
                    `/api/popularity-vote?fp=${fingerprint}&candidate_name=${encodeURIComponent(candidate.candidate_name)}`
                  );
                  if (voteCheck.ok) {
                    const result = await voteCheck.json();
                    if (result.hasVoted) {
                      votedSet.add(candidate.candidate_name);
                    }
                  }
                })
              );
              setVotedCandidates(votedSet);
            }
          }
        } catch (error) {
          console.error('Error fetching constituency:', error);
          toast.error('Failed to load constituency data');
        }
      };
      
      fetchConstituency();
    }
  }, [selectedConstituencyId, fingerprint]);

  const handleVote = async (candidateName: string, constituencyId: string) => {
    if (!fingerprint) {
      toast.error('Fingerprint not available. Please refresh the page.');
      return;
    }

    if (votedCandidates.has(candidateName)) {
      toast.error('You have already voted for this candidate');
      return;
    }

    try {
      const response = await fetch('/api/popularity-vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fp: fingerprint,
          candidate_name: candidateName,
          constituency_id: constituencyId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          toast.error(data.error || 'You have already voted for this candidate');
          setVotedCandidates(prev => new Set(prev).add(candidateName));
        } else {
          throw new Error(data.error || 'Failed to vote');
        }
        return;
      }

      toast.success('Vote recorded successfully!');
      setVotedCandidates(prev => new Set(prev).add(candidateName));
      
      // Update local state
      if (selectedConstituency) {
        const updatedConstituency = { ...selectedConstituency };
        const candidate = updatedConstituency.candidate_list.find(c => c.candidate_name === candidateName);
        if (candidate) {
          candidate.popularity_vote = data.popularity_vote;
          setSelectedConstituency(updatedConstituency);
        }
      }
    } catch (error) {
      console.error('Error voting:', error);
      toast.error('Failed to record vote');
    }
  };

  const handleConstituencySelect = (constituencyId: string) => {
    setSelectedConstituencyId(constituencyId);
  };

  const handleDivisionChange = (division: string) => {
    setSelectedDivision(division);
    setSelectedDistrict(''); // Reset district when division changes
    setSelectedConstituencyId(''); // Reset constituency
  };

  const handleDistrictChange = (district: string) => {
    setSelectedDistrict(district);
    setSelectedConstituencyId(''); // Reset constituency
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading election data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
          Election 2026 Data Module
        </h1>

        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Division Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Division
              </label>
              <select
                value={selectedDivision}
                onChange={(e) => handleDivisionChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-election-green"
              >
                <option value="">All Divisions</option>
                {divisions.map((division) => (
                  <option key={division} value={division}>
                    {division}
                  </option>
                ))}
              </select>
            </div>

            {/* District Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                District
              </label>
              <select
                value={selectedDistrict}
                onChange={(e) => handleDistrictChange(e.target.value)}
                disabled={!selectedDivision}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-election-green disabled:bg-gray-100"
              >
                <option value="">All Districts</option>
                {filteredDistricts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>

            {/* Constituency Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Constituency
              </label>
              <select
                value={selectedConstituencyId}
                onChange={(e) => setSelectedConstituencyId(e.target.value)}
                disabled={!selectedDistrict}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-election-green disabled:bg-gray-100"
              >
                <option value="">Select Constituency</option>
                {filteredConstituencies.map((constituency) => (
                  <option key={constituency.constituency_id} value={constituency.constituency_id}>
                    {constituency.constituency_id}
                  </option>
                ))}
              </select>
            </div>

            {/* Party Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Party (Optional)
              </label>
              <select
                value={selectedParty}
                onChange={(e) => setSelectedParty(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-election-green"
              >
                <option value="">All Parties</option>
                {parties.map((party) => (
                  <option key={party} value={party}>
                    {party}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="mt-4 flex gap-4">
            <button
              onClick={() => setViewMode('candidate')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                viewMode === 'candidate'
                  ? 'bg-election-green text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Candidate View
            </button>
            <button
              onClick={() => setViewMode('party')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                viewMode === 'party'
                  ? 'bg-election-green text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Party View
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Candidates/Parties Section */}
          <div className="lg:col-span-2">
            {selectedConstituency ? (
              <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
                <h2 className="text-2xl font-bold mb-4 text-gray-900">
                  {selectedConstituency.constituency_id}
                </h2>
                <p className="text-gray-600 mb-6">
                  {selectedConstituency.division} → {selectedConstituency.district}
                </p>

                {viewMode === 'candidate' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {selectedConstituency.candidate_list
                      .filter(c => !selectedParty || c.party_name === selectedParty)
                      .map((candidate) => (
                        <CandidateCard
                          key={candidate.candidate_name}
                          candidate={candidate}
                          constituencyId={selectedConstituency.constituency_id}
                          hasVoted={votedCandidates.has(candidate.candidate_name)}
                          onVote={handleVote}
                          onPartyClick={setSelectedPartyName}
                        />
                      ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {Array.from(new Set(selectedConstituency.candidate_list.map(c => c.party_name)))
                      .filter(party => !selectedParty || party === selectedParty)
                      .map((partyName) => {
                        const partyCandidates = selectedConstituency.candidate_list.filter(
                          c => c.party_name === partyName
                        );
                        return (
                          <PartyCard
                            key={partyName}
                            partyName={partyName}
                            candidates={partyCandidates}
                            partyInfo={partyCandidates[0]?.party_info}
                            onPartyClick={setSelectedPartyName}
                          />
                        );
                      })}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-gray-500 text-lg">
                  Select a constituency from the filters or map to view candidates
                </p>
              </div>
            )}
          </div>

          {/* Map Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4 sticky top-4">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Bangladesh Map</h3>
              <div className="w-full h-[400px] md:h-[500px] lg:h-[600px]">
                <ConstituencyMap
                  selectedConstituencyId={selectedConstituencyId}
                  onConstituencySelect={handleConstituencySelect}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Candidate Card Component
function CandidateCard({
  candidate,
  constituencyId,
  hasVoted,
  onVote,
  onPartyClick,
}: {
  candidate: CandidateListItem;
  constituencyId: string;
  hasVoted: boolean;
  onVote: (name: string, id: string) => void;
  onPartyClick?: (partyName: string) => void;
}) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-4 mb-4">
        <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-election-green">
          <Image
            src={candidate.candidate_img || '/placeholder-candidate.jpg'}
            alt={candidate.candidate_name}
            width={80}
            height={80}
            className="object-cover"
            unoptimized
          />
        </div>
        <div className="flex-1">
          <Link 
            href={`/candidates?id=${candidate.candidate_ref}`}
            className="font-bold text-lg text-gray-900 hover:text-election-green transition-colors cursor-pointer"
          >
            {candidate.candidate_name}
          </Link>
          <div className="flex items-center gap-2 mt-1">
            <Link
              href={`/api/party2026?name=${encodeURIComponent(candidate.party_name)}`}
              onClick={(e) => {
                e.preventDefault();
                if (onPartyClick) {
                  onPartyClick(candidate.party_name);
                }
              }}
              className="text-sm text-gray-600 hover:text-election-green transition-colors cursor-pointer"
            >
              {candidate.party_name}
            </Link>
            {candidate.party_symbol_img && (
              <div className="relative w-6 h-6">
                <Image
                  src={candidate.party_symbol_img}
                  alt="Party Symbol"
                  width={24}
                  height={24}
                  className="object-contain"
                  unoptimized
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Popularity Vote:</span>
          <span className="font-semibold text-election-green">
            {candidate.popularity_vote} votes
          </span>
        </div>

        {candidate.electoral_vote > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Electoral Vote:</span>
            <span className="font-semibold text-election-red">
              {candidate.electoral_vote} votes
            </span>
          </div>
        )}

        <button
          onClick={() => onVote(candidate.candidate_name, constituencyId)}
          disabled={hasVoted}
          className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
            hasVoted
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-election-green text-white hover:bg-[#1a8f4f]'
          }`}
        >
          {hasVoted ? '✓ Voted' : '+1 Vote'}
        </button>
      </div>
    </div>
  );
}

// Party Card Component
function PartyCard({
  partyName,
  candidates,
  partyInfo,
  onPartyClick,
}: {
  partyName: string;
  candidates: CandidateListItem[];
  partyInfo?: IParty2026 | null;
  onPartyClick?: (partyName: string) => void;
}) {
  const totalPopularityVotes = candidates.reduce((sum, c) => sum + c.popularity_vote, 0);
  const totalElectoralVotes = candidates.reduce((sum, c) => sum + c.electoral_vote, 0);

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-center gap-3 mb-4">
        {candidates[0]?.party_symbol_img && (
          <div className="relative w-12 h-12">
            <Image
              src={candidates[0].party_symbol_img}
              alt="Party Symbol"
              width={48}
              height={48}
              className="object-contain"
              unoptimized
            />
          </div>
        )}
        <div>
          <Link
            href={`/api/party2026?name=${encodeURIComponent(partyName)}`}
            onClick={(e) => {
              e.preventDefault();
              if (onPartyClick) {
                onPartyClick(partyName);
              }
            }}
            className="font-bold text-xl text-gray-900 hover:text-election-green transition-colors cursor-pointer"
          >
            {partyName}
          </Link>
          {partyInfo?.alliance?.name && (
            <p className="text-sm text-gray-600">Alliance: {partyInfo.alliance.name}</p>
          )}
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Total Popularity Votes:</span>
          <span className="font-semibold text-election-green">{totalPopularityVotes} votes</span>
        </div>
        {totalElectoralVotes > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Total Electoral Votes:</span>
            <span className="font-semibold text-election-red">{totalElectoralVotes} votes</span>
          </div>
        )}
      </div>

      <div className="mt-4">
        <h4 className="font-semibold text-gray-700 mb-2">Candidates ({candidates.length}):</h4>
        <ul className="space-y-1">
          {candidates.map((candidate) => (
            <li key={candidate.candidate_name} className="text-sm text-gray-600">
              • <Link 
                href={`/candidates?id=${candidate.candidate_ref}`}
                className="hover:text-election-green transition-colors"
              >
                {candidate.candidate_name}
              </Link> ({candidate.popularity_vote} votes)
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

