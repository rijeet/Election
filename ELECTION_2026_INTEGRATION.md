# Election 2026 Data Module - Integration Instructions

## 📋 Overview

This document provides step-by-step instructions for integrating the Election 2026 Data Module into your Next.js application.

## 🗂️ Project Structure

```
src/
├── models/
│   ├── Party2026.ts              # Party schema
│   ├── Candidate2026.ts          # Candidate/Constituency schema
│   └── FingerprintLog.ts         # Vote tracking schema
├── app/
│   ├── api/
│   │   ├── party2026/
│   │   │   ├── route.ts          # GET all, POST create
│   │   │   └── [name]/route.ts  # GET by name
│   │   ├── candidate2026/
│   │   │   └── route.ts         # GET with filters, POST create
│   │   └── popularity-vote/
│   │       └── route.ts          # POST vote, GET check status
│   └── election2026/
│       └── page.tsx              # Main frontend component
├── components/
│   └── ConstituencyMap.tsx      # SVG map component
└── scripts/
    └── seedElection2026.ts      # Seed data script
```

## 🚀 Setup Instructions

### 1. Environment Variables

Ensure your `.env.local` file has MongoDB connection string:

```env
MONGODB_URI=mongodb://localhost:27017/election-db
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/election-db
```

### 2. Install Dependencies

All required dependencies should already be installed:
- `mongoose` - MongoDB ODM
- `@fingerprintjs/fingerprintjs` - Browser fingerprinting
- `react-hot-toast` - Toast notifications
- `tailwindcss` - Styling

### 3. Seed Database

Run the seed script to populate sample data:

```bash
# Using ts-node
npx ts-node src/scripts/seedElection2026.ts

# OR add to package.json scripts:
# "seed:election2026": "ts-node src/scripts/seedElection2026.ts"
npm run seed:election2026
```

### 4. Access the Module

Navigate to: `http://localhost:3000/election2026`

## 📡 API Endpoints

### Party2026 Endpoints

#### GET `/api/party2026`
Get all parties or filter by query params:
- `?name=PartyName` - Get specific party
- `?alliance=AllianceName` - Get parties by alliance

**Response:**
```json
[
  {
    "_id": "...",
    "party": {
      "name": "Bangladesh Awami League",
      "abbreviation": "AL",
      "leader": "Sheikh Hasina",
      "symbol": {
        "name": "Boat",
        "image_url": "..."
      }
    },
    "alliance": { ... },
    "manifesto": { ... }
  }
]
```

#### POST `/api/party2026`
Create a new party.

**Request Body:**
```json
{
  "party": {
    "name": "Party Name",
    "abbreviation": "PN",
    "leader": "Leader Name",
    "symbol": {
      "name": "Symbol Name",
      "image_url": "https://..."
    }
  },
  "alliance": {
    "name": "Alliance Name",
    "type": "Coalition",
    "member_parties": ["Party1", "Party2"]
  },
  "manifesto": {
    "election_year": 2026,
    "highlights": ["Highlight 1", "Highlight 2"],
    "full_document_url": "https://..."
  }
}
```

### Candidate2026 Endpoints

#### GET `/api/candidate2026`
Get constituencies with optional filters:
- `?constituency=Dhaka-1` - Get specific constituency
- `?party=PartyName` - Filter by party
- `?division=Dhaka` - Filter by division
- `?district=Dhaka` - Filter by district

**Response:**
```json
[
  {
    "_id": "...",
    "division": "Dhaka",
    "district": "Dhaka",
    "constituency_id": "Dhaka-1",
    "election_date": "2026-01-07T00:00:00.000Z",
    "candidate_list": [
      {
        "candidate_name": "Candidate Name",
        "candidate_ref": "candidate-001",
        "candidate_img": "https://...",
        "party_name": "Party Name",
        "party_ref": "party-ref",
        "party_symbol_img": "https://...",
        "popularity_vote": 0,
        "electoral_vote": 0,
        "party_info": { ... }
      }
    ]
  }
]
```

#### POST `/api/candidate2026`
Create a new constituency.

**Request Body:**
```json
{
  "division": "Dhaka",
  "district": "Dhaka",
  "constituency_id": "Dhaka-1",
  "election_date": "2026-01-07",
  "candidate_list": [
    {
      "candidate_name": "Candidate Name",
      "candidate_ref": "candidate-ref",
      "candidate_img": "https://...",
      "party_name": "Party Name",
      "party_ref": "party-ref",
      "party_symbol_img": "https://...",
      "popularity_vote": 0,
      "electoral_vote": 0
    }
  ]
}
```

### Popularity Vote Endpoints

#### POST `/api/popularity-vote`
Record a popularity vote.

**Request Body:**
```json
{
  "fp": "fingerprint-value",
  "candidate_name": "Candidate Name",
  "constituency_id": "Dhaka-1"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Vote recorded successfully",
  "popularity_vote": 1
}
```

#### GET `/api/popularity-vote?fp=xxx&candidate_name=xxx`
Check if user has voted for a candidate.

**Response:**
```json
{
  "hasVoted": true
}
```

## 🎨 Frontend Components

### Election2026 Component

Located at: `src/app/election2026/page.tsx`

**Features:**
- 4-level filter system (Division → District → Constituency → Party)
- Candidate View and Party View toggle
- Candidate cards with vote buttons
- Responsive grid layout (1-col mobile, 3-col desktop)
- Fingerprint-based vote tracking

### ConstituencyMap Component

Located at: `src/components/ConstituencyMap.tsx`

**Props:**
- `selectedConstituencyId?: string` - Highlight selected constituency
- `onConstituencySelect?: (id: string) => void` - Callback on click
- `className?: string` - Additional CSS classes

**Features:**
- Interactive SVG map
- Hover highlighting
- Click to select constituency
- Green theme for selected areas

## 🎨 Tailwind Theme Colors

The following colors are available in Tailwind:

- `election-green`: `#1FA757`
- `election-red`: `#D62828`

**Usage:**
```tsx
<div className="bg-election-green text-white">
  Green Background
</div>
<div className="text-election-red">
  Red Text
</div>
```

## 🔗 Data Relations

### Candidate → Info Candidate

The `candidate_ref` field in `Candidate2026.candidate_list` links to the `info_candidate` collection:

```typescript
// Example aggregation
const candidateWithInfo = await Candidate2026.aggregate([
  {
    $unwind: '$candidate_list'
  },
  {
    $lookup: {
      from: 'info_candidate',
      localField: 'candidate_list.candidate_ref',
      foreignField: 'id',
      as: 'candidate_info'
    }
  }
]);
```

### Candidate → Party2026

The `party_ref` field links to `party2026` collection. The API automatically joins this data in the response.

## 🔒 Vote Security

- **Fingerprint-based**: Uses FingerprintJS to generate unique browser fingerprints
- **One vote per candidate**: Enforced via unique index on `fingerprint_log` collection
- **Duplicate prevention**: Database-level constraint prevents duplicate votes

## 📝 Adding to Homepage

To add a link to the Election 2026 module in your homepage:

```tsx
// In src/app/page.tsx or your navigation component
<Link href="/election2026" className="...">
  Election 2026
</Link>
```

## 🧪 Testing

1. **Test Filters:**
   - Select Division → District → Constituency
   - Verify candidates load correctly
   - Test Party filter

2. **Test Voting:**
   - Click "+1 Vote" button
   - Verify vote is recorded
   - Verify button becomes disabled
   - Refresh page and verify vote persists

3. **Test Map:**
   - Click on map constituencies
   - Verify constituency data loads
   - Test hover effects

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Verify `MONGODB_URI` in `.env.local`
- Check MongoDB service is running
- Verify network connectivity for Atlas

### Fingerprint Not Working
- Ensure FingerprintJS is properly initialized
- Check browser console for errors
- Verify `useFingerprint` hook is working

### Map Not Displaying
- Verify `bangladeshMapData.ts` is imported correctly
- Check SVG viewBox settings
- Verify Tailwind classes are applied

## 📚 Additional Resources

- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [FingerprintJS Documentation](https://dev.fingerprintjs.com/)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)

## ✅ Checklist

- [x] MongoDB schemas created
- [x] API routes implemented
- [x] Frontend components created
- [x] Tailwind theme configured
- [x] Seed data script ready
- [x] Integration documentation complete

---

**Route:** `http://localhost:3000/election2026`

**Last Updated:** 2024

