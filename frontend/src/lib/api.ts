import axios from 'axios';
import type {
    Restaurant,
    TrendsData,
    TopRestaurantsData,
    FilteredAnalytics,
    FilterMeta,
    RestaurantFilters,
    AnalyticsFilters,
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    timeout: 10000, // 10s timeout
});

// Robust Retry Logic
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const config = error.config;

        // If config does not exist or the retry option is not set, reject
        if (!config || !config.retry) {
            config.retry = 0;
        }

        // Check if we should retry (Network Error or 5xx)
        // Limit to 3 retries
        if (config.retry < 3 && (error.code === 'ERR_NETWORK' || (error.response && error.response.status >= 500))) {
            config.retry += 1;

            // Exponential backoff: 1s, 2s, 4s
            const delay = Math.pow(2, config.retry - 1) * 1000;

            await new Promise(resolve => setTimeout(resolve, delay));

            return api(config);
        }

        return Promise.reject(error);
    }
);

// Restaurant API
export const restaurantApi = {
    // Get all restaurants with optional filters
    getAll: async (filters?: RestaurantFilters): Promise<Restaurant[]> => {
        const params = new URLSearchParams();
        if (filters?.search) params.append('search', filters.search);
        if (filters?.location) params.append('location', filters.location);
        if (filters?.cuisine) params.append('cuisine', filters.cuisine);
        if (filters?.sort) params.append('sort', filters.sort);
        if (filters?.order) params.append('order', filters.order);

        const response = await api.get(`/restaurants?${params.toString()}`);
        return response.data.data;
    },

    // Get single restaurant with stats
    getById: async (id: number): Promise<Restaurant> => {
        const response = await api.get(`/restaurants/${id}`);
        return response.data.data;
    },

    // Get filter options (locations, cuisines)
    getMeta: async (): Promise<{ locations: string[]; cuisines: string[] }> => {
        const response = await api.get('/restaurants/meta');
        return response.data.data;
    },
};

// Analytics API
export const analyticsApi = {
    // Get order trends for a restaurant
    getTrends: async (
        restaurantId: number,
        startDate: string,
        endDate: string
    ): Promise<TrendsData> => {
        const params = new URLSearchParams({
            restaurant_id: restaurantId.toString(),
            start_date: startDate,
            end_date: endDate,
        });
        const response = await api.get(`/analytics/trends?${params.toString()}`);
        return response.data.data;
    },

    // Get top restaurants by revenue
    getTopRestaurants: async (
        startDate: string,
        endDate: string,
        limit: number = 3
    ): Promise<TopRestaurantsData> => {
        const params = new URLSearchParams({
            start_date: startDate,
            end_date: endDate,
            limit: limit.toString(),
        });
        const response = await api.get(`/analytics/top-restaurants?${params.toString()}`);
        return response.data.data;
    },

    // Apply complex filters
    getFiltered: async (filters: AnalyticsFilters): Promise<FilteredAnalytics> => {
        const body: Record<string, unknown> = {
            group_by: filters.group_by || 'day',
        };

        if (filters.restaurant_id) {
            body.restaurant_id = filters.restaurant_id;
        }

        if (filters.start_date && filters.end_date) {
            body.date_range = {
                start: filters.start_date,
                end: filters.end_date,
            };
        }

        if (filters.min_amount !== undefined || filters.max_amount !== undefined) {
            body.amount_range = {
                min: filters.min_amount,
                max: filters.max_amount,
            };
        }

        if (filters.start_hour !== undefined && filters.end_hour !== undefined) {
            body.hour_range = {
                start: filters.start_hour,
                end: filters.end_hour,
            };
        }

        const response = await api.post('/analytics/filter', body);
        return response.data.data;
    },

    // Get filter metadata
    getMeta: async (): Promise<FilterMeta> => {
        const response = await api.get('/analytics/meta');
        return response.data.data;
    },
};

export default api;
