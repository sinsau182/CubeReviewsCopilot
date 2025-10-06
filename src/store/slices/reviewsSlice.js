import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for fetching reviews with filters and pagination
export const fetchReviews = createAsyncThunk(
  'reviews/fetchReviews',
  async ({ location, sentiment, q, page = 1, pagesize = 20 }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pagesize: pagesize.toString(),
      });

      if (location) params.append('location', location);
      if (sentiment) params.append('sentiment', sentiment);
      if (q) params.append('q', q);

      const response = await fetch(`http://13.53.214.127:8000/reviews?${params}`, {
        method: 'GET',
        headers: {
          'x-api-key': 'your-api-key',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for fetching a single review by ID
export const fetchReviewById = createAsyncThunk(
  'reviews/fetchReviewById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://13.53.214.127:8000/reviews/${id}`, {
        method: 'GET',
        headers: {
          'x-api-key': 'your-api-key',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for suggesting reply to a review
export const suggestReply = createAsyncThunk(
  'reviews/suggestReply',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://13.53.214.127:8000/reviews/${id}/suggest-reply`, {
        method: 'POST',
        headers: {
          'x-api-key': 'your-api-key',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return { id, ...result };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState: {
    // Reviews list state
    reviews: [],
    totalReviews: 0,
    currentPage: 1,
    pageSize: 20,
    isLoading: false,
    error: null,
    
    // Filters state
    filters: {
      location: '',
      sentiment: '',
      searchQuery: '',
    },
    
    // Single review state
    selectedReview: null,
    isLoadingReview: false,
    reviewError: null,
    
    // Reply suggestion state
    replyData: null,
    isGeneratingReply: false,
    replyError: null,
  },
  reducers: {
    // Filter actions
    setLocationFilter: (state, action) => {
      state.filters.location = action.payload;
    },
    setSentimentFilter: (state, action) => {
      state.filters.sentiment = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.filters.searchQuery = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {
        location: '',
        sentiment: '',
        searchQuery: '',
      };
    },
    
    // Pagination actions
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
    },
    
    // Clear states
    clearSelectedReview: (state) => {
      state.selectedReview = null;
      state.reviewError = null;
    },
    clearReplyData: (state) => {
      state.replyData = null;
      state.replyError = null;
    },
    clearError: (state) => {
      state.error = null;
      state.reviewError = null;
      state.replyError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch reviews cases
      .addCase(fetchReviews.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = action.payload.reviews || action.payload;
        state.totalReviews = action.payload.total || action.payload.length;
        state.error = null;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch single review cases
      .addCase(fetchReviewById.pending, (state) => {
        state.isLoadingReview = true;
        state.reviewError = null;
      })
      .addCase(fetchReviewById.fulfilled, (state, action) => {
        state.isLoadingReview = false;
        state.selectedReview = action.payload;
        state.reviewError = null;
      })
      .addCase(fetchReviewById.rejected, (state, action) => {
        state.isLoadingReview = false;
        state.reviewError = action.payload;
      })
      
      // Suggest reply cases
      .addCase(suggestReply.pending, (state) => {
        state.isGeneratingReply = true;
        state.replyError = null;
      })
      .addCase(suggestReply.fulfilled, (state, action) => {
        state.isGeneratingReply = false;
        state.replyData = action.payload;
        state.replyError = null;
      })
      .addCase(suggestReply.rejected, (state, action) => {
        state.isGeneratingReply = false;
        state.replyError = action.payload;
      });
  },
});

export const {
  setLocationFilter,
  setSentimentFilter,
  setSearchQuery,
  clearFilters,
  setCurrentPage,
  setPageSize,
  clearSelectedReview,
  clearReplyData,
  clearError,
} = reviewsSlice.actions;

export default reviewsSlice.reducer;
