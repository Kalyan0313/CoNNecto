# 🚀 Deployment Guide for CoNNecto

This guide will help you deploy your CoNNecto application to various hosting platforms.

## 📋 Prerequisites

1. **GitHub Repository**: Push your code to GitHub
2. **MongoDB Atlas**: Set up a free MongoDB Atlas cluster
3. **Node.js**: Ensure you're using Node.js 16+ locally

## 🎯 Recommended Deployment Strategy

**Frontend**: Vercel (Best for React/Vite apps)
**Backend**: Render (Free tier available, good for Node.js)

## 🔧 Step 1: Prepare Your Repository

### 1.1 Update Environment Variables

Create a `.env.example` file in the server directory:

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/connecto
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

### 1.2 Push to GitHub

```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

## 🌐 Step 2: Deploy Backend (Render)

### 2.1 Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with your GitHub account

### 2.2 Deploy Backend Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: `connecto-backend`
   - **Root Directory**: `server`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### 2.3 Set Environment Variables
In the Render dashboard, add these environment variables:

```
PORT=10000
MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/connecto
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long
NODE_ENV=production
```

### 2.4 Get Backend URL
After deployment, copy your backend URL (e.g., `https://connecto-backend.onrender.com`)

## 🎨 Step 3: Deploy Frontend (Vercel)

### 3.1 Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with your GitHub account

### 3.2 Deploy Frontend
1. Click "New Project"
2. Import your GitHub repository
3. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### 3.3 Set Environment Variables
In the Vercel dashboard, add:

```
VITE_API_URL=https://your-backend-url.onrender.com
```

### 3.4 Deploy
Click "Deploy" and wait for the build to complete.

## 🔄 Alternative Deployment Options

### Option A: Netlify (Frontend) + Railway (Backend)

#### Netlify Frontend
1. Go to [netlify.com](https://netlify.com)
2. Connect your GitHub repository
3. Set build settings:
   - **Base directory**: `client`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
4. Add environment variable: `VITE_API_URL=https://your-railway-url.railway.app`

#### Railway Backend
1. Go to [railway.app](https://railway.app)
2. Connect your GitHub repository
3. Set root directory to `server`
4. Add environment variables as above

### Option B: Heroku (Both Frontend & Backend)

#### Backend on Heroku
1. Create Heroku account
2. Install Heroku CLI
3. Deploy backend:
   ```bash
   cd server
   heroku create connecto-backend
   git push heroku main
   ```
4. Set environment variables in Heroku dashboard

#### Frontend on Heroku
1. Create another Heroku app for frontend
2. Deploy frontend:
   ```bash
   cd client
   heroku create connecto-frontend
   git push heroku main
   ```

## 🔍 Step 4: Verify Deployment

### 4.1 Test Backend
```bash
curl https://your-backend-url.onrender.com/api/posts
```

### 4.2 Test Frontend
Visit your frontend URL and test:
- User registration/login
- Creating posts
- Liking/commenting on posts
- Profile management

### 4.3 Check Environment Variables
Ensure all environment variables are set correctly in both platforms.

## 🛠️ Troubleshooting

### Common Issues

#### 1. CORS Errors
- Ensure your backend has CORS configured properly
- Check that the frontend URL is allowed in CORS settings

#### 2. Environment Variables Not Working
- Double-check variable names (case-sensitive)
- Ensure variables are set in the correct environment
- Restart the deployment after changing variables

#### 3. Build Failures
- Check Node.js version compatibility
- Verify all dependencies are in package.json
- Check build logs for specific errors

#### 4. Database Connection Issues
- Verify MongoDB Atlas connection string
- Check network access settings in MongoDB Atlas
- Ensure database user has correct permissions

### Debug Commands

#### Check Backend Logs
```bash
# Render
# Check logs in Render dashboard

# Railway
railway logs

# Heroku
heroku logs --tail
```

#### Check Frontend Build
```bash
# Local build test
cd client
npm run build
```

## 📊 Step 5: Performance Optimization

### 1. Enable Compression
Add compression middleware to your backend:

```javascript
const compression = require('compression');
app.use(compression());
```

### 2. Set Cache Headers
```javascript
app.use(express.static('public', {
  maxAge: '1y',
  etag: false
}));
```

### 3. Monitor Performance
- Use Vercel Analytics for frontend
- Monitor Render/Railway metrics for backend
- Set up error tracking (Sentry, LogRocket)

## 🔐 Step 6: Security Checklist

- [ ] JWT_SECRET is at least 32 characters long
- [ ] MongoDB connection uses SSL
- [ ] CORS is properly configured
- [ ] Environment variables are not exposed in client code
- [ ] API endpoints are protected where necessary
- [ ] HTTPS is enabled on all URLs

## 📈 Step 7: Monitoring & Maintenance

### Set Up Monitoring
1. **Uptime Monitoring**: Use UptimeRobot or similar
2. **Error Tracking**: Implement Sentry for error tracking
3. **Performance Monitoring**: Use platform-specific analytics

### Regular Maintenance
1. **Update Dependencies**: Regularly update npm packages
2. **Monitor Logs**: Check for errors and performance issues
3. **Backup Database**: Set up regular MongoDB Atlas backups
4. **Security Updates**: Keep dependencies updated for security patches

## 🎉 Success!

Your CoNNecto application is now deployed and ready for users!

### Next Steps
1. Update your README with live demo URLs
2. Set up custom domains if needed
3. Implement monitoring and analytics
4. Plan for scaling as your user base grows

## 📞 Support

If you encounter issues:
1. Check the deployment logs
2. Verify environment variables
3. Test locally first
4. Check platform-specific documentation
5. Open an issue on GitHub with detailed error information 