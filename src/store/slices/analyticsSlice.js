import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for fetching analytics data
export const fetchAnalytics = createAsyncThunk(
  'analytics/fetchAnalytics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:8000/analytics', {
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

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState: {
    // Main analytics data
    totalReviews: 0,
    averageRating: 0,
    positiveRate: 0,
    negativeCount: 0,
    
    // Distribution data
    sentimentDistribution: {},
    topicDistribution: {},
    locationBreakdown: {},
    
    // State management
    isLoading: false,
    error: null,
    lastUpdated: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetAnalytics: (state) => {
      state.totalReviews = 0;
      state.averageRating = 0;
      state.positiveRate = 0;
      state.negativeCount = 0;
      state.sentimentDistribution = {};
      state.topicDistribution = {};
      state.locationBreakdown = {};
      state.error = null;
      state.lastUpdated = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalytics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.totalReviews = action.payload.total_reviews;
        state.averageRating = action.payload.average_rating;
        state.positiveRate = action.payload.positive_rate;
        state.negativeCount = action.payload.negative_count;
        state.sentimentDistribution = action.payload.sentiment_distribution;
        state.topicDistribution = action.payload.topic_distribution;
        state.locationBreakdown = action.payload.location_breakdown;
        state.lastUpdated = new Date().toISOString();
        state.error = null;
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, resetAnalytics } = analyticsSlice.actions;
export default analyticsSlice.reducer;
