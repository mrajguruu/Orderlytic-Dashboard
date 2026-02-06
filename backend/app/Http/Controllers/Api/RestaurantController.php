<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Repositories\RestaurantRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RestaurantController extends Controller
{
    public function __construct(
        private RestaurantRepository $restaurantRepository
    ) {}

    /**
     * Get all restaurants with optional filters
     * 
     * GET /api/restaurants
     * Query params: search, location, cuisine, sort, order
     */
    public function index(Request $request): JsonResponse
    {
        $filters = [
            'search' => $request->query('search'),
            'location' => $request->query('location'),
            'cuisine' => $request->query('cuisine'),
            'sort' => $request->query('sort', 'name'),
            'order' => $request->query('order', 'asc'),
        ];

        $restaurants = $this->restaurantRepository->getAll($filters);

        // Get stats for each restaurant
        $restaurantsWithStats = $restaurants->map(function ($restaurant) {
            $data = $this->restaurantRepository->findWithStats($restaurant->id);
            return [
                'id' => $restaurant->id,
                'name' => $restaurant->name,
                'location' => $restaurant->location,
                'cuisine' => $restaurant->cuisine,
                'stats' => $data['stats'] ?? [
                    'total_orders' => 0,
                    'total_revenue' => 0,
                    'avg_order_value' => 0,
                ],
            ];
        });

        return response()->json([
            'data' => $restaurantsWithStats,
            'meta' => [
                'total' => count($restaurantsWithStats),
            ],
        ]);
    }

    /**
     * Get a single restaurant with stats
     * 
     * GET /api/restaurants/{id}
     */
    public function show(int $id): JsonResponse
    {
        $data = $this->restaurantRepository->findWithStats($id);

        if (!$data) {
            return response()->json([
                'error' => 'Restaurant not found',
            ], 404);
        }

        return response()->json([
            'data' => [
                'id' => $data['restaurant']->id,
                'name' => $data['restaurant']->name,
                'location' => $data['restaurant']->location,
                'cuisine' => $data['restaurant']->cuisine,
                'stats' => $data['stats'],
            ],
        ]);
    }

    /**
     * Get filter options (locations, cuisines)
     * 
     * GET /api/restaurants/meta
     */
    public function meta(): JsonResponse
    {
        return response()->json([
            'data' => [
                'locations' => $this->restaurantRepository->getLocations(),
                'cuisines' => $this->restaurantRepository->getCuisines(),
            ],
        ]);
    }
}
