import connectDB from '@/lib/mongodb';
import Election from '@/models/Election';

const electionData = [
  {
    parliamentNumber: 1,
    electionDate: new Date('1973-04-07'),
    endDate: new Date('1975-11-06'),
    title: '1st Parliament',
    description: 'First parliamentary election of Bangladesh',
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
      }
    ],
    voterStats: {
      totalVoters: 440287,
      maleVoters: 216794,
      femaleVoters: 223493,
      totalCenters: 178,
      upazilas: ['Dohar Upazila', 'Nawabganj Upazila'],
      turnout: 77.4
    }
  },
  {
    parliamentNumber: 2,
    electionDate: new Date('1979-04-02'),
    title: '2nd Parliament',
    description: 'Second parliamentary election of Bangladesh',
    candidates: [
      {
        name: 'Candidate A',
        party: 'AL',
        symbol: 'BOAT',
        votes: 250000,
        centersCounted: 150,
        isWinner: true,
        isNearestCandidate: false,
        imageUrl: '/assets/candidate1.jpg'
      },
      {
        name: 'Candidate B',
        party: 'BNP',
        symbol: 'CAR',
        votes: 180000,
        centersCounted: 150,
        isWinner: false,
        isNearestCandidate: true,
        imageUrl: '/assets/election_logo.png'
      },
      {
        name: 'Candidate C',
        party: 'JSD',
        symbol: 'SICKLE',
        votes: 10000,
        centersCounted: 150,
        isWinner: false,
        isNearestCandidate: false,
        imageUrl: '/assets/logo.png'
      }
    ],
    voterStats: {
      totalVoters: 400000,
      maleVoters: 200000,
      femaleVoters: 200000,
      totalCenters: 150,
      upazilas: ['Example Upazila 1', 'Example Upazila 2'],
      turnout: 75.0
    }
  },
  {
    parliamentNumber: 3,
    electionDate: new Date('1986-07-10'),
    title: '3rd Parliament',
    description: 'Third parliamentary election of Bangladesh',
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
      upazilas: ['Sample Upazila 1', 'Sample Upazila 2'],
      turnout: 80.0
    }
  },
  {
    parliamentNumber: 4,
    electionDate: new Date('1988-04-15'),
    title: '4th Parliament',
    description: 'Fourth parliamentary election of Bangladesh',
    candidates: [
      {
        name: 'Sample Candidate 1',
        party: 'AL',
        symbol: 'BOAT',
        votes: 350000,
        centersCounted: 220,
        isWinner: true,
        isNearestCandidate: false,
        imageUrl: '/assets/candidate1.jpg'
      },
      {
        name: 'Sample Candidate 2',
        party: 'BNP',
        symbol: 'CAR',
        votes: 280000,
        centersCounted: 220,
        isWinner: false,
        isNearestCandidate: true,
        imageUrl: '/assets/election_logo.png'
      }
    ],
    voterStats: {
      totalVoters: 600000,
      maleVoters: 300000,
      femaleVoters: 300000,
      totalCenters: 220,
      upazilas: ['Sample Upazila 1', 'Sample Upazila 2'],
      turnout: 80.0
    }
  },
  {
    parliamentNumber: 5,
    electionDate: new Date('1991-04-05'),
    title: '5th Parliament',
    description: 'Fifth parliamentary election of Bangladesh',
    candidates: [
      {
        name: 'Sample Candidate 1',
        party: 'AL',
        symbol: 'BOAT',
        votes: 400000,
        centersCounted: 250,
        isWinner: true,
        isNearestCandidate: false,
        imageUrl: '/assets/candidate1.jpg'
      },
      {
        name: 'Sample Candidate 2',
        party: 'BNP',
        symbol: 'CAR',
        votes: 320000,
        centersCounted: 250,
        isWinner: false,
        isNearestCandidate: true,
        imageUrl: '/assets/election_logo.png'
      }
    ],
    voterStats: {
      totalVoters: 700000,
      maleVoters: 350000,
      femaleVoters: 350000,
      totalCenters: 250,
      upazilas: ['Sample Upazila 1', 'Sample Upazila 2'],
      turnout: 80.0
    }
  },
  {
    parliamentNumber: 6,
    electionDate: new Date('1996-03-19'),
    title: '6th Parliament',
    description: 'Sixth parliamentary election of Bangladesh',
    candidates: [
      {
        name: 'Sample Candidate 1',
        party: 'AL',
        symbol: 'BOAT',
        votes: 450000,
        centersCounted: 280,
        isWinner: true,
        isNearestCandidate: false,
        imageUrl: '/assets/candidate1.jpg'
      },
      {
        name: 'Sample Candidate 2',
        party: 'BNP',
        symbol: 'CAR',
        votes: 380000,
        centersCounted: 280,
        isWinner: false,
        isNearestCandidate: true,
        imageUrl: '/assets/election_logo.png'
      }
    ],
    voterStats: {
      totalVoters: 800000,
      maleVoters: 400000,
      femaleVoters: 400000,
      totalCenters: 280,
      upazilas: ['Sample Upazila 1', 'Sample Upazila 2'],
      turnout: 80.0
    }
  },
  {
    parliamentNumber: 7,
    electionDate: new Date('1996-07-14'),
    title: '7th Parliament',
    description: 'Seventh parliamentary election of Bangladesh',
    candidates: [
      {
        name: 'Sample Candidate 1',
        party: 'AL',
        symbol: 'BOAT',
        votes: 500000,
        centersCounted: 300,
        isWinner: true,
        isNearestCandidate: false,
        imageUrl: '/assets/candidate1.jpg'
      },
      {
        name: 'Sample Candidate 2',
        party: 'BNP',
        symbol: 'CAR',
        votes: 420000,
        centersCounted: 300,
        isWinner: false,
        isNearestCandidate: true,
        imageUrl: '/assets/election_logo.png'
      }
    ],
    voterStats: {
      totalVoters: 900000,
      maleVoters: 450000,
      femaleVoters: 450000,
      totalCenters: 300,
      upazilas: ['Sample Upazila 1', 'Sample Upazila 2'],
      turnout: 80.0
    }
  },
  {
    parliamentNumber: 8,
    electionDate: new Date('2001-10-28'),
    title: '8th Parliament',
    description: 'Eighth parliamentary election of Bangladesh',
    candidates: [
      {
        name: 'Sample Candidate 1',
        party: 'AL',
        symbol: 'BOAT',
        votes: 550000,
        centersCounted: 320,
        isWinner: true,
        isNearestCandidate: false,
        imageUrl: '/assets/candidate1.jpg'
      },
      {
        name: 'Sample Candidate 2',
        party: 'BNP',
        symbol: 'CAR',
        votes: 480000,
        centersCounted: 320,
        isWinner: false,
        isNearestCandidate: true,
        imageUrl: '/assets/election_logo.png'
      }
    ],
    voterStats: {
      totalVoters: 1000000,
      maleVoters: 500000,
      femaleVoters: 500000,
      totalCenters: 320,
      upazilas: ['Sample Upazila 1', 'Sample Upazila 2'],
      turnout: 80.0
    }
  },
  {
    parliamentNumber: 9,
    electionDate: new Date('2009-01-25'),
    title: '9th Parliament',
    description: 'Ninth parliamentary election of Bangladesh',
    candidates: [
      {
        name: 'Sample Candidate 1',
        party: 'AL',
        symbol: 'BOAT',
        votes: 600000,
        centersCounted: 350,
        isWinner: true,
        isNearestCandidate: false,
        imageUrl: '/assets/candidate1.jpg'
      },
      {
        name: 'Sample Candidate 2',
        party: 'BNP',
        symbol: 'CAR',
        votes: 520000,
        centersCounted: 350,
        isWinner: false,
        isNearestCandidate: true,
        imageUrl: '/assets/election_logo.png'
      }
    ],
    voterStats: {
      totalVoters: 1100000,
      maleVoters: 550000,
      femaleVoters: 550000,
      totalCenters: 350,
      upazilas: ['Sample Upazila 1', 'Sample Upazila 2'],
      turnout: 80.0
    }
  },
  {
    parliamentNumber: 10,
    electionDate: new Date('2014-01-29'),
    title: '10th Parliament',
    description: 'Tenth parliamentary election of Bangladesh',
    candidates: [
      {
        name: 'Sample Candidate 1',
        party: 'AL',
        symbol: 'BOAT',
        votes: 650000,
        centersCounted: 380,
        isWinner: true,
        isNearestCandidate: false,
        imageUrl: '/assets/candidate1.jpg'
      },
      {
        name: 'Sample Candidate 2',
        party: 'BNP',
        symbol: 'CAR',
        votes: 580000,
        centersCounted: 380,
        isWinner: false,
        isNearestCandidate: true,
        imageUrl: '/assets/election_logo.png'
      }
    ],
    voterStats: {
      totalVoters: 1200000,
      maleVoters: 600000,
      femaleVoters: 600000,
      totalCenters: 380,
      upazilas: ['Sample Upazila 1', 'Sample Upazila 2'],
      turnout: 80.0
    }
  },
  {
    parliamentNumber: 11,
    electionDate: new Date('2019-01-30'),
    title: '11th Parliament',
    description: 'Eleventh parliamentary election of Bangladesh',
    candidates: [
      {
        name: 'Sample Candidate 1',
        party: 'AL',
        symbol: 'BOAT',
        votes: 700000,
        centersCounted: 400,
        isWinner: true,
        isNearestCandidate: false,
        imageUrl: '/assets/candidate1.jpg'
      },
      {
        name: 'Sample Candidate 2',
        party: 'BNP',
        symbol: 'CAR',
        votes: 620000,
        centersCounted: 400,
        isWinner: false,
        isNearestCandidate: true,
        imageUrl: '/assets/election_logo.png'
      }
    ],
    voterStats: {
      totalVoters: 1300000,
      maleVoters: 650000,
      femaleVoters: 650000,
      totalCenters: 400,
      upazilas: ['Sample Upazila 1', 'Sample Upazila 2'],
      turnout: 80.0
    }
  },
  {
    parliamentNumber: 12,
    electionDate: new Date('2024-01-30'),
    title: '12th Parliament',
    description: 'Twelfth parliamentary election of Bangladesh',
    candidates: [
      {
        name: 'Sample Candidate 1',
        party: 'AL',
        symbol: 'BOAT',
        votes: 750000,
        centersCounted: 420,
        isWinner: true,
        isNearestCandidate: false,
        imageUrl: '/assets/candidate1.jpg'
      },
      {
        name: 'Sample Candidate 2',
        party: 'BNP',
        symbol: 'CAR',
        votes: 680000,
        centersCounted: 420,
        isWinner: false,
        isNearestCandidate: true,
        imageUrl: '/assets/election_logo.png'
      }
    ],
    voterStats: {
      totalVoters: 1400000,
      maleVoters: 700000,
      femaleVoters: 700000,
      totalCenters: 420,
      upazilas: ['Sample Upazila 1', 'Sample Upazila 2'],
      turnout: 80.0
    }
  }
];

export async function seedDatabase() {
  try {
    await connectDB();
    
    // Clear existing data
    await Election.deleteMany({});
    
    // Insert new data
    await Election.insertMany(electionData);
    
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}
