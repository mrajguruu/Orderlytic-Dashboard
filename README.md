# OrderLytic - Restaurant Analytics Dashboard

A full-stack analytics dashboard for restaurant performance tracking.

> 📌 This project was built as a **take-home assignment** for the Kitchen Spurs Full Stack Developer role using provided mock data.

## Architecture Walkthrough (Optional)

A short technical walkthrough explaining architectural decisions, data flow, and UX considerations:

▶ Video walkthrough: https://drive.google.com/file/d/1fwPWNGByR6M-omXitkplVu74eloHB2fE/view?usp=sharing

## 🚀 Tech Stack

### Backend
- **Laravel 11** - PHP Framework
- **PHP 8.2** - Server-side language
- **MySQL 8.0** - Database
- **File-based caching** - For API response caching

### Frontend
- **Next.js 14** - React Framework (App Router)
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI Components
- **Recharts** - Data visualization
- **React Query (TanStack)** - Data fetching & caching
- **Axios** - HTTP client

## 📋 Features

### 1. Restaurant List
- Browse all restaurants in a responsive grid
- Search restaurants by name
- Filter by location and cuisine
- Sort by name, location, or cuisine (ascending/descending)
- View quick stats (orders, revenue, avg order value)

### 2. Analytics Dashboard
For each restaurant, view detailed analytics with:
- **Daily Orders Count** - Bar chart
- **Daily Revenue** - Line chart
- **Average Order Value** - Line chart
- **Peak Order Hour** - Bar chart showing busiest hour per day

### 3. Top Restaurants
- View top 3 (or more) restaurants ranked by revenue
- Configurable date range
- Revenue share percentage
- Quick access to individual analytics

### 4. Advanced Filters
- Filter by specific restaurant
- Date range selection
- **Amount range filters** (min/max order amount)
- **Hour range filters** (orders between specific hours)
- Group results by Day / Hour / Restaurant
- Visual breakdown with charts and data tables

## 🛠️ Prerequisites

Before running this project, ensure you have:

- **PHP 8.2+** (via XAMPP, Laragon, or standalone)
- **Composer 2.x** (PHP package manager)
- **Node.js 18+** (for frontend)
- **npm 9+** or yarn
- **MySQL 8.0+** (via XAMPP or standalone)

## 📦 Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/orderlytic.git
cd orderlytic
```

### Step 2: Backend Setup (Laravel)

```bash
# Navigate to backend
cd backend

# Install PHP dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Create database (use phpMyAdmin or command line)
# Database name: orderlytic

# Run migrations and seed data
php artisan migrate:fresh --seed

# Start the development server
php artisan serve
```

The API will be available at `http://localhost:8000`

### Step 3: Frontend Setup (Next.js)

```bash
# Navigate to frontend (from project root)
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

## 🔌 API Endpoints

### Restaurants

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/restaurants` | List all restaurants with optional filters |
| GET | `/api/restaurants/{id}` | Get single restaurant with stats |
| GET | `/api/restaurants/meta` | Get filter options (locations, cuisines) |

**Query Parameters for `/api/restaurants`:**
- `search` - Search by name
- `location` - Filter by location
- `cuisine` - Filter by cuisine
- `sort` - Sort field (name, location, cuisine)
- `order` - Sort order (asc, desc)

### Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/trends` | Get daily metrics for a restaurant |
| GET | `/api/analytics/top-restaurants` | Get top restaurants by revenue |
| POST | `/api/analytics/filter` | Apply complex filters |
| GET | `/api/analytics/meta` | Get filter metadata |

**Query Parameters for `/api/analytics/trends`:**
- `restaurant_id` (required) - Restaurant ID
- `start_date` (required) - Start date (YYYY-MM-DD)
- `end_date` (required) - End date (YYYY-MM-DD)

**Query Parameters for `/api/analytics/top-restaurants`:**
- `start_date` (required) - Start date (YYYY-MM-DD)
- `end_date` (required) - End date (YYYY-MM-DD)
- `limit` (optional) - Number of results (default: 3, max: 10)

## 📊 Data

The project includes mock data:
- **4 Restaurants** across different locations and cuisines
- **200 Orders** spanning 7 days (June 22-28, 2025)

### Restaurants
| ID | Name | Location | Cuisine |
|----|------|----------|---------|
| 101 | Tandoori Treats | Bangalore | North Indian |
| 102 | Sushi Bay | Mumbai | Japanese |
| 103 | Pasta Palace | Delhi | Italian |
| 104 | Burger Hub | Hyderabad | American |

## 📱 Responsive Design

The dashboard is fully responsive:
- **Mobile** (< 640px): Single column layout, collapsible filters
- **Tablet** (640-1024px): 2-3 column grid
- **Desktop** (> 1024px): Full 4-column grid with side-by-side charts

## 🌟 Advanced Enhancements

Beyond the core assessment requirements, this project includes several usability and performance enhancements:

### 1. High-Performance Architecture
- **Server-Side File Caching**: API responses are cached to reduce database load and improve response times.
- **Client-Side Data Caching**: Uses React Query handling stale time and background refetching.
- **Optimized Rendering**: Memoized heavy chart components (Pie Charts) to prevent unnecessary re-rendering.

### 2. UI/UX Experience
- **Dark Mode Support**: Theme switching implemented using Tailwind’s class strategy with minimal re-rendering.
- **Professional Analytics Cards**: Custom-designed metric cards with varying visual hierarchies (Solid colors vs Outlines) depending on context.
- **Polished Data Visualization**:
  - Interactive charts with custom tooltips (Dark mode aware).
  - No-data states and Skeleton loading animations.
  - "Top Performer" highlights with golden ring accents.

### 3. Advanced Analytics Capabilities
- **Hourly Breakdown**: Ability to drill down into specific operating hours (e.g., "Lunch Rush" 12PM-2PM).
- **Amount Range Filtering**: Filter orders based on value ranges (Low/Medium/High ticket orders).
- **Multi-dimension Grouping**: API supports grouping data by Day, Hour, or Restaurant dynamically.

### 4. Code Quality
- **Type Safety**: Full TypeScript implementation with shared types.
- **Clean Code Architecture**: Service-Repository pattern in Laravel, Custom Hooks in React.
- **Production-Oriented Setup**: Proper environment configuration, error boundaries, and loading states implemented for a realistic deployment setup.

## 🗂️ Project Structure

```
orderlytic/
├── backend/                    # Laravel API
│   ├── app/
│   │   ├── Http/Controllers/Api/
│   │   ├── Models/
│   │   ├── Repositories/
│   │   └── Services/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   ├── resources/data/         # JSON data files
│   └── routes/api.php
│
├── frontend/                   # Next.js App
│   ├── src/
│   │   ├── app/               # Pages (App Router)
│   │   ├── components/        # React components
│   │   ├── hooks/             # Custom hooks
│   │   ├── lib/               # API client, utilities
│   │   └── types/             # TypeScript types
│
├── restaurants.json            # Source data
├── orders.json                 # Source data
└── README.md
```

## 🧪 Testing the API

```bash
# Get all restaurants
curl http://localhost:8000/api/restaurants

# Get restaurant with stats
curl http://localhost:8000/api/restaurants/101

# Get analytics trends
curl "http://localhost:8000/api/analytics/trends?restaurant_id=101&start_date=2025-06-22&end_date=2025-06-28"

# Get top restaurants
curl "http://localhost:8000/api/analytics/top-restaurants?start_date=2025-06-22&end_date=2025-06-28&limit=3"
```

## 🚀 Deployment

### Backend (Laravel)
Can be deployed to:
- Render (Free tier)
- Railway
- Heroku
- Any PHP hosting with MySQL

### Frontend (Next.js)
Can be deployed to:
- Vercel (Recommended, Free tier)
- Netlify
- AWS Amplify

### Deployment Note
> ℹ️ Note: Free-tier deployments may experience cold-start delays on the first request.

### Environment Variables

**Backend (.env):**
```
DB_CONNECTION=mysql
DB_HOST=your-db-host
DB_DATABASE=orderlytic
DB_USERNAME=your-username
DB_PASSWORD=your-password
```

**Frontend (.env.local):**
```
NEXT_PUBLIC_API_URL=https://your-api-url.com/api
```

## ⚠️ Known Limitations

- Uses mock data and file-based caching for demonstration purposes.
- Not designed for concurrent multi-user access.
- Authentication and authorization are intentionally excluded as they were outside the assignment scope.

## 👤 Author

**Mohit Rajguru**  
Full Stack Developer | Laravel • React • Analytics Systems

## 📄 License

This project was created solely as a take-home assignment for Kitchen Spurs using provided mock data and is intended for evaluation and portfolio demonstration purposes only.

---

Built with ❤️ for Kitchen Spurs
