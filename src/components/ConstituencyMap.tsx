'use client';

import { useState } from 'react';
import { bangladeshMapConstituencies } from '@/data/bangladeshMapData';

interface ConstituencyMapProps {
  selectedConstituencyId?: string;
  onConstituencySelect?: (constituencyId: string) => void;
  className?: string;
}

export default function ConstituencyMap({
  selectedConstituencyId,
  onConstituencySelect,
  className = ''
}: ConstituencyMapProps) {
  const [hoveredConstituencyId, setHoveredConstituencyId] = useState<string | null>(null);

  const handlePathClick = (constituencyId: string) => {
    if (onConstituencySelect) {
      onConstituencySelect(constituencyId);
    }
  };

  const getPathFill = (constituencyId: string) => {
    if (selectedConstituencyId === constituencyId) {
      return '#1FA757'; // election-green
    }
    if (hoveredConstituencyId === constituencyId) {
      return '#4ade80'; // lighter green for hover
    }
    return '#e5e7eb'; // default gray
  };

  const getPathStroke = (constituencyId: string) => {
    if (selectedConstituencyId === constituencyId) {
      return '#15803d'; // darker green border
    }
    return '#9ca3af'; // default gray border
  };

  return (
    <div className={`w-full h-full ${className}`}>
      <svg
        viewBox="0 0 4 3"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {bangladeshMapConstituencies.map((constituency) => (
          <path
            key={constituency.id}
            id={constituency.id}
            d={constituency.path}
            fill={getPathFill(constituency.id)}
            stroke={getPathStroke(constituency.id)}
            strokeWidth={selectedConstituencyId === constituency.id ? 0.02 : 0.01}
            className="cursor-pointer transition-all duration-200"
            onMouseEnter={() => setHoveredConstituencyId(constituency.id)}
            onMouseLeave={() => setHoveredConstituencyId(null)}
            onClick={() => handlePathClick(constituency.id)}
            style={{
              opacity: hoveredConstituencyId === constituency.id ? 0.9 : 1
            }}
          />
        ))}
      </svg>
    </div>
  );
}

