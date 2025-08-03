import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { User } from 'lucide-react'
import api from '../utils/axios'
import toast from 'react-hot-toast'
import PostCard from '../components/PostCard'
import GlowCard from '../components/GlowCard'

const UserProfile = () => {
  const { userId } = useParams()
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserData()
  }, [userId])

  const fetchUserData = async () => {
    try {
      const [userResponse, postsResponse] = await Promise.all([
        api.get(`/api/users/${userId}`),
        api.get(`/api/posts/user/${userId}`)
      ])
      
      // Handle new API response format
      const userData = userResponse.data.data?.user || userResponse.data.data || userResponse.data
      const postsData = postsResponse.data.data?.posts || postsResponse.data.data || postsResponse.data
      
      setUser(userData)
      setPosts(Array.isArray(postsData) ? postsData : [])
    } catch (error) {
      toast.error('Failed to load user profile')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-blue"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-500 mb-4">User not found</h2>
        <p className="text-gray-500 dark:text-gray-400">
          The user you're looking for doesn't exist.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <GlowCard glowColor="orange" customSize={true} className="p-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-20 h-20 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full flex items-center justify-center">
            <User size={32} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-2">{user.name}</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-2">{user.email}</p>
            {user.bio && (
              <p className="text-gray-700 dark:text-gray-300">{user.bio}</p>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200 dark:border-dark-700">
          <div className="text-center">
            <div className="text-2xl font-bold neon-text">{posts.length}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Posts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold neon-text">
              {posts.reduce((total, post) => total + (post.likes?.length || 0), 0)}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Likes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold neon-text">
              {posts.reduce((total, post) => total + (post.comments?.length || 0), 0)}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Comments</div>
          </div>
        </div>
      </GlowCard>

      {/* User Posts */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold neon-text">{user.name}'s Posts</h2>
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full flex items-center justify-center mx-auto mb-4">
              <User size={24} className="text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
            <p className="text-gray-500 dark:text-gray-400">
              {user.name} hasn't shared any posts yet.
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard 
              key={post._id} 
              post={post} 
            />
          ))
        )}
      </div>
    </div>
  )
}

export default UserProfile 