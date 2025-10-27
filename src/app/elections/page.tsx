'use client';

import { useState, useEffect } from 'react';
import { IElection } from '@/models/Election';
import { IConstituency } from '@/models/Constituency';
import Timeline from '@/components/Timeline';
import ElectionDetails from '@/components/ElectionDetails';
import ConstituencyList from '@/components/ConstituencyList';

import ParliamentTabs from '@/components/ParliamentTabs';
import ParliamentSeatingChart from '@/components/ParliamentSeatingChart';
import Header from '@/components/Header';
import Link from 'next/link';

export default function Elections() {
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-6"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-green-400 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <p className="text-gray-600 font-medium text-lg">Loading election data...</p>
          <p className="text-gray-400 text-sm mt-2">Please wait while we fetch the latest information</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Error Loading Data</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchElections}
            className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-3 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      <main className="py-8">
        <Timeline
          elections={elections}
          onElectionSelect={handleElectionSelect}
          selectedElection={selectedElection}
        />
        
        {selectedElection && !showConstituencies && !showParliamentTabs && (
          <div className="max-w-7xl mx-auto px-6">
            <ElectionDetails election={selectedElection} />
            
            <div className="text-center mt-12 space-y-4 sm:space-y-0 sm:space-x-6 sm:flex sm:justify-center">
              <button
                onClick={toggleConstituencies}
                className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <span>View Constituency Details</span>
              </button>
              <button
                onClick={toggleParliamentTabs}
                className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span>Party & Manifesto</span>
              </button>
              <Link
                href="/parliament-visualization"
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 inline-flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span>Parliament Visualization</span>
              </Link>
            </div>

            {/* Parliament Seating Chart - Integrated with Election Details */}
            <div className="mt-16">
              <div className="text-center mb-12">
                <div className="inline-block p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">
                    Parliament Seating Chart
                  </h2>
                  <p className="text-gray-600 mb-6 max-w-2xl mx-auto leading-relaxed">
                    Interactive parliament seating chart showing constituency results by election year. Each circle represents a parliamentary seat colored by the winning party.
                  </p>
                  <div className="inline-flex items-center px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Use the timeline navigation above to change election years (1973-2024)
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                <ParliamentSeatingChart electionYear={new Date(selectedElection.electionDate).getFullYear().toString()} />
              </div>
            </div>
          </div>
        )}
        
        {selectedElection && showConstituencies && (
          <div>
            <div className="text-center mb-8">
              <button
                onClick={toggleConstituencies}
                className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-3 rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 mr-4"
              >
                ← Back to Election Overview
              </button>
              <h2 className="text-3xl font-bold text-gray-800 mt-6">
                {selectedElection.title} - Constituency Details
              </h2>
            </div>
            
            <ConstituencyList
              parliamentNumber={selectedElection.parliamentNumber}
              onConstituencySelect={handleConstituencySelect}
              selectedConstituency={selectedConstituency}
            />
          </div>
        )}
        
        {selectedElection && showParliamentTabs && (
          <div>
            <div className="text-center mb-8">
              <button
                onClick={toggleParliamentTabs}
                className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-3 rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 mr-4"
              >
                ← Back to Election Overview
              </button>
              <h2 className="text-3xl font-bold text-gray-800 mt-6">
                {selectedElection.title} - Party & Manifesto
              </h2>
            </div>
            
            <ParliamentTabs election={selectedElection} />
          </div>
        )}
      </main>
      
      <footer className="bg-gradient-to-r from-green-800 to-green-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-3">Jatiya Sangsad</h3>
            <p className="text-green-200 text-lg mb-4">
              Bangladesh Parliamentary Election History
            </p>
            <p className="text-sm text-green-300">
              © 2024 Election Data Portal. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
