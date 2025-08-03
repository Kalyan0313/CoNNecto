import React, { useState, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Heart, MessageCircle, User, Send, Trash2, MoreVertical, Reply, ThumbsUp } from 'lucide-react'
import { useAppSelector, useAppDispatch } from '../store/hooks'
import { likePost, addComment, deleteComment, optimisticLike, optimisticAddComment } from '../store/slices/postsSlice'
import toast from 'react-hot-toast'
import GlowCard from './GlowCard'
import GlowButton from './GlowButton'
import LazyLoad from './LazyLoad'

const PostCard = React.memo(({ post, onUpdate }) => {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector(state => state.auth)
  const { liking, commenting } = useAppSelector(state => state.posts)
  
  // Ensure post has proper structure and ID
  const postId = post?._id || post?.id
  const postLikes = post?.likes || []
  const postComments = post?.comments || []
  
  // Use local state for immediate UI updates
  const [localLiked, setLocalLiked] = useState(postLikes.includes(user?._id) || false)
  const [localLikesCount, setLocalLikesCount] = useState(postLikes.length || 0)
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)
  const [replyingTo, setReplyingTo] = useState(null)
  const [showCommentOptions, setShowCommentOptions] = useState(null)

  // Update local state when post data changes
  React.useEffect(() => {
    setLocalLiked(postLikes.includes(user?._id) || false)
    setLocalLikesCount(postLikes.length || 0)
  }, [postLikes, user?._id])

  const handleLike = useCallback(async () => {
    if (!user) {
      toast.error('Please login to like posts')
      return
    }

    if (!postId) {
      toast.error('Invalid post ID')
      return
    }

    // Optimistic update - immediately update UI
    const newLiked = !localLiked
    const newLikesCount = newLiked ? localLikesCount + 1 : localLikesCount - 1
    
    setLocalLiked(newLiked)
    setLocalLikesCount(newLikesCount)

    // Dispatch optimistic update to Redux
    dispatch(optimisticLike({ postId, userId: user._id }))

    try {
      await dispatch(likePost(postId)).unwrap()
      // Success - no need to update local state as Redux will handle it
    } catch (error) {
      // Revert optimistic update on error
      setLocalLiked(!newLiked)
      setLocalLikesCount(newLiked ? newLikesCount - 1 : newLikesCount + 1)
      toast.error(error || 'Failed to like post')
    }
  }, [user, postId, localLiked, localLikesCount, dispatch])

  const handleAddComment = useCallback(async (e) => {
    e.preventDefault()
    if (!newComment.trim() || submittingComment) return

    if (!postId) {
      toast.error('Invalid post ID')
      return
    }

    if (!user) {
      toast.error('Please login to comment')
      return
    }

    setSubmittingComment(true)

    // Create optimistic comment
    const optimisticComment = {
      _id: `temp_${Date.now()}`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      },
      content: newComment.trim(),
      createdAt: new Date().toISOString()
    }

    // Optimistic update - immediately add comment to UI
    dispatch(optimisticAddComment({ postId, comment: optimisticComment }))
    
    // Clear input immediately for better UX
    setNewComment('')
    setReplyingTo(null)

    try {
      await dispatch(addComment({ postId, content: optimisticComment.content })).unwrap()
      toast.success('Comment added successfully!')
    } catch (error) {
      toast.error(error || 'Failed to add comment')
    } finally {
      setSubmittingComment(false)
    }
  }, [newComment, postId, submittingComment, dispatch, user])

  const handleDeleteComment = useCallback(async (commentId) => {
    if (!postId) {
      toast.error('Invalid post ID')
      return
    }

    try {
      await dispatch(deleteComment({ postId, commentId })).unwrap()
      setShowCommentOptions(null)
      toast.success('Comment deleted successfully!')
    } catch (error) {
      toast.error(error || 'Failed to delete comment')
    }
  }, [postId, dispatch])

  const handleReply = useCallback((comment) => {
    setReplyingTo(comment)
    setNewComment(`@${comment.user.name} `)
  }, [])

  const formatDate = useCallback((dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    return date.toLocaleDateString()
  }, [])

  const canDeleteComment = useCallback((comment) => {
    return user && (user._id === comment.user._id || user._id === post.author._id)
  }, [user, post?.author?._id])

  // Memoized values
  const formattedDate = useMemo(() => formatDate(post.createdAt), [post.createdAt, formatDate])
  const commentsCount = useMemo(() => postComments.length || 0, [postComments])
  const glowColor = useMemo(() => localLiked ? 'pink' : 'blue', [localLiked])
  const variant = useMemo(() => localLiked ? 'primary' : 'outline', [localLiked])
  const cardClassName = useMemo(() => `p-6 ${localLiked ? 'shadow-neon-pink' : ''}`, [localLiked])

  // Memoized fallback component
  const fallbackComponent = useMemo(() => (
    <div className="p-6 rounded-xl glass-effect neon-border animate-pulse">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24 mb-2"></div>
          <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
      </div>
    </div>
  ), [])

  // Don't render if post doesn't have proper structure
  if (!post || !postId) {
    return null
  }

  return (
    <LazyLoad fallback={fallbackComponent}>
      <GlowCard 
        glowColor={glowColor} 
        customSize={true}
        className={cardClassName}
      >
        {/* Post Header */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full flex items-center justify-center">
            <User size={20} className="text-white" />
          </div>
          <div className="flex-1">
            <Link 
              to={`/user/${post.author._id}`}
              className="font-semibold hover:text-neon-blue transition-colors"
            >
              {post.author.name}
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {formattedDate}
            </p>
          </div>
        </div>

        {/* Post Content */}
        <div className="mb-4">
          <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
            {post.content}
          </p>
        </div>

        {/* Post Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-dark-700">
          <div className="flex items-center space-x-4">
            <GlowButton
              onClick={handleLike}
              variant={variant}
              glowColor={glowColor}
              size="sm"
              className="flex items-center space-x-2"
              disabled={liking}
            >
              <Heart size={18} className={localLiked ? 'fill-current' : ''} />
              <span>{localLikesCount}</span>
            </GlowButton>

            <GlowButton
              onClick={() => setShowComments(!showComments)}
              variant="outline"
              glowColor="green"
              size="sm"
              className="flex items-center space-x-2"
            >
              <MessageCircle size={18} />
              <span>{commentsCount}</span>
            </GlowButton>
          </div>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-dark-700">
            {/* Add Comment Form */}
            {user && (
              <div className="mb-6">
                <form onSubmit={handleAddComment} className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-neon-green to-neon-blue rounded-full flex items-center justify-center flex-shrink-0">
                      <User size={16} className="text-white" />
                    </div>
                    <div className="flex-1">
                      {replyingTo && (
                        <div className="mb-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                          <p className="text-sm text-blue-600 dark:text-blue-400">
                            Replying to <span className="font-medium">{replyingTo.user.name}</span>
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              setReplyingTo(null)
                              setNewComment('')
                            }}
                            className="text-xs text-blue-500 hover:text-blue-600 mt-1"
                          >
                            Cancel reply
                          </button>
                        </div>
                      )}
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder={replyingTo ? `Reply to ${replyingTo.user.name}...` : "Write a comment..."}
                        className="w-full p-3 rounded-lg bg-white/50 dark:bg-dark-800/50 border border-gray-200 dark:border-dark-700 focus:border-neon-blue focus:ring-2 focus:ring-neon-blue/20 outline-none transition-all resize-none"
                        rows="2"
                        maxLength="500"
                      />
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {newComment.length}/500
                        </span>
                        <GlowButton
                          type="submit"
                          disabled={!newComment.trim() || submittingComment || commenting}
                          variant="primary"
                          glowColor="green"
                          size="sm"
                          className="flex items-center space-x-2"
                        >
                          <Send size={16} />
                          <span>{submittingComment || commenting ? 'Sending...' : 'Send'}</span>
                        </GlowButton>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-4">
              {postComments.length > 0 ? (
                postComments.map((comment) => (
                  <div key={comment._id} className="group">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-neon-green to-neon-blue rounded-full flex items-center justify-center flex-shrink-0">
                        <User size={16} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm font-medium text-neon-blue">
                            {comment.user.name}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(comment.createdAt)}
                          </span>
                          {canDeleteComment(comment) && (
                            <div className="relative">
                              <button
                                onClick={() => setShowCommentOptions(showCommentOptions === comment._id ? null : comment._id)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 dark:hover:bg-dark-700 rounded"
                              >
                                <MoreVertical size={14} />
                              </button>
                              {showCommentOptions === comment._id && (
                                <div className="absolute right-0 top-6 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-lg shadow-lg z-10 min-w-[120px]">
                                  <button
                                    onClick={() => handleDeleteComment(comment._id)}
                                    className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2"
                                  >
                                    <Trash2 size={14} />
                                    <span>Delete</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                          {comment.content}
                        </p>
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => handleReply(comment)}
                            className="text-xs text-gray-500 hover:text-neon-blue transition-colors flex items-center space-x-1"
                          >
                            <Reply size={12} />
                            <span>Reply</span>
                          </button>
                          <button className="text-xs text-gray-500 hover:text-neon-blue transition-colors flex items-center space-x-1">
                            <ThumbsUp size={12} />
                            <span>Like</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full flex items-center justify-center mx-auto mb-3">
                    <MessageCircle size={20} className="text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No comments yet</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {user ? 'Be the first to share your thoughts!' : 'Login to start the conversation!'}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </GlowCard>
    </LazyLoad>
  )
})

PostCard.displayName = 'PostCard'

export default PostCard 