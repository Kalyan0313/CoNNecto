import React, { useState, useEffect } from 'react'
import { Users, UserPlus, UserCheck, Search } from 'lucide-react'
import { useAppSelector } from '../store/hooks'
import GlowCard from '../components/GlowCard'
import GlowButton from '../components/GlowButton'

const Network = () => {
  const { user } = useAppSelector(state => state.auth)
  const [connections, setConnections] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  // Mock data for network
  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setConnections([
        { id: 1, name: 'John Doe', title: 'Frontend Developer', company: 'Tech Corp', avatar: 'JD' },
        { id: 2, name: 'Jane Smith', title: 'UX Designer', company: 'Design Studio', avatar: 'JS' },
        { id: 3, name: 'Mike Johnson', title: 'Backend Developer', company: 'Startup Inc', avatar: 'MJ' },
      ])
      
      setSuggestions([
        { id: 4, name: 'Sarah Wilson', title: 'Product Manager', company: 'Innovation Labs', avatar: 'SW' },
        { id: 5, name: 'Alex Brown', title: 'DevOps Engineer', company: 'Cloud Solutions', avatar: 'AB' },
        { id: 6, name: 'Emily Davis', title: 'Data Scientist', company: 'AI Research', avatar: 'ED' },
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const handleConnect = (userId) => {
    // Mock connection request
    console.log(`Connection request sent to user ${userId}`)
  }

  const handleAccept = (userId) => {
    // Mock accept connection
    console.log(`Connection accepted from user ${userId}`)
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
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">My Network</h1>
                <p className="text-gray-400">Connect with professionals in your field</p>
              </div>
              <GlowButton
                variant="primary"
                glowColor="purple"
                className="flex items-center space-x-2"
              >
                <UserPlus size={20} />
                <span>Invite Connections</span>
              </GlowButton>
            </div>

            {/* Search */}
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search your network..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-dark-800/50 border border-dark-700 focus:border-neon-blue focus:ring-2 focus:ring-neon-blue/20 outline-none text-white placeholder-gray-400"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Connections */}
              <GlowCard glowColor="blue" customSize={true} className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Users size={24} className="text-neon-blue" />
                  <div>
                    <h2 className="text-xl font-semibold text-white">Your Connections</h2>
                    <p className="text-gray-400">{connections.length} connections</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {connections.map((connection) => (
                    <div key={connection.id} className="flex items-center justify-between p-4 bg-dark-700/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-neon-green to-neon-blue rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">{connection.avatar}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{connection.name}</h3>
                          <p className="text-sm text-gray-400">{connection.title}</p>
                          <p className="text-xs text-gray-500">{connection.company}</p>
                        </div>
                      </div>
                      <GlowButton
                        variant="outline"
                        glowColor="green"
                        size="sm"
                        className="flex items-center space-x-2"
                      >
                        <UserCheck size={16} />
                        <span>Connected</span>
                      </GlowButton>
                    </div>
                  ))}
                </div>
              </GlowCard>

              {/* Suggestions */}
              <GlowCard glowColor="purple" customSize={true} className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <UserPlus size={24} className="text-neon-purple" />
                  <div>
                    <h2 className="text-xl font-semibold text-white">People You May Know</h2>
                    <p className="text-gray-400">{suggestions.length} suggestions</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {suggestions.map((suggestion) => (
                    <div key={suggestion.id} className="flex items-center justify-between p-4 bg-dark-700/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-neon-purple to-neon-pink rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">{suggestion.avatar}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{suggestion.name}</h3>
                          <p className="text-sm text-gray-400">{suggestion.title}</p>
                          <p className="text-xs text-gray-500">{suggestion.company}</p>
                        </div>
                      </div>
                      <GlowButton
                        onClick={() => handleConnect(suggestion.id)}
                        variant="primary"
                        glowColor="purple"
                        size="sm"
                        className="flex items-center space-x-2"
                      >
                        <UserPlus size={16} />
                        <span>Connect</span>
                      </GlowButton>
                    </div>
                  ))}
                </div>
              </GlowCard>
            </div>

            {/* Network Stats */}
            <GlowCard glowColor="green" customSize={true} className="p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Network Insights</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-dark-700/30 rounded-lg">
                  <div className="text-3xl font-bold text-neon-blue mb-2">{connections.length}</div>
                  <div className="text-gray-400">Total Connections</div>
                </div>
                <div className="text-center p-4 bg-dark-700/30 rounded-lg">
                  <div className="text-3xl font-bold text-neon-green mb-2">12</div>
                  <div className="text-gray-400">New This Month</div>
                </div>
                <div className="text-center p-4 bg-dark-700/30 rounded-lg">
                  <div className="text-3xl font-bold text-neon-purple mb-2">85%</div>
                  <div className="text-gray-400">Response Rate</div>
                </div>
              </div>
            </GlowCard>
          </div>
        </div>

        {/* Sidebar - Hidden on mobile, 1/4 on xl */}
        <div className="hidden xl:block">
          <div className="space-y-6">
            {/* Network Stats */}
            <GlowCard glowColor="blue" customSize={true} className="p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Pending Requests</span>
                  <span className="font-semibold text-neon-blue">3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Mutual Connections</span>
                  <span className="font-semibold text-neon-green">15</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Industry Contacts</span>
                  <span className="font-semibold text-neon-purple">8</span>
                </div>
              </div>
            </GlowCard>

            {/* Recent Activity */}
            <GlowCard glowColor="purple" customSize={true} className="p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-neon-green rounded-full"></div>
                  <span className="text-sm text-gray-400">John Doe accepted your request</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-neon-blue rounded-full"></div>
                  <span className="text-sm text-gray-400">Jane Smith viewed your profile</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-neon-purple rounded-full"></div>
                  <span className="text-sm text-gray-400">New connection suggestion</span>
                </div>
              </div>
            </GlowCard>

            {/* Industry Groups */}
            <GlowCard glowColor="green" customSize={true} className="p-6">
              <h3 className="text-lg font-semibold mb-4">Industry Groups</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-dark-700/30 rounded-lg">
                  <span className="text-neon-blue font-medium">Frontend Developers</span>
                  <span className="text-sm text-gray-400">1.2k members</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-dark-700/30 rounded-lg">
                  <span className="text-neon-purple font-medium">UX Designers</span>
                  <span className="text-sm text-gray-400">856 members</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-dark-700/30 rounded-lg">
                  <span className="text-neon-green font-medium">Tech Leaders</span>
                  <span className="text-sm text-gray-400">432 members</span>
                </div>
              </div>
            </GlowCard>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Network 