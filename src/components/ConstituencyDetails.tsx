// 'use client';

// import { IConstituency } from '@/models/Constituency';
// import Image from 'next/image';

// interface ConstituencyDetailsProps {
//   constituency: IConstituency;
// }

// export default function ConstituencyDetails({ constituency }: ConstituencyDetailsProps) {
//   const formatNumber = (num: number) => {
//     return num.toLocaleString();
//   };

//   return (
//     <div className="w-full max-w-6xl mx-auto p-6">
//       {/* Header with constituency name and expand button */}
//       <div className="bg-blue-800 text-white px-4 py-3 flex justify-between items-center mb-4">
//         <h1 className="text-xl font-bold">{constituency.constituencyId}</h1>
//         <button className="text-white text-xl font-bold">+</button>
//       </div>

//       {/* Candidates Section - Compact horizontal layout */}
//       <div className="bg-blue-100 p-4 mb-4">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           {constituency.candidates.map((candidate, index) => (
//             <div
//               key={index}
//               className={`bg-white rounded-lg p-3 border-2 ${
//                 candidate.isWinner
//                   ? 'border-red-500'
//                   : candidate.isNearestCandidate
//                   ? 'border-green-500'
//                   : 'border-gray-300'
//               }`}
//             >
//               <div className="text-center">
//                 {candidate.imageUrl && (
//                   <div className="mb-2">
//                     <Image
//                       src={candidate.imageUrl}
//                       alt={candidate.name}
//                       width={40}
//                       height={50}
//                       className="rounded mx-auto"
//                     />
//                   </div>
//                 )}
                
//                 <h3 className="font-bold text-sm mb-1">{candidate.name}</h3>
                
//                 <p className="text-xs text-gray-600 mb-1">
//                   {candidate.party}
//                 </p>
                
//                 <p className="text-xs text-gray-600 mb-2">
//                   Symbol: {candidate.symbol}
//                 </p>
                
//                 <div className="bg-gray-50 rounded p-2">
//                   <p className="text-xs font-semibold mb-1">Result:</p>
//                   <p className="text-xs text-gray-600 mb-1">
//                     Vote: <span className="font-bold text-blue-600">
//                       {formatNumber(candidate.votes)}
//                     </span>
//                   </p>
//                   <p className="text-xs text-gray-600 mb-1">
//                     Center Counted: <span className="font-bold text-blue-600">
//                       {candidate.centersCounted}
//                     </span>
//                   </p>
                  
//                   {candidate.isWinner && (
//                     <p className="text-red-600 font-bold text-xs">WINNER</p>
//                   )}
//                   {candidate.isNearestCandidate && !candidate.isWinner && (
//                     <p className="text-green-600 font-bold text-xs">NEAREST CANDIDATE</p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Combined District and Voter Info Section */}
//       <div className="bg-blue-100 p-4">
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
//           <div className="text-center">
//             <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-1">
//               <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
//               </svg>
//             </div>
//             <p className="text-lg font-bold text-blue-600">
//               {formatNumber(constituency.voterStats.totalVoters)}
//             </p>
//             <p className="text-xs text-gray-600">Total Voters</p>
//           </div>
          
//           <div className="text-center">
//             <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center mx-auto mb-1">
//               <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//               </svg>
//             </div>
//             <p className="text-lg font-bold text-green-600">
//               {formatNumber(constituency.voterStats.maleVoters)}
//             </p>
//             <p className="text-xs text-gray-600">Male Voters</p>
//           </div>
          
//           <div className="text-center">
//             <div className="w-8 h-8 bg-pink-200 rounded-full flex items-center justify-center mx-auto mb-1">
//               <svg className="w-4 h-4 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//               </svg>
//             </div>
//             <p className="text-lg font-bold text-pink-600">
//               {formatNumber(constituency.voterStats.femaleVoters)}
//             </p>
//             <p className="text-xs text-gray-600">Female Voters</p>
//           </div>
          
//           <div className="text-center">
//             <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center mx-auto mb-1">
//               <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h0" />
//               </svg>
//             </div>
//             <p className="text-lg font-bold text-purple-600">
//               {constituency.voterStats.totalCenters}
//             </p>
//             <p className="text-xs text-gray-600">Total Centres</p>
//           </div>
//         </div>
        
//         {/* District and Upazila info combined */}
//         <div className="text-center">
//           <p className="text-xs text-gray-600">
//             <strong>Upazilas/Unions/Wards:</strong> {constituency.voterStats.upazilas.join(', ')}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }
