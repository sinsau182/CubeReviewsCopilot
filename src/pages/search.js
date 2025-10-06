import React, { useState, useEffect } from 'react';
import { Search, Loader2, Target, TrendingUp, Calendar, MapPin, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useDispatch, useSelector } from 'react-redux';
import { searchSimilarReviews, setQuery, clearResults } from '../store/slices/searchSlice';
import { toast } from "sonner";

// Helper functions
const getSentimentColor = (sentiment) => {
  switch (sentiment?.toLowerCase()) {
    case 'positive':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'negative':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'neutral':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const StarRating = ({ rating }) => {
  if (!rating) return null;
  
  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-3 h-3 ${
            star <= rating
              ? 'text-yellow-400 fill-current'
              : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
};

export default function SearchPage() {
  const dispatch = useDispatch();
  const { 
    query, 
    results, 
    isSearching, 
    searchError, 
    hasSearched, 
    lastSearchQuery,
    searchDuration 
  } = useSelector((state) => state.search);

  // Handle error notifications
  useEffect(() => {
    if (searchError) {
      toast.error(`Search failed: ${searchError}`);
    }
  }, [searchError]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      toast.error('Please enter a search query');
      return;
    }

    try {
      await dispatch(searchSimilarReviews({ query: query.trim(), k: 5 }));
      toast.success('Search completed successfully!');
    } catch (error) {
      toast.error('Search failed');
    }
  };

  const handleQueryChange = (value) => {
    dispatch(setQuery(value));
  };

  const handleClearResults = () => {
    dispatch(clearResults());
    dispatch(setQuery(''));
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Similar Reviews Search</h1>
        <p className="text-gray-600">Find reviews similar to your query using TF-IDF and cosine similarity</p>
      </div>

      {/* Search Query Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Search Query</h2>
        <p className="text-gray-600 mb-4">Enter keywords to find similar customer reviews</p>
        
        <form onSubmit={handleSearch}>
          <div className="flex space-x-3">
            <input
              type="text"
              placeholder="e.g. 'long wait time service'"
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-500"
              style={{ color: '#111827' }}
              disabled={isSearching}
            />
            <Button 
              type="submit"
              disabled={isSearching || !query.trim()}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 flex items-center space-x-2 disabled:opacity-50"
            >
              {isSearching ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Search</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Search Results */}
      {hasSearched && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                <Target className="w-5 h-5 text-purple-600" />
                <span>Similar Reviews</span>
              </h2>
              {lastSearchQuery && (
                <p className="text-sm text-gray-600 mt-1">
                  Results for: "{lastSearchQuery}" 
                  {searchDuration && (
                    <span className="ml-2">({searchDuration}ms)</span>
                  )}
                </p>
              )}
            </div>
            {results.length > 0 && (
              <Button onClick={handleClearResults} variant="outline" size="sm">
                Clear Results
              </Button>
            )}
          </div>

          {/* Loading State */}
          {isSearching && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
              <span className="ml-2 text-gray-600">Searching for similar reviews...</span>
            </div>
          )}

          {/* No Results */}
          {!isSearching && results.length === 0 && hasSearched && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No similar reviews found. Try different keywords.</p>
            </div>
          )}

          {/* Results List */}
          {!isSearching && results.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Top {results.length} Similar Reviews
              </h2>
              <div className="space-y-6">
                {results.map((review, index) => (
                  <div key={review.id || index} className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      {review.similarity_score && (
                        <Badge className="bg-blue-100 text-blue-800 text-sm">
                          {(review.similarity_score * 100).toFixed(1)}% match
                        </Badge>
                      )}
                      {review.rating && <StarRating rating={review.rating} />}
                      {review.sentiment && (
                        <Badge className={getSentimentColor(review.sentiment)} variant="outline">
                          {review.sentiment}
                        </Badge>
                      )}
                      {review.topics && review.topics.length > 0 && (
                        <Badge variant="outline" className="bg-gray-50 text-gray-700">
                          {review.topics[0]}
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-gray-800 mb-4 leading-relaxed font-medium">
                      {review.text || review.review || 'No review text available'}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      {review.location && (
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3" />
                          <span>{review.location}</span>
                        </div>
                      )}
                      {review.date && (
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{review.date}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Integration Note - Only show when no search has been performed */}
      {!hasSearched && (
        <Card>
          <CardHeader>
            <CardTitle>Integration Note</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <span className="font-medium">FastAPI Endpoint:</span>
                <code className="ml-2 px-2 py-1 bg-gray-100 rounded text-sm">GET /search?q=&k=5</code>
              </div>
              <div>
                <span>This feature uses </span>
                <span className="font-medium">TF-IDF vectorization</span>
                <span> and </span>
                <span className="font-medium">cosine similarity</span>
                <span> from </span>
                <span className="font-medium">scikit-learn</span>
                <span> to find the most relevant reviews based on semantic similarity.</span>
              </div>
              <div className="text-sm text-gray-600">
                <span>Implementation: Use </span>
                <code className="px-1 bg-gray-100 rounded">TfidfVectorizer</code>
                <span> to create document vectors, then </span>
                <code className="px-1 bg-gray-100 rounded">cosine_similarity</code>
                <span> to rank reviews by relevance.</span>
              </div>
              <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-800">
                  <span className="font-medium">API Response Format:</span> Returns top-k most similar reviews with similarity scores, review details, and metadata.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
