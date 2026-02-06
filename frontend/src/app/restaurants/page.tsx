import { Metadata } from 'next';
import { RestaurantList } from '@/components/restaurants/restaurant-list';

export const metadata: Metadata = {
    title: 'Restaurants | OrderLytic',
    description: 'Browse and analyze restaurant performance data',
};

export default function RestaurantsPage() {
    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Restaurants</h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Browse restaurants and view their performance analytics
                </p>
            </div>

            {/* Restaurant List */}
            <RestaurantList />
        </div>
    );
}
