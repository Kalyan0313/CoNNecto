import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Send } from 'lucide-react'
import { useAppSelector, useAppDispatch } from '../store/hooks'
import { fetchPosts, createPost } from '../store/slices/postsSlice'
import toast from 'react-hot-toast'
import PostCard from '../components/PostCard'
import VirtualizedPostList from '../components/VirtualizedPostList'
import GlowCard from '../components/GlowCard'
import GlowButton from '../components/GlowButton'

const Home = () => {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector(state => state.auth)
  const { posts, loading, creating } = useAppSelector(state => state.posts)
  const [newPost, setNewPost] = useState('')

  useEffect(() => {
    dispatch(fetchPosts())
  }, [dispatch])

  const handleSubmitPost = useCallback(async (e) => {
    e.preventDefault()
    if (!newPost.trim() || creating) return

    try {
      await dispatch(createPost({ content: newPost })).unwrap()
      setNewPost('')
      toast.success('Post created successfully!')
    } catch (error) {
      toast.error(error || 'Failed to create post')
    }
  }, [newPost, creating, dispatch])

  const handleNewPostChange = useCallback((e) => {
    setNewPost(e.target.value)
  }, [])

  // Memoized loading component
  const loadingComponent = useMemo(() => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-blue"></div>
    </div>
  ), [])

  // Memoized empty state component
  const emptyStateComponent = useMemo(() => (
    <div className="text-center py-8 sm:py-12">
      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full flex items-center justify-center mx-auto mb-4">
        <Send size={20} className="sm:w-6 sm:h-6 text-white" />
      </div>
      <h3 className="text-lg sm:text-xl font-semibold mb-2">No posts yet</h3>
      <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
        {user ? 'Be the first to share something!' : 'Login to start posting!'}
      </p>
    </div>
  ), [user])

  // Memoized posts list - use virtualized list for better performance
  const postsList = useMemo(() => {
    if (posts.length > 50) {
      // Use virtualized list for large datasets
      return (
        <VirtualizedPostList
          posts={posts}
          itemHeight={350}
          containerHeight={600}
        />
      );
    } else {
      // Use regular list for smaller datasets
      return posts.map((post) => (
        <PostCard 
          key={post._id} 
          post={post} 
        />
      ));
    }
  }, [posts]);

  if (loading) {
    return loadingComponent
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 lg:gap-8">
        {/* Main Content - Takes full width on mobile, 3/4 on xl */}
        <div className="xl:col-span-3">
          <div className="space-y-4 sm:space-y-6">
            {/* Create Post */}
            {user && (
              <GlowCard glowColor="purple" customSize={true} className="p-4 sm:p-6">
                <form onSubmit={handleSubmitPost} className="space-y-4">
                  <textarea
                    value={newPost}
                    onChange={handleNewPostChange}
                    placeholder="What's on your mind?"
                    className="w-full p-3 sm:p-4 rounded-lg bg-white/50 dark:bg-dark-800/50 border border-gray-200 dark:border-dark-700 focus:border-neon-blue focus:ring-2 focus:ring-neon-blue/20 outline-none transition-all resize-none text-sm sm:text-base"
                    rows="3"
                    maxLength="1000"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      {newPost.length}/1000
                    </span>
                    <GlowButton
                      type="submit"
                      disabled={!newPost.trim() || creating}
                      variant="primary"
                      glowColor="purple"
                      className="flex items-center space-x-2 text-sm sm:text-base"
                    >
                      <Send size={16} className="sm:w-5 sm:h-5" />
                      <span>{creating ? 'Posting...' : 'Post'}</span>
                    </GlowButton>
                  </div>
                </form>
              </GlowCard>
            )}

            {/* Posts Feed */}
            <div className="space-y-4 sm:space-y-6">
              {posts.length === 0 ? emptyStateComponent : postsList}
            </div>
          </div>
        </div>

        {/* Sidebar - Hidden on mobile, 1/4 on xl */}
        <div className="hidden xl:block">
          <div className="space-y-6">
            {/* Trending Topics */}
            <GlowCard glowColor="blue" customSize={true} className="p-6">
              <h3 className="text-lg font-semibold mb-4">Trending Topics</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-dark-700/30 rounded-lg">
                  <span className="text-neon-blue font-medium">#React</span>
                  <span className="text-sm text-gray-400">45 posts</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-dark-700/30 rounded-lg">
                  <span className="text-neon-purple font-medium">#JavaScript</span>
                  <span className="text-sm text-gray-400">32 posts</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-dark-700/30 rounded-lg">
                  <span className="text-neon-green font-medium">#WebDev</span>
                  <span className="text-sm text-gray-400">28 posts</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-dark-700/30 rounded-lg">
                  <span className="text-neon-pink font-medium">#TechNews</span>
                  <span className="text-sm text-gray-400">25 posts</span>
                </div>
              </div>
            </GlowCard>

            {/* Who to Follow */}
            <GlowCard glowColor="purple" customSize={true} className="p-6">
              <h3 className="text-lg font-semibold mb-4">Who to Follow</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-neon-green to-neon-blue rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">JD</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-white">John Doe</h4>
                    <p className="text-sm text-gray-400">Frontend Developer</p>
                  </div>
                  <GlowButton
                    variant="outline"
                    glowColor="blue"
                    size="sm"
                    className="text-xs"
                  >
                    Follow
                  </GlowButton>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-neon-purple to-neon-pink rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">JS</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-white">Jane Smith</h4>
                    <p className="text-sm text-gray-400">UX Designer</p>
                  </div>
                  <GlowButton
                    variant="outline"
                    glowColor="blue"
                    size="sm"
                    className="text-xs"
                  >
                    Follow
                  </GlowButton>
                </div>
              </div>
            </GlowCard>

            {/* Quick Stats */}
            <GlowCard glowColor="green" customSize={true} className="p-6">
              <h3 className="text-lg font-semibold mb-4">Your Activity</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Posts Today</span>
                  <span className="font-semibold text-neon-blue">3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Likes Received</span>
                  <span className="font-semibold text-neon-green">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Comments</span>
                  <span className="font-semibold text-neon-purple">5</span>
                </div>
              </div>
            </GlowCard>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home 