import React, { useState } from 'react';
import { BarChart3, MessageSquare, Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Dashboard from './dashboard';
import Reviews from './reviews';
import SearchPage from './search';
import Ingest from './ingest';

const pages = {
  dashboard: 'dashboard',
  reviews: 'reviews',
  search: 'search',
  ingest: 'ingest'
};

export default function Home() {
  const [activePage, setActivePage] = useState(pages.dashboard);

  const renderPage = () => {
    switch (activePage) {
      case pages.dashboard:
        return <Dashboard />;
      case pages.reviews:
        return <Reviews />;
      case pages.search:
        return <SearchPage />;
      case pages.ingest:
        return <Ingest />;
      default:
        return <Dashboard />;
    }
  };

  const isActive = (page) => activePage === page;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center space-x-8 py-4">
            <h2 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Reviews Copilot
            </h2>
            <nav className="flex space-x-1">
              <Button 
                variant={isActive(pages.dashboard) ? "default" : "ghost"}
                size="sm" 
                className={`rounded-md px-4 py-2 flex items-center space-x-2 ${
                  isActive(pages.dashboard) 
                    ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                onClick={() => setActivePage(pages.dashboard)}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Dashboard</span>
              </Button>
              <Button 
                variant={isActive(pages.reviews) ? "default" : "ghost"}
                size="sm" 
                className={`rounded-md px-4 py-2 flex items-center space-x-2 ${
                  isActive(pages.reviews) 
                    ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                onClick={() => setActivePage(pages.reviews)}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Reviews</span>
              </Button>
              <Button 
                variant={isActive(pages.search) ? "default" : "ghost"}
                size="sm" 
                className={`rounded-md px-4 py-2 flex items-center space-x-2 ${
                  isActive(pages.search) 
                    ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                onClick={() => setActivePage(pages.search)}
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </Button>
              <Button 
                variant={isActive(pages.ingest) ? "default" : "ghost"}
                size="sm" 
                className={`rounded-md px-4 py-2 flex items-center space-x-2 ${
                  isActive(pages.ingest) 
                    ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                onClick={() => setActivePage(pages.ingest)}
              >
                <Plus className="w-4 h-4" />
                <span>Ingest</span>
              </Button>
            </nav>
          </div>
        </div>
      </div>

      {/* Dynamic Page Content */}
      {renderPage()}
    </div>
  );
}
