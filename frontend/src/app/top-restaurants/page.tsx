import { Metadata } from 'next';
import { TopRestaurantsList } from '@/components/analytics/top-restaurants';

export const metadata: Metadata = {
    title: 'Top Restaurants | OrderLytic',
    description: 'View top performing restaurants by revenue',
};

export default function TopRestaurantsPage() {
    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Top Performers</h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Restaurants ranked by total revenue within the selected date range
                </p>
            </div>

            {/* Top Restaurants List */}
            <TopRestaurantsList />
        </div>
    );
}
