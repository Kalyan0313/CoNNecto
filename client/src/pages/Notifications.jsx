import React, { useState, useEffect } from 'react'
import { Bell, Heart, MessageSquare, UserPlus, Eye, Check, X } from 'lucide-react'
import { useAppSelector } from '../store/hooks'
import GlowCard from '../components/GlowCard'
import GlowButton from '../components/GlowButton'

const Notifications = () => {
  const { user } = useAppSelector(state => state.auth)
  const [notifications, setNotifications] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  // Mock notifications data
  useEffect(() => {
    setTimeout(() => {
      setNotifications([
        {
          id: 1,
          type: 'like',
          user: { name: 'John Doe', avatar: 'JD' },
          post: 'Great post about React hooks!',
          time: '2 hours ago',
          read: false,
          postId: '123'
        },
        {
          id: 2,
          type: 'comment',
          user: { name: 'Jane Smith', avatar: 'JS' },
          post: 'Thanks for sharing this!',
          time: '4 hours ago',
          read: false,
          postId: '456'
        },
        {
          id: 3,
          type: 'follow',
          user: { name: 'Mike Johnson', avatar: 'MJ' },
          action: 'started following you',
          time: '6 hours ago',
          read: true
        },
        {
          id: 4,
          type: 'connection',
          user: { name: 'Sarah Wilson', avatar: 'SW' },
          action: 'accepted your connection request',
          time: '1 day ago',
          read: true
        },
        {
          id: 5,
          type: 'mention',
          user: { name: 'Alex Brown', avatar: 'AB' },
          post: 'mentioned you in a comment',
          time: '2 days ago',
          read: true,
          postId: '789'
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return <Heart size={20} className="text-neon-pink" />
      case 'comment':
        return <MessageSquare size={20} className="text-neon-blue" />
      case 'follow':
      case 'connection':
        return <UserPlus size={20} className="text-neon-green" />
      case 'mention':
        return <Bell size={20} className="text-neon-purple" />
      default:
        return <Bell size={20} className="text-gray-400" />
    }
  }

  const getNotificationText = (notification) => {
    switch (notification.type) {
      case 'like':
        return `liked your post "${notification.post}"`
      case 'comment':
        return `commented on your post "${notification.post}"`
      case 'follow':
        return notification.action
      case 'connection':
        return notification.action
      case 'mention':
        return `mentioned you in a comment "${notification.post}"`
      default:
        return 'interacted with your content'
    }
  }

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true
    if (filter === 'unread') return !notification.read
    return notification.type === filter
  })

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    )
  }

  const deleteNotification = (notificationId) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-blue"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 lg:gap-8">
        {/* Main Content - Takes full width on mobile, 3/4 on xl */}
        <div className="xl:col-span-3">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Notifications</h1>
                <p className="text-gray-400">
                  {notifications.filter(n => !n.read).length} unread notifications
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <GlowButton
                  onClick={markAllAsRead}
                  variant="outline"
                  glowColor="blue"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <Check size={16} />
                  <span>Mark All Read</span>
                </GlowButton>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  filter === 'all'
                    ? 'bg-neon-blue/20 text-neon-blue border border-neon-blue/30'
                    : 'text-gray-400 hover:text-neon-blue hover:bg-neon-blue/10'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  filter === 'unread'
                    ? 'bg-neon-blue/20 text-neon-blue border border-neon-blue/30'
                    : 'text-gray-400 hover:text-neon-blue hover:bg-neon-blue/10'
                }`}
              >
                Unread
              </button>
              <button
                onClick={() => setFilter('like')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  filter === 'like'
                    ? 'bg-neon-blue/20 text-neon-blue border border-neon-blue/30'
                    : 'text-gray-400 hover:text-neon-blue hover:bg-neon-blue/10'
                }`}
              >
                Likes
              </button>
              <button
                onClick={() => setFilter('comment')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  filter === 'comment'
                    ? 'bg-neon-blue/20 text-neon-blue border border-neon-blue/30'
                    : 'text-gray-400 hover:text-neon-blue hover:bg-neon-blue/10'
                }`}
              >
                Comments
              </button>
            </div>

            {/* Notifications List */}
            <GlowCard glowColor="blue" customSize={true} className="p-6">
              <div className="space-y-4">
                {filteredNotifications.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full flex items-center justify-center mx-auto mb-4">
                      <Bell size={24} className="text-white" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No notifications</h3>
                    <p className="text-gray-400">
                      {filter === 'all' 
                        ? 'You\'re all caught up!' 
                        : `No ${filter} notifications found`
                      }
                    </p>
                  </div>
                ) : (
                  filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`flex items-start space-x-4 p-4 rounded-lg transition-all ${
                        notification.read 
                          ? 'bg-dark-700/30' 
                          : 'bg-neon-blue/10 border border-neon-blue/30'
                      }`}
                    >
                      {/* User Avatar */}
                      <div className="w-10 h-10 bg-gradient-to-r from-neon-green to-neon-blue rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-semibold text-sm">
                          {notification.user.avatar}
                        </span>
                      </div>

                      {/* Notification Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm text-gray-300">
                              <span className="font-medium text-neon-blue">
                                {notification.user.name}
                              </span>
                              {' '}
                              {getNotificationText(notification)}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {notification.time}
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center space-x-2 ml-4">
                            {!notification.read && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="p-1 text-gray-400 hover:text-neon-blue transition-colors"
                                title="Mark as read"
                              >
                                <Eye size={16} />
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                              title="Delete notification"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        </div>

                        {/* Notification Icon */}
                        <div className="mt-2">
                          {getNotificationIcon(notification.type)}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </GlowCard>

            {/* Notification Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-dark-700/30 rounded-lg">
                <div className="text-2xl font-bold text-neon-blue mb-1">
                  {notifications.length}
                </div>
                <div className="text-sm text-gray-400">Total</div>
              </div>
              <div className="text-center p-4 bg-dark-700/30 rounded-lg">
                <div className="text-2xl font-bold text-neon-pink mb-1">
                  {notifications.filter(n => !n.read).length}
                </div>
                <div className="text-sm text-gray-400">Unread</div>
              </div>
              <div className="text-center p-4 bg-dark-700/30 rounded-lg">
                <div className="text-2xl font-bold text-neon-green mb-1">
                  {notifications.filter(n => n.type === 'like').length}
                </div>
                <div className="text-sm text-gray-400">Likes</div>
              </div>
              <div className="text-center p-4 bg-dark-700/30 rounded-lg">
                <div className="text-2xl font-bold text-neon-purple mb-1">
                  {notifications.filter(n => n.type === 'comment').length}
                </div>
                <div className="text-sm text-gray-400">Comments</div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Hidden on mobile, 1/4 on xl */}
        <div className="hidden xl:block">
          <div className="space-y-6">
            {/* Notification Settings */}
            <GlowCard glowColor="blue" customSize={true} className="p-6">
              <h3 className="text-lg font-semibold mb-4">Notification Settings</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Email Notifications</span>
                  <div className="w-12 h-6 bg-neon-blue rounded-full relative">
                    <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Push Notifications</span>
                  <div className="w-12 h-6 bg-gray-600 rounded-full relative">
                    <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Like Notifications</span>
                  <div className="w-12 h-6 bg-neon-blue rounded-full relative">
                    <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1"></div>
                  </div>
                </div>
              </div>
            </GlowCard>

            {/* Quick Actions */}
            <GlowCard glowColor="purple" customSize={true} className="p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <GlowButton
                  variant="outline"
                  glowColor="blue"
                  size="sm"
                  className="w-full justify-center"
                >
                  Clear All Notifications
                </GlowButton>
                <GlowButton
                  variant="outline"
                  glowColor="green"
                  size="sm"
                  className="w-full justify-center"
                >
                  Export Notifications
                </GlowButton>
                <GlowButton
                  variant="outline"
                  glowColor="purple"
                  size="sm"
                  className="w-full justify-center"
                >
                  Notification History
                </GlowButton>
              </div>
            </GlowCard>

            {/* Recent Activity */}
            <GlowCard glowColor="green" customSize={true} className="p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-neon-green rounded-full"></div>
                  <span className="text-sm text-gray-400">Post liked by John Doe</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-neon-blue rounded-full"></div>
                  <span className="text-sm text-gray-400">New comment on your post</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-neon-purple rounded-full"></div>
                  <span className="text-sm text-gray-400">Connection request accepted</span>
                </div>
              </div>
            </GlowCard>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Notifications 