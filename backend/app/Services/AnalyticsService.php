<?php

namespace App\Services;

use App\Models\Restaurant;
use App\Repositories\OrderRepository;
use App\Repositories\RestaurantRepository;
use Carbon\Carbon;

class AnalyticsService
{
    public function __construct(
        private RestaurantRepository $restaurantRepository,
        private OrderRepository $orderRepository
    ) {}

    /**
     * Get order trends for a restaurant
     */
    public function getOrderTrends(int $restaurantId, string $startDate, string $endDate): array
    {
        $restaurant = Restaurant::find($restaurantId);
        
        if (!$restaurant) {
            return ['error' => 'Restaurant not found'];
        }

        $dailyMetrics = $this->orderRepository->getDailyMetrics($restaurantId, $startDate, $endDate);

        // Calculate summary
        $totalOrders = array_sum(array_column($dailyMetrics, 'order_count'));
        $totalRevenue = array_sum(array_column($dailyMetrics, 'total_revenue'));
        $avgOrderValue = $totalOrders > 0 ? $totalRevenue / $totalOrders : 0;

        // Find most common peak hour
        $peakHours = array_column(array_column($dailyMetrics, 'peak_hour'), 'hour');
        $peakHourCounts = array_count_values($peakHours);
        arsort($peakHourCounts);
        $mostCommonPeakHour = array_key_first($peakHourCounts) ?? 0;

        return [
            'restaurant' => [
                'id' => $restaurant->id,
                'name' => $restaurant->name,
            ],
            'date_range' => [
                'start' => $startDate,
                'end' => $endDate,
                'days' => Carbon::parse($startDate)->diffInDays(Carbon::parse($endDate)) + 1,
            ],
            'daily_metrics' => $dailyMetrics,
            'summary' => [
                'total_orders' => $totalOrders,
                'total_revenue' => round($totalRevenue, 2),
                'avg_order_value' => round($avgOrderValue, 2),
                'most_common_peak_hour' => $mostCommonPeakHour,
                'most_common_peak_hour_formatted' => Carbon::createFromTime($mostCommonPeakHour, 0)->format('g:i A'),
            ],
        ];
    }

    /**
     * Get top restaurants by revenue
     */
    public function getTopRestaurants(string $startDate, string $endDate, int $limit = 3): array
    {
        $topRestaurants = $this->orderRepository->getTopRestaurantsByRevenue($startDate, $endDate, $limit);

        return [
            'date_range' => [
                'start' => $startDate,
                'end' => $endDate,
            ],
            'total_restaurants_analyzed' => Restaurant::count(),
            'rankings' => $topRestaurants,
        ];
    }

    /**
     * Apply complex filters and get analytics
     */
    public function getFilteredAnalytics(array $filters): array
    {
        $analytics = $this->orderRepository->getFilteredAnalytics($filters);

        // Build filters applied description
        $filtersApplied = [];

        if (!empty($filters['restaurant_id'])) {
            $restaurant = Restaurant::find($filters['restaurant_id']);
            $filtersApplied['restaurant'] = $restaurant ? "{$restaurant->name} (ID: {$restaurant->id})" : "ID: {$filters['restaurant_id']}";
        }

        if (!empty($filters['start_date']) && !empty($filters['end_date'])) {
            $filtersApplied['date_range'] = "{$filters['start_date']} to {$filters['end_date']}";
        }

        if (!empty($filters['min_amount']) || !empty($filters['max_amount'])) {
            $min = $filters['min_amount'] ?? 0;
            $max = $filters['max_amount'] ?? '∞';
            $filtersApplied['amount_range'] = "₹{$min} - ₹{$max}";
        }

        if (isset($filters['start_hour']) && isset($filters['end_hour'])) {
            $startHour = Carbon::createFromTime($filters['start_hour'], 0)->format('g:i A');
            $endHour = Carbon::createFromTime($filters['end_hour'], 0)->format('g:i A');
            $filtersApplied['hour_range'] = "{$startHour} - {$endHour}";
        }

        return [
            'filters_applied' => $filtersApplied,
            'summary' => $analytics['summary'],
            'breakdown' => $analytics['breakdown'],
        ];
    }

    /**
     * Get meta information for filters
     */
    public function getFilterMeta(): array
    {
        $dateRange = $this->orderRepository->getDateRange();
        $locations = $this->restaurantRepository->getLocations();
        $cuisines = $this->restaurantRepository->getCuisines();

        return [
            'date_range' => $dateRange,
            'locations' => $locations,
            'cuisines' => $cuisines,
            'hours' => range(0, 23),
        ];
    }
}
