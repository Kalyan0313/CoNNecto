import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  searchTerm: '',
  searchResults: [],
  searchType: 'all', // 'all', 'posts', 'users', 'topics'
  isSearching: false,
  searchHistory: [],
  filters: {
    dateRange: 'all',
    contentType: 'all',
    author: 'all'
  }
}

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload
    },
    setSearchResults: (state, action) => {
      state.searchResults = action.payload
    },
    setSearchType: (state, action) => {
      state.searchType = action.payload
    },
    setIsSearching: (state, action) => {
      state.isSearching = action.payload
    },
    addToSearchHistory: (state, action) => {
      const term = action.payload
      if (term && !state.searchHistory.includes(term)) {
        state.searchHistory = [term, ...state.searchHistory.slice(0, 9)]
      }
    },
    clearSearchHistory: (state) => {
      state.searchHistory = []
    },
    setSearchFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearSearch: (state) => {
      state.searchTerm = ''
      state.searchResults = []
      state.isSearching = false
    }
  }
})

export const {
  setSearchTerm,
  setSearchResults,
  setSearchType,
  setIsSearching,
  addToSearchHistory,
  clearSearchHistory,
  setSearchFilters,
  clearSearch
} = searchSlice.actions

export default searchSlice.reducer 