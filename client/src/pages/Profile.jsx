import { useState, useEffect, useCallback, useRef } from 'react'
import { Edit3, Save, X, User, Loader2 } from 'lucide-react'
import { useAppSelector, useAppDispatch } from '../store/hooks'
import api from '../utils/axios'
import toast from 'react-hot-toast'
import PostCard from '../components/PostCard'
import GlowCard from '../components/GlowCard'
import GlowButton from '../components/GlowButton'

const Profile = () => {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector(state => state.auth)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [editing, setEditing] = useState(false)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
    hasMore: true
  })
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || ''
  })

  // Ref for intersection observer
  const loadMoreRef = useRef(null)

  useEffect(() => {
    if (user) {
      fetchUserPosts()
    }
  }, [user])

  // Intersection observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && pagination.hasMore && !loadingMore) {
          loadMorePosts()
        }
      },
      {
        rootMargin: '100px', // Start loading 100px before reaching the end
        threshold: 0.1
      }
    )

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current)
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current)
      }
    }
  }, [pagination.hasMore, loadingMore])

  const fetchUserPosts = useCallback(async (page = 1, append = false) => {
    if (!user?._id) return
    
    try {
      const isInitialLoad = page === 1 && !append
      if (isInitialLoad) {
        setLoading(true)
      } else {
        setLoadingMore(true)
      }

      const response = await api.get(`/api/posts/user/${user._id}`, {
        params: {
          page,
          limit: pagination.limit
        }
      })
      
      const data = response.data.data || response.data
      const newPosts = data.posts || []
      const newPagination = data.pagination || {}

      if (append) {
        setPosts(prev => [...prev, ...newPosts])
      } else {
        setPosts(newPosts)
      }

      setPagination(prev => ({
        ...prev,
        page: newPagination.page || page,
        total: newPagination.total || 0,
        pages: newPagination.pages || 0,
        hasMore: (newPagination.page || page) < (newPagination.pages || 0)
      }))
    } catch (error) {
      toast.error('Failed to load posts')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [user?._id, pagination.limit])

  const loadMorePosts = useCallback(() => {
    if (!loadingMore && pagination.hasMore) {
      fetchUserPosts(pagination.page + 1, true)
    }
  }, [loadingMore, pagination.hasMore, pagination.page, fetchUserPosts])

  const handleEdit = () => {
    setFormData({
      name: user.name,
      bio: user.bio || ''
    })
    setEditing(true)
  }

  const handleCancel = () => {
    setEditing(false)
  }

  const handleSave = async () => {
    try {
      await api.put('/api/users/me/profile', formData)
      // Refresh user data by dispatching getCurrentUser
      dispatch({ type: 'auth/getCurrentUser' })
      setEditing(false)
      toast.success('Profile updated successfully!')
    } catch (error) {
      toast.error('Failed to update profile')
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">User not found</h2>
          <p className="text-gray-500 dark:text-gray-400">Please log in to view your profile.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
        {/* Profile Header - Takes full width on mobile, 1/3 on xl */}
        <div className="xl:col-span-3">
          <GlowCard glowColor="green" customSize={true} className="p-4 sm:p-6 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Info */}
              <div className="lg:col-span-2">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="w-20 h-20 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full flex items-center justify-center flex-shrink-0">
                    <User size={32} className="text-white" />
                  </div>
                  <div className="flex-1">
                    {editing ? (
                      <div className="space-y-4">
                        <input
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="text-xl sm:text-2xl font-bold bg-white/50 dark:bg-dark-800/50 border border-gray-200 dark:border-dark-700 rounded-lg px-3 py-2 focus:border-neon-blue focus:ring-2 focus:ring-neon-blue/20 outline-none w-full"
                        />
                        <textarea
                          name="bio"
                          value={formData.bio}
                          onChange={handleChange}
                          placeholder="Tell us about yourself..."
                          className="w-full bg-white/50 dark:bg-dark-800/50 border border-gray-200 dark:border-dark-700 rounded-lg px-3 py-2 focus:border-neon-blue focus:ring-2 focus:ring-neon-blue/20 outline-none resize-none"
                          rows="3"
                          maxLength="500"
                        />
                      </div>
                    ) : (
                      <div>
                        <h1 className="text-xl sm:text-2xl font-bold mb-2">{user.name}</h1>
                        <p className="text-gray-600 dark:text-gray-400 mb-2">{user.email}</p>
                        {user.bio && (
                          <p className="text-gray-700 dark:text-gray-300">{user.bio}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
                {editing ? (
                  <>
                    <GlowButton
                      onClick={handleSave}
                      variant="secondary"
                      glowColor="green"
                      className="flex items-center justify-center space-x-2"
                    >
                      <Save size={18} />
                      <span>Save</span>
                    </GlowButton>
                    <GlowButton
                      onClick={handleCancel}
                      variant="outline"
                      glowColor="red"
                      className="flex items-center justify-center space-x-2"
                    >
                      <X size={18} />
                      <span>Cancel</span>
                    </GlowButton>
                  </>
                ) : (
                  <GlowButton
                    onClick={handleEdit}
                    variant="outline"
                    glowColor="blue"
                    className="flex items-center justify-center space-x-2"
                  >
                    <Edit3 size={18} />
                    <span>Edit Profile</span>
                  </GlowButton>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200 dark:border-dark-700">
              <div className="text-center p-4 bg-dark-700/30 rounded-lg">
                <div className="text-2xl font-bold neon-text">{pagination.total}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Posts</div>
              </div>
              <div className="text-center p-4 bg-dark-700/30 rounded-lg">
                <div className="text-2xl font-bold neon-text">
                  {posts.reduce((total, post) => total + (post.likes?.length || 0), 0)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Total Likes</div>
              </div>
              <div className="text-center p-4 bg-dark-700/30 rounded-lg">
                <div className="text-2xl font-bold neon-text">
                  {posts.reduce((total, post) => total + (post.comments?.length || 0), 0)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Total Comments</div>
              </div>
            </div>
          </GlowCard>
        </div>

        {/* User Posts - Takes full width on mobile, 2/3 on xl */}
        <div className="xl:col-span-2">
          <div className="space-y-6">
            <h2 className="text-xl font-semibold neon-text">Your Posts</h2>
            {posts.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full flex items-center justify-center mx-auto mb-4">
                  <User size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Start sharing your thoughts with the community!
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {posts.map((post) => (
                  <PostCard 
                    key={post._id} 
                    post={post} 
                  />
                ))}
                
                {/* Infinite Scroll Trigger */}
                {pagination.hasMore && (
                  <div ref={loadMoreRef} className="flex justify-center pt-6">
                    {loadingMore ? (
                      <div className="flex items-center space-x-2 text-neon-blue">
                        <Loader2 size={20} className="animate-spin" />
                        <span>Loading more posts...</span>
                      </div>
                    ) : (
                      <div className="h-4" /> // Invisible trigger for intersection observer
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Hidden on mobile, 1/3 on xl */}
        <div className="hidden xl:block">
          <div className="space-y-6">
            {/* Quick Stats */}
            <GlowCard glowColor="blue" customSize={true} className="p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Profile Views</span>
                  <span className="font-semibold text-neon-blue">1,234</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Connections</span>
                  <span className="font-semibold text-neon-green">89</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Endorsements</span>
                  <span className="font-semibold text-neon-purple">23</span>
                </div>
              </div>
            </GlowCard>

            {/* Recent Activity */}
            <GlowCard glowColor="purple" customSize={true} className="p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-neon-green rounded-full"></div>
                  <span className="text-sm text-gray-400">Post liked by John Doe</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-neon-blue rounded-full"></div>
                  <span className="text-sm text-gray-400">New connection request</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-neon-purple rounded-full"></div>
                  <span className="text-sm text-gray-400">Comment on your post</span>
                </div>
              </div>
            </GlowCard>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile 