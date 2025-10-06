import { configureStore } from '@reduxjs/toolkit';
import ingestReducer from './slices/ingestSlice';
import reviewsReducer from './slices/reviewsSlice';
import analyticsReducer from './slices/analyticsSlice';
import searchReducer from './slices/searchSlice';

export const store = configureStore({
  reducer: {
    ingest: ingestReducer,
    reviews: reviewsReducer,
    analytics: analyticsReducer,
    search: searchReducer,
  },
});
