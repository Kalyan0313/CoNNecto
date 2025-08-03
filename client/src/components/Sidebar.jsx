import React, { useState, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Home, 
  User, 
  Users, 
  TrendingUp, 
  Hash, 
  Bell, 
  Bookmark, 
  X
} from 'lucide-react'
import { useAppSelector, useAppDispatch } from '../store/hooks'
import GlowButton from './GlowButton'

const Sidebar = ({ isMobileOpen, onMobileClose }) => {
  const dispatch = useAppDispatch()
  const location = useLocation()
  const { user, isAuthenticated } = useAppSelector(state => state.auth)
  const { posts } = useAppSelector(state => state.posts)
  
  const [activeTab, setActiveTab] = useState('home')

  // Navigation items
  const navigationItems = useMemo(() => [
    { id: 'home', label: 'Home', icon: Home, path: '/' },
    { id: 'profile', label: 'Profile', icon: User, path: '/profile', requiresAuth: true },
    { id: 'network', label: 'Network', icon: Users, path: '/network', requiresAuth: true },
    { id: 'trending', label: 'Trending', icon: TrendingUp, path: '/trending' },
    { id: 'notifications', label: 'Notifications', icon: Bell, path: '/notifications', requiresAuth: true },
    { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark, path: '/bookmarks', requiresAuth: true },
  ], [])

  // User stats
  const userStats = useMemo(() => {
    if (!user) return null
    
    const userPosts = posts.filter(post => post.author._id === user._id)
    const totalLikes = userPosts.reduce((total, post) => total + (post.likes?.length || 0), 0)
    const totalComments = userPosts.reduce((total, post) => total + (post.comments?.length || 0), 0)
    
    return {
      posts: userPosts.length,
      likes: totalLikes,
      comments: totalComments,
      views: Math.floor(Math.random() * 1000) + 100 // Mock data
    }
  }, [user, posts])

  // Trending topics (mock data)
  const trendingTopics = useMemo(() => [
    { id: 1, topic: '#React', posts: 45, trending: true },
    { id: 2, topic: '#JavaScript', posts: 32, trending: true },
    { id: 3, topic: '#WebDev', posts: 28, trending: false },
    { id: 4, topic: '#TechNews', posts: 25, trending: true },
    { id: 5, topic: '#Programming', posts: 22, trending: false },
  ], [])

  // Recent activity (mock data)
  const recentActivity = useMemo(() => [
    { id: 1, type: 'like', user: 'John Doe', post: 'Great post about React hooks!', time: '2h ago' },
    { id: 2, type: 'comment', user: 'Jane Smith', post: 'Thanks for sharing this!', time: '4h ago' },
    { id: 3, type: 'follow', user: 'Mike Johnson', action: 'started following you', time: '6h ago' },
  ], [])


  const handleNavigation = (path) => {
    setActiveTab(path)
    if (onMobileClose) onMobileClose()
  }

  const isActive = (path) => location.pathname === path

  const sidebarContent = (
    <div className="p-4 space-y-6 h-full overflow-y-auto">
      {/* Mobile Header */}
      <div className="flex items-center justify-between lg:hidden">
        <button
          onClick={onMobileClose}
          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-dark-700 transition-all"
        >
          <X size={20} />
        </button>
      </div>      

      {/* Navigation */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Navigation
        </h3>
        {navigationItems.map((item) => {
          if (item.requiresAuth && !isAuthenticated) return null
          
          return (
            <Link
              key={item.id}
              to={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all group ${
                isActive(item.path)
                  ? 'bg-neon-blue/20 text-neon-blue border border-neon-blue/30'
                  : 'text-gray-300 hover:text-neon-blue hover:bg-neon-blue/10'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 bg-dark-800/80 backdrop-blur-md border-r border-dark-700 h-full">
        {sidebarContent}
      </div>

      {/* Mobile Sidebar */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onMobileClose}
          />
          
          {/* Sidebar */}
          <div className="absolute left-0 top-0 h-full w-80 max-w-[85vw] bg-dark-800/95 backdrop-blur-md border-r border-dark-700 shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  )
}

export default Sidebar 