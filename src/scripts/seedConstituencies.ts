import connectDB from '@/lib/mongodb';
import Constituency from '@/models/Constituency';

const dhakaConstituencies = [
  {
    constituencyId: 'Dhaka-1',
    division: 'Dhaka',
    district: 'Dhaka',
    parliamentNumber: 12,
    electionDate: new Date('2024-01-30'),
    candidates: [
      {
        name: 'Salman Fazlur Rahman',
        party: 'AL-led 14-Party Alliance',
        symbol: 'BOAT',
        votes: 302993,
        centersCounted: 178,
        isWinner: true,
        isNearestCandidate: false,
        imageUrl: '/assets/candidate1.jpg'
      },
      {
        name: 'SALMA ISLAM',
        party: 'INDEPENDENT',
        symbol: 'CAR',
        votes: 37763,
        centersCounted: 178,
        isWinner: false,
        isNearestCandidate: true,
        imageUrl: '/assets/election_logo.png'
      },
      {
        name: 'ABID HOSSAIN',
        party: 'COMMUNIST PARTY OF BANGLADESH',
        symbol: 'SICKLE',
        votes: 375,
        centersCounted: 178,
        isWinner: false,
        isNearestCandidate: false,
        imageUrl: '/assets/logo.png'
      }
    ],
    voterStats: {
      totalVoters: 440287,
      maleVoters: 216794,
      femaleVoters: 223493,
      totalCenters: 178,
      upazilas: ['Dohar Upazila', 'Nawabganj Upazila']
    }
  },
  {
    constituencyId: 'Dhaka-2',
    division: 'Dhaka',
    district: 'Dhaka',
    parliamentNumber: 12,
    electionDate: new Date('2024-01-30'),
    candidates: [
      {
        name: 'Sample Candidate 1',
        party: 'AL',
        symbol: 'BOAT',
        votes: 250000,
        centersCounted: 150,
        isWinner: true,
        isNearestCandidate: false,
        imageUrl: '/assets/candidate1.jpg'
      },
      {
        name: 'Sample Candidate 2',
        party: 'BNP',
        symbol: 'CAR',
        votes: 180000,
        centersCounted: 150,
        isWinner: false,
        isNearestCandidate: true,
        imageUrl: '/assets/election_logo.png'
      }
    ],
    voterStats: {
      totalVoters: 400000,
      maleVoters: 200000,
      femaleVoters: 200000,
      totalCenters: 150,
      upazilas: ['Sample Upazila 1', 'Sample Upazila 2']
    }
  },
  {
    constituencyId: 'Dhaka-3',
    division: 'Dhaka',
    district: 'Dhaka',
    parliamentNumber: 12,
    electionDate: new Date('2024-01-30'),
    candidates: [
      {
        name: 'Sample Candidate 1',
        party: 'AL',
        symbol: 'BOAT',
        votes: 300000,
        centersCounted: 200,
        isWinner: true,
        isNearestCandidate: false,
        imageUrl: '/assets/candidate1.jpg'
      },
      {
        name: 'Sample Candidate 2',
        party: 'BNP',
        symbol: 'CAR',
        votes: 250000,
        centersCounted: 200,
        isWinner: false,
        isNearestCandidate: true,
        imageUrl: '/assets/election_logo.png'
      }
    ],
    voterStats: {
      totalVoters: 500000,
      maleVoters: 250000,
      femaleVoters: 250000,
      totalCenters: 200,
      upazilas: ['Sample Upazila 1', 'Sample Upazila 2']
    }
  }
];

// Add more constituencies for other divisions
const allConstituencies = [
  ...dhakaConstituencies,
  // Add more constituencies for other divisions here
];

export async function seedConstituencies() {
  try {
    await connectDB();
    
    // Clear existing constituency data
    await Constituency.deleteMany({});
    
    // Insert new constituency data
    await Constituency.insertMany(allConstituencies);
    
    console.log('Constituency database seeded successfully!');
  } catch (error) {
    console.error('Error seeding constituency database:', error);
  }
}
