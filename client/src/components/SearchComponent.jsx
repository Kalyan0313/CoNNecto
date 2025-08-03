import React, { useState, useEffect, useRef } from 'react'
import { Search, X, Clock, User, FileText, Hash, Filter } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../store/hooks'
import { setSearchTerm, setSearchType, addToSearchHistory, clearSearch } from '../store/slices/searchSlice'
import GlowButton from './GlowButton'

const SearchComponent = ({ 
  placeholder = "Search posts, people, topics...",
  className = "",
  onSearch,
  showFilters = true,
  compact = false
}) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { searchTerm, searchType, searchHistory, isSearching } = useAppSelector(state => state.search)
  const [isOpen, setIsOpen] = useState(false)
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm)
  const [showHistory, setShowHistory] = useState(false)
  const searchRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false)
        setShowHistory(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (term = localSearchTerm) => {
    if (!term.trim()) return
    
    dispatch(setSearchTerm(term))
    dispatch(addToSearchHistory(term))
    setIsOpen(false)
    setShowHistory(false)
    
    // Navigate to search results page
    navigate('/search')
    
    if (onSearch) {
      onSearch(term, searchType)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleHistoryClick = (term) => {
    setLocalSearchTerm(term)
    handleSearch(term)
  }

  const handleClearSearch = () => {
    setLocalSearchTerm('')
    dispatch(clearSearch())
    setIsOpen(false)
    setShowHistory(false)
  }

  const searchTypes = [
    { id: 'all', label: 'All', icon: Search },
    { id: 'posts', label: 'Posts', icon: FileText },
    { id: 'users', label: 'Users', icon: User },
    { id: 'topics', label: 'Topics', icon: Hash }
  ]

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      {/* Search Input */}
      <div className="relative">
        <Search 
          size={20} 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
        />
        <input
          type="text"
          placeholder={placeholder}
          value={localSearchTerm}
          onChange={(e) => setLocalSearchTerm(e.target.value)}
          onFocus={() => {
            setIsOpen(true)
            setShowHistory(true)
          }}
          onKeyPress={handleKeyPress}
          className={`w-full pl-10 pr-12 py-2 sm:py-3 rounded-lg bg-dark-700/50 border border-dark-600 focus:border-neon-blue focus:ring-2 focus:ring-neon-blue/20 outline-none text-white placeholder-gray-400 transition-all ${
            compact ? 'text-sm' : 'text-base'
          }`}
        />
        {localSearchTerm && (
          <button
            onClick={handleClearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Search Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-dark-800 border border-dark-700 rounded-lg shadow-2xl z-50 max-h-96 overflow-y-auto">
          {/* Search Types */}
          {showFilters && (
            <div className="p-4 border-b border-dark-700">
              <div className="flex items-center space-x-2 mb-3">
                <Filter size={16} className="text-gray-400" />
                <span className="text-sm text-gray-400">Search in:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {searchTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => {
                      dispatch(setSearchType(type.id))
                      handleSearch()
                    }}
                    className={`flex items-center space-x-2 px-3 py-1 rounded-lg text-sm transition-all ${
                      searchType === type.id
                        ? 'bg-neon-blue/20 text-neon-blue border border-neon-blue/30'
                        : 'text-gray-400 hover:text-neon-blue hover:bg-neon-blue/10'
                    }`}
                  >
                    <type.icon size={14} />
                    <span>{type.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search History */}
          {showHistory && searchHistory.length > 0 && (
            <div className="p-4 border-b border-dark-700">
              <div className="flex items-center space-x-2 mb-3">
                <Clock size={16} className="text-gray-400" />
                <span className="text-sm text-gray-400">Recent searches:</span>
              </div>
              <div className="space-y-2">
                {searchHistory.slice(0, 5).map((term, index) => (
                  <button
                    key={index}
                    onClick={() => handleHistoryClick(term)}
                    className="flex items-center space-x-3 w-full p-2 rounded-lg text-left text-gray-300 hover:text-white hover:bg-dark-700/50 transition-all"
                  >
                    <Clock size={14} className="text-gray-500" />
                    <span className="text-sm">{term}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Search Suggestions */}
          {!localSearchTerm && (
            <div className="p-4">
              <div className="text-sm text-gray-400 mb-3">Popular searches:</div>
              <div className="space-y-2">
                {['React hooks', 'JavaScript tips', 'Web development', 'UI/UX design'].map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleHistoryClick(suggestion)}
                    className="flex items-center space-x-3 w-full p-2 rounded-lg text-left text-gray-300 hover:text-white hover:bg-dark-700/50 transition-all"
                  >
                    <Search size={14} className="text-gray-500" />
                    <span className="text-sm">{suggestion}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Button */}
          {localSearchTerm && (
            <div className="p-4 border-t border-dark-700">
              <GlowButton
                onClick={() => handleSearch()}
                variant="primary"
                glowColor="blue"
                className="w-full justify-center"
                disabled={isSearching}
              >
                {isSearching ? 'Searching...' : 'Search'}
              </GlowButton>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchComponent 