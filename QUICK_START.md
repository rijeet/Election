# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Set up Environment Variables

Create a `.env.local` file in the `election-nextjs` directory with your MongoDB Atlas URI:

```env
MONGODB_URI=mongodb+srv://rijeet2025_db_user:<db_password>@cluster0.iawakxl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

**Important**: Replace `<db_password>` with your actual MongoDB Atlas password!

### Step 2: Install Dependencies

```bash
cd election-nextjs
npm install
```

### Step 3: Start Development Server

```bash
npm run dev
```

### Step 4: Seed the Database

Open another terminal and run:

```bash
# Option 1: Using npm script
npm run seed

# Option 2: Using curl directly
curl -X POST http://localhost:3000/api/seed

# Option 3: Visit in browser
# Go to: http://localhost:3000/api/seed
```

### Step 5: View Your App

Open your browser and go to: `http://localhost:3000`

## 🔧 Troubleshooting

### MongoDB Connection Issues

1. **Check your password**: Make sure you've replaced `<db_password>` with your actual password
2. **Check network access**: Ensure your IP is whitelisted in MongoDB Atlas
3. **Check database user**: Verify the username `rijeet2025_db_user` exists and has proper permissions

### Database Seeding Issues

If the seed endpoint doesn't work:
1. Make sure the development server is running (`npm run dev`)
2. Check the browser console for any errors
3. Verify your MongoDB connection string is correct

### Common Errors

- **"MONGODB_URI is not defined"**: Make sure `.env.local` exists and contains the correct URI
- **"Authentication failed"**: Check your username and password
- **"Network timeout"**: Check your IP whitelist in MongoDB Atlas

## 📱 What You'll See

Once everything is set up, you'll have:
- An interactive timeline showing all 12 parliamentary elections
- Detailed election data with candidates and results
- Responsive design that works on all devices
- Smooth animations and modern UI

## 🎯 Next Steps

- Customize the election data in `src/scripts/seedData.ts`
- Modify the styling in the component files
- Add more features like search, filtering, or data visualization
- Deploy to Vercel, Netlify, or your preferred platform

## 📞 Need Help?

- Check the main README.md for detailed documentation
- Review the DEPLOYMENT.md for deployment instructions
- Open an issue on GitHub if you encounter problems

---

**Ready to go?** Just follow the 5 steps above and you'll have your election timeline running in minutes! 🎉
