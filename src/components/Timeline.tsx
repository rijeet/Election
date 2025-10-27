'use client';

import { useState, useEffect } from 'react';
import { IElection } from '@/models/Election';

interface TimelineProps {
  elections: IElection[];
  onElectionSelect: (election: IElection) => void;
  selectedElection: IElection | null;
}

export default function Timeline({ elections, onElectionSelect, selectedElection }: TimelineProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (selectedElection) {
      const index = elections.findIndex(e => e.parliamentNumber === selectedElection.parliamentNumber);
      if (index !== -1) {
        setCurrentIndex(index);
      }
    }
  }, [selectedElection, elections]);

  const handlePrev = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      onElectionSelect(elections[newIndex]);
    }
  };

  const handleNext = () => {
    if (currentIndex < elections.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      onElectionSelect(elections[newIndex]);
    }
  };

  const handleElectionClick = (election: IElection, index: number) => {
    setCurrentIndex(index);
    onElectionSelect(election);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto my-12 px-6">
      <div className="relative">
        {/* Background card */}
        <div className="absolute inset-0 bg-white rounded-2xl shadow-lg border border-gray-200"></div>
        
        {/* Content */}
        <div className="relative p-8">
          {/* Timeline line */}
          <div className="absolute top-16 left-16 right-16 h-1 bg-gray-200 rounded-full"></div>
          <div 
            className="absolute top-16 left-16 h-1 bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-700 ease-out"
            style={{ width: `calc(${(currentIndex / (elections.length - 1)) * 100}% - 4rem)` }}
          ></div>

          {/* Timeline events */}
          <div className="relative flex justify-between px-4">
            {elections.map((election, index) => (
              <div key={index} className="flex flex-col items-center group flex-shrink-0">
                <button
                  onClick={() => handleElectionClick(election, index)}
                  className={`relative z-10 w-8 h-8 rounded-full border-3 transition-all duration-300 transform hover:scale-110 ${
                    index === currentIndex
                      ? 'bg-gradient-to-br from-green-500 to-green-600 border-green-600 shadow-lg shadow-green-500/30'
                      : index < currentIndex
                      ? 'bg-gradient-to-br from-green-400 to-green-500 border-green-500 shadow-md shadow-green-400/20'
                      : 'bg-white border-gray-300 hover:border-green-400 hover:shadow-md'
                  }`}
                >
                  {/* Inner dot */}
                  <div className={`absolute inset-1 rounded-full transition-all duration-300 ${
                    index === currentIndex || index < currentIndex
                      ? 'bg-white'
                      : 'bg-gray-300 group-hover:bg-green-200'
                  }`}></div>
                  
                  {/* Pulse animation for current */}
                  {index === currentIndex && (
                    <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20"></div>
                  )}
                </button>
                
                <div className="mt-4 text-center space-y-1 max-w-20">
                  <div className={`text-xs font-semibold transition-colors duration-200 leading-tight ${
                    index === currentIndex 
                      ? 'text-green-700' 
                      : 'text-gray-600 group-hover:text-gray-800'
                  }`}>
                    {election.parliamentNumber}th
                  </div>
                  <div className={`text-xs transition-colors duration-200 leading-tight ${
                    index === currentIndex 
                      ? 'text-green-600 font-medium' 
                      : 'text-gray-500 group-hover:text-gray-600'
                  }`}>
                    {formatDate(election.electionDate)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation arrows */}
          <div className="flex justify-between mt-12">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 transform hover:scale-105 ${
                currentIndex === 0
                  ? 'border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50'
                  : 'border-gray-300 text-gray-600 hover:border-green-500 hover:text-green-600 hover:bg-green-50 hover:shadow-md'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              onClick={handleNext}
              disabled={currentIndex === elections.length - 1}
              className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 transform hover:scale-105 ${
                currentIndex === elections.length - 1
                  ? 'border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50'
                  : 'border-gray-300 text-gray-600 hover:border-green-500 hover:text-green-600 hover:bg-green-50 hover:shadow-md'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
