'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import CandidateList from '@/components/CandidateList';
import CandidateProfile from '@/components/CandidateProfile';

export default function CandidatesPage() {
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);

  const handleSelectCandidate = (candidateId: string) => {
    setSelectedCandidateId(candidateId);
  };

  const handleBackToList = () => {
    setSelectedCandidateId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      {selectedCandidateId ? (
        <CandidateProfile
          candidateId={selectedCandidateId}
          onBack={handleBackToList}
        />
      ) : (
        <CandidateList onSelectCandidate={handleSelectCandidate} />
      )}
    </div>
  );
}
