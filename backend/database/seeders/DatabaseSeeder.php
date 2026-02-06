<?php

namespace Database\Seeders;

use App\Models\Restaurant;
use App\Models\Order;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Load restaurants from JSON
        $restaurantsJson = File::get(resource_path('data/restaurants.json'));
        $restaurants = json_decode($restaurantsJson, true);

        foreach ($restaurants as $restaurant) {
            Restaurant::create([
                'id' => $restaurant['id'],
                'name' => $restaurant['name'],
                'location' => $restaurant['location'],
                'cuisine' => $restaurant['cuisine'],
            ]);
        }

        $this->command->info('Seeded ' . count($restaurants) . ' restaurants.');

        // Load orders from JSON
        $ordersJson = File::get(resource_path('data/orders.json'));
        $orders = json_decode($ordersJson, true);

        foreach ($orders as $order) {
            Order::create([
                'id' => $order['id'],
                'restaurant_id' => $order['restaurant_id'],
                'order_amount' => $order['order_amount'],
                'order_time' => $order['order_time'],
            ]);
        }

        $this->command->info('Seeded ' . count($orders) . ' orders.');
    }
}
