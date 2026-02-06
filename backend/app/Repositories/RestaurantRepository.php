<?php

namespace App\Repositories;

use App\Models\Restaurant;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class RestaurantRepository
{
    /**
     * Get all restaurants with optional filters
     */
    public function getAll(array $filters = []): Collection
    {
        $cacheKey = 'restaurants:all:' . md5(serialize($filters));

        return Cache::remember($cacheKey, 300, function () use ($filters) {
            $query = Restaurant::query();

            // Search by name
            if (!empty($filters['search'])) {
                $query->where('name', 'like', '%' . $filters['search'] . '%');
            }

            // Filter by location
            if (!empty($filters['location'])) {
                $query->where('location', $filters['location']);
            }

            // Filter by cuisine
            if (!empty($filters['cuisine'])) {
                $query->where('cuisine', $filters['cuisine']);
            }

            // Sorting
            $sortField = $filters['sort'] ?? 'name';
            $sortOrder = $filters['order'] ?? 'asc';
            
            if (in_array($sortField, ['name', 'location', 'cuisine'])) {
                $query->orderBy($sortField, $sortOrder);
            }

            return $query->get();
        });
    }

    /**
     * Get a single restaurant with stats
     */
    public function findWithStats(int $id): ?array
    {
        $cacheKey = "restaurant:{$id}:stats";

        return Cache::remember($cacheKey, 300, function () use ($id) {
            $restaurant = Restaurant::find($id);
            
            if (!$restaurant) {
                return null;
            }

            $stats = DB::table('orders')
                ->where('restaurant_id', $id)
                ->selectRaw('
                    COUNT(*) as total_orders,
                    COALESCE(SUM(order_amount), 0) as total_revenue,
                    COALESCE(AVG(order_amount), 0) as avg_order_value
                ')
                ->first();

            return [
                'restaurant' => $restaurant,
                'stats' => [
                    'total_orders' => (int) $stats->total_orders,
                    'total_revenue' => round((float) $stats->total_revenue, 2),
                    'avg_order_value' => round((float) $stats->avg_order_value, 2),
                ],
            ];
        });
    }

    /**
     * Get available locations
     */
    public function getLocations(): array
    {
        return Cache::remember('restaurants:locations', 3600, function () {
            return Restaurant::distinct()->pluck('location')->toArray();
        });
    }

    /**
     * Get available cuisines
     */
    public function getCuisines(): array
    {
        return Cache::remember('restaurants:cuisines', 3600, function () {
            return Restaurant::distinct()->pluck('cuisine')->toArray();
        });
    }
}
