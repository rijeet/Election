'use client';

import { useState, useEffect } from 'react';
import { IElection } from '@/models/Election';
import { IConstituency } from '@/models/Constituency';
import Timeline from '@/components/Timeline';
import ElectionDetails from '@/components/ElectionDetails';
import ConstituencyList from '@/components/ConstituencyList';
import ConstituencyDetails from '@/components/ConstituencyDetails';
import ParliamentTabs from '@/components/ParliamentTabs';
import Header from '@/components/Header';

export default function Home() {
  const [elections, setElections] = useState<IElection[]>([]);
  const [selectedElection, setSelectedElection] = useState<IElection | null>(null);
  const [selectedConstituency, setSelectedConstituency] = useState<IConstituency | null>(null);
  const [showConstituencies, setShowConstituencies] = useState(false);
  const [showParliamentTabs, setShowParliamentTabs] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/elections');
      if (!response.ok) {
        throw new Error('Failed to fetch elections');
      }
      const data = await response.json();
      setElections(data);
      if (data.length > 0) {
        setSelectedElection(data[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleElectionSelect = (election: IElection) => {
    setSelectedElection(election);
    setSelectedConstituency(null);
    setShowConstituencies(false);
  };

  const handleConstituencySelect = (constituency: IConstituency) => {
    setSelectedConstituency(constituency);
  };

  const toggleConstituencies = () => {
    setShowConstituencies(!showConstituencies);
    setSelectedConstituency(null);
    setShowParliamentTabs(false);
  };

  const toggleParliamentTabs = () => {
    setShowParliamentTabs(!showParliamentTabs);
    setShowConstituencies(false);
    setSelectedConstituency(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading election data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchElections}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="py-8">
        <Timeline
          elections={elections}
          onElectionSelect={handleElectionSelect}
          selectedElection={selectedElection}
        />
        
        {selectedElection && !showConstituencies && !showParliamentTabs && (
          <div>
            <ElectionDetails election={selectedElection} />
            
            <div className="text-center mt-8 space-x-4">
              <button
                onClick={toggleConstituencies}
                className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                View Constituency Details
              </button>
              <button
                onClick={toggleParliamentTabs}
                className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
                Party & Manifesto
              </button>
            </div>
          </div>
        )}
        
        {selectedElection && showConstituencies && (
          <div>
            <div className="text-center mb-8">
              <button
                onClick={toggleConstituencies}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors mr-4"
              >
                ← Back to Election Overview
              </button>
              <h2 className="text-2xl font-bold text-gray-800 mt-4">
                {selectedElection.title} - Constituency Details
              </h2>
            </div>
            
            <ConstituencyList
              parliamentNumber={selectedElection.parliamentNumber}
              onConstituencySelect={handleConstituencySelect}
              selectedConstituency={selectedConstituency}
            />
            
            {selectedConstituency && (
              <ConstituencyDetails constituency={selectedConstituency} />
            )}
          </div>
        )}
        
        {selectedElection && showParliamentTabs && (
          <div>
            <div className="text-center mb-8">
              <button
                onClick={toggleParliamentTabs}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors mr-4"
              >
                ← Back to Election Overview
              </button>
              <h2 className="text-2xl font-bold text-gray-800 mt-4">
                {selectedElection.title} - Party & Manifesto
              </h2>
            </div>
            
            <ParliamentTabs election={selectedElection} />
          </div>
        )}
        

      </main>
      
      <footer className="bg-green-800 text-white py-8 mt-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h3 className="text-xl font-bold mb-2">Jatiya Sangsad</h3>
          <p className="text-green-200">
            Bangladesh Parliamentary Election History
          </p>
          <p className="text-sm text-green-300 mt-2">
            © 2024 Election Data Portal. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}