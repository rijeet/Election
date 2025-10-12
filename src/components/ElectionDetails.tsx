'use client';

import { IElection } from '@/models/Election';
import Image from 'next/image';
import InteractiveMap from './InteractiveMap';

interface ElectionDetailsProps {
  election: IElection;
}

export default function ElectionDetails({ election }: ElectionDetailsProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const totalVotes = election.candidates.reduce((sum, candidate) => sum + candidate.votes, 0);

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
          {election.title}
        </h1>
        <p className="text-xl text-gray-600 mb-2">
          {formatDate(election.electionDate)}
          {election.endDate && ` to ${formatDate(election.endDate)}`}
        </p>
        {election.description && (
          <p className="text-lg text-gray-500 max-w-3xl mx-auto">
            {election.description}
          </p>
        )}
      </div>

      {/* Interactive Map */}
      <InteractiveMap parliamentNumber={election.parliamentNumber} />

      {/* Main Content with Red Border */}
      <div className="border-4 border-red-500 rounded-lg p-8 bg-white">
        {/* Election Results Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Election Results
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {election.candidates.map((candidate, index) => {
              const percentage = ((candidate.votes / totalVotes) * 100).toFixed(2);
              
              return (
                <div
                  key={index}
                  className={`border-2 rounded-lg p-6 transition-all duration-300 ${
                    candidate.isWinner
                      ? 'border-red-500 bg-red-50'
                      : candidate.isNearestCandidate
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="text-center">
                    {candidate.imageUrl && (
                      <div className="mb-4">
                        <Image
                          src={candidate.imageUrl}
                          alt={candidate.name}
                          width={80}
                          height={100}
                          className="rounded-lg border-2 border-gray-200 mx-auto"
                        />
                      </div>
                    )}
                    
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {candidate.name}
                    </h3>
                    
                    <p className="text-lg font-bold text-gray-800 mb-4">
                      {candidate.name}
                    </p>
                    
                    <div className="space-y-2 text-sm mb-4">
                      <p>
                        <span className="font-semibold">Party:</span> {candidate.party}
                      </p>
                      <p>
                        <span className="font-semibold">Symbol:</span> {candidate.symbol}
                      </p>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 space-y-2">
                      <p className="text-sm">
                        <span className="font-semibold">Popular vote</span> {formatNumber(candidate.votes)}
                      </p>
                      <p className="text-sm">
                        <span className="font-semibold">Percentage</span> {percentage}%
                      </p>
                      
                      <div className="mt-4">
                        {candidate.isWinner && (
                          <p className="text-red-600 font-bold text-lg">WINNER</p>
                        )}
                        {candidate.isNearestCandidate && !candidate.isWinner && (
                          <p className="text-green-600 font-bold text-lg">NEAREST CANDIDATE</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Voter Statistics Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Voter Statistics
          </h2>
          
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {formatNumber(election.voterStats.totalVoters)}
              </div>
              <div className="text-sm text-gray-600">Registered</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {election.voterStats.turnout}%
              </div>
              <div className="text-sm text-gray-600">Turnout</div>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-600">
              <strong>Upazilas/Unions/Wards:</strong> All Districts
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}