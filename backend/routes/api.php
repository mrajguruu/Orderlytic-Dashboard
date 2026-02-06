<?php

use App\Http\Controllers\Api\AnalyticsController;
use App\Http\Controllers\Api\RestaurantController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group.
|
*/

// Restaurant endpoints
Route::get('/restaurants/meta', [RestaurantController::class, 'meta']);
Route::get('/restaurants', [RestaurantController::class, 'index']);
Route::get('/restaurants/{id}', [RestaurantController::class, 'show']);

// Analytics endpoints
Route::get('/analytics/meta', [AnalyticsController::class, 'meta']);
Route::get('/analytics/trends', [AnalyticsController::class, 'trends']);
Route::get('/analytics/top-restaurants', [AnalyticsController::class, 'topRestaurants']);
Route::post('/analytics/filter', [AnalyticsController::class, 'filter']);
