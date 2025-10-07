import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for searching similar reviews
export const searchSimilarReviews = createAsyncThunk(
  'search/searchSimilarReviews',
  async ({ query, k = 5 }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({
        q: query,
        k: k.toString(),
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/search?${params}`, {
        method: 'GET',
        headers: {
          'x-api-key': process.env.NEXT_PUBLIC_X_API_KEY,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return { query, results: result };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    // Search state
    query: '',
    results: [],
    isSearching: false,
    searchError: null,
    hasSearched: false,
    
    // Search parameters
    topK: 5,
    
    // UI state
    lastSearchQuery: '',
    searchStartTime: null,
    searchDuration: null,
  },
  reducers: {
    setQuery: (state, action) => {
      state.query = action.payload;
    },
    setTopK: (state, action) => {
      state.topK = action.payload;
    },
    clearResults: (state) => {
      state.results = [];
      state.hasSearched = false;
      state.lastSearchQuery = '';
      state.searchError = null;
      state.searchDuration = null;
    },
    clearError: (state) => {
      state.searchError = null;
    },
    resetSearch: (state) => {
      state.query = '';
      state.results = [];
      state.isSearching = false;
      state.searchError = null;
      state.hasSearched = false;
      state.lastSearchQuery = '';
      state.searchStartTime = null;
      state.searchDuration = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchSimilarReviews.pending, (state, action) => {
        state.isSearching = true;
        state.searchError = null;
        state.searchStartTime = Date.now();
        state.lastSearchQuery = action.meta.arg.query;
      })
      .addCase(searchSimilarReviews.fulfilled, (state, action) => {
        state.isSearching = false;
        state.results = action.payload.results;
        state.hasSearched = true;
        state.searchError = null;
        state.searchDuration = Date.now() - state.searchStartTime;
      })
      .addCase(searchSimilarReviews.rejected, (state, action) => {
        state.isSearching = false;
        state.searchError = action.payload;
        state.results = [];
        state.hasSearched = true;
        state.searchDuration = Date.now() - state.searchStartTime;
      });
  },
});

export const { 
  setQuery, 
  setTopK, 
  clearResults, 
  clearError, 
  resetSearch 
} = searchSlice.actions;

export default searchSlice.reducer;
