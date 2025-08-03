import React, { useState, useEffect } from 'react'
import { Search, Filter, User, FileText, Hash, Clock, TrendingUp } from 'lucide-react'
import { useAppSelector, useAppDispatch } from '../store/hooks'
import { setSearchTerm, setSearchType, setSearchFilters } from '../store/slices/searchSlice'
import PostCard from '../components/PostCard'
import GlowCard from '../components/GlowCard'
import GlowButton from '../components/GlowButton'
import SearchComponent from '../components/SearchComponent'

const SearchResults = () => {
  const dispatch = useAppDispatch()
  const { searchTerm, searchType, searchResults, isSearching } = useAppSelector(state => state.search)
  const [activeFilter, setActiveFilter] = useState('all')
  const [sortBy, setSortBy] = useState('relevance')

  // Mock search results
  const mockResults = {
    posts: [
      {
        _id: '1',
        content: 'Just learned about React hooks! They make state management so much easier. #React #JavaScript',
        author: { name: 'John Doe', _id: 'user1' },
        likes: ['user2', 'user3'],
        comments: [{ _id: 'c1', content: 'Great post!', author: { name: 'Jane Smith' } }],
        createdAt: '2024-01-15T10:30:00Z'
      },
      {
        _id: '2',
        content: 'Web development tips: Always use semantic HTML and keep your CSS organized. #WebDev #CSS',
        author: { name: 'Mike Johnson', _id: 'user2' },
        likes: ['user1', 'user4'],
        comments: [],
        createdAt: '2024-01-14T15:45:00Z'
      }
    ],
    users: [
      { _id: 'user1', name: 'John Doe', title: 'Frontend Developer', company: 'Tech Corp' },
      { _id: 'user2', name: 'Jane Smith', title: 'UX Designer', company: 'Design Studio' },
      { _id: 'user3', name: 'Mike Johnson', title: 'Full Stack Developer', company: 'Startup Inc' }
    ],
    topics: [
      { _id: 'topic1', name: 'React', posts: 45, trending: true },
      { _id: 'topic2', name: 'JavaScript', posts: 32, trending: true },
      { _id: 'topic3', name: 'Web Development', posts: 28, trending: false }
    ]
  }

  const handleSearch = (term, type) => {
    console.log('Searching for:', term, 'in:', type)
    // Here you would typically make an API call
  }

  const getFilteredResults = () => {
    if (activeFilter === 'all') {
      return {
        posts: mockResults.posts,
        users: mockResults.users,
        topics: mockResults.topics
      }
    }
    return { [activeFilter]: mockResults[activeFilter] }
  }

  const getSortedResults = (results) => {
    if (sortBy === 'relevance') {
      return results
    } else if (sortBy === 'date') {
      return [...results].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    } else if (sortBy === 'popularity') {
      return [...results].sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
    }
    return results
  }

  const filters = [
    { id: 'all', label: 'All Results', icon: Search },
    { id: 'posts', label: 'Posts', icon: FileText },
    { id: 'users', label: 'Users', icon: User },
    { id: 'topics', label: 'Topics', icon: Hash }
  ]

  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'date', label: 'Date' },
    { value: 'popularity', label: 'Popularity' }
  ]

  const results = getFilteredResults()
  const sortedPosts = getSortedResults(results.posts || [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 lg:gap-8">
        {/* Main Content - Takes full width on mobile, 3/4 on xl */}
        <div className="xl:col-span-3">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  Search Results
                </h1>
                <p className="text-gray-400">
                  {searchTerm ? `Results for "${searchTerm}"` : 'Search for posts, people, and topics'}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <GlowButton
                  variant="outline"
                  glowColor="blue"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <Filter size={16} />
                  <span>Advanced Search</span>
                </GlowButton>
              </div>
            </div>

            {/* Search Bar */}
            <SearchComponent 
              placeholder="Search posts, people, topics..."
              onSearch={handleSearch}
              showFilters={false}
            />

            {/* Filters and Sort */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                {filters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                      activeFilter === filter.id
                        ? 'bg-neon-blue/20 text-neon-blue border border-neon-blue/30'
                        : 'text-gray-400 hover:text-neon-blue hover:bg-neon-blue/10'
                    }`}
                  >
                    <filter.icon size={16} />
                    <span>{filter.label}</span>
                  </button>
                ))}
              </div>

              {/* Sort */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-dark-700/50 border border-dark-600 rounded-lg px-3 py-2 text-white text-sm focus:border-neon-blue focus:ring-2 focus:ring-neon-blue/20 outline-none"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Results */}
            <div className="space-y-6">
              {/* Posts Results */}
              {(activeFilter === 'all' || activeFilter === 'posts') && sortedPosts.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                    <FileText size={20} className="text-neon-blue" />
                    <span>Posts ({sortedPosts.length})</span>
                  </h2>
                  <div className="space-y-4">
                    {sortedPosts.map((post) => (
                      <PostCard key={post._id} post={post} />
                    ))}
                  </div>
                </div>
              )}

              {/* Users Results */}
              {(activeFilter === 'all' || activeFilter === 'users') && results.users?.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                    <User size={20} className="text-neon-green" />
                    <span>Users ({results.users.length})</span>
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {results.users.map((user) => (
                      <GlowCard key={user._id} glowColor="green" customSize={true} className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-neon-green to-neon-blue rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-white">{user.name}</h3>
                            <p className="text-sm text-gray-400">{user.title}</p>
                            <p className="text-xs text-gray-500">{user.company}</p>
                          </div>
                          <GlowButton
                            variant="outline"
                            glowColor="blue"
                            size="sm"
                            className="text-xs"
                          >
                            Connect
                          </GlowButton>
                        </div>
                      </GlowCard>
                    ))}
                  </div>
                </div>
              )}

              {/* Topics Results */}
              {(activeFilter === 'all' || activeFilter === 'topics') && results.topics?.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                    <Hash size={20} className="text-neon-purple" />
                    <span>Topics ({results.topics.length})</span>
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {results.topics.map((topic) => (
                      <GlowCard key={topic._id} glowColor="purple" customSize={true} className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-white">#{topic.name}</h3>
                            <p className="text-sm text-gray-400">{topic.posts} posts</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {topic.trending && (
                              <TrendingUp size={16} className="text-neon-pink" />
                            )}
                            <GlowButton
                              variant="outline"
                              glowColor="purple"
                              size="sm"
                              className="text-xs"
                            >
                              Follow
                            </GlowButton>
                          </div>
                        </div>
                      </GlowCard>
                    ))}
                  </div>
                </div>
              )}

              {/* No Results */}
              {Object.values(results).every(arr => !arr || arr.length === 0) && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search size={24} className="text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No results found</h3>
                  <p className="text-gray-400">
                    Try adjusting your search terms or filters
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar - Hidden on mobile, 1/4 on xl */}
        <div className="hidden xl:block">
          <div className="space-y-6">
            {/* Search Filters */}
            <GlowCard glowColor="blue" customSize={true} className="p-6">
              <h3 className="text-lg font-semibold mb-4">Search Filters</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Date Range</label>
                  <select className="w-full bg-dark-700/50 border border-dark-600 rounded-lg px-3 py-2 text-white text-sm focus:border-neon-blue focus:ring-2 focus:ring-neon-blue/20 outline-none">
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="year">This Year</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Content Type</label>
                  <select className="w-full bg-dark-700/50 border border-dark-600 rounded-lg px-3 py-2 text-white text-sm focus:border-neon-blue focus:ring-2 focus:ring-neon-blue/20 outline-none">
                    <option value="all">All Content</option>
                    <option value="posts">Posts Only</option>
                    <option value="comments">Comments Only</option>
                    <option value="topics">Topics Only</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Author</label>
                  <select className="w-full bg-dark-700/50 border border-dark-600 rounded-lg px-3 py-2 text-white text-sm focus:border-neon-blue focus:ring-2 focus:ring-neon-blue/20 outline-none">
                    <option value="all">All Authors</option>
                    <option value="connections">My Connections</option>
                    <option value="followed">People I Follow</option>
                  </select>
                </div>
              </div>
            </GlowCard>

            {/* Search Tips */}
            <GlowCard glowColor="purple" customSize={true} className="p-6">
              <h3 className="text-lg font-semibold mb-4">Search Tips</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-neon-blue rounded-full mt-2"></div>
                  <span className="text-sm text-gray-400">Use quotes for exact phrases</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-neon-green rounded-full mt-2"></div>
                  <span className="text-sm text-gray-400">Add hashtags to find topics</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-neon-purple rounded-full mt-2"></div>
                  <span className="text-sm text-gray-400">Use filters to narrow results</span>
                </div>
              </div>
            </GlowCard>

            {/* Recent Searches */}
            <GlowCard glowColor="green" customSize={true} className="p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Searches</h3>
              <div className="space-y-2">
                <button className="flex items-center space-x-3 w-full p-2 rounded-lg text-left text-gray-300 hover:text-white hover:bg-dark-700/50 transition-all">
                  <Clock size={14} className="text-gray-500" />
                  <span className="text-sm">React hooks</span>
                </button>
                <button className="flex items-center space-x-3 w-full p-2 rounded-lg text-left text-gray-300 hover:text-white hover:bg-dark-700/50 transition-all">
                  <Clock size={14} className="text-gray-500" />
                  <span className="text-sm">JavaScript tips</span>
                </button>
                <button className="flex items-center space-x-3 w-full p-2 rounded-lg text-left text-gray-300 hover:text-white hover:bg-dark-700/50 transition-all">
                  <Clock size={14} className="text-gray-500" />
                  <span className="text-sm">Web development</span>
                </button>
              </div>
            </GlowCard>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchResults 