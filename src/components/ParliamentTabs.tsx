'use client';

import { useState } from 'react';
import { IElection } from '@/models/Election';
import PartyAllianceVisualization from './PartyAllianceVisualization';

interface ParliamentTabsProps {
  election: IElection;
}

export default function ParliamentTabs({ election }: ParliamentTabsProps) {
  const [activeTab, setActiveTab] = useState<'party' | 'candidates' | 'manifesto'>('party');

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };


  const getCandidatesData = () => {
    return election.candidates.sort((a, b) => b.votes - a.votes);
  };

  const getManifestoData = () => {
    // Sample manifesto data for different parliaments
    const manifestos = {
      1: {
        title: "Building a New Nation",
        keyPoints: [
          "Establish democratic governance",
          "Rebuild war-torn infrastructure", 
          "Ensure food security",
          "Promote social justice",
          "Strengthen national unity"
        ],
        focus: "Post-independence reconstruction and nation-building"
      },
      2: {
        title: "Economic Development",
        keyPoints: [
          "Industrial development",
          "Agricultural modernization",
          "Foreign investment promotion",
          "Infrastructure development",
          "Poverty alleviation"
        ],
        focus: "Economic growth and development"
      },
      3: {
        title: "Democratic Consolidation",
        keyPoints: [
          "Strengthen democratic institutions",
          "Ensure free and fair elections",
          "Protect human rights",
          "Promote good governance",
          "Fight corruption"
        ],
        focus: "Democratic governance and institutional reform"
      },
      4: {
        title: "Social Welfare",
        keyPoints: [
          "Universal healthcare",
          "Quality education for all",
          "Women empowerment",
          "Youth development",
          "Social safety nets"
        ],
        focus: "Social development and welfare"
      },
      5: {
        title: "Economic Liberalization",
        keyPoints: [
          "Market economy reforms",
          "Private sector development",
          "Export promotion",
          "Financial sector reform",
          "Technology advancement"
        ],
        focus: "Economic liberalization and modernization"
      },
      6: {
        title: "Digital Bangladesh",
        keyPoints: [
          "Digital infrastructure",
          "E-governance",
          "IT education",
          "Digital services",
          "Innovation and technology"
        ],
        focus: "Digital transformation and technology"
      },
      7: {
        title: "Climate Action",
        keyPoints: [
          "Climate change adaptation",
          "Renewable energy",
          "Environmental protection",
          "Disaster management",
          "Sustainable development"
        ],
        focus: "Environmental sustainability and climate action"
      },
      8: {
        title: "Regional Cooperation",
        keyPoints: [
          "SAARC cooperation",
          "BIMSTEC integration",
          "Trade partnerships",
          "Cultural exchange",
          "Regional security"
        ],
        focus: "Regional integration and cooperation"
      },
      9: {
        title: "Vision 2021",
        keyPoints: [
          "Middle-income country status",
          "Infrastructure mega-projects",
          "Human development",
          "Economic diversification",
          "Global competitiveness"
        ],
        focus: "Achieving middle-income country status"
      },
      10: {
        title: "Vision 2041",
        keyPoints: [
          "Developed country status",
          "Advanced technology",
          "Knowledge economy",
          "Green development",
          "Global leadership"
        ],
        focus: "Long-term development vision"
      },
      11: {
        title: "Smart Bangladesh",
        keyPoints: [
          "Smart cities",
          "AI and automation",
          "Digital economy",
          "Innovation hubs",
          "Future-ready workforce"
        ],
        focus: "Smart technology and innovation"
      },
      12: {
        title: "Prosperous Bangladesh",
        keyPoints: [
          "Economic prosperity",
          "Social harmony",
          "Environmental sustainability",
          "Global integration",
          "Inclusive development"
        ],
        focus: "Comprehensive national development"
      }
    };

    return manifestos[election.parliamentNumber as keyof typeof manifestos] || manifestos[12];
  };

  const candidatesData = getCandidatesData();
  const manifestoData = getManifestoData();

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Tab Navigation */}
      <div className="flex justify-center mb-8">
        <div className="bg-red-100 border-2 border-red-500 rounded-lg p-1 flex space-x-1">
          <button
            onClick={() => setActiveTab('party')}
            className={`px-6 py-2 rounded-md font-semibold transition-colors ${
              activeTab === 'party'
                ? 'bg-red-500 text-white'
                : 'text-red-700 hover:bg-red-200'
            }`}
          >
            Party
          </button>
          <button
            onClick={() => setActiveTab('candidates')}
            className={`px-6 py-2 rounded-md font-semibold transition-colors ${
              activeTab === 'candidates'
                ? 'bg-red-500 text-white'
                : 'text-red-700 hover:bg-red-200'
            }`}
          >
            Candidates
          </button>
          <button
            onClick={() => setActiveTab('manifesto')}
            className={`px-6 py-2 rounded-md font-semibold transition-colors ${
              activeTab === 'manifesto'
                ? 'bg-red-500 text-white'
                : 'text-red-700 hover:bg-red-200'
            }`}
          >
            Manifesto
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        {activeTab === 'party' && (
          <div>
            <PartyAllianceVisualization parliamentNumber={election.parliamentNumber} />
          </div>
        )}

        {activeTab === 'candidates' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              All Candidates - {election.title}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {candidatesData.map((candidate, index) => (
                <div
                  key={index}
                  className={`rounded-lg p-4 border-2 ${
                    candidate.isWinner
                      ? 'border-red-500 bg-red-50'
                      : candidate.isNearestCandidate
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{candidate.name}</h3>
                    <p className="text-sm text-gray-600 mb-1">{candidate.party}</p>
                    <p className="text-sm text-gray-600 mb-3">Symbol: {candidate.symbol}</p>
                    
                    <div className="bg-white rounded p-3">
                      <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                        <div>
                          <span className="font-semibold text-blue-600">
                            {formatNumber(candidate.votes)}
                          </span>
                          <p className="text-xs text-gray-600">Votes</p>
                        </div>
                        <div>
                          <span className="font-semibold text-blue-600">
                            {candidate.centersCounted}
                          </span>
                          <p className="text-xs text-gray-600">Centers</p>
                        </div>
                      </div>
                      
                      {candidate.isWinner && (
                        <p className="text-red-600 font-bold text-sm">WINNER</p>
                      )}
                      {candidate.isNearestCandidate && !candidate.isWinner && (
                        <p className="text-green-600 font-bold text-sm">NEAREST CANDIDATE</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'manifesto' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Election Manifesto - {election.title}
            </h2>
            
            <div className="max-w-4xl mx-auto">
              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-bold text-blue-800 mb-3">{manifestoData.title}</h3>
                <p className="text-gray-700 mb-4">{manifestoData.focus}</p>
              </div>
              
              <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Key Policy Points:</h4>
                <ul className="space-y-3">
                  {manifestoData.keyPoints.map((point, index) => (
                    <li key={index} className="flex items-start">
                      <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="mt-6 bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">Election Context:</h4>
                <p className="text-sm text-gray-600">
                  This manifesto was presented during the {election.title} held on{' '}
                  {new Date(election.electionDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}. The focus was on {manifestoData.focus.toLowerCase()}.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
