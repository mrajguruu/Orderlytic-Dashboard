// Restaurant Types
export interface Restaurant {
  id: number;
  name: string;
  location: string;
  cuisine: string;
  stats: RestaurantStats;
}

export interface RestaurantStats {
  total_orders: number;
  total_revenue: number;
  avg_order_value: number;
}

// Analytics Types
export interface DailyMetric {
  date: string;
  day_of_week: string;
  order_count: number;
  total_revenue: number;
  avg_order_value: number;
  peak_hour: PeakHour;
}

export interface PeakHour {
  hour: number;
  hour_formatted: string;
  order_count: number;
}

export interface TrendsData {
  restaurant: {
    id: number;
    name: string;
  };
  date_range: {
    start: string;
    end: string;
    days: number;
  };
  daily_metrics: DailyMetric[];
  summary: {
    total_orders: number;
    total_revenue: number;
    avg_order_value: number;
    most_common_peak_hour: number;
    most_common_peak_hour_formatted: string;
  };
}

export interface TopRestaurant {
  rank: number;
  restaurant: {
    id: number;
    name: string;
    location: string;
    cuisine: string;
  };
  metrics: {
    total_revenue: number;
    total_orders: number;
    avg_order_value: number;
    revenue_percentage: number;
  };
}

export interface TopRestaurantsData {
  date_range: {
    start: string;
    end: string;
  };
  total_restaurants_analyzed: number;
  rankings: TopRestaurant[];
}

export interface FilteredAnalytics {
  filters_applied: Record<string, string>;
  summary: {
    filtered_orders: number;
    total_revenue: number;
    avg_order_value: number;
  };
  breakdown: {
    group: string;
    order_count: number;
    total_revenue: number;
    avg_order_value: number;
  }[];
}

export interface FilterMeta {
  date_range: {
    min_date: string;
    max_date: string;
  };
  locations: string[];
  cuisines: string[];
  hours: number[];
}

// Filter types
export interface RestaurantFilters {
  search?: string;
  location?: string;
  cuisine?: string;
  sort?: 'name' | 'location' | 'cuisine';
  order?: 'asc' | 'desc';
}

export interface AnalyticsFilters {
  restaurant_id?: number;
  start_date: string;
  end_date: string;
  min_amount?: number;
  max_amount?: number;
  start_hour?: number;
  end_hour?: number;
  group_by?: 'day' | 'hour' | 'restaurant';
}
