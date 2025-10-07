import React, { useState, useEffect } from 'react';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useDispatch, useSelector } from 'react-redux';
import { uploadReviews, setJsonData, clearUploadState } from '../store/slices/ingestSlice';
import { toast } from "sonner";

export default function Ingest() {
  const dispatch = useDispatch();
  const { isUploading, uploadSuccess, uploadError, uploadedCount, jsonData } = useSelector(
    (state) => state.ingest
  );

  const handleUpload = async () => {
    if (!jsonData.trim()) {
      toast.error('Please enter JSON data before uploading');
      return;
    }

    try {
      // Parse JSON to validate format
      const parsedData = JSON.parse(jsonData);
      
      // Ensure it's an array
      const reviewsArray = Array.isArray(parsedData) ? parsedData : [parsedData];
      
      // Dispatch the upload action
      const result = await dispatch(uploadReviews(reviewsArray));
      
      if (uploadReviews.fulfilled.match(result)) {
        toast.success(`Successfully uploaded reviews!`);
      }
    } catch (error) {
      toast.error('Invalid JSON format. Please check your data.');
    }
  };

  const handleJsonChange = (value) => {
    dispatch(setJsonData(value));
  };

  // Clear upload state when component unmounts or when needed
  useEffect(() => {
    if (uploadError) {
      toast.error(`Upload failed: ${uploadError}`);
    }
  }, [uploadError]);

  const loadExample = () => {
    const exampleData = `[
  {
    "id": "12345",
    "location": "NYC",
    "rating": 4,
    "text": "Great service and friendly staff!",
    "date": "2025-10-05"
  },
  {
    "id": "12346", 
    "location": "LA",
    "rating": 5,
    "text": "Amazing experience, highly recommend!",
    "date": "2025-10-04"
  }
]`;
    handleJsonChange(exampleData);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Ingest Reviews</h1>
        <p className="text-gray-600">Upload customer reviews in JSON format</p>
      </div>

      {/* Upload JSON Data Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Upload JSON Data</CardTitle>
          <CardDescription>
            Paste a JSON array of review objects with id, location, rating, text, and date fields
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <textarea
              value={jsonData}
              onChange={(e) => handleJsonChange(e.target.value)}
              placeholder="Paste your JSON data here..."
              className="w-full h-64 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
              disabled={isUploading}
            />
            <div className="flex space-x-3">
              <Button 
                onClick={handleUpload}
                disabled={isUploading || !jsonData.trim()}
                className="bg-purple-600 hover:bg-purple-700 text-white flex items-center space-x-2 disabled:opacity-50"
              >
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>Upload Reviews</span>
                  </>
                )}
              </Button>
              <Button 
                onClick={loadExample}
                variant="outline"
                disabled={isUploading}
                className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50"
              >
                Load Example
              </Button>
            </div>

            {/* Upload Status */}
            {uploadSuccess && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-green-800">
                  Successfully uploaded reviews!
                </span>
              </div>
            )}

            {uploadError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="text-red-800">
                  Upload failed: {uploadError}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Expected Format Section */}
      <Card>
        <CardHeader>
          <CardTitle>Expected JSON Format</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 rounded-lg p-4">
            <pre className="text-sm text-gray-700 overflow-x-auto">
{`{
  "id": number,        // Unique review ID
  "location": string,  // Store location (e.g., "NYC", "SF")
  "rating": number,    // 1-5 star rating
  "text": string,      // Review text content
  "date": string       // ISO date format (YYYY-MM-DD)
}`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
