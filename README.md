# CoNNecto - Modern Community Platform

A modern, neon-styled LinkedIn-like community platform built with React, Node.js, Express, and MongoDB.

## 🚀 Live Demo
- **Frontend**: [Deploy to Vercel/Netlify]
- **Backend**: [Deploy to Render/Railway]

## 📋 Features Status

### ✅ **Fully Functional Features**
- **User Authentication**: Complete register/login with JWT
- **Post Management**: Create, read, like, and comment on posts
- **User Profiles**: View and edit user profiles with statistics
- **Responsive Design**: Mobile-first responsive layouts with grid systems
- **Modern UI/UX**: Neon-style design with glowing effects and animations
- **Performance Optimizations**: Virtualized lists, lazy loading, memoized components

### 🎨 **Designed/UI Only (Dummy Data)**
- **Search Functionality**: UI components created but not connected to backend
- **Network Page**: Connection suggestions and network stats (mock data)
- **Notifications**: Notification system UI with dummy notifications
- **Trending Topics**: Sidebar trending topics with mock data
- **Bookmarks**: Bookmark functionality UI (not implemented)
- **User Activity**: Recent activity feeds with mock data

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite
- **Redux Toolkit** for state management
- **Tailwind CSS** for styling
- **React Router DOM** for navigation
- **Axios** for API calls
- **Lucide React** for icons
- **React Hot Toast** for notifications

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcryptjs** for password hashing
- **express-validator** for validation
- **CORS** for cross-origin requests

## 🚀 Deployment Guide

### Option 1: Vercel (Frontend) + Render (Backend) - Recommended

#### Frontend Deployment (Vercel)
1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Connect your GitHub repository
   - Set build settings:
     - **Framework Preset**: Vite
     - **Build Command**: `cd client && npm install && npm run build`
     - **Output Directory**: `client/dist`
     - **Install Command**: `npm install`

3. **Environment Variables** (in Vercel dashboard)
   ```
   VITE_API_URL=https://your-backend-url.onrender.com
   ```

#### Backend Deployment (Render)
1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Deploy Backend**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `connecto-backend`
     - **Root Directory**: `server`
     - **Runtime**: Node
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`

3. **Environment Variables** (in Render dashboard)
   ```
   PORT=10000
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   NODE_ENV=production
   ```

### Option 2: Netlify (Frontend) + Railway (Backend)

#### Frontend Deployment (Netlify)
1. **Deploy to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Connect your GitHub repository
   - Set build settings:
     - **Base directory**: `client`
     - **Build command**: `npm run build`
     - **Publish directory**: `dist`

2. **Environment Variables**
   ```
   VITE_API_URL=https://your-backend-url.railway.app
   ```

#### Backend Deployment (Railway)
1. **Deploy to Railway**
   - Go to [railway.app](https://railway.app)
   - Connect your GitHub repository
   - Set root directory to `server`
   - Add environment variables as above

## 📦 Local Development Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd connecto
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install
   
   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env` file in the server directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/connecto
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=development
   ```

4. **Start MongoDB**
   
   Make sure MongoDB is running on your system or use MongoDB Atlas.

5. **Run the application**
   ```bash
   # Start backend (from server directory)
   cd server
   npm run dev
   
   # Start frontend (from client directory)
   cd client
   npm run dev
   ```

## 📁 Project Structure

```
connecto/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   │   ├── GlowCard.jsx
│   │   │   ├── GlowButton.jsx
│   │   │   ├── PostCard.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── pages/        # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Network.jsx
│   │   │   └── Notifications.jsx
│   │   ├── store/        # Redux store
│   │   │   ├── index.js
│   │   │   └── slices/
│   │   └── utils/        # Utility functions
├── server/                # Node.js backend
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── middleware/       # Express middleware
│   ├── controllers/      # Route controllers
│   └── index.js         # Server entry point
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create a new post
- `PUT /api/posts/:id/like` - Like/unlike a post
- `GET /api/posts/user/:userId` - Get posts by user

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/profile` - Update user profile

## 🎨 UI Components

### Fully Functional
- **GlowCard**: Reusable card component with neon effects
- **GlowButton**: Interactive button with glow animations
- **PostCard**: Post display with like/comment functionality
- **Navbar**: Responsive navigation with user authentication
- **Sidebar**: Navigation sidebar with user stats

### UI Only (Dummy)
- **SearchComponent**: Search input with dropdown (not connected)
- **SearchResults**: Search results page (mock data)
- **Network Components**: Connection suggestions and stats
- **Notification Components**: Notification system UI

## 🚀 Performance Features

- **Virtualized Lists**: Efficient rendering for large datasets
- **Lazy Loading**: Components load on demand
- **Memoized Components**: Optimized re-renders
- **Shared Event Listeners**: Reduced DOM listeners
- **Responsive Design**: Mobile-first approach with grid layouts

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions:
- Open an issue on GitHub
- Check the deployment logs in your hosting platform
- Verify environment variables are set correctly

## 🔄 Next Steps

### Planned Features
- [ ] Real-time notifications
- [ ] Advanced search functionality
- [ ] File upload for posts
- [ ] Direct messaging
- [ ] Email notifications
- [ ] Social sharing
- [ ] Dark/Light mode toggle
- [ ] Advanced user profiles
- [ ] Post categories and tags
- [ ] Analytics dashboard 