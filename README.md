# Reviews Copilot Frontend

A modern React/Next.js dashboard for managing and analyzing customer reviews with AI-powered insights.

## Features

- **Analytics Dashboard** - Real-time review metrics and sentiment analysis
- **Review Management** - Browse, search, and filter customer reviews
- **AI-Powered Search** - Find similar reviews using TF-IDF semantic matching
- **Data Ingestion** - Upload review data via JSON files
- **Smart Filtering** - Filter by location, sentiment, and keywords
- **Mobile Responsive** - Optimized for all screen sizes

## Quick Start

1. **Install dependencies**
```bash
npm install
```

2. **Configure environment**
```bash
# Create .env.local file
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_X_API_KEY=your-api-key
```

3. **Run development server**
```bash
npm run dev
```

4. **Open application**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Ensure backend API is running on port 8000

## Tech Stack

- **Framework**: Next.js 15.5.4 with React 19.1.0
- **Styling**: Tailwind CSS 4 + shadcn/ui components
- **State Management**: Redux Toolkit
- **Charts**: Recharts
- **Icons**: Lucide React
- **Notifications**: Sonner

## Pages

- `/` - Navigation hub
- `/dashboard` - Analytics and metrics
- `/reviews` - Review management with search/filter
- `/search` - AI-powered similar review finder
- `/ingest` - Data upload interface

## API Integration

All API calls use environment variables and include proper authentication headers. Backend endpoints:
- `GET /reviews` - Fetch reviews with pagination/filtering
- `GET /analytics` - Dashboard metrics
- `POST /search` - Similar review search
- `POST /ingest` - Upload review data

## Deployment

Ready for deployment on Vercel, Netlify, or any static hosting platform. Ensure environment variables are configured in your hosting provider.
