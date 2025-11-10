'use client';

import { useState, useEffect } from 'react';
import { bangladeshMapConstituencies } from '@/data/bangladeshMapData';
import BlunderAnalysis from './BlunderAnalysis';

interface SwingState {
  constituency_name: string;
  swingState: 'solid' | 'leaning' | 'toss_up' | 'competitive';
  stability: string;
  dominantParty: {
    party: string;
    color: string;
  } | null;
  wins: number;
  partyBreakdown: Array<{
    party: string;
    color: string;
    wins: number;
  }>;
}

interface SwingStateData {
  parliaments: number[];
  totalConstituencies: number;
  swingStates: SwingState[];
}

export default function SwingStateMap() {
  const [data, setData] = useState<SwingStateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedConstituency, setSelectedConstituency] = useState<SwingState | null>(null);
  const [showBlunder, setShowBlunder] = useState(true);

  useEffect(() => {
    async function fetchSwingStates() {
      try {
        const response = await fetch('/api/swing-state');
        if (!response.ok) throw new Error('Failed to fetch swing states');
        const swingData = await response.json();
        setData(swingData);
      } catch (error) {
        console.error('Error fetching swing states:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSwingStates();
  }, []);

  const getConstituencyColor = (constituencyName: string): string => {
    if (!data) return '#E5E7EB'; // Default gray

    // Match by constituency ID (like "Patuakhali-2")
    const swingState = data.swingStates.find(
      s => s.constituency_name.toLowerCase() === constituencyName.toLowerCase()
    );

    if (!swingState) return '#E5E7EB';

    // Determine color based on swing state
    if (swingState.swingState === 'solid') {
      // Solid - use dominant party color at full opacity
      return swingState.dominantParty?.color || '#E5E7EB';
    } else if (swingState.swingState === 'leaning') {
      // Leaning - use dominant party color with opacity
      const color = swingState.dominantParty?.color || '#E5E7EB';
      return addOpacity(color, 0.7);
    } else if (swingState.swingState === 'toss_up') {
      // Toss up - striped or mixed color
      return '#FCD34D'; // Yellow for toss-ups
    } else {
      // Competitive - light color
      return addOpacity(swingState.dominantParty?.color || '#E5E7EB', 0.5);
    }
  };

  const addOpacity = (hex: string, opacity: number): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return hex;

    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const handleConstituencyClick = (constituencyName: string) => {
    if (!data) return;

    const swingState = data.swingStates.find(
      s => s.constituency_name.toLowerCase() === constituencyName.toLowerCase()
    );

    if (swingState) {
      setSelectedConstituency(swingState);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="text-gray-600">Loading swing state data...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="text-red-600">Failed to load swing state data</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Swing State Analysis
          </h2>
          <p className="text-gray-600">
            Electoral patterns across {data.parliaments.join(', ')} Parliaments
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map */}
          <div className="lg:col-span-2">
            <div className="bg-gray-50 rounded-xl p-6 overflow-auto">
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
                  {bangladeshMapConstituencies.map((constituency) => (
                    <path
                      key={constituency.id}
                      className="constituency-path"
                      fill={getConstituencyColor(constituency.name)}
                      d={constituency.path}
                      onClick={() => handleConstituencyClick(constituency.name)}
                    />
                  ))}
                </g>
              </svg>
            </div>

            {/* Legend */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Legend</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-green-500 rounded"></div>
                  <span className="text-sm text-gray-600">Solid (4/4 wins)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-yellow-400 rounded"></div>
                  <span className="text-sm text-gray-600">Toss-up (2-2 split)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded" style={{ background: 'rgba(34, 197, 94, 0.7)' }}></div>
                  <span className="text-sm text-gray-600">Leaning (3/4 wins)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded" style={{ background: 'rgba(34, 197, 94, 0.5)' }}></div>
                  <span className="text-sm text-gray-600">Competitive (varied)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Details Panel */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 h-full">
              {selectedConstituency ? (
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    {selectedConstituency.constituency_name}
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-semibold text-gray-700">Status:</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          selectedConstituency.swingState === 'solid'
                            ? 'bg-green-100 text-green-700'
                            : selectedConstituency.swingState === 'leaning'
                            ? 'bg-blue-100 text-blue-700'
                            : selectedConstituency.swingState === 'toss_up'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {selectedConstituency.swingState.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Stability: {selectedConstituency.stability.replace('_', ' ')}
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">
                        Party Performance
                      </h4>
                      <div className="space-y-2">
                        {selectedConstituency.partyBreakdown.map((party, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2 bg-white rounded-lg"
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className="w-4 h-4 rounded"
                                style={{ backgroundColor: party.color }}
                              ></div>
                              <span className="text-sm text-gray-700">{party.party}</span>
                            </div>
                            <span className="text-sm font-semibold text-gray-800">
                              {party.wins} win{party.wins !== 1 ? 's' : ''}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 mt-12">
                  <svg
                    className="w-16 h-16 mx-auto mb-4 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                    />
                  </svg>
                  <p className="text-sm">Click on a constituency to view details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Blunder Analysis Section */}
      <div className="mt-8">{showBlunder && <BlunderAnalysis parliamentNumber={9} />}</div>
    </div>
  );
}
