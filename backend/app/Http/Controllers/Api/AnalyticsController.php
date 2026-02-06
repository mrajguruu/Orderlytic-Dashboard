<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\AnalyticsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AnalyticsController extends Controller
{
    public function __construct(
        private AnalyticsService $analyticsService
    ) {}

    /**
     * Get order trends for a restaurant
     * 
     * GET /api/analytics/trends
     * Query params: restaurant_id (required), start_date (required), end_date (required)
     */
    public function trends(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'restaurant_id' => 'required|integer|exists:restaurants,id',
            'start_date' => 'required|date|date_format:Y-m-d',
            'end_date' => 'required|date|date_format:Y-m-d|after_or_equal:start_date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'Validation failed',
                'messages' => $validator->errors(),
            ], 422);
        }

        $data = $this->analyticsService->getOrderTrends(
            (int) $request->query('restaurant_id'),
            $request->query('start_date'),
            $request->query('end_date')
        );

        if (isset($data['error'])) {
            return response()->json(['error' => $data['error']], 404);
        }

        return response()->json(['data' => $data]);
    }

    /**
     * Get top restaurants by revenue
     * 
     * GET /api/analytics/top-restaurants
     * Query params: start_date (required), end_date (required), limit (optional, default 3)
     */
    public function topRestaurants(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'start_date' => 'required|date|date_format:Y-m-d',
            'end_date' => 'required|date|date_format:Y-m-d|after_or_equal:start_date',
            'limit' => 'integer|min:1|max:10',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'Validation failed',
                'messages' => $validator->errors(),
            ], 422);
        }

        $limit = (int) $request->query('limit', 3);
        
        $data = $this->analyticsService->getTopRestaurants(
            $request->query('start_date'),
            $request->query('end_date'),
            $limit
        );

        return response()->json(['data' => $data]);
    }

    /**
     * Apply complex filters and get analytics
     * 
     * POST /api/analytics/filter
     * Body: restaurant_id, date_range, amount_range, hour_range, group_by
     */
    public function filter(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'restaurant_id' => 'nullable|integer|exists:restaurants,id',
            'date_range.start' => 'nullable|date|date_format:Y-m-d',
            'date_range.end' => 'nullable|date|date_format:Y-m-d|after_or_equal:date_range.start',
            'amount_range.min' => 'nullable|numeric|min:0',
            'amount_range.max' => 'nullable|numeric|min:0',
            'hour_range.start' => 'nullable|integer|min:0|max:23',
            'hour_range.end' => 'nullable|integer|min:0|max:23',
            'group_by' => 'nullable|in:day,hour,restaurant',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'Validation failed',
                'messages' => $validator->errors(),
            ], 422);
        }

        $filters = [
            'restaurant_id' => $request->input('restaurant_id'),
            'start_date' => $request->input('date_range.start'),
            'end_date' => $request->input('date_range.end'),
            'min_amount' => $request->input('amount_range.min'),
            'max_amount' => $request->input('amount_range.max'),
            'start_hour' => $request->input('hour_range.start'),
            'end_hour' => $request->input('hour_range.end'),
            'group_by' => $request->input('group_by', 'day'),
        ];

        $data = $this->analyticsService->getFilteredAnalytics($filters);

        return response()->json(['data' => $data]);
    }

    /**
     * Get filter metadata (date range, etc.)
     * 
     * GET /api/analytics/meta
     */
    public function meta(): JsonResponse
    {
        $data = $this->analyticsService->getFilterMeta();

        return response()->json(['data' => $data]);
    }
}
