'use client';

import React, { useState } from 'react';
import ParliamentVisualization from '@/components/ParliamentVisualization';

export default function ParliamentVisualizationPage() {
  const [electionYear, setElectionYear] = useState('1991');

  const electionYears = ['1973', '1979', '1986', '1988', '1991', '1996', '2001', '2009', '2014', '2019', '2024'];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Bangladesh Parliament Visualization
          </h1>
          <p className="text-gray-600 mb-6">
            Visualize constituency results by election year with party colors from the parliament collection.
          </p>
          
          <div className="flex flex-wrap gap-2 mb-6">
            <label className="text-sm font-medium text-gray-700 mr-2">
              Select Election Year:
            </label>
            {electionYears.map((year) => (
              <button
                key={year}
                onClick={() => setElectionYear(year)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  electionYear === year
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>

        <ParliamentVisualization electionYear={electionYear} />
      </div>
    </div>
  );
}
