# Bangladesh Election Timeline - Next.js

A modern, responsive web application showcasing Bangladesh's parliamentary election history from 1973 to 2024. Built with Next.js, MongoDB, and Tailwind CSS.

## Features

- **Interactive Timeline**: Navigate through 12 parliamentary elections with smooth animations
- **Detailed Election Data**: View candidates, results, and voter statistics for each election
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Modern UI**: Clean, intuitive interface with Tailwind CSS styling
- **Database Integration**: MongoDB for storing and managing election data
- **TypeScript**: Full type safety throughout the application

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: MongoDB with Mongoose ODM
- **Deployment**: Vercel (recommended)

## Prerequisites

- Node.js 18+ 
- MongoDB (local or cloud instance)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd election-nextjs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/election-db
   ```
   
   For MongoDB Atlas (cloud), use:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/election-db
   ```

4. **Set up MongoDB**
   - **Local MongoDB**: Install and start MongoDB locally
   - **MongoDB Atlas**: Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas)

5. **Seed the database**
   ```bash
   # Start the development server
   npm run dev
   
   # In another terminal, seed the database
   curl -X POST http://localhost:3000/api/seed
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
election-nextjs/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── elections/     # Election data endpoints
│   │   │   └── seed/          # Database seeding endpoint
│   │   └── page.tsx           # Home page
│   ├── components/            # React components
│   │   ├── Timeline.tsx       # Interactive timeline component
│   │   ├── ElectionDetails.tsx # Election data display
│   │   ├── Header.tsx         # Site header
│   │   └── Navigation.tsx     # Navigation menu
│   ├── lib/                   # Utility functions
│   │   └── mongodb.ts         # Database connection
│   ├── models/                # MongoDB models
│   │   └── Election.ts        # Election data schema
│   ├── scripts/               # Database scripts
│   │   └── seedData.ts        # Sample data
│   └── types/                 # TypeScript type definitions
│       └── global.d.ts        # Global type declarations
├── public/
│   └── assets/                # Static assets
│       ├── election_logo.png  # Bangladesh election logo
│       └── fast-forward.png   # Timeline navigation icon
└── README.md
```

## API Endpoints

- `GET /api/elections` - Fetch all elections
- `GET /api/elections/[id]` - Fetch specific election by parliament number
- `POST /api/elections` - Create new election (admin)
- `POST /api/seed` - Seed database with sample data

## Data Model

### Election Schema
```typescript
interface IElection {
  parliamentNumber: number;
  electionDate: Date;
  endDate?: Date;
  title: string;
  description?: string;
  candidates: ICandidate[];
  voterStats: IVoterStats;
}

interface ICandidate {
  name: string;
  party: string;
  symbol: string;
  votes: number;
  centersCounted: number;
  isWinner: boolean;
  isNearestCandidate: boolean;
  imageUrl?: string;
}

interface IVoterStats {
  totalVoters: number;
  maleVoters: number;
  femaleVoters: number;
  totalCenters: number;
  upazilas: string[];
}
```

## Customization

### Adding New Elections
1. Update the `electionData` array in `src/scripts/seedData.ts`
2. Run the seed endpoint: `POST /api/seed`

### Styling
- Modify Tailwind classes in component files
- Update the color scheme in `tailwind.config.js`
- Add custom CSS in `src/app/globals.css`

### Timeline Navigation
- Customize timeline behavior in `src/components/Timeline.tsx`
- Modify animation durations and transitions
- Add keyboard navigation support

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
- **Netlify**: Use `npm run build` and deploy the `out` folder
- **Railway**: Connect your GitHub repository
- **DigitalOcean**: Use App Platform

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Data sourced from Bangladesh Election Commission
- Timeline design inspired by modern web standards
- Built with love for Bangladesh's democratic history

## Support

For questions or support, please open an issue on GitHub or contact the development team.

---

**Note**: This application is for educational and informational purposes. Election data should be verified with official sources.