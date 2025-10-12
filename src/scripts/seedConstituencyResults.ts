import connectDB from '@/lib/mongodb';
import ConstituencyResult from '@/models/ConstituencyResult';

const constituencyResultsData = [
  // 1st Parliament (1973)
  {
    constituency_number: 1,
    constituency_name: "Bhola-4",
    party: "Bangladesh Awami League",
    candidate: "Sheikh Mujibur Rahman",
    total_voters: 1200000,
    parliament: 1,
    color: "#BCFBE2",
    votes: 1200000,
    isWinner: true
  },
  {
    constituency_number: 2,
    constituency_name: "Lakshmipur-4", 
    party: "Bangladesh Nationalist Party",
    candidate: "Maulana Abdul Hamid Khan Bhashani",
    total_voters: 800000,
    parliament: 1,
    color: "#F2B5FB",
    votes: 800000,
    isWinner: false
  },
  {
    constituency_number: 3,
    constituency_name: "Patuakhali-3",
    party: "Bangladesh Awami League", 
    candidate: "Bir Bahadur",
    total_voters: 174359,
    parliament: 1,
    color: "#BCFBE2",
    votes: 174359,
    isWinner: true
  },
  {
    constituency_number: 4,
    constituency_name: "Patuakhali-4",
    party: "Bangladesh Awami League",
    candidate: "Tajuddin Ahmad",
    total_voters: 250000,
    parliament: 1,
    color: "#BCFBE2",
    votes: 250000,
    isWinner: true
  },
  {
    constituency_number: 5,
    constituency_name: "Barisal-4",
    party: "Bangladesh Awami League",
    candidate: "M. A. Hannan",
    total_voters: 300000,
    parliament: 1,
    color: "#BCFBE2",
    votes: 300000,
    isWinner: true
  },

  // 9th Parliament (2008) - Different results
  {
    constituency_number: 1,
    constituency_name: "Bhola-4",
    party: "Bangladesh Awami League",
    candidate: "Salman Fazlur Rahman",
    total_voters: 440287,
    parliament: 9,
    color: "#BCFBE2",
    votes: 102991,
    isWinner: true
  },
  {
    constituency_number: 2,
    constituency_name: "Lakshmipur-4",
    party: "Independent",
    candidate: "Salma Islam",
    total_voters: 440287,
    parliament: 9,
    color: "#FED7AA",
    votes: 70204,
    isWinner: false
  },
  {
    constituency_number: 3,
    constituency_name: "Patuakhali-3",
    party: "Bangladesh Awami League",
    candidate: "Bir Bahadur",
    total_voters: 174359,
    parliament: 9,
    color: "#BCFBE2",
    votes: 120000,
    isWinner: true
  },
  {
    constituency_number: 4,
    constituency_name: "Patuakhali-4",
    party: "Bangladesh Nationalist Party",
    candidate: "Khaleda Zia",
    total_voters: 250000,
    parliament: 9,
    color: "#F2B5FB",
    votes: 180000,
    isWinner: true
  },
  {
    constituency_number: 5,
    constituency_name: "Barisal-4",
    party: "Bangladesh Awami League",
    candidate: "A. B. M. Mohiuddin Chowdhury",
    total_voters: 300000,
    parliament: 9,
    color: "#BCFBE2",
    votes: 220000,
    isWinner: true
  },

  // 12th Parliament (2024) - Latest results
  {
    constituency_number: 1,
    constituency_name: "Bhola-4",
    party: "Bangladesh Awami League",
    candidate: "Salman Fazlur Rahman",
    total_voters: 500000,
    parliament: 12,
    color: "#BCFBE2",
    votes: 350000,
    isWinner: true
  },
  {
    constituency_number: 2,
    constituency_name: "Lakshmipur-4",
    party: "Bangladesh Nationalist Party",
    candidate: "Rizvi Ahmed",
    total_voters: 450000,
    parliament: 12,
    color: "#F2B5FB",
    votes: 200000,
    isWinner: false
  },
  {
    constituency_number: 3,
    constituency_name: "Patuakhali-3",
    party: "Bangladesh Awami League",
    candidate: "Bir Bahadur",
    total_voters: 200000,
    parliament: 12,
    color: "#BCFBE2",
    votes: 150000,
    isWinner: true
  },
  {
    constituency_number: 4,
    constituency_name: "Patuakhali-4",
    party: "Bangladesh Awami League",
    candidate: "Hossain Zillur Rahman",
    total_voters: 300000,
    parliament: 12,
    color: "#BCFBE2",
    votes: 250000,
    isWinner: true
  },
  {
    constituency_number: 5,
    constituency_name: "Barisal-4",
    party: "Bangladesh Awami League",
    candidate: "A. B. M. Mohiuddin Chowdhury",
    total_voters: 350000,
    parliament: 12,
    color: "#BCFBE2",
    votes: 300000,
    isWinner: true
  }
];

export async function seedConstituencyResults() {
  try {
    await connectDB();
    
    // Clear existing data
    await ConstituencyResult.deleteMany({});
    
    // Insert new data
    await ConstituencyResult.insertMany(constituencyResultsData);
    
    console.log('Constituency results seeded successfully!');
    return { success: true, count: constituencyResultsData.length };
  } catch (error) {
    console.error('Error seeding constituency results:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  seedConstituencyResults()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
