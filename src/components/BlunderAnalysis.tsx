'use client';

import { useMemo, useState } from 'react';
import { useBlunderAnalysis } from '@/hooks/useBlunderAnalysis';
import { bangladeshMapConstituencies } from '@/data/bangladeshMapData';

export default function BlunderAnalysis({ parliamentNumber: initialParliament }: { parliamentNumber?: number }) {
  const [parliament, setParliament] = useState<number>(initialParliament ?? 9);
  const { data, isLoading, error } = useBlunderAnalysis(parliament);
  const [showAll, setShowAll] = useState(false);
  const [hovered, setHovered] = useState<null | {
    constituencyId: string;
    Difference: number;
    Difference_Percentage?: string;
    candidates: Array<{ name: string; party: string; votes: number }>;
  }>(null);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const visibleConstituencies = useMemo(() => {
    if (!data) return [];
    const list = data.constituencies;
    return showAll ? list : list.slice(0, 6);
  }, [data, showAll]);

  return (
    <section className="mt-10 bg-white rounded-xl p-6 shadow-lg">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Blunder Analysis</h2>
        <div className="flex items-center gap-2">
          <label htmlFor="parliament" className="text-sm text-gray-600">Parliament:</label>
          <select
            id="parliament"
            value={parliament}
            onChange={(e) => setParliament(Number(e.target.value))}
            className="bg-green-600 text-white font-medium px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-300 outline-none text-sm"
          >
            {[5, 7, 8, 9].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </div>

      {isLoading && (
        <div className="mt-6 text-gray-600">Loading blunder analysis...</div>
      )}

      {error && !isLoading && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">{error}</div>
      )}

      {data && !isLoading && (
        <>
          <p className="mt-2 text-gray-700 text-lg">
            In {data.year},{' '}
            <span className="font-semibold text-blue-600">{data.topParty}</span> won {data.topPartySeats} seats and{' '}
            <span className="font-semibold text-red-600">{data.secondParty}</span> won {data.secondPartySeats} seats.
            <br />
            If <span className="font-semibold text-red-600">{data.secondParty}</span> gained{' '}
            {data.totalVotesNeeded.toLocaleString()} more votes to win {data.seatDifference} constituencies, they would
            have won the Parliament.
          </p>

          {/* Map with highlighted blunder constituencies */}
          <div className="relative mt-6 bg-gray-50 rounded-xl p-4 overflow-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="-0.058 -0.058 4.78 6.01"
              className="w-full h-[540px] md:h-[620px] lg:h-[700px] border border-gray-300 rounded-lg bg-white"
            >
              <style>
                {`
                  .constituency-path { 
                    transition: all 0.25s ease; 
                    cursor: pointer;
                    stroke: #6b7280;
                    stroke-width: 0.002;
                  }
                  .constituency-path:hover { 
                    stroke: #ef4444;
                    stroke-width: 0.004;
                    filter: brightness(1.1);
                  }
                `}
              </style>
              <g fill="none" stroke="#000" strokeWidth="0.002" transform="matrix(1 0 0 -1 0 5.893)">
                {bangladeshMapConstituencies.map((c) => {
                  const isBlunder = data.constituencyIds.includes(c.id) || data.constituencyIds.includes(c.name);
                  // Use light pink for blunder highlight
                  const fill = isBlunder ? '#FD9670' : '#E5E7EB';
                  const onMove = (e: React.MouseEvent<SVGPathElement>) => {
                    if (!isBlunder) return;
                    const rec = data.constituencies.find(
                      (x) => x.constituencyId === c.id || x.constituencyId === c.name
                    );
                    if (rec) {
                      setHovered({
                        constituencyId: rec.constituencyId,
                        Difference: rec.Difference,
                        Difference_Percentage: rec.Difference_Percentage,
                        candidates: rec.candidates
                      });
                      // Position tooltip close to cursor and relative to the SVG container
                      const svgEl = e.currentTarget.ownerSVGElement;
                      const rect = svgEl ? svgEl.getBoundingClientRect() : { left: 0, top: 0 };
                      const x = e.clientX - rect.left + 30; // small offset from cursor
                      const y = e.clientY - rect.top + 10;
                      setHoverPos({ x, y });
                    }
                  };
                  const onLeave = () => setHovered(null);
                  return (
                    <path
                      key={c.id}
                      className="constituency-path"
                      fill={fill}
                      d={c.path}
                      onMouseMove={onMove}
                      onMouseLeave={onLeave}
                    />
                  );
                })}
              </g>
            </svg>
            {hovered && (
              <div
                className="pointer-events-none absolute z-50 w-72 bg-white text-sm p-3 rounded-lg shadow-xl border border-gray-200"
                style={{ top: hoverPos.y, left: hoverPos.x }}
              >
                <h4 className="font-semibold text-gray-900">{hovered.constituencyId}</h4>
                <div className="mt-1 space-y-1">
                  {hovered.candidates.slice(0, 2).map((p) => (
                    <div key={p.name} className="flex items-center justify-between">
                      <span className="text-gray-700">{p.party}</span>
                      <span className="text-gray-800">{p.votes.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Diff: {hovered.Difference.toLocaleString()}{' '}
                  {hovered.Difference_Percentage ? `(${hovered.Difference_Percentage})` : ''}
                </p>
              </div>
            )}
          </div>

          {/* Constituency cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {visibleConstituencies.map((c) => (
              <div key={c.constituencyId} className="bg-white rounded-xl p-4 shadow hover:bg-green-50 transition">
                <h3 className="font-semibold text-gray-800">{c.constituencyId}</h3>
                <div className="flex justify-between text-sm mt-2">
                  <div>
                    <p className="font-medium text-gray-600">{c.candidates[0]?.name}</p>
                    <p className="text-gray-500">{c.candidates[0]?.party}</p>
                  </div>
                  <span className="text-gray-700">{c.candidates[0]?.votes?.toLocaleString?.() ?? c.candidates[0]?.votes}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <div>
                    <p className="font-medium text-gray-600">{c.candidates[1]?.name}</p>
                    <p className="text-gray-500">{c.candidates[1]?.party}</p>
                  </div>
                  <span className="text-gray-700">{c.candidates[1]?.votes?.toLocaleString?.() ?? c.candidates[1]?.votes}</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Difference: {c.Difference.toLocaleString()} {c.Difference_Percentage ? `(${c.Difference_Percentage})` : ''}
                </p>
              </div>
            ))}
          </div>
          {data.constituencies.length > 6 && (
            <div className="flex justify-center">
              <button
                onClick={() => setShowAll(!showAll)}
                className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                {showAll ? 'Show Less' : 'See All'}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}



