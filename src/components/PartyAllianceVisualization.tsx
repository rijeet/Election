'use client';

import { useState, useEffect, useCallback } from 'react';
import { IPartyAlliance } from '@/models/PartyAlliance';

interface PartyAllianceVisualizationProps {
  parliamentNumber: number;
}

interface AllianceGroup {
  name: string;
  color: string;
  parties: IPartyAlliance[];
  totalCandidates: number;
}

export default function PartyAllianceVisualization({ parliamentNumber }: PartyAllianceVisualizationProps) {
  const [alliances, setAlliances] = useState<IPartyAlliance[]>([]);
  const [allianceGroups, setAllianceGroups] = useState<AllianceGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAlliances = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/party-alliances?parliament=${parliamentNumber}`);
      if (!response.ok) {
        throw new Error('Failed to fetch party alliances');
      }
      const data = await response.json();
      setAlliances(data.data);
      groupAlliances(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [parliamentNumber]);

  useEffect(() => {
    fetchAlliances();
  }, [fetchAlliances]);

  const groupAlliances = (allianceData: IPartyAlliance[]) => {
    const groups: { [key: string]: AllianceGroup } = {};
    
    allianceData.forEach(party => {
      if (!groups[party.alliance_name]) {
        groups[party.alliance_name] = {
          name: party.alliance_name,
          color: party.alliance_color,
          parties: [],
          totalCandidates: 0
        };
      }
      
      groups[party.alliance_name].parties.push(party);
      groups[party.alliance_name].totalCandidates += party.candidate_count;
    });
    
    setAllianceGroups(Object.values(groups));
  };

  const getColorClasses = (color: string) => {
    const colorMap: { [key: string]: string } = {
      blue: 'from-blue-50 to-blue-100 border-blue-200 text-blue-800',
      pink: 'from-pink-50 to-pink-100 border-pink-200 text-pink-800',
      orange: 'from-orange-50 to-orange-100 border-orange-200 text-orange-800',
      green: 'from-green-50 to-green-100 border-green-200 text-green-800',
      purple: 'from-purple-50 to-purple-100 border-purple-200 text-purple-800',
      red: 'from-red-50 to-red-100 border-red-200 text-red-800',
      yellow: 'from-yellow-50 to-yellow-100 border-yellow-200 text-yellow-800',
      indigo: 'from-indigo-50 to-indigo-100 border-indigo-200 text-indigo-800'
    };
    return colorMap[color] || 'from-gray-50 to-gray-100 border-gray-200 text-gray-800';
  };

  const getBadgeColor = (color: string) => {
    const colorMap: { [key: string]: string } = {
      blue: 'bg-blue-100 text-blue-800',
      pink: 'bg-pink-100 text-pink-800',
      orange: 'bg-orange-100 text-orange-800',
      green: 'bg-green-100 text-green-800',
      purple: 'bg-purple-100 text-purple-800',
      red: 'bg-red-100 text-red-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      indigo: 'bg-indigo-100 text-indigo-800'
    };
    return colorMap[color] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading party alliances...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-6xl mb-4">⚠️</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Alliances</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={fetchAlliances}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Party Alliances - {parliamentNumber}th Parliament
        </h2>
        <p className="text-gray-600">
          Political alliances and their constituent parties
        </p>
      </div>

      {/* Alliance Groups */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {allianceGroups.map((group, index) => (
          <div
            key={index}
            className={`bg-gradient-to-r ${getColorClasses(group.color)} border rounded-xl p-6 shadow-lg`}
          >
            {/* Alliance Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">{group.name}</h3>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getBadgeColor(group.color)}`}>
                {group.totalCandidates} Candidates
              </div>
            </div>

            {/* Parties List */}
            <div className="space-y-3">
              {group.parties.map((party, partyIndex) => (
                <div
                  key={partyIndex}
                  className={`flex items-center justify-between p-3 bg-white/50 rounded-lg border border-white/30 ${
                    party.is_alliance_leader ? 'ring-2 ring-white/50' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-gray-800">
                        {party.party_abbreviation}
                      </span>
                      {party.is_alliance_leader && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-medium">
                          Leader
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-gray-600">
                      {party.party_name}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700">
                      {party.candidate_count} candidates
                    </span>
                    {party.candidate_count === 0 && (
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                        Boycotted
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Summary Statistics */}
      <div className="bg-white rounded-xl p-6 shadow-lg border">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Alliance Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{allianceGroups.length}</div>
            <div className="text-sm text-gray-600">Total Alliances</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {alliances.reduce((sum, party) => sum + party.candidate_count, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Candidates</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{alliances.length}</div>
            <div className="text-sm text-gray-600">Total Parties</div>
          </div>
        </div>
      </div>
    </div>
  );
}
