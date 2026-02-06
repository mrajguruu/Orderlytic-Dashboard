'use client';

import { useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Trophy, Calendar, MapPin, Utensils, TrendingUp, IndianRupee, ShoppingBag, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useTopRestaurants } from '@/hooks/useApi';
import type { TopRestaurant } from '@/types';

const RANK_COLORS = {
    1: { bg: 'from-yellow-400 to-yellow-500', text: 'text-yellow-900', badge: '🥇' },
    2: { bg: 'from-gray-300 to-gray-400', text: 'text-gray-900', badge: '🥈' },
    3: { bg: 'from-amber-600 to-amber-700', text: 'text-amber-100', badge: '🥉' },
};

export function TopRestaurantsList() {
    const [startDate, setStartDate] = useState('2025-06-22');
    const [endDate, setEndDate] = useState('2025-06-28');
    const [limit, setLimit] = useState(3);

    const { data, isLoading, error, refetch } = useTopRestaurants(startDate, endDate, limit);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-red-600 dark:text-red-400 mb-4">Failed to load top restaurants</p>
                <Button onClick={() => refetch()}>Retry</Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Date Range Filter */}
            <Card className="dark:bg-gray-800/50 dark:border-gray-700">
                <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row gap-4 items-end">
                        <div className="flex-1 space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                Date Range
                            </label>
                            <div className="flex gap-3">
                                <Input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="flex-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                                />
                                <span className="self-center text-gray-500 dark:text-gray-400">to</span>
                                <Input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="flex-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Show Top
                            </label>
                            <Select value={limit.toString()} onValueChange={(v) => setLimit(parseInt(v))}>
                                <SelectTrigger className="w-[100px] dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="3">Top 3</SelectItem>
                                    <SelectItem value="5">Top 5</SelectItem>
                                    <SelectItem value="10">Top 10</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setStartDate('2025-06-22');
                                setEndDate('2025-06-28');
                            }}
                            className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                            Reset
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Summary */}
            {data && (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                    Showing top {data.rankings.length} of {data.total_restaurants_analyzed} restaurants
                    from {format(new Date(data.date_range.start), 'MMM dd, yyyy')} to {format(new Date(data.date_range.end), 'MMM dd, yyyy')}
                </div>
            )}

            {/* Rankings */}
            {isLoading ? (
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-48 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="space-y-4">
                    {data?.rankings.map((item: TopRestaurant) => {
                        const rankStyle = RANK_COLORS[item.rank as keyof typeof RANK_COLORS] || {
                            bg: 'from-gray-200 to-gray-300',
                            text: 'text-gray-900',
                            badge: `#${item.rank}`,
                        };

                        return (
                            <Card
                                key={item.restaurant.id}
                                className="overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 dark:bg-gray-800/80 dark:border-gray-700/50 border-gray-200"
                            >
                                <div className="flex flex-col lg:flex-row">
                                    {/* Rank Badge */}
                                    <div className={`lg:w-28 flex items-center justify-center p-6 bg-gradient-to-br ${rankStyle.bg}`}>
                                        <span className="text-5xl">
                                            {rankStyle.badge}
                                        </span>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 p-6">
                                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                            <div>
                                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight">
                                                    {item.restaurant.name}
                                                </h3>
                                                <div className="flex flex-wrap gap-2 mt-3">
                                                    <Badge variant="secondary" className="flex items-center gap-1.5 px-3 py-1 text-xs dark:bg-gray-700/80 dark:text-gray-200 bg-gray-100 text-gray-700">
                                                        <MapPin className="h-3 w-3" />
                                                        {item.restaurant.location}
                                                    </Badge>
                                                    <Badge variant="secondary" className="flex items-center gap-1.5 px-3 py-1 text-xs dark:bg-gray-700/80 dark:text-gray-200 bg-gray-100 text-gray-700">
                                                        <Utensils className="h-3 w-3" />
                                                        {item.restaurant.cuisine}
                                                    </Badge>
                                                </div>
                                            </div>

                                            <Link href={`/restaurants/${item.restaurant.id}/analytics`}>
                                                <Button variant="outline" size="sm" className="dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700 group font-medium">
                                                    View Analytics
                                                    <ArrowRight className="h-4 w-4 ml-1.5 transition-transform group-hover:translate-x-1" />
                                                </Button>
                                            </Link>
                                        </div>

                                        {/* Metrics Grid - Polished Cards */}
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
                                            <div className="bg-emerald-600 rounded-xl p-4">
                                                <div className="flex items-center gap-1.5 text-emerald-100/90 text-xs font-medium uppercase tracking-wide">
                                                    <IndianRupee className="h-3.5 w-3.5" />
                                                    Revenue
                                                </div>
                                                <p className="text-xl font-bold text-white font-mono mt-2">
                                                    {formatCurrency(item.metrics.total_revenue)}
                                                </p>
                                            </div>

                                            <div className="bg-blue-600 rounded-xl p-4">
                                                <div className="flex items-center gap-1.5 text-blue-100/90 text-xs font-medium uppercase tracking-wide">
                                                    <ShoppingBag className="h-3.5 w-3.5" />
                                                    Orders
                                                </div>
                                                <p className="text-xl font-bold text-white font-mono mt-2">
                                                    {item.metrics.total_orders}
                                                </p>
                                            </div>

                                            <div className="bg-orange-600 rounded-xl p-4">
                                                <div className="flex items-center gap-1.5 text-orange-100/90 text-xs font-medium uppercase tracking-wide">
                                                    <TrendingUp className="h-3.5 w-3.5" />
                                                    Avg Value
                                                </div>
                                                <p className="text-xl font-bold text-white font-mono mt-2">
                                                    {formatCurrency(item.metrics.avg_order_value)}
                                                </p>
                                            </div>

                                            <div className="bg-purple-600 rounded-xl p-4">
                                                <div className="flex items-center gap-1.5 text-purple-100/90 text-xs font-medium uppercase tracking-wide">
                                                    <Trophy className="h-3.5 w-3.5" />
                                                    Share
                                                </div>
                                                <p className="text-xl font-bold text-white font-mono mt-2">
                                                    {item.metrics.revenue_percentage}%
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
