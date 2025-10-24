'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { IConstituency } from '@/models/Constituency';

interface ConstituencyListProps {
  parliamentNumber: number;
  onConstituencySelect: (constituency: IConstituency) => void;
  selectedConstituency: IConstituency | null;
}

const divisions = [
  'Dhaka', 'Rangpur', 'Chattogram', 'Sylhet', 
  'Barishal', 'Rajshahi', 'Khulna', 'Mymensingh'
];

export default function ConstituencyList({ 
  parliamentNumber, 
  onConstituencySelect, 
  selectedConstituency 
}: ConstituencyListProps) {
  const [constituencies, setConstituencies] = useState<IConstituency[]>([]);
  const [selectedDivision, setSelectedDivision] = useState<string>('Dhaka');
  const [expandedConstituencies, setExpandedConstituencies] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConstituencies = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/constituencies?parliament=${parliamentNumber}&division=${selectedDivision}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch constituencies');
      }
      const data = await response.json();
      setConstituencies(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [parliamentNumber, selectedDivision]);

  useEffect(() => {
    fetchConstituencies();
  }, [fetchConstituencies]);

  const handleDivisionChange = (division: string) => {
    setSelectedDivision(division);
  };

  const handleConstituencyClick = (constituency: IConstituency) => {
    onConstituencySelect(constituency);
  };

  const toggleConstituencyExpansion = (constituencyId: string) => {
    setExpandedConstituencies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(constituencyId)) {
        newSet.delete(constituencyId);
      } else {
        newSet.add(constituencyId);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading constituencies...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchConstituencies}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Division Tabs */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Find detail of election {parliamentNumber}th Parliament result:
        </h2>
        
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {divisions.map((division) => (
            <button
              key={division}
              onClick={() => handleDivisionChange(division)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                selectedDivision === division
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-green-500 hover:text-white'
              }`}
            >
              {division}
            </button>
          ))}
        </div>
      </div>

      {/* Constituency List - Expandable Format */}
      <div className="space-y-2">
        {constituencies.map((constituency) => {
          const isExpanded = expandedConstituencies.has(constituency.constituencyId);
          const isSelected = selectedConstituency?.constituencyId === constituency.constituencyId;
          
          return (
            <div key={constituency.constituencyId} className="border border-gray-300 rounded-lg overflow-hidden">
              {/* Constituency Header Bar */}
              <div 
                className={`px-4 py-3 flex justify-between items-center cursor-pointer transition-colors ${
                  isSelected 
                    ? 'bg-green-100 border-green-500' 
                    : 'bg-blue-50 hover:bg-blue-100'
                }`}
                onClick={() => handleConstituencyClick(constituency)}
              >
                <div>
                  <div className="font-semibold text-sm text-gray-800">
                    {constituency.constituencyId}
                  </div>
                  <div className="text-xs text-gray-600">
                    {constituency.district}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleConstituencyExpansion(constituency.constituencyId);
                  }}
                  className="text-gray-600 hover:text-gray-800 text-xl font-bold"
                >
                  {isExpanded ? '−' : '+'}
                </button>
              </div>
              
              {/* Expanded Content */}
              {isExpanded && (
                <div className="bg-white p-4 border-t border-gray-200">
                  <div className={`grid gap-4 grid-cols-1 ${constituency.candidates.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
                    {constituency.candidates.map((candidate, index) => (
                      <div
                        key={index}
                        className={`bg-gray-50 rounded-lg p-3 border-2 ${
                          candidate.isWinner
                            ? 'border-red-500'
                            : candidate.isNearestCandidate
                            ? 'border-green-500'
                            : 'border-gray-300'
                        }`}
                      >
                        <div className="text-center">
                          {candidate.imageUrl && (
                            <div className="mb-2">
                              <Image
                                src={candidate.imageUrl}
                                alt={candidate.name}
                                width={40}
                                height={50}
                                className="rounded mx-auto"
                              />
                            </div>
                          )}
                          
                          <h3 className="font-bold text-sm text-black mb-1">{candidate.name}</h3>
                          
                          <p className="text-xs text-gray-600 mb-1">
                            {candidate.party}
                          </p>
                          
                          <p className="text-xs text-gray-600 mb-2">
                            Symbol: {candidate.symbol}
                          </p>
                          
                          <div className="bg-white text-black rounded p-2">
                            <p className="text-xs font-semibold mb-1">Result:</p>
                            <p className="text-xs text-gray-600 mb-1">
                              Vote: <span className="font-bold text-blue-600">
                                {candidate.votes.toLocaleString()}
                              </span>
                            </p>
                            {/* <p className="text-xs text-gray-600 mb-1">
                              Center Counted: <span className="font-bold text-blue-600">
                                {candidate.centersCounted}
                              </span>
                            </p> */}
                            
                            {candidate.isWinner && (
                              <p className="text-red-600 font-bold text-xs">WINNER</p>
                            )}
                            {candidate.isNearestCandidate && !candidate.isWinner && (
                              <p className="text-green-600 font-bold text-xs">NEAREST CANDIDATE</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Voter Statistics */}
                  <div className="mt-4 bg-blue-50 p-4 rounded-lg">
                    {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center">
                        <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-1">
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <p className="text-lg font-bold text-blue-600">
                          {constituency.voterStats.totalVoters.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-600">Total Voters</p>
                      </div>
                      
                      <div className="text-center">
                        <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center mx-auto mb-1">
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <p className="text-lg font-bold text-green-600">
                          {constituency.voterStats.maleVoters.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-600">Male Voters</p>
                      </div>
                      
                      <div className="text-center">
                        <div className="w-8 h-8 bg-pink-200 rounded-full flex items-center justify-center mx-auto mb-1">
                          <svg className="w-4 h-4 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <p className="text-lg font-bold text-pink-600">
                          {constituency.voterStats.femaleVoters.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-600">Female Voters</p>
                      </div>
                      
                      <div className="text-center">
                        <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center mx-auto mb-1">
                          <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h0" />
                          </svg>
                        </div>
                        <p className="text-lg font-bold text-purple-600">
                          {constituency.voterStats.totalCenters}
                        </p>
                        <p className="text-xs text-gray-600">Total Centres</p>
                      </div>
                    </div> */}
                    
                    {/* District and Upazila info */}
                    <div className="text-center">
                      {/* <p className="text-xs text-gray-600">
                        <strong>Upazilas/Unions/Wards:</strong> {constituency.voterStats.upazilas.join(', ')}
                      </p> */}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {constituencies.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📊</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No constituencies found
          </h3>
          <p className="text-gray-500">
            No constituency data available for {selectedDivision} division in the {parliamentNumber}th Parliament.
          </p>
        </div>
      )}
    </div>
  );
}
