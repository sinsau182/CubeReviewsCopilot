import React, { useEffect } from 'react';
import { BarChart3, TrendingUp, TrendingDown, Minus, RefreshCw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CustomBarChart from '../components/CustomBarChart';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAnalytics, clearError } from '../store/slices/analyticsSlice';
import { toast } from "sonner";

export default function Dashboard() {
  const dispatch = useDispatch();
  const {
    totalReviews,
    averageRating,
    positiveRate,
    negativeCount,
    sentimentDistribution,
    topicDistribution,
    locationBreakdown,
    isLoading,
    error,
    lastUpdated,
  } = useSelector((state) => state.analytics);

  // Load analytics data on component mount
  useEffect(() => {
    dispatch(fetchAnalytics());
  }, [dispatch]);

  // Handle error notifications
  useEffect(() => {
    if (error) {
      toast.error(`Failed to load analytics: ${error}`);
    }
  }, [error]);

  // Transform data for charts
  const sentimentData = Object.entries(sentimentDistribution || {}).map(([name, value]) => ({
    name,
    value,
    color: name === 'Positive' ? '#22C55E' : name === 'Negative' ? '#EF4444' : '#F59E0B'
  }));

  const topicData = Object.entries(topicDistribution || {}).map(([name, value], index) => ({
    name,
    value,
    color: '#8B5CF6',
    showTooltip: index === 0 // Show tooltip for first item
  }));

  const locationData = Object.entries(locationBreakdown || {}).map(([name, value]) => ({
    name,
    value,
    color: '#3B82F6'
  }));

  const handleRefresh = () => {
    dispatch(fetchAnalytics());
  };
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Dashboard Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">Overview of customer reviews and sentiment analysis</p>
          {lastUpdated && (
            <p className="text-xs text-gray-500 mt-1">
              Last updated: {new Date(lastUpdated).toLocaleString()}
            </p>
          )}
        </div>
        <Button
          onClick={handleRefresh}
          disabled={isLoading}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'Refreshing...' : 'Refresh'}</span>
        </Button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          <span className="ml-2 text-gray-600">Loading analytics...</span>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="text-center py-12">
          <div className="text-red-600 mb-2">Failed to load analytics data</div>
          <Button onClick={handleRefresh} variant="outline">
            Try Again
          </Button>
        </div>
      )}

      {/* Analytics Content */}
      {!isLoading && !error && (
        <>
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Total Reviews */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-700">Total Reviews</h3>
                <BarChart3 className="w-4 h-4 text-gray-400" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{totalReviews}</div>
              <p className="text-sm text-gray-500">Across all locations</p>
            </div>

            {/* Average Rating */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-700">Average Rating</h3>
                <TrendingUp className={`w-4 h-4 ${averageRating >= 3.5 ? 'text-green-500' : averageRating >= 2.5 ? 'text-yellow-500' : 'text-red-500'}`} />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{averageRating.toFixed(1)}/5</div>
              <p className="text-sm text-gray-500">Overall customer satisfaction</p>
            </div>

            {/* Positive Rate */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-700">Positive Rate</h3>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{positiveRate}%</div>
              <p className="text-sm text-gray-500">Customer satisfaction rate</p>
            </div>

            {/* Negative Count */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-700">Negative Reviews</h3>
                <TrendingDown className="w-4 h-4 text-red-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{negativeCount}</div>
              <p className="text-sm text-gray-500">Requiring attention</p>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Sentiment Distribution */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Sentiment Distribution</h3>
              <p className="text-sm text-gray-600 mb-6">Breakdown of customer sentiment across all reviews</p>
              <CustomBarChart data={sentimentData} height={240} />
            </div>

            {/* Topic Distribution */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Topic Distribution</h3>
              <p className="text-sm text-gray-600 mb-6">Common topics mentioned in customer feedback</p>
              <CustomBarChart data={topicData} height={240} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
