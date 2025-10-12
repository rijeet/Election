'use client';

import { useState } from 'react';

export default function DatabaseManager() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSeedComprehensive = async () => {
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      const response = await fetch('/api/seed-comprehensive');
      const data = await response.json();
      
      if (response.ok) {
        setMessage(`✅ ${data.message} - ${data.elections} elections, ${data.constituencies} constituencies`);
      } else {
        setError(`❌ ${data.error}`);
      }
    } catch (err) {
      setError(`❌ Network error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSeedElections = async () => {
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      const response = await fetch('/api/seed');
      const data = await response.json();
      
      if (response.ok) {
        setMessage(`✅ ${data.message}`);
      } else {
        setError(`❌ ${data.error}`);
      }
    } catch (err) {
      setError(`❌ Network error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSeedConstituencies = async () => {
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      const response = await fetch('/api/seed-constituencies');
      const data = await response.json();
      
      if (response.ok) {
        setMessage(`✅ ${data.message}`);
      } else {
        setError(`❌ ${data.error}`);
      }
    } catch (err) {
      setError(`❌ Network error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSeedPartyAlliances = async () => {
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      const response = await fetch('/api/seed-party-alliances');
      const data = await response.json();
      
      if (response.ok) {
        setMessage(`✅ ${data.message} - ${data.count} party alliance records`);
      } else {
        setError(`❌ ${data.error}`);
      }
    } catch (err) {
      setError(`❌ Network error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClearDatabase = async () => {
    if (!confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      return;
    }
    
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      // Clear elections
      await fetch('/api/elections', { method: 'DELETE' });
      
      // Clear constituencies
      await fetch('/api/constituencies', { method: 'DELETE' });
      
      setMessage('✅ Database cleared successfully');
    } catch (err) {
      setError(`❌ Error clearing database: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Database Management
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <button
            onClick={handleSeedComprehensive}
            disabled={loading}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '⏳ Seeding...' : '🌱 Seed Comprehensive Data'}
          </button>
          
          <button
            onClick={handleSeedElections}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '⏳ Seeding...' : '📊 Seed Elections Only'}
          </button>
          
          <button
            onClick={handleSeedConstituencies}
            disabled={loading}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '⏳ Seeding...' : '🏛️ Seed Constituencies Only'}
          </button>
          
          <button
            onClick={handleSeedPartyAlliances}
            disabled={loading}
            className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '⏳ Seeding...' : '🤝 Seed Party Alliances'}
          </button>
          
          <button
            onClick={handleClearDatabase}
            disabled={loading}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '⏳ Clearing...' : '🗑️ Clear All Data'}
          </button>
        </div>
        
        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {message}
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <div className="text-sm text-gray-600">
          <h3 className="font-semibold mb-2">Available Actions:</h3>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Seed Comprehensive Data:</strong> Adds 12 elections + 70+ constituencies</li>
            <li><strong>Seed Elections Only:</strong> Adds 12 parliamentary elections</li>
            <li><strong>Seed Constituencies Only:</strong> Adds constituency data for 12th Parliament</li>
            <li><strong>Seed Party Alliances:</strong> Adds party alliance data for all parliaments</li>
            <li><strong>Clear All Data:</strong> Removes all data from database</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
