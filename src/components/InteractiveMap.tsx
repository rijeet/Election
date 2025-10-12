'use client';

import { useState, useEffect } from 'react';
import { IParliament } from '@/models/Parliament';
import { bangladeshMapConstituencies } from '@/data/bangladeshMapData';

interface PartyColor {
  name: string;
  color: string;
}

interface InteractiveMapProps {
  parliamentNumber: number;
}

export default function InteractiveMap({ parliamentNumber }: InteractiveMapProps) {
  const [constituencyResults, setConstituencyResults] = useState<IParliament[]>([]);
  const [partyColors, setPartyColors] = useState<PartyColor[]>([]);
  const [hoveredConstituency, setHoveredConstituency] = useState<IParliament | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Map parliament numbers to years
  const getParliamentYear = (parliamentNum: number): number => {
    const parliamentYearMap: { [key: number]: number } = {
      1: 1973,
      2: 1979,
      3: 1986,
      4: 1988,
      5: 1991,
      6: 1996,
      7: 1996,
      8: 2001,
      9: 2009,
      10: 2014,
      11: 2018,
      12: 2024
    };
    return parliamentYearMap[parliamentNum] || parliamentNum;
  };

  // Fetch constituency results and unique parties for the selected parliament
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const parliamentYear = getParliamentYear(parliamentNumber);
        
        // Fetch constituency results
        const resultsResponse = await fetch(`/api/constituency-results?parliament=${parliamentYear}`);
        if (!resultsResponse.ok) {
          throw new Error('Failed to fetch constituency results');
        }
        const resultsData = await resultsResponse.json();
        setConstituencyResults(resultsData);
        
        // Fetch unique parties with colors
        const partiesResponse = await fetch(`/api/constituency-results/parties?parliament=${parliamentYear}`);
        if (!partiesResponse.ok) {
          throw new Error('Failed to fetch party data');
        }
        const partiesData = await partiesResponse.json();
        setPartyColors(partiesData);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [parliamentNumber]);

  // Get constituency data by ID
  const getConstituencyData = (constituencyId: string) => {
    console.log('Looking for constituency:', constituencyId);
    console.log('Available constituency names:', constituencyResults.map(r => r.constituency_name));
    
    const exactMatch = constituencyResults.find(result => 
      result.constituency_name === constituencyId
    );
    
    if (exactMatch) {
      console.log('Found exact match:', exactMatch);
      return exactMatch;
    }
    
    // Try case-insensitive match
    const caseInsensitiveMatch = constituencyResults.find(result => 
      result.constituency_name.toLowerCase() === constituencyId.toLowerCase()
    );
    
    if (caseInsensitiveMatch) {
      console.log('Found case-insensitive match:', caseInsensitiveMatch);
      return caseInsensitiveMatch;
    }
    
    // Try partial match
    const partialMatch = constituencyResults.find(result => 
      result.constituency_name.includes(constituencyId) || 
      constituencyId.includes(result.constituency_name)
    );
    
    if (partialMatch) {
      console.log('Found partial match:', partialMatch);
      return partialMatch;
    }
    
    console.log('No match found for:', constituencyId);
    return null;
  };

  // Get color for constituency based on winning party
  const getConstituencyColor = (constituencyId: string) => {
    const data = getConstituencyData(constituencyId);
    if (data) {
      // First try to use the color from the database
      if (data.color) {
        return data.color;
      }
      // Then try to find the party in our dynamic party colors
      const partyColor = partyColors.find(p => p.name === data.party);
      if (partyColor) {
        return partyColor.color;
      }
    }
    return "#E5E7EB"; // Default gray color
  };

  const handleConstituencyClick = (constituencyId: string) => {
    const data = getConstituencyData(constituencyId);
    if (data) {
      console.log('Clicked constituency:', data);
      // You can add more functionality here, like opening a detailed view
    }
  };

  const handleMouseEnter = (constituencyId: string) => {
    const data = getConstituencyData(constituencyId);
    if (data) {
      setHoveredConstituency(data);
    }
  };

  const handleMouseLeave = () => {
    setHoveredConstituency(null);
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  if (loading) {
    return (
      <div className="w-full bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Interactive Map - {parliamentNumber}th Parliament
        </h2>
        <div className="flex items-center justify-center h-[600px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading map data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Interactive Map - {parliamentNumber}th Parliament
        </h2>
        <div className="flex items-center justify-center h-[600px]">
          <div className="text-center text-red-600">
            <p>Error loading map data: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-xl shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Interactive Map - {parliamentNumber}th Parliament
      </h2>
      
      <div className="relative">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="-0.058 -0.058 4.78 6.01" 
          className="w-full h-[600px] border border-gray-300 rounded-lg bg-gray-50"
        >
          <style>
            {`
              .constituency-path { 
                transition: all 0.3s ease; 
                cursor: pointer;
                stroke: #374151;
                stroke-width: 0.002;
              }
              .constituency-path:hover { 
                stroke: #1E40AF;
                stroke-width: 0.004;
                filter: brightness(1.1);
              }
            `}
          </style>
          
          {/* Bangladesh Map with Actual Geographical Boundaries */}
          <g fill="none" stroke="#000" strokeWidth="0.002" transform="matrix(1 0 0 -1 0 5.893)">
            {bangladeshMapConstituencies.map((constituency) => {
              console.log('Map constituency ID:', constituency.id, 'Name:', constituency.name);
              const fillColor = getConstituencyColor(constituency.id);

              return (
                <path
                  key={constituency.id}
                  className="constituency-path"
                  fill={fillColor}
                  d={constituency.path}
                  onClick={() => handleConstituencyClick(constituency.id)}
                  onMouseEnter={() => handleMouseEnter(constituency.id)}
                  onMouseLeave={handleMouseLeave}
                />
              );
            })}
          </g>

          
          {/* Dynamic Legend - More Center Left Vertical */}
          <g>
            {partyColors.map((party, index) => {
              const x = -2.5;
              const y = 1.8 + (index * 0.2);
              return (
                <g key={party.name}>
                  <rect x={x} y={y} width="0.15" height="0.15" fill={party.color} />
                  <text x={x + 0.2} y={y + 0.12} fontSize="0.12" fill="#374151">
                    {party.name}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
        
        {/* Enhanced Hover Tooltip */}
        {hoveredConstituency && (
          <div className="absolute top-4 right-4 bg-white border border-gray-300 rounded-lg p-4 shadow-lg max-w-xs z-10">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-gray-800">{hoveredConstituency.constituency_name}</h3>
              <div 
                className="w-4 h-4 rounded-full border border-gray-300"
                style={{ backgroundColor: getConstituencyColor(hoveredConstituency.constituency_name) }}
              ></div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="bg-gray-50 p-2 rounded">
                <p className="font-semibold text-gray-700">Candidate</p>
                <p className="text-gray-800">{hoveredConstituency.candidate}</p>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <p className="font-semibold text-gray-700">Party</p>
                <p className="text-gray-800">{hoveredConstituency.party}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-50 p-2 rounded">
                  <p className="font-semibold text-gray-700 text-xs">Votes</p>
                  <p className="text-gray-800 text-sm">{formatNumber(hoveredConstituency.votes || 0)}</p>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <p className="font-semibold text-gray-700 text-xs">Total Voters</p>
                  <p className="text-gray-800 text-sm">{formatNumber(hoveredConstituency.total_voters)}</p>
                </div>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <p className="font-semibold text-gray-700">Parliament</p>
                <p className="text-gray-800">{parliamentNumber}th Parliament ({hoveredConstituency.parliament})</p>
              </div>
              {hoveredConstituency.isWinner && (
                <div className="bg-green-100 border border-green-300 p-2 rounded">
                  <p className="text-green-800 font-bold text-center">🏆 WINNER</p>
                </div>
              )}
            </div>
            <button 
              onClick={() => setHoveredConstituency(null)}
              className="mt-3 w-full text-xs text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 py-1 px-2 rounded"
            >
              Close
            </button>
          </div>
        )}
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Hover over constituencies to view details • Click to select
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Showing {constituencyResults.length} constituencies for {parliamentNumber}th Parliament
        </p>
      </div>
    </div>
  );
}