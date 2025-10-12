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
    <div className="w-full max-w-4xl mx-auto my-8">
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute top-12 left-10 right-10 h-0.5 bg-gray-300"></div>
        <div 
          className="absolute top-12 left-10 h-0.5 bg-green-600 transition-all duration-500"
          style={{ width: `${(currentIndex / (elections.length - 1)) * 100}%` }}
        ></div>

        {/* Timeline events */}
        <div className="relative flex justify-between">
          {elections.map((election, index) => (
            <div key={index} className="flex flex-col items-center">
              <button
                onClick={() => handleElectionClick(election, index)}
                className={`relative z-10 w-6 h-6 rounded-full border-2 transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-green-600 border-green-600'
                    : index < currentIndex
                    ? 'bg-green-600 border-green-600'
                    : 'bg-white border-gray-300 hover:border-green-600'
                }`}
              >
                <div className="absolute inset-0 rounded-full bg-green-600 scale-0 transition-transform duration-300 group-hover:scale-100"></div>
              </button>
              <span className="mt-2 text-sm font-medium text-gray-700 text-center">
                {election.parliamentNumber}th Parliament
              </span>
              <span className="text-xs text-gray-500 mt-1">
                {formatDate(election.electionDate)}
              </span>
            </div>
          ))}
        </div>

        {/* Navigation arrows */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
              currentIndex === 0
                ? 'border-gray-300 text-gray-300 cursor-not-allowed'
                : 'border-gray-400 text-gray-600 hover:border-green-600 hover:text-green-600'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={handleNext}
            disabled={currentIndex === elections.length - 1}
            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
              currentIndex === elections.length - 1
                ? 'border-gray-300 text-gray-300 cursor-not-allowed'
                : 'border-gray-400 text-gray-600 hover:border-green-600 hover:text-green-600'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
