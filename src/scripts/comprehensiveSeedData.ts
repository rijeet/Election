import connectDB from '@/lib/mongodb';
import Election from '@/models/Election';
import Constituency from '@/models/Constituency';

// Comprehensive election data for all 12 parliaments
const comprehensiveElectionData = [
  {
    parliamentNumber: 1,
    electionDate: new Date('1973-04-07'),
    endDate: new Date('1975-11-06'),
    title: '1st Parliament',
    description: 'First parliamentary election of Bangladesh after independence',
    candidates: [
      {
        name: 'Sheikh Mujibur Rahman',
        party: 'Awami League',
        symbol: 'BOAT',
        votes: 1200000,
        centersCounted: 300,
        isWinner: true,
        isNearestCandidate: false,
        imageUrl: '/assets/candidate1.jpg'
      },
      {
        name: 'Maulana Abdul Hamid Khan Bhashani',
        party: 'National Awami Party',
        symbol: 'SICKLE',
        votes: 800000,
        centersCounted: 300,
        isWinner: false,
        isNearestCandidate: true,
        imageUrl: '/assets/election_logo.png'
      }
    ],
    voterStats: {
      totalVoters: 2000000,
      maleVoters: 1000000,
      femaleVoters: 1000000,
      totalCenters: 300,
      upazilas: ['All Districts']
    }
  },
  {
    parliamentNumber: 2,
    electionDate: new Date('1979-04-02'),
    title: '2nd Parliament',
    description: 'Second parliamentary election under military rule',
    candidates: [
      {
        name: 'Ziaur Rahman',
        party: 'Bangladesh Nationalist Party',
        symbol: 'SHEAF OF PADDY',
        votes: 1500000,
        centersCounted: 400,
        isWinner: true,
        isNearestCandidate: false,
        imageUrl: '/assets/candidate1.jpg'
      },
      {
        name: 'General Ershad',
        party: 'Jatiya Party',
        symbol: 'PLOUGH',
        votes: 1200000,
        centersCounted: 400,
        isWinner: false,
        isNearestCandidate: true,
        imageUrl: '/assets/election_logo.png'
      }
    ],
    voterStats: {
      totalVoters: 2500000,
      maleVoters: 1250000,
      femaleVoters: 1250000,
      totalCenters: 400,
      upazilas: ['All Districts']
    }
  },
  {
    parliamentNumber: 3,
    electionDate: new Date('1986-07-10'),
    title: '3rd Parliament',
    description: 'Third parliamentary election',
    candidates: [
      {
        name: 'Hussain Muhammad Ershad',
        party: 'Jatiya Party',
        symbol: 'PLOUGH',
        votes: 1800000,
        centersCounted: 500,
        isWinner: true,
        isNearestCandidate: false,
        imageUrl: '/assets/candidate1.jpg'
      },
      {
        name: 'Sheikh Hasina',
        party: 'Awami League',
        symbol: 'BOAT',
        votes: 1600000,
        centersCounted: 500,
        isWinner: false,
        isNearestCandidate: true,
        imageUrl: '/assets/election_logo.png'
      }
    ],
    voterStats: {
      totalVoters: 3000000,
      maleVoters: 1500000,
      femaleVoters: 1500000,
      totalCenters: 500,
      upazilas: ['All Districts']
    }
  },
  {
    parliamentNumber: 4,
    electionDate: new Date('1988-04-15'),
    title: '4th Parliament',
    description: 'Fourth parliamentary election',
    candidates: [
      {
        name: 'Hussain Muhammad Ershad',
        party: 'Jatiya Party',
        symbol: 'PLOUGH',
        votes: 2000000,
        centersCounted: 600,
        isWinner: true,
        isNearestCandidate: false,
        imageUrl: '/assets/candidate1.jpg'
      },
      {
        name: 'Khaleda Zia',
        party: 'Bangladesh Nationalist Party',
        symbol: 'SHEAF OF PADDY',
        votes: 1800000,
        centersCounted: 600,
        isWinner: false,
        isNearestCandidate: true,
        imageUrl: '/assets/election_logo.png'
      }
    ],
    voterStats: {
      totalVoters: 3500000,
      maleVoters: 1750000,
      femaleVoters: 1750000,
      totalCenters: 600,
      upazilas: ['All Districts']
    }
  },
  {
    parliamentNumber: 5,
    electionDate: new Date('1991-04-05'),
    title: '5th Parliament',
    description: 'Fifth parliamentary election - return to democracy',
    candidates: [
      {
        name: 'Khaleda Zia',
        party: 'Bangladesh Nationalist Party',
        symbol: 'SHEAF OF PADDY',
        votes: 2200000,
        centersCounted: 700,
        isWinner: true,
        isNearestCandidate: false,
        imageUrl: '/assets/candidate1.jpg'
      },
      {
        name: 'Sheikh Hasina',
        party: 'Awami League',
        symbol: 'BOAT',
        votes: 2000000,
        centersCounted: 700,
        isWinner: false,
        isNearestCandidate: true,
        imageUrl: '/assets/election_logo.png'
      }
    ],
    voterStats: {
      totalVoters: 4000000,
      maleVoters: 2000000,
      femaleVoters: 2000000,
      totalCenters: 700,
      upazilas: ['All Districts']
    }
  },
  {
    parliamentNumber: 6,
    electionDate: new Date('1996-03-19'),
    title: '6th Parliament',
    description: 'Sixth parliamentary election',
    candidates: [
      {
        name: 'Sheikh Hasina',
        party: 'Awami League',
        symbol: 'BOAT',
        votes: 2500000,
        centersCounted: 800,
        isWinner: true,
        isNearestCandidate: false,
        imageUrl: '/assets/candidate1.jpg'
      },
      {
        name: 'Khaleda Zia',
        party: 'Bangladesh Nationalist Party',
        symbol: 'SHEAF OF PADDY',
        votes: 2300000,
        centersCounted: 800,
        isWinner: false,
        isNearestCandidate: true,
        imageUrl: '/assets/election_logo.png'
      }
    ],
    voterStats: {
      totalVoters: 4500000,
      maleVoters: 2250000,
      femaleVoters: 2250000,
      totalCenters: 800,
      upazilas: ['All Districts']
    }
  },
  {
    parliamentNumber: 7,
    electionDate: new Date('1996-07-14'),
    title: '7th Parliament',
    description: 'Seventh parliamentary election',
    candidates: [
      {
        name: 'Sheikh Hasina',
        party: 'Awami League',
        symbol: 'BOAT',
        votes: 2800000,
        centersCounted: 900,
        isWinner: true,
        isNearestCandidate: false,
        imageUrl: '/assets/candidate1.jpg'
      },
      {
        name: 'Khaleda Zia',
        party: 'Bangladesh Nationalist Party',
        symbol: 'SHEAF OF PADDY',
        votes: 2600000,
        centersCounted: 900,
        isWinner: false,
        isNearestCandidate: true,
        imageUrl: '/assets/election_logo.png'
      }
    ],
    voterStats: {
      totalVoters: 5000000,
      maleVoters: 2500000,
      femaleVoters: 2500000,
      totalCenters: 900,
      upazilas: ['All Districts']
    }
  },
  {
    parliamentNumber: 8,
    electionDate: new Date('2001-10-28'),
    title: '8th Parliament',
    description: 'Eighth parliamentary election',
    candidates: [
      {
        name: 'Khaleda Zia',
        party: 'Bangladesh Nationalist Party',
        symbol: 'SHEAF OF PADDY',
        votes: 3000000,
        centersCounted: 1000,
        isWinner: true,
        isNearestCandidate: false,
        imageUrl: '/assets/candidate1.jpg'
      },
      {
        name: 'Sheikh Hasina',
        party: 'Awami League',
        symbol: 'BOAT',
        votes: 2800000,
        centersCounted: 1000,
        isWinner: false,
        isNearestCandidate: true,
        imageUrl: '/assets/election_logo.png'
      }
    ],
    voterStats: {
      totalVoters: 5500000,
      maleVoters: 2750000,
      femaleVoters: 2750000,
      totalCenters: 1000,
      upazilas: ['All Districts']
    }
  },
  {
    parliamentNumber: 9,
    electionDate: new Date('2009-01-25'),
    title: '9th Parliament',
    description: 'Ninth parliamentary election',
    candidates: [
      {
        name: 'Sheikh Hasina',
        party: 'Awami League',
        symbol: 'BOAT',
        votes: 3200000,
        centersCounted: 1100,
        isWinner: true,
        isNearestCandidate: false,
        imageUrl: '/assets/candidate1.jpg'
      },
      {
        name: 'Khaleda Zia',
        party: 'Bangladesh Nationalist Party',
        symbol: 'SHEAF OF PADDY',
        votes: 3000000,
        centersCounted: 1100,
        isWinner: false,
        isNearestCandidate: true,
        imageUrl: '/assets/election_logo.png'
      }
    ],
    voterStats: {
      totalVoters: 6000000,
      maleVoters: 3000000,
      femaleVoters: 3000000,
      totalCenters: 1100,
      upazilas: ['All Districts']
    }
  },
  {
    parliamentNumber: 10,
    electionDate: new Date('2014-01-29'),
    title: '10th Parliament',
    description: 'Tenth parliamentary election',
    candidates: [
      {
        name: 'Sheikh Hasina',
        party: 'Awami League',
        symbol: 'BOAT',
        votes: 3500000,
        centersCounted: 1200,
        isWinner: true,
        isNearestCandidate: false,
        imageUrl: '/assets/candidate1.jpg'
      },
      {
        name: 'Khaleda Zia',
        party: 'Bangladesh Nationalist Party',
        symbol: 'SHEAF OF PADDY',
        votes: 3200000,
        centersCounted: 1200,
        isWinner: false,
        isNearestCandidate: true,
        imageUrl: '/assets/election_logo.png'
      }
    ],
    voterStats: {
      totalVoters: 6500000,
      maleVoters: 3250000,
      femaleVoters: 3250000,
      totalCenters: 1200,
      upazilas: ['All Districts']
    }
  },
  {
    parliamentNumber: 11,
    electionDate: new Date('2019-01-30'),
    title: '11th Parliament',
    description: 'Eleventh parliamentary election',
    candidates: [
      {
        name: 'Sheikh Hasina',
        party: 'Awami League',
        symbol: 'BOAT',
        votes: 3800000,
        centersCounted: 1300,
        isWinner: true,
        isNearestCandidate: false,
        imageUrl: '/assets/candidate1.jpg'
      },
      {
        name: 'Khaleda Zia',
        party: 'Bangladesh Nationalist Party',
        symbol: 'SHEAF OF PADDY',
        votes: 3500000,
        centersCounted: 1300,
        isWinner: false,
        isNearestCandidate: true,
        imageUrl: '/assets/election_logo.png'
      }
    ],
    voterStats: {
      totalVoters: 7000000,
      maleVoters: 3500000,
      femaleVoters: 3500000,
      totalCenters: 1300,
      upazilas: ['All Districts']
    }
  },
  {
    parliamentNumber: 12,
    electionDate: new Date('2024-01-30'),
    title: '12th Parliament',
    description: 'Twelfth parliamentary election - most recent',
    candidates: [
      {
        name: 'Sheikh Hasina',
        party: 'Awami League',
        symbol: 'BOAT',
        votes: 4000000,
        centersCounted: 1400,
        isWinner: true,
        isNearestCandidate: false,
        imageUrl: '/assets/candidate1.jpg'
      },
      {
        name: 'Dr. Kamal Hossain',
        party: 'Jatiya Oikya Front',
        symbol: 'SHEAF OF PADDY',
        votes: 3700000,
        centersCounted: 1400,
        isWinner: false,
        isNearestCandidate: true,
        imageUrl: '/assets/election_logo.png'
      }
    ],
    voterStats: {
      totalVoters: 7500000,
      maleVoters: 3750000,
      femaleVoters: 3750000,
      totalCenters: 1400,
      upazilas: ['All Districts']
    }
  }
];

// Comprehensive constituency data for all divisions
const comprehensiveConstituencyData = [
  // Dhaka Division Constituencies
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
        name: 'Dr. A K M Fazlul Haque',
        party: 'Awami League',
        symbol: 'BOAT',
        votes: 285000,
        centersCounted: 165,
        isWinner: true,
        isNearestCandidate: false,
        imageUrl: '/assets/candidate1.jpg'
      },
      {
        name: 'Mirza Abbas',
        party: 'Bangladesh Nationalist Party',
        symbol: 'SHEAF OF PADDY',
        votes: 195000,
        centersCounted: 165,
        isWinner: false,
        isNearestCandidate: true,
        imageUrl: '/assets/election_logo.png'
      }
    ],
    voterStats: {
      totalVoters: 420000,
      maleVoters: 210000,
      femaleVoters: 210000,
      totalCenters: 165,
      upazilas: ['Dhanmondi', 'Wari']
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
        name: 'Nasir Uddin Ahmed Pintu',
        party: 'Awami League',
        symbol: 'BOAT',
        votes: 320000,
        centersCounted: 180,
        isWinner: true,
        isNearestCandidate: false,
        imageUrl: '/assets/candidate1.jpg'
      },
      {
        name: 'Moudud Ahmed',
        party: 'Bangladesh Nationalist Party',
        symbol: 'SHEAF OF PADDY',
        votes: 250000,
        centersCounted: 180,
        isWinner: false,
        isNearestCandidate: true,
        imageUrl: '/assets/election_logo.png'
      }
    ],
    voterStats: {
      totalVoters: 480000,
      maleVoters: 240000,
      femaleVoters: 240000,
      totalCenters: 180,
      upazilas: ['Lalbagh', 'Kotwali']
    }
  },
  // Add more Dhaka constituencies
  ...Array.from({ length: 17 }, (_, i) => ({
    constituencyId: `Dhaka-${i + 4}`,
    division: 'Dhaka',
    district: 'Dhaka',
    parliamentNumber: 12,
    electionDate: new Date('2024-01-30'),
    candidates: [
      {
        name: `Sample Candidate ${i + 1}`,
        party: 'Awami League',
        symbol: 'BOAT',
        votes: 250000 + (i * 10000),
        centersCounted: 150 + (i * 5),
        isWinner: true,
        isNearestCandidate: false,
        imageUrl: '/assets/candidate1.jpg'
      },
      {
        name: `Opposition Candidate ${i + 1}`,
        party: 'Bangladesh Nationalist Party',
        symbol: 'SHEAF OF PADDY',
        votes: 180000 + (i * 8000),
        centersCounted: 150 + (i * 5),
        isWinner: false,
        isNearestCandidate: true,
        imageUrl: '/assets/election_logo.png'
      }
    ],
    voterStats: {
      totalVoters: 400000 + (i * 20000),
      maleVoters: 200000 + (i * 10000),
      femaleVoters: 200000 + (i * 10000),
      totalCenters: 150 + (i * 5),
      upazilas: [`Sample Upazila ${i + 1}`, `Sample Upazila ${i + 2}`]
    }
  })),
  
  // Gazipur Constituencies
  ...Array.from({ length: 5 }, (_, i) => ({
    constituencyId: `Gazipur-${i + 1}`,
    division: 'Dhaka',
    district: 'Gazipur',
    parliamentNumber: 12,
    electionDate: new Date('2024-01-30'),
    candidates: [
      {
        name: `Gazipur Candidate ${i + 1}`,
        party: 'Awami League',
        symbol: 'BOAT',
        votes: 200000 + (i * 15000),
        centersCounted: 120 + (i * 8),
        isWinner: true,
        isNearestCandidate: false,
        imageUrl: '/assets/candidate1.jpg'
      },
      {
        name: `Gazipur Opposition ${i + 1}`,
        party: 'Bangladesh Nationalist Party',
        symbol: 'SHEAF OF PADDY',
        votes: 150000 + (i * 12000),
        centersCounted: 120 + (i * 8),
        isWinner: false,
        isNearestCandidate: true,
        imageUrl: '/assets/election_logo.png'
      }
    ],
    voterStats: {
      totalVoters: 350000 + (i * 25000),
      maleVoters: 175000 + (i * 12500),
      femaleVoters: 175000 + (i * 12500),
      totalCenters: 120 + (i * 8),
      upazilas: [`Gazipur Upazila ${i + 1}`, `Gazipur Upazila ${i + 2}`]
    }
  })),

  // Narsingdi Constituencies
  ...Array.from({ length: 5 }, (_, i) => ({
    constituencyId: `Narsingdi-${i + 1}`,
    division: 'Dhaka',
    district: 'Narsingdi',
    parliamentNumber: 12,
    electionDate: new Date('2024-01-30'),
    candidates: [
      {
        name: `Narsingdi Candidate ${i + 1}`,
        party: 'Awami League',
        symbol: 'BOAT',
        votes: 180000 + (i * 12000),
        centersCounted: 100 + (i * 6),
        isWinner: true,
        isNearestCandidate: false,
        imageUrl: '/assets/candidate1.jpg'
      },
      {
        name: `Narsingdi Opposition ${i + 1}`,
        party: 'Bangladesh Nationalist Party',
        symbol: 'SHEAF OF PADDY',
        votes: 130000 + (i * 10000),
        centersCounted: 100 + (i * 6),
        isWinner: false,
        isNearestCandidate: true,
        imageUrl: '/assets/election_logo.png'
      }
    ],
    voterStats: {
      totalVoters: 300000 + (i * 20000),
      maleVoters: 150000 + (i * 10000),
      femaleVoters: 150000 + (i * 10000),
      totalCenters: 100 + (i * 6),
      upazilas: [`Narsingdi Upazila ${i + 1}`, `Narsingdi Upazila ${i + 2}`]
    }
  })),

  // Narayanganj Constituencies
  ...Array.from({ length: 5 }, (_, i) => ({
    constituencyId: `Narayanganj-${i + 1}`,
    division: 'Dhaka',
    district: 'Narayanganj',
    parliamentNumber: 12,
    electionDate: new Date('2024-01-30'),
    candidates: [
      {
        name: `Narayanganj Candidate ${i + 1}`,
        party: 'Awami League',
        symbol: 'BOAT',
        votes: 190000 + (i * 13000),
        centersCounted: 110 + (i * 7),
        isWinner: true,
        isNearestCandidate: false,
        imageUrl: '/assets/candidate1.jpg'
      },
      {
        name: `Narayanganj Opposition ${i + 1}`,
        party: 'Bangladesh Nationalist Party',
        symbol: 'SHEAF OF PADDY',
        votes: 140000 + (i * 11000),
        centersCounted: 110 + (i * 7),
        isWinner: false,
        isNearestCandidate: true,
        imageUrl: '/assets/election_logo.png'
      }
    ],
    voterStats: {
      totalVoters: 320000 + (i * 22000),
      maleVoters: 160000 + (i * 11000),
      femaleVoters: 160000 + (i * 11000),
      totalCenters: 110 + (i * 7),
      upazilas: [`Narayanganj Upazila ${i + 1}`, `Narayanganj Upazila ${i + 2}`]
    }
  })),

  // Tangail Constituencies
  ...Array.from({ length: 8 }, (_, i) => ({
    constituencyId: `Tangail-${i + 1}`,
    division: 'Dhaka',
    district: 'Tangail',
    parliamentNumber: 12,
    electionDate: new Date('2024-01-30'),
    candidates: [
      {
        name: `Tangail Candidate ${i + 1}`,
        party: 'Awami League',
        symbol: 'BOAT',
        votes: 160000 + (i * 10000),
        centersCounted: 90 + (i * 5),
        isWinner: true,
        isNearestCandidate: false,
        imageUrl: '/assets/candidate1.jpg'
      },
      {
        name: `Tangail Opposition ${i + 1}`,
        party: 'Bangladesh Nationalist Party',
        symbol: 'SHEAF OF PADDY',
        votes: 120000 + (i * 8000),
        centersCounted: 90 + (i * 5),
        isWinner: false,
        isNearestCandidate: true,
        imageUrl: '/assets/election_logo.png'
      }
    ],
    voterStats: {
      totalVoters: 280000 + (i * 18000),
      maleVoters: 140000 + (i * 9000),
      femaleVoters: 140000 + (i * 9000),
      totalCenters: 90 + (i * 5),
      upazilas: [`Tangail Upazila ${i + 1}`, `Tangail Upazila ${i + 2}`]
    }
  })),

  // Manikganj Constituencies
  ...Array.from({ length: 3 }, (_, i) => ({
    constituencyId: `Manikganj-${i + 1}`,
    division: 'Dhaka',
    district: 'Manikganj',
    parliamentNumber: 12,
    electionDate: new Date('2024-01-30'),
    candidates: [
      {
        name: `Manikganj Candidate ${i + 1}`,
        party: 'Awami League',
        symbol: 'BOAT',
        votes: 140000 + (i * 8000),
        centersCounted: 80 + (i * 4),
        isWinner: true,
        isNearestCandidate: false,
        imageUrl: '/assets/candidate1.jpg'
      },
      {
        name: `Manikganj Opposition ${i + 1}`,
        party: 'Bangladesh Nationalist Party',
        symbol: 'SHEAF OF PADDY',
        votes: 100000 + (i * 6000),
        centersCounted: 80 + (i * 4),
        isWinner: false,
        isNearestCandidate: true,
        imageUrl: '/assets/election_logo.png'
      }
    ],
    voterStats: {
      totalVoters: 240000 + (i * 15000),
      maleVoters: 120000 + (i * 7500),
      femaleVoters: 120000 + (i * 7500),
      totalCenters: 80 + (i * 4),
      upazilas: [`Manikganj Upazila ${i + 1}`, `Manikganj Upazila ${i + 2}`]
    }
  })),

  // Munshiganj Constituencies
  ...Array.from({ length: 3 }, (_, i) => ({
    constituencyId: `Munshiganj-${i + 1}`,
    division: 'Dhaka',
    district: 'Munshiganj',
    parliamentNumber: 12,
    electionDate: new Date('2024-01-30'),
    candidates: [
      {
        name: `Munshiganj Candidate ${i + 1}`,
        party: 'Awami League',
        symbol: 'BOAT',
        votes: 130000 + (i * 7000),
        centersCounted: 75 + (i * 3),
        isWinner: true,
        isNearestCandidate: false,
        imageUrl: '/assets/candidate1.jpg'
      },
      {
        name: `Munshiganj Opposition ${i + 1}`,
        party: 'Bangladesh Nationalist Party',
        symbol: 'SHEAF OF PADDY',
        votes: 95000 + (i * 5000),
        centersCounted: 75 + (i * 3),
        isWinner: false,
        isNearestCandidate: true,
        imageUrl: '/assets/election_logo.png'
      }
    ],
    voterStats: {
      totalVoters: 220000 + (i * 12000),
      maleVoters: 110000 + (i * 6000),
      femaleVoters: 110000 + (i * 6000),
      totalCenters: 75 + (i * 3),
      upazilas: [`Munshiganj Upazila ${i + 1}`, `Munshiganj Upazila ${i + 2}`]
    }
  })),

  // Kishoreganj Constituencies
  ...Array.from({ length: 6 }, (_, i) => ({
    constituencyId: `Kishoreganj-${i + 1}`,
    division: 'Dhaka',
    district: 'Kishoreganj',
    parliamentNumber: 12,
    electionDate: new Date('2024-01-30'),
    candidates: [
      {
        name: `Kishoreganj Candidate ${i + 1}`,
        party: 'Awami League',
        symbol: 'BOAT',
        votes: 150000 + (i * 9000),
        centersCounted: 85 + (i * 4),
        isWinner: true,
        isNearestCandidate: false,
        imageUrl: '/assets/candidate1.jpg'
      },
      {
        name: `Kishoreganj Opposition ${i + 1}`,
        party: 'Bangladesh Nationalist Party',
        symbol: 'SHEAF OF PADDY',
        votes: 110000 + (i * 7000),
        centersCounted: 85 + (i * 4),
        isWinner: false,
        isNearestCandidate: true,
        imageUrl: '/assets/election_logo.png'
      }
    ],
    voterStats: {
      totalVoters: 260000 + (i * 16000),
      maleVoters: 130000 + (i * 8000),
      femaleVoters: 130000 + (i * 8000),
      totalCenters: 85 + (i * 4),
      upazilas: [`Kishoreganj Upazila ${i + 1}`, `Kishoreganj Upazila ${i + 2}`]
    }
  })),

  // Shariatpur Constituencies
  ...Array.from({ length: 3 }, (_, i) => ({
    constituencyId: `Shariatpur-${i + 1}`,
    division: 'Dhaka',
    district: 'Shariatpur',
    parliamentNumber: 12,
    electionDate: new Date('2024-01-30'),
    candidates: [
      {
        name: `Shariatpur Candidate ${i + 1}`,
        party: 'Awami League',
        symbol: 'BOAT',
        votes: 120000 + (i * 6000),
        centersCounted: 70 + (i * 3),
        isWinner: true,
        isNearestCandidate: false,
        imageUrl: '/assets/candidate1.jpg'
      },
      {
        name: `Shariatpur Opposition ${i + 1}`,
        party: 'Bangladesh Nationalist Party',
        symbol: 'SHEAF OF PADDY',
        votes: 85000 + (i * 4000),
        centersCounted: 70 + (i * 3),
        isWinner: false,
        isNearestCandidate: true,
        imageUrl: '/assets/election_logo.png'
      }
    ],
    voterStats: {
      totalVoters: 200000 + (i * 10000),
      maleVoters: 100000 + (i * 5000),
      femaleVoters: 100000 + (i * 5000),
      totalCenters: 70 + (i * 3),
      upazilas: [`Shariatpur Upazila ${i + 1}`, `Shariatpur Upazila ${i + 2}`]
    }
  })),

  // Rajbari Constituencies
  ...Array.from({ length: 2 }, (_, i) => ({
    constituencyId: `Rajbari-${i + 1}`,
    division: 'Dhaka',
    district: 'Rajbari',
    parliamentNumber: 12,
    electionDate: new Date('2024-01-30'),
    candidates: [
      {
        name: `Rajbari Candidate ${i + 1}`,
        party: 'Awami League',
        symbol: 'BOAT',
        votes: 110000 + (i * 5000),
        centersCounted: 65 + (i * 2),
        isWinner: true,
        isNearestCandidate: false,
        imageUrl: '/assets/candidate1.jpg'
      },
      {
        name: `Rajbari Opposition ${i + 1}`,
        party: 'Bangladesh Nationalist Party',
        symbol: 'SHEAF OF PADDY',
        votes: 80000 + (i * 3000),
        centersCounted: 65 + (i * 2),
        isWinner: false,
        isNearestCandidate: true,
        imageUrl: '/assets/election_logo.png'
      }
    ],
    voterStats: {
      totalVoters: 180000 + (i * 8000),
      maleVoters: 90000 + (i * 4000),
      femaleVoters: 90000 + (i * 4000),
      totalCenters: 65 + (i * 2),
      upazilas: [`Rajbari Upazila ${i + 1}`, `Rajbari Upazila ${i + 2}`]
    }
  })),

  // Faridpur Constituencies
  ...Array.from({ length: 4 }, (_, i) => ({
    constituencyId: `Faridpur-${i + 1}`,
    division: 'Dhaka',
    district: 'Faridpur',
    parliamentNumber: 12,
    electionDate: new Date('2024-01-30'),
    candidates: [
      {
        name: `Faridpur Candidate ${i + 1}`,
        party: 'Awami League',
        symbol: 'BOAT',
        votes: 140000 + (i * 8000),
        centersCounted: 80 + (i * 4),
        isWinner: true,
        isNearestCandidate: false,
        imageUrl: '/assets/candidate1.jpg'
      },
      {
        name: `Faridpur Opposition ${i + 1}`,
        party: 'Bangladesh Nationalist Party',
        symbol: 'SHEAF OF PADDY',
        votes: 100000 + (i * 6000),
        centersCounted: 80 + (i * 4),
        isWinner: false,
        isNearestCandidate: true,
        imageUrl: '/assets/election_logo.png'
      }
    ],
    voterStats: {
      totalVoters: 240000 + (i * 15000),
      maleVoters: 120000 + (i * 7500),
      femaleVoters: 120000 + (i * 7500),
      totalCenters: 80 + (i * 4),
      upazilas: [`Faridpur Upazila ${i + 1}`, `Faridpur Upazila ${i + 2}`]
    }
  })),

  // Gopalganj Constituencies
  ...Array.from({ length: 3 }, (_, i) => ({
    constituencyId: `Gopalganj-${i + 1}`,
    division: 'Dhaka',
    district: 'Gopalganj',
    parliamentNumber: 12,
    electionDate: new Date('2024-01-30'),
    candidates: [
      {
        name: `Gopalganj Candidate ${i + 1}`,
        party: 'Awami League',
        symbol: 'BOAT',
        votes: 130000 + (i * 7000),
        centersCounted: 75 + (i * 3),
        isWinner: true,
        isNearestCandidate: false,
        imageUrl: '/assets/candidate1.jpg'
      },
      {
        name: `Gopalganj Opposition ${i + 1}`,
        party: 'Bangladesh Nationalist Party',
        symbol: 'SHEAF OF PADDY',
        votes: 95000 + (i * 5000),
        centersCounted: 75 + (i * 3),
        isWinner: false,
        isNearestCandidate: true,
        imageUrl: '/assets/election_logo.png'
      }
    ],
    voterStats: {
      totalVoters: 220000 + (i * 12000),
      maleVoters: 110000 + (i * 6000),
      femaleVoters: 110000 + (i * 6000),
      totalCenters: 75 + (i * 3),
      upazilas: [`Gopalganj Upazila ${i + 1}`, `Gopalganj Upazila ${i + 2}`]
    }
  })),

  // Madaripur Constituencies
  ...Array.from({ length: 2 }, (_, i) => ({
    constituencyId: `Madaripur-${i + 1}`,
    division: 'Dhaka',
    district: 'Madaripur',
    parliamentNumber: 12,
    electionDate: new Date('2024-01-30'),
    candidates: [
      {
        name: `Madaripur Candidate ${i + 1}`,
        party: 'Awami League',
        symbol: 'BOAT',
        votes: 120000 + (i * 6000),
        centersCounted: 70 + (i * 3),
        isWinner: true,
        isNearestCandidate: false,
        imageUrl: '/assets/candidate1.jpg'
      },
      {
        name: `Madaripur Opposition ${i + 1}`,
        party: 'Bangladesh Nationalist Party',
        symbol: 'SHEAF OF PADDY',
        votes: 85000 + (i * 4000),
        centersCounted: 70 + (i * 3),
        isWinner: false,
        isNearestCandidate: true,
        imageUrl: '/assets/election_logo.png'
      }
    ],
    voterStats: {
      totalVoters: 200000 + (i * 10000),
      maleVoters: 100000 + (i * 5000),
      femaleVoters: 100000 + (i * 5000),
      totalCenters: 70 + (i * 3),
      upazilas: [`Madaripur Upazila ${i + 1}`, `Madaripur Upazila ${i + 2}`]
    }
  }))
];

export async function seedComprehensiveData() {
  try {
    await connectDB();
    
    console.log('🗑️ Clearing existing data...');
    await Election.deleteMany({});
    await Constituency.deleteMany({});
    
    console.log('📊 Seeding election data...');
    await Election.insertMany(comprehensiveElectionData);
    
    console.log('🏛️ Seeding constituency data...');
    await Constituency.insertMany(comprehensiveConstituencyData);
    
    console.log('✅ Comprehensive database seeded successfully!');
    console.log(`📈 Elections: ${comprehensiveElectionData.length}`);
    console.log(`🏛️ Constituencies: ${comprehensiveConstituencyData.length}`);
  } catch (error) {
    console.error('❌ Error seeding comprehensive database:', error);
    throw error;
  }
}
