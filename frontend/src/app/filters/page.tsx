import { Metadata } from 'next';
import { AdvancedFilters } from '@/components/analytics/advanced-filters';

export const metadata: Metadata = {
    title: 'Advanced Filters | OrderLytic',
    description: 'Apply advanced filters to analyze order data by amount, hour, and restaurant',
};

export default function FiltersPage() {
    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Advanced Filters</h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Filter orders by amount range, hour range, and group results by different dimensions
                </p>
            </div>

            {/* Advanced Filters Component */}
            <AdvancedFilters />
        </div>
    );
}
