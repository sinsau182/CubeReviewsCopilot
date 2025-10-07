import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Calendar, Star, Sparkles, Copy, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from "sonner";
import { useDispatch, useSelector } from 'react-redux';
import { suggestReply, clearReplyData } from '../store/slices/reviewsSlice';

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

export default function ReviewDetail({ review, onBack }) {
  const dispatch = useDispatch();
  const { replyData, isGeneratingReply, replyError } = useSelector((state) => state.reviews);
  
  // Clear reply data when component mounts or review changes
  useEffect(() => {
    return () => {
      dispatch(clearReplyData());
    };
  }, [dispatch, review.id]);

  // Handle reply error notifications
  useEffect(() => {
    if (replyError) {
      toast.error(`Failed to generate reply: ${replyError}`);
    }
  }, [replyError]);

  const handleGenerateReply = async () => {
    try {
      await dispatch(suggestReply(review.id));
      toast.success('Reply generated successfully!');
    } catch (error) {
      toast.error('Failed to generate reply');
    }
  };

  const handleCopyReply = () => {
  const replyText = replyData?.reply || '';
  
  if (navigator.clipboard && window.isSecureContext) {
    // HTTPS and modern browsers
    navigator.clipboard.writeText(replyText);
  } else {
    // Fallback for HTTP: create a temporary textarea
    const textArea = document.createElement("textarea");
    textArea.value = replyText;
    textArea.style.position = "fixed"; // avoid scrolling to bottom
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('Copy to clipboard failed', err);
    }
    document.body.removeChild(textArea);
  }
  toast.success('Reply copied to clipboard!');
};


  const handleRegenerate = async () => {
    try {
      await dispatch(suggestReply(review.id));
      toast.success('Reply regenerated successfully!');
    } catch (error) {
      toast.error('Failed to regenerate reply');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Reviews</span>
      </button>

      {/* Review Details */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        {/* Rating and Sentiment */}
        <div className="flex items-center justify-between mb-4">
          <StarRating rating={review.rating} />
          <div className="flex items-center space-x-3">
          </div>
        </div>

        {/* Review Title */}
        <h1 className="text-2xl font-bold text-black mb-4">Review #{review.id}</h1>

        {/* Location and Date */}
        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6">
          <div className="flex items-center space-x-1">
            <MapPin className="w-3 h-3" />
            <span>{review.location}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>{review.date}</span>
          </div>
        </div>

        {/* Review Text */}
        <p className="text-black leading-relaxed text-lg">
          {review.text || review.review}
        </p>
      </div>

      {/* AI-Suggested Reply Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-lg">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <span>AI-Suggested Reply</span>
          </CardTitle>
          <CardDescription>
            Generate an empathetic response using AI. Edit before sending.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!replyData && !isGeneratingReply && (
            <Button 
              onClick={handleGenerateReply}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate AI Reply</span>
            </Button>
          )}

          {isGeneratingReply && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Generating empathetic response...</p>
            </div>
          )}

          {replyData && !isGeneratingReply && (
            <div>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-black leading-relaxed">
                  {replyData.reply}
                </p>
              </div>
              
              {/* Reply Analysis */}
              {replyData.reasoning && (
                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-blue-900 mb-2">AI Analysis</h4>
                  <div className="text-sm text-blue-800 space-y-1">
                    <p><strong>Detected Sentiment:</strong> {replyData.sentiment}</p>
                    <p><strong>Main Topic:</strong> {replyData.topic}</p>
                    <p><strong>Reasoning:</strong> {replyData.reasoning}</p>
                  </div>
                </div>
              )}
              <div className="flex space-x-3">
                <Button 
                  onClick={handleCopyReply}
                  variant="outline" 
                  className="flex items-center space-x-2 bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy Reply</span>
                </Button>
                <Button 
                  onClick={handleRegenerate}
                  variant="outline" 
                  className="flex items-center space-x-2 bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Regenerate</span>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Integration Note */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Integration Note</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="font-medium text-black mb-2">FastAPI Endpoint:</p>
              <code className="bg-gray-100 px-3 py-1 rounded text-sm">
                POST /reviews/{review.id}/suggest-reply
              </code>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              This feature calls your FastAPI backend to generate AI-powered reply suggestions using LLM or Hugging Face transformers.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
