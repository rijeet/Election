// 'use client';

// import React, { useState, useEffect } from 'react';
// import { bangladeshMapConstituencies } from '@/data/bangladeshMapData';

// interface ConstituencyData {
//   party: string;
//   color: string;
//   candidate: string;
//   isWinner: boolean;
// }

// interface PartyInfo {
//   name: string;
//   color: string;
//   seats: number;
// }

// interface ParliamentData {
//   electionYear: string;
//   constituencies: Record<number, ConstituencyData>;
//   parties: PartyInfo[];
//   totalSeats: number;
// }

// interface ParliamentVisualizationProps {
//   electionYear: string;
// }

// export default function ParliamentVisualization({ electionYear }: ParliamentVisualizationProps) {
//   const [parliamentData, setParliamentData] = useState<ParliamentData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchParliamentData = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch(`/api/parliament-visualization?year=${electionYear}`);
        
//         if (!response.ok) {
//           throw new Error('Failed to fetch parliament data');
//         }
        
//         const data = await response.json();
//         setParliamentData(data);
//         setError(null);
//       } catch (err) {
//         console.error('Error fetching parliament data:', err);
//         setError(err instanceof Error ? err.message : 'An error occurred');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchParliamentData();
//   }, [electionYear]);

//   const getConstituencyColor = (constituencyId: string): string => {
//     if (!parliamentData) return '#f0f0f0';
    
//     // Extract constituency number from ID (e.g., "Bhola-4" -> 4)
//     const parts = constituencyId.split('-');
//     const constituencyNumber = parseInt(parts[parts.length - 1]);
    
//     const constituencyData = parliamentData.constituencies[constituencyNumber];
//     return constituencyData?.color || '#f0f0f0';
//   };

//   const getConstituencyInfo = (constituencyId: string) => {
//     if (!parliamentData) return null;
    
//     const parts = constituencyId.split('-');
//     const constituencyNumber = parseInt(parts[parts.length - 1]);
    
//     return parliamentData.constituencies[constituencyNumber] || null;
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center p-8">
//         <div className="text-lg">Loading parliament data...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center p-8">
//         <div className="text-red-600">Error: {error}</div>
//       </div>
//     );
//   }

//   if (!parliamentData) {
//     return (
//       <div className="flex items-center justify-center p-8">
//         <div className="text-lg">No data available</div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full">
//       <div className="mb-6">
//         <h2 className="text-2xl font-bold mb-2">
//           {parliamentData.electionYear} Election - Constituency Results
//         </h2>
//         <p className="text-gray-600">
//           Total Seats: {parliamentData.totalSeats}
//         </p>
//       </div>

//       {/* Party Legend */}
//       <div className="mb-6">
//         <h3 className="text-lg font-semibold mb-3">Party Results</h3>
//         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
//           {parliamentData.parties.map((party, index) => (
//             <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
//               <div 
//                 className="w-4 h-4 rounded"
//                 style={{ backgroundColor: party.color }}
//               ></div>
//               <div className="text-sm">
//                 <div className="font-medium">{party.name}</div>
//                 <div className="text-gray-600">{party.seats} seats</div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* SVG Map */}
//       <div className="border rounded-lg p-4 bg-white">
//         <svg 
//           viewBox="0 0 360 185" 
//           className="w-full h-auto"
//           style={{ maxHeight: '500px' }}
//         >
//           {bangladeshMapConstituencies.map((constituency, index) => {
//             const constituencyInfo = getConstituencyInfo(constituency.id);
//             const fillColor = getConstituencyColor(constituency.id);
            
//             return (
//               <g key={index}>
//                 <path
//                   d={constituency.path}
//                   fill={fillColor}
//                   stroke="#ffffff"
//                   strokeWidth="0.5"
//                   className="hover:opacity-80 cursor-pointer transition-opacity"
//                   title={`${constituency.name}${constituencyInfo ? ` - ${constituencyInfo.party} (${constituencyInfo.candidate})` : ''}`}
//                 />
//               </g>
//             );
//           })}
//         </svg>
//       </div>

//       {/* Constituency Details */}
//       <div className="mt-6">
//         <h3 className="text-lg font-semibold mb-3">Constituency Details</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {Object.entries(parliamentData.constituencies).map(([constituencyNumber, data]) => (
//             <div key={constituencyNumber} className="p-3 border rounded-lg">
//               <div className="flex items-center space-x-2 mb-2">
//                 <div 
//                   className="w-3 h-3 rounded"
//                   style={{ backgroundColor: data.color }}
//                 ></div>
//                 <span className="font-medium">Constituency {constituencyNumber}</span>
//               </div>
//               <div className="text-sm text-gray-600">
//                 <div><strong>Party:</strong> {data.party}</div>
//                 <div><strong>Candidate:</strong> {data.candidate}</div>
//                 {data.isWinner && (
//                   <div className="text-green-600 font-medium">Winner</div>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }
