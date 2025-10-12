'use client';

import { useState } from 'react';
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

  if (selectedCandidateId) {
    return (
      <CandidateProfile
        candidateId={selectedCandidateId}
        onBack={handleBackToList}
      />
    );
  }

  return (
    <CandidateList onSelectCandidate={handleSelectCandidate} />
  );
}
