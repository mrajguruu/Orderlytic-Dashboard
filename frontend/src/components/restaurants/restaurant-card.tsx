'use client';

import Link from 'next/link';
import { MapPin, Utensils, ShoppingBag, IndianRupee, TrendingUp, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Restaurant } from '@/types';

interface RestaurantCardProps {
    restaurant: Restaurant;
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <Card className="group hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 dark:bg-gray-800/80 dark:border-gray-700/50 border-gray-200">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            {restaurant.name}
                        </h3>
                        <div className="flex flex-wrap gap-2 mt-3">
                            <Badge variant="secondary" className="flex items-center gap-1.5 px-3 py-1 text-xs dark:bg-gray-700/80 dark:text-gray-200 bg-gray-100 text-gray-700">
                                <MapPin className="h-3 w-3" />
                                {restaurant.location}
                            </Badge>
                            <Badge variant="secondary" className="flex items-center gap-1.5 px-3 py-1 text-xs dark:bg-gray-700/80 dark:text-gray-200 bg-gray-100 text-gray-700">
                                <Utensils className="h-3 w-3" />
                                {restaurant.cuisine}
                            </Badge>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-blue-600 rounded-xl p-4">
                        <div className="flex items-center gap-1.5 text-blue-100/90 text-xs font-medium uppercase tracking-wide">
                            <ShoppingBag className="h-3.5 w-3.5" />
                            Orders
                        </div>
                        <p className="text-xl font-bold text-white font-mono mt-2">
                            {restaurant.stats.total_orders}
                        </p>
                    </div>
                    <div className="bg-emerald-600 rounded-xl p-4">
                        <div className="flex items-center gap-1.5 text-emerald-100/90 text-xs font-medium uppercase tracking-wide">
                            <IndianRupee className="h-3.5 w-3.5" />
                            Revenue
                        </div>
                        <p className="text-xl font-bold text-white font-mono mt-2">
                            {formatCurrency(restaurant.stats.total_revenue)}
                        </p>
                    </div>
                </div>

                {/* Average Order Value */}
                <div className="flex items-center justify-between text-sm bg-gray-100 dark:bg-gray-700/60 rounded-xl p-4">
                    <span className="text-gray-600 dark:text-gray-300 flex items-center gap-2 text-xs font-medium uppercase tracking-wide">
                        <TrendingUp className="h-3.5 w-3.5" />
                        Avg. Order Value
                    </span>
                    <span className="font-bold text-gray-900 dark:text-white font-mono text-lg">
                        {formatCurrency(restaurant.stats.avg_order_value)}
                    </span>
                </div>

                {/* Action Button */}
                <Link href={`/restaurants/${restaurant.id}/analytics`} className="block">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 transition-all duration-200 group/btn font-medium">
                        View Analytics
                        <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                </Link>
            </CardContent>
        </Card>
    );
}

// Skeleton loader for restaurant card
export function RestaurantCardSkeleton() {
    return (
        <Card className="dark:bg-gray-800/50 dark:border-gray-700">
            <CardHeader className="pb-3">
                <div className="space-y-3">
                    <div className="h-5 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="flex gap-2">
                        <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                        <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
                        <div className="h-6 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                        <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
                        <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 flex justify-between">
                    <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </CardContent>
        </Card>
    );
}
