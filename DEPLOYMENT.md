# Deployment Guide

This guide covers deploying the Bangladesh Election Timeline application to various platforms.

## Vercel (Recommended)

Vercel is the easiest way to deploy Next.js applications.

### Steps:

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your repository

3. **Configure Environment Variables**
   - In Vercel dashboard, go to Settings → Environment Variables
   - Add: `MONGODB_URI` with your MongoDB connection string
   - For MongoDB Atlas: `mongodb+srv://username:password@cluster.mongodb.net/election-db`

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy your app

5. **Seed Database**
   - After deployment, visit: `https://your-app.vercel.app/api/seed`
   - This will populate your database with sample data

## MongoDB Atlas Setup

For production, use MongoDB Atlas (free tier available):

1. **Create Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for free account

2. **Create Cluster**
   - Click "Build a Database"
   - Choose "FREE" tier
   - Select region closest to your users
   - Create cluster

3. **Configure Access**
   - Go to "Database Access"
   - Add new database user
   - Set username/password
   - Give "Atlas admin" privileges

4. **Whitelist IPs**
   - Go to "Network Access"
   - Add IP address (0.0.0.0/0 for all IPs)
   - Or add specific IPs for security

5. **Get Connection String**
   - Go to "Database"
   - Click "Connect"
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` with your user password

## Alternative Platforms

### Netlify

1. **Build the app**
   ```bash
   npm run build
   npm run export
   ```

2. **Deploy to Netlify**
   - Drag and drop the `out` folder to Netlify
   - Or connect GitHub repository

3. **Configure Environment Variables**
   - Go to Site settings → Environment variables
   - Add `MONGODB_URI`

### Railway

1. **Connect Repository**
   - Go to [railway.app](https://railway.app)
   - Connect your GitHub repository

2. **Add MongoDB**
   - Add MongoDB service
   - Copy connection string

3. **Configure Environment**
   - Add `MONGODB_URI` environment variable
   - Deploy automatically

### DigitalOcean App Platform

1. **Create App**
   - Go to DigitalOcean App Platform
   - Create new app from GitHub

2. **Configure**
   - Select Node.js
   - Add environment variables
   - Deploy

## Environment Variables

Required environment variables:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/election-db
```

Optional variables:
```env
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## Database Seeding

After deployment, seed your database:

```bash
# Using curl
curl -X POST https://your-app.vercel.app/api/seed

# Or visit in browser
https://your-app.vercel.app/api/seed
```

## Custom Domain

### Vercel
1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

### Other Platforms
- Follow platform-specific domain configuration
- Update DNS records to point to your app

## Performance Optimization

1. **Enable Compression**
   - Vercel: Automatic
   - Others: Configure gzip/brotli

2. **CDN**
   - Vercel: Automatic global CDN
   - Others: Use CloudFlare or similar

3. **Image Optimization**
   - Use Next.js Image component
   - Optimize images before upload

4. **Database Indexing**
   ```javascript
   // Add indexes for better performance
   db.elections.createIndex({ "parliamentNumber": 1 })
   db.elections.createIndex({ "electionDate": 1 })
   ```

## Monitoring

1. **Vercel Analytics**
   - Enable in Vercel dashboard
   - Monitor performance and usage

2. **MongoDB Atlas Monitoring**
   - Monitor database performance
   - Set up alerts for issues

3. **Error Tracking**
   - Consider Sentry for error monitoring
   - Log important events

## Security

1. **Environment Variables**
   - Never commit `.env.local` to git
   - Use strong MongoDB passwords
   - Rotate credentials regularly

2. **Database Security**
   - Enable MongoDB Atlas security features
   - Use IP whitelisting
   - Enable encryption at rest

3. **API Security**
   - Add rate limiting
   - Validate input data
   - Use HTTPS only

## Troubleshooting

### Common Issues:

1. **Build Failures**
   - Check TypeScript errors
   - Verify all dependencies installed
   - Check environment variables

2. **Database Connection Issues**
   - Verify MongoDB URI format
   - Check network access settings
   - Ensure database user has correct permissions

3. **Deployment Issues**
   - Check build logs
   - Verify environment variables
   - Check platform-specific requirements

### Getting Help:

- Check platform documentation
- Review Next.js deployment guide
- Check MongoDB Atlas documentation
- Open GitHub issue for app-specific problems

## Cost Estimation

### Vercel
- **Free tier**: 100GB bandwidth, unlimited static sites
- **Pro**: $20/month for more resources

### MongoDB Atlas
- **Free tier**: 512MB storage, shared clusters
- **M10**: $57/month for production use

### Total Monthly Cost
- **Development**: $0 (free tiers)
- **Production**: $20-80/month depending on usage

---

**Note**: Always test your deployment in a staging environment before going live!
