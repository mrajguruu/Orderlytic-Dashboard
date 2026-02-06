'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, MapPin, Utensils } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AnalyticsDashboard } from '@/components/analytics/analytics-dashboard';
import { useRestaurant } from '@/hooks/useApi';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function RestaurantAnalyticsPage({ params }: PageProps) {
    const { id } = use(params);
    const restaurantId = parseInt(id, 10);
    const { data: restaurant, isLoading } = useRestaurant(restaurantId);

    return (
        <div className="space-y-6">
            {/* Back Button & Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/restaurants">
                        <Button variant="ghost" size="icon" className="shrink-0">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        {isLoading ? (
                            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
                        ) : (
                            <>
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                                    {restaurant?.name}
                                </h1>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    <Badge variant="secondary" className="flex items-center gap-1">
                                        <MapPin className="h-3 w-3" />
                                        {restaurant?.location}
                                    </Badge>
                                    <Badge variant="outline" className="flex items-center gap-1">
                                        <Utensils className="h-3 w-3" />
                                        {restaurant?.cuisine}
                                    </Badge>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Analytics Dashboard */}
            <AnalyticsDashboard restaurantId={restaurantId} />
        </div>
    );
}
