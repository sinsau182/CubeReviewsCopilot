import React, { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, Star, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ReviewDetail from '../components/ReviewDetail';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchReviews, 
  fetchReviewById,
  setLocationFilter, 
  setSentimentFilter, 
  setSearchQuery,
  setCurrentPage,
  clearFilters,
  clearSelectedReview 
} from '../store/slices/reviewsSlice';
import { toast } from "sonner";

const getSentimentColor = (ai_sentiment) => {
  switch (ai_sentiment) {
    case 'POSITIVE':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'NEGATIVE':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'NEUTRAL':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const StarRating = ({ rating }) => {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating
              ? 'text-orange-400 fill-current'
              : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
};

export default function Reviews() {
  const dispatch = useDispatch();
  const { 
    reviews, 
    totalReviews, 
    currentPage, 
    pageSize,
    isLoading, 
    error, 
    filters,
    selectedReview,
    isLoadingReview,
    reviewError
  } = useSelector((state) => state.reviews);

  
  const [availableLocations, setAvailableLocations] = useState([]);

  // Fetch all unique locations from the backend
  const fetchAllLocations = async () => {
    try {
      // Fetch a large number of reviews to get all unique locations
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews?page=1&pagesize=1000`, {
        method: 'GET',
        headers: {
          'x-api-key': process.env.NEXT_PUBLIC_X_API_KEY,
        },
      });

      if (response.ok) {
        const allReviews = await response.json();
        // Extract unique locations
        const locations = [...new Set(
          allReviews
            .map(review => review.location)
            .filter(location => location && location.trim() !== '')
        )].sort();
        
        setAvailableLocations(locations);
        console.log('Fetched unique locations:', locations);
      } else {
        console.error('Failed to fetch locations');
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  // Fetch locations on component mount
  useEffect(() => {
    fetchAllLocations();
  }, []);

  // Load reviews on component mount and when filters/pagination change
  useEffect(() => {
    const loadReviews = () => {
      dispatch(fetchReviews({
        location: filters.location || undefined,
        sentiment: filters.sentiment || undefined,
        q: filters.searchQuery || undefined,
        page: currentPage,
        pagesize: pageSize,
      }));
    };

    loadReviews();
  }, [dispatch, filters, currentPage, pageSize]);

  // Handle error notifications
  useEffect(() => {
    if (error) {
      toast.error(`Failed to load reviews: ${error}`);
    }
    if (reviewError) {
      toast.error(`Failed to load review details: ${reviewError}`);
    }
  }, [error, reviewError]);

  const handleReviewClick = async (review) => {
    try {
      await dispatch(fetchReviewById(review.id));
    } catch (error) {
      toast.error('Failed to load review details');
    }
  };

  const handleBackToReviews = () => {
    dispatch(clearSelectedReview());
  };

  const handleSearchChange = (value) => {
    dispatch(setSearchQuery(value));
  };

  const handleLocationFilterChange = (value) => {
    dispatch(setLocationFilter(value === 'all' ? '' : value));
  };

  const handleSentimentFilterChange = (value) => {
    dispatch(setSentimentFilter(value === 'all' ? '' : value));
  };

  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  // If a review is selected, show the detail view
  if (selectedReview) {
    return <ReviewDetail review={selectedReview} onBack={handleBackToReviews} />;
  }

  // Loading state for review details
  if (isLoadingReview) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          <span className="ml-2 text-gray-600">Loading review details...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Reviews Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Reviews</h1>
        <p className="text-gray-600">Browse, search, and manage customer feedback</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 flex flex-col lg:flex-row gap-4">
        {/* Search Bar */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search reviews..."
            value={filters.searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm text-black placeholder-gray-500"
            style={{ color: '#000000' }}
          />
        </div>

        {/* Location Filter */}
        <div className="relative">
          <select
            value={filters.location || 'all'}
            onChange={(e) => handleLocationFilterChange(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent min-w-[150px] text-black"
            style={{ color: '#000000' }}
          >
            <option value="all">All locations</option>
            {availableLocations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Sentiment Filter */}
        <div className="relative">
          <select
            value={filters.sentiment || 'all'}
            onChange={(e) => handleSentimentFilterChange(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent min-w-[150px] text-black"
            style={{ color: '#000000' }}
          >
            <option value="all">All sentiments</option>
            <option value="POSITIVE">Positive</option>
            <option value="NEGATIVE">Negative</option>  
            <option value="NEUTRAL">Neutral</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Clear Filters Button */}
        {(filters.searchQuery || filters.location || filters.sentiment) && (
          <Button
            onClick={handleClearFilters}
            variant="outline"
            className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          <span className="ml-2 text-gray-600">Loading reviews...</span>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="text-center py-12">
          <div className="text-red-600 mb-2">Failed to load reviews</div>
          <Button 
            onClick={() => dispatch(fetchReviews({ 
              location: filters.location || undefined,
              sentiment: filters.sentiment || undefined,
              q: filters.searchQuery || undefined,
              page: currentPage,
              pagesize: pageSize,
            }))}
            variant="outline"
          >
            Try Again
          </Button>
        </div>
      )}

      {/* Reviews List */}
      {!isLoading && !error && (
        <div className="space-y-6">
          {reviews.map((review) => (
          <div 
            key={review.id} 
            className="bg-white rounded-lg border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow" 
            style={{ color: '#000000' }}
            onClick={() => handleReviewClick(review)}
          >
            {/* Rating and Sentiment */}
            <div className="flex items-center justify-between mb-4">
              <StarRating rating={review.rating} />
              <div className="flex items-center space-x-3">
                <Badge className={getSentimentColor(review.ai_sentiment)} variant="outline">
                  {review.ai_sentiment}
                </Badge>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {review.ai_topic || 'General'}
                </Badge>
              </div>
            </div>

            {/* Review Text */}
            <p className="mb-4 leading-relaxed font-medium" style={{ color: '#000000' }}>
              {review.text || review.review}
            </p>

            {/* Location and Date */}
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <MapPin className="w-3 h-3" />
                <span>{review.location}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>{review.date}</span>
              </div>
            </div>
          </div>
          ))}

          {/* No Reviews Found */}
          {reviews.length === 0 && (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews found</h3>
              <p className="text-gray-500">Try adjusting your search terms or filters.</p>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && !error && totalReviews > pageSize && (
        <div className="mt-8 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalReviews)} of {totalReviews} reviews
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="px-3 py-2 text-sm text-gray-700">
              Page {currentPage} of {Math.ceil(totalReviews / pageSize)}
            </span>
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= Math.ceil(totalReviews / pageSize)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
