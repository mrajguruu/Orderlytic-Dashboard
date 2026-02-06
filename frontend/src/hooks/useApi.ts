'use client';

import { useQuery } from '@tanstack/react-query';
import { restaurantApi, analyticsApi } from '@/lib/api';
import type { RestaurantFilters } from '@/types';

// Restaurant hooks
export function useRestaurants(filters?: RestaurantFilters) {
    return useQuery({
        queryKey: ['restaurants', filters],
        queryFn: () => restaurantApi.getAll(filters),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

export function useRestaurant(id: number) {
    return useQuery({
        queryKey: ['restaurant', id],
        queryFn: () => restaurantApi.getById(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
    });
}

export function useRestaurantMeta() {
    return useQuery({
        queryKey: ['restaurant-meta'],
        queryFn: () => restaurantApi.getMeta(),
        staleTime: 60 * 60 * 1000, // 1 hour
    });
}

// Analytics hooks
export function useAnalyticsTrends(
    restaurantId: number,
    startDate: string,
    endDate: string
) {
    return useQuery({
        queryKey: ['analytics-trends', restaurantId, startDate, endDate],
        queryFn: () => analyticsApi.getTrends(restaurantId, startDate, endDate),
        enabled: !!restaurantId && !!startDate && !!endDate,
        staleTime: 15 * 60 * 1000, // 15 minutes
    });
}

export function useTopRestaurants(
    startDate: string,
    endDate: string,
    limit: number = 3
) {
    return useQuery({
        queryKey: ['top-restaurants', startDate, endDate, limit],
        queryFn: () => analyticsApi.getTopRestaurants(startDate, endDate, limit),
        enabled: !!startDate && !!endDate,
        staleTime: 15 * 60 * 1000,
    });
}

export function useAnalyticsMeta() {
    return useQuery({
        queryKey: ['analytics-meta'],
        queryFn: () => analyticsApi.getMeta(),
        staleTime: 60 * 60 * 1000, // 1 hour
    });
}
