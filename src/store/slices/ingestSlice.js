import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for uploading reviews
export const uploadReviews = createAsyncThunk(
  'ingest/uploadReviews',
  async (reviewsData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ingest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.NEXT_PUBLIC_X_API_KEY,
        },
        body: JSON.stringify(reviewsData),
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

const ingestSlice = createSlice({
  name: 'ingest',
  initialState: {
    isUploading: false,
    uploadSuccess: false,
    uploadError: null,
    uploadedCount: 0,
    jsonData: '',
  },
  reducers: {
    setJsonData: (state, action) => {
      state.jsonData = action.payload;
    },
    clearUploadState: (state) => {
      state.uploadSuccess = false;
      state.uploadError = null;
      state.uploadedCount = 0;
    },
    resetIngestState: (state) => {
      state.isUploading = false;
      state.uploadSuccess = false;
      state.uploadError = null;
      state.uploadedCount = 0;
      state.jsonData = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadReviews.pending, (state) => {
        state.isUploading = true;
        state.uploadSuccess = false;
        state.uploadError = null;
      })
      .addCase(uploadReviews.fulfilled, (state, action) => {
        state.isUploading = false;
        state.uploadSuccess = true;
        state.uploadedCount = action.payload.count || 0;
        state.uploadError = null;
      })
      .addCase(uploadReviews.rejected, (state, action) => {
        state.isUploading = false;
        state.uploadSuccess = false;
        state.uploadError = action.payload;
      });
  },
});

export const { setJsonData, clearUploadState, resetIngestState } = ingestSlice.actions;
export default ingestSlice.reducer;
