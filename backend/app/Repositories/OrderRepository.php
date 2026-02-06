<?php

namespace App\Repositories;

use App\Models\Order;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class OrderRepository
{
    /**
     * Get orders with optional filters
     */
    public function getFiltered(array $filters): array
    {
        $query = Order::query();

        // Filter by restaurant
        if (!empty($filters['restaurant_id'])) {
            $query->where('restaurant_id', $filters['restaurant_id']);
        }

        // Filter by date range
        if (!empty($filters['start_date']) && !empty($filters['end_date'])) {
            $query->whereBetween('order_time', [
                Carbon::parse($filters['start_date'])->startOfDay(),
                Carbon::parse($filters['end_date'])->endOfDay(),
            ]);
        }

        // Filter by amount range
        if (!empty($filters['min_amount'])) {
            $query->where('order_amount', '>=', $filters['min_amount']);
        }
        if (!empty($filters['max_amount'])) {
            $query->where('order_amount', '<=', $filters['max_amount']);
        }

        // Filter by hour range
        if (isset($filters['start_hour']) && isset($filters['end_hour'])) {
            $query->whereRaw('HOUR(order_time) >= ?', [$filters['start_hour']])
                  ->whereRaw('HOUR(order_time) <= ?', [$filters['end_hour']]);
        }

        return $query->orderBy('order_time', 'desc')->get()->toArray();
    }

    /**
     * Get daily metrics for a restaurant within date range
     */
    public function getDailyMetrics(int $restaurantId, string $startDate, string $endDate): array
    {
        $cacheKey = "analytics:trends:{$restaurantId}:{$startDate}:{$endDate}";

        return Cache::remember($cacheKey, 900, function () use ($restaurantId, $startDate, $endDate) {
            $metrics = DB::table('orders')
                ->where('restaurant_id', $restaurantId)
                ->whereBetween('order_time', [
                    Carbon::parse($startDate)->startOfDay(),
                    Carbon::parse($endDate)->endOfDay(),
                ])
                ->selectRaw('
                    DATE(order_time) as date,
                    COUNT(*) as order_count,
                    SUM(order_amount) as total_revenue,
                    AVG(order_amount) as avg_order_value
                ')
                ->groupBy(DB::raw('DATE(order_time)'))
                ->orderBy('date')
                ->get();

            // Get peak hours for each day
            $dailyMetrics = [];
            foreach ($metrics as $dayMetric) {
                $peakHour = $this->getPeakHourForDay($restaurantId, $dayMetric->date);
                
                $dailyMetrics[] = [
                    'date' => $dayMetric->date,
                    'day_of_week' => Carbon::parse($dayMetric->date)->format('l'),
                    'order_count' => (int) $dayMetric->order_count,
                    'total_revenue' => round((float) $dayMetric->total_revenue, 2),
                    'avg_order_value' => round((float) $dayMetric->avg_order_value, 2),
                    'peak_hour' => $peakHour,
                ];
            }

            return $dailyMetrics;
        });
    }

    /**
     * Get peak hour for a specific day
     */
    private function getPeakHourForDay(int $restaurantId, string $date): array
    {
        $peakHour = DB::table('orders')
            ->where('restaurant_id', $restaurantId)
            ->whereDate('order_time', $date)
            ->selectRaw('
                HOUR(order_time) as hour,
                COUNT(*) as order_count
            ')
            ->groupBy(DB::raw('HOUR(order_time)'))
            ->orderByDesc('order_count')
            ->first();

        if (!$peakHour) {
            return [
                'hour' => 0,
                'hour_formatted' => 'N/A',
                'order_count' => 0,
            ];
        }

        return [
            'hour' => (int) $peakHour->hour,
            'hour_formatted' => Carbon::createFromTime($peakHour->hour, 0)->format('g:i A'),
            'order_count' => (int) $peakHour->order_count,
        ];
    }

    /**
     * Get top restaurants by revenue
     */
    public function getTopRestaurantsByRevenue(string $startDate, string $endDate, int $limit = 3): array
    {
        $cacheKey = "analytics:top:{$startDate}:{$endDate}:{$limit}";

        return Cache::remember($cacheKey, 900, function () use ($startDate, $endDate, $limit) {
            $results = DB::table('orders')
                ->join('restaurants', 'orders.restaurant_id', '=', 'restaurants.id')
                ->whereBetween('orders.order_time', [
                    Carbon::parse($startDate)->startOfDay(),
                    Carbon::parse($endDate)->endOfDay(),
                ])
                ->selectRaw('
                    restaurants.id,
                    restaurants.name,
                    restaurants.location,
                    restaurants.cuisine,
                    SUM(orders.order_amount) as total_revenue,
                    COUNT(orders.id) as total_orders,
                    AVG(orders.order_amount) as avg_order_value
                ')
                ->groupBy('restaurants.id', 'restaurants.name', 'restaurants.location', 'restaurants.cuisine')
                ->orderByDesc('total_revenue')
                ->limit($limit)
                ->get();

            // Calculate total revenue for percentage
            $totalRevenue = $results->sum('total_revenue');

            $topRestaurants = [];
            $rank = 1;
            foreach ($results as $result) {
                $topRestaurants[] = [
                    'rank' => $rank++,
                    'restaurant' => [
                        'id' => $result->id,
                        'name' => $result->name,
                        'location' => $result->location,
                        'cuisine' => $result->cuisine,
                    ],
                    'metrics' => [
                        'total_revenue' => round((float) $result->total_revenue, 2),
                        'total_orders' => (int) $result->total_orders,
                        'avg_order_value' => round((float) $result->avg_order_value, 2),
                        'revenue_percentage' => $totalRevenue > 0 
                            ? round(($result->total_revenue / $totalRevenue) * 100, 2) 
                            : 0,
                    ],
                ];
            }

            return $topRestaurants;
        });
    }

    /**
     * Get filtered analytics with grouping
     */
    public function getFilteredAnalytics(array $filters): array
    {
        $query = DB::table('orders')
            ->join('restaurants', 'orders.restaurant_id', '=', 'restaurants.id');

        // Apply filters
        if (!empty($filters['restaurant_id'])) {
            $query->where('orders.restaurant_id', $filters['restaurant_id']);
        }

        if (!empty($filters['start_date']) && !empty($filters['end_date'])) {
            $query->whereBetween('orders.order_time', [
                Carbon::parse($filters['start_date'])->startOfDay(),
                Carbon::parse($filters['end_date'])->endOfDay(),
            ]);
        }

        if (!empty($filters['min_amount'])) {
            $query->where('orders.order_amount', '>=', $filters['min_amount']);
        }
        if (!empty($filters['max_amount'])) {
            $query->where('orders.order_amount', '<=', $filters['max_amount']);
        }

        if (isset($filters['start_hour']) && isset($filters['end_hour'])) {
            $query->whereRaw('HOUR(orders.order_time) >= ?', [$filters['start_hour']])
                  ->whereRaw('HOUR(orders.order_time) <= ?', [$filters['end_hour']]);
        }

        // Group by setting
        $groupBy = $filters['group_by'] ?? 'day';
        
        switch ($groupBy) {
            case 'hour':
                $query->selectRaw('
                    HOUR(orders.order_time) as `group`,
                    COUNT(*) as order_count,
                    SUM(orders.order_amount) as total_revenue,
                    AVG(orders.order_amount) as avg_order_value
                ')
                ->groupBy(DB::raw('HOUR(orders.order_time)'))
                ->orderBy('group');
                break;

            case 'restaurant':
                $query->selectRaw('
                    restaurants.name as `group`,
                    COUNT(*) as order_count,
                    SUM(orders.order_amount) as total_revenue,
                    AVG(orders.order_amount) as avg_order_value
                ')
                ->groupBy('restaurants.id', 'restaurants.name')
                ->orderByDesc('total_revenue');
                break;

            default: // day
                $query->selectRaw('
                    DATE(orders.order_time) as `group`,
                    COUNT(*) as order_count,
                    SUM(orders.order_amount) as total_revenue,
                    AVG(orders.order_amount) as avg_order_value
                ')
                ->groupBy(DB::raw('DATE(orders.order_time)'))
                ->orderBy('group');
        }

        $results = $query->get();

        $breakdown = [];
        foreach ($results as $result) {
            $breakdown[] = [
                'group' => $result->group,
                'order_count' => (int) $result->order_count,
                'total_revenue' => round((float) $result->total_revenue, 2),
                'avg_order_value' => round((float) $result->avg_order_value, 2),
            ];
        }

        // Calculate summary
        $summary = [
            'filtered_orders' => array_sum(array_column($breakdown, 'order_count')),
            'total_revenue' => round(array_sum(array_column($breakdown, 'total_revenue')), 2),
            'avg_order_value' => count($breakdown) > 0 
                ? round(array_sum(array_column($breakdown, 'total_revenue')) / array_sum(array_column($breakdown, 'order_count')), 2)
                : 0,
        ];

        return [
            'summary' => $summary,
            'breakdown' => $breakdown,
        ];
    }

    /**
     * Get date range of all orders
     */
    public function getDateRange(): array
    {
        return Cache::remember('orders:date_range', 3600, function () {
            $range = DB::table('orders')
                ->selectRaw('MIN(DATE(order_time)) as min_date, MAX(DATE(order_time)) as max_date')
                ->first();

            return [
                'min_date' => $range->min_date,
                'max_date' => $range->max_date,
            ];
        });
    }
}
