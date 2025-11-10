'use client';

import { useEffect, useState } from 'react';

export interface BlunderHookData {
  year: number;
  topParty: string;
  secondParty: string;
  topPartySeats: number;
  secondPartySeats: number;
  seatDifference: number;
  totalVotesNeeded: number;
  constituencyIds: string[];
  constituencies: Array<{
    constituencyId: string;
    Difference: number;
    Difference_Percentage?: string;
    candidates: Array<{ name: string; party: string; votes: number }>;
    Winner: string;
    electionDate: string;
  }>;
}

export function useBlunderAnalysis(parliamentNumber: number) {
  const [data, setData] = useState<BlunderHookData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        setLoading(true);
        const res = await fetch(`/api/blunder?parliament=${parliamentNumber}`);
        if (!res.ok) throw new Error('Failed to fetch blunder analysis');
        const json = await res.json();
        if (active) {
          setData(json);
          setError(null);
        }
      } catch (err) {
        if (active) setError('Failed to fetch blunder analysis');
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [parliamentNumber]);

  return { data, isLoading: loading, error };
}



