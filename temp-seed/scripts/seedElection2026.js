"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Party2026_1 = __importDefault(require("../models/Party2026"));
const Candidate2026_1 = __importDefault(require("../models/Candidate2026"));
const InfoCandidate_1 = __importDefault(require("../models/InfoCandidate"));
const MONGODB_URI = 'mongodb+srv://rijeet2025_db_user:12345@cluster0.mdntgtd.mongodb.net/new-election-db?retryWrites=true&w=majority&appName=Cluster0';
async function seedElection2026() {
    try {
        // Connect directly to MongoDB
        await mongoose_1.default.connect(MONGODB_URI);
        console.log('Connected to MongoDB');
        // Fetch all candidates from info_candidate collection
        console.log('Fetching candidates from info_candidate collection...');
        const allCandidates = await InfoCandidate_1.default.find({}).limit(100); // Limit to first 100 for testing
        if (allCandidates.length === 0) {
            console.log('⚠️  No candidates found in info_candidate collection.');
            console.log('Please seed info_candidate collection first.');
            process.exit(1);
        }
        console.log(`Found ${allCandidates.length} candidates in info_candidate`);
        // Extract unique parties from candidates
        const uniqueParties = new Map();
        for (const candidate of allCandidates) {
            const partyName = candidate.party || 'Independent';
            if (!uniqueParties.has(partyName)) {
                uniqueParties.set(partyName, {
                    name: partyName,
                    candidates: []
                });
            }
            uniqueParties.get(partyName).candidates.push(candidate);
        }
        console.log(`\nFound ${uniqueParties.size} unique parties`);
        // Create Party2026 entries from unique parties
        console.log('\nSeeding parties...');
        const partyMap = new Map(); // party name -> party_ref
        for (const [partyName, partyData] of uniqueParties.entries()) {
            // Get leader from first candidate (or use party name as fallback)
            const leader = partyData.candidates[0]?.candidate_name || partyName;
            // Create party abbreviation (first 2-3 letters)
            const abbreviation = partyName
                .split(' ')
                .map(word => word[0])
                .join('')
                .toUpperCase()
                .substring(0, 3);
            const partyRef = `party-${partyName.toLowerCase().replace(/\s+/g, '-')}`;
            partyMap.set(partyName, partyRef);
            const existingParty = await Party2026_1.default.findOne({ 'party.name': partyName });
            if (!existingParty) {
                const partyDoc = await Party2026_1.default.create({
                    party: {
                        name: partyName,
                        abbreviation: abbreviation,
                        leader: leader,
                        symbol: {
                            name: abbreviation,
                            image_url: `https://example.com/symbols/${abbreviation.toLowerCase()}.png`
                        }
                    },
                    alliance: {
                        name: partyName.includes('Awami') ? 'Grand Alliance' :
                            partyName.includes('Nationalist') ? '20-Party Alliance' : 'Independent',
                        type: 'Coalition',
                        member_parties: [partyName]
                    },
                    manifesto: {
                        election_year: 2026,
                        highlights: [
                            `${partyName} Manifesto Point 1`,
                            `${partyName} Manifesto Point 2`,
                            `${partyName} Manifesto Point 3`
                        ],
                        full_document_url: `https://example.com/manifestos/${partyRef}.pdf`
                    }
                });
                console.log(`✓ Created party: ${partyName} (${abbreviation})`);
            }
            else {
                console.log(`- Party already exists: ${partyName}`);
            }
        }
        // Group candidates by constituency
        const constituenciesMap = new Map();
        for (const candidate of allCandidates) {
            const constituencyId = candidate.constituency || 'Unknown-1';
            const division = candidate.division || 'Unknown';
            const district = candidate.district || 'Unknown';
            if (!constituenciesMap.has(constituencyId)) {
                constituenciesMap.set(constituencyId, {
                    division: division,
                    district: district,
                    constituency_id: constituencyId,
                    candidates: []
                });
            }
            constituenciesMap.get(constituencyId).candidates.push(candidate);
        }
        console.log(`\nFound ${constituenciesMap.size} unique constituencies`);
        // Create Candidate2026 entries
        console.log('\nSeeding constituencies with candidates...');
        let createdCount = 0;
        let updatedCount = 0;
        for (const [constituencyId, constituencyData] of constituenciesMap.entries()) {
            const candidateList = constituencyData.candidates.map((candidate) => {
                const partyName = candidate.party || 'Independent';
                const partyRef = partyMap.get(partyName) || `party-${partyName.toLowerCase().replace(/\s+/g, '-')}`;
                // Get party info for symbol image
                const partyInfo = uniqueParties.get(partyName);
                const partySymbolImg = partyInfo
                    ? `https://example.com/symbols/${partyName.split(' ').map((w) => w[0]).join('').toLowerCase()}.png`
                    : 'https://example.com/symbols/default.png';
                return {
                    candidate_name: candidate.candidate_name,
                    candidate_ref: candidate.id, // Link to info_candidate.id
                    candidate_img: candidate.media?.img_url || '/placeholder-candidate.jpg',
                    party_name: partyName,
                    party_ref: partyRef,
                    party_symbol_img: partySymbolImg,
                    popularity_vote: 0,
                    electoral_vote: 0
                };
            });
            const existingConstituency = await Candidate2026_1.default.findOne({
                constituency_id: constituencyId
            });
            if (!existingConstituency) {
                await Candidate2026_1.default.create({
                    division: constituencyData.division,
                    district: constituencyData.district,
                    constituency_id: constituencyId,
                    election_date: new Date('2026-01-07'),
                    candidate_list: candidateList
                });
                console.log(`✓ Created constituency: ${constituencyId} (${candidateList.length} candidates)`);
                createdCount++;
            }
            else {
                // Update existing constituency with new candidates
                existingConstituency.candidate_list = candidateList;
                existingConstituency.division = constituencyData.division;
                existingConstituency.district = constituencyData.district;
                await existingConstituency.save();
                console.log(`↻ Updated constituency: ${constituencyId} (${candidateList.length} candidates)`);
                updatedCount++;
            }
        }
        console.log('\n📊 Summary:');
        console.log(`   Parties: ${uniqueParties.size}`);
        console.log(`   Constituencies: ${constituenciesMap.size}`);
        console.log(`   Created: ${createdCount}`);
        console.log(`   Updated: ${updatedCount}`);
        console.log(`   Total Candidates: ${allCandidates.length}`);
        console.log('\n✅ Seed data completed successfully!');
        console.log('\n💡 You can now:');
        console.log('   - Visit http://localhost:3000/election2026');
        console.log('   - Click on candidate names to see info_candidate details');
        console.log('   - Click on party names to see party2026 details');
        console.log('   - Test voting functionality');
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Error seeding data:', error);
        process.exit(1);
    }
}
// Run if called directly
if (require.main === module) {
    seedElection2026();
}
exports.default = seedElection2026;
