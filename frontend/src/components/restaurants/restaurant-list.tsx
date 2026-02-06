'use client';

import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { RestaurantCard, RestaurantCardSkeleton } from './restaurant-card';
import { useRestaurants, useRestaurantMeta } from '@/hooks/useApi';
import type { RestaurantFilters } from '@/types';

export function RestaurantList() {
    const [filters, setFilters] = useState<RestaurantFilters>({
        search: '',
        location: undefined,
        cuisine: undefined,
        sort: 'name',
        order: 'asc',
    });
    const [showFilters, setShowFilters] = useState(false);

    const { data: restaurants, isLoading, error, refetch } = useRestaurants(filters);
    const { data: meta } = useRestaurantMeta();

    // Debounced search
    const [searchInput, setSearchInput] = useState('');

    useMemo(() => {
        const timer = setTimeout(() => {
            setFilters(prev => ({ ...prev, search: searchInput }));
        }, 300);
        return () => clearTimeout(timer);
    }, [searchInput]);

    const handleFilterChange = (key: keyof RestaurantFilters, value: string) => {
        setFilters(prev => ({
            ...prev,
            [key]: value === 'all' ? undefined : value,
        }));
    };

    const toggleSortOrder = () => {
        setFilters(prev => ({
            ...prev,
            order: prev.order === 'asc' ? 'desc' : 'asc',
        }));
    };

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-red-600 dark:text-red-400 mb-4">Failed to load restaurants</p>
                <Button onClick={() => refetch()} className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Retry
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
                {/* Search Input */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                    <Input
                        placeholder="Search restaurants..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="pl-10 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                    />
                </div>

                {/* Filter Toggle (Mobile) */}
                <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="sm:hidden flex items-center gap-2 dark:border-gray-700 dark:text-gray-300"
                >
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                </Button>

                {/* Desktop Filters */}
                <div className="hidden sm:flex gap-3">
                    <Select
                        value={filters.location || 'all'}
                        onValueChange={(value) => handleFilterChange('location', value)}
                    >
                        <SelectTrigger className="w-[140px] dark:bg-gray-800 dark:border-gray-700">
                            <SelectValue placeholder="Location" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Locations</SelectItem>
                            {meta?.locations.map((location) => (
                                <SelectItem key={location} value={location}>
                                    {location}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={filters.cuisine || 'all'}
                        onValueChange={(value) => handleFilterChange('cuisine', value)}
                    >
                        <SelectTrigger className="w-[140px] dark:bg-gray-800 dark:border-gray-700">
                            <SelectValue placeholder="Cuisine" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Cuisines</SelectItem>
                            {meta?.cuisines.map((cuisine) => (
                                <SelectItem key={cuisine} value={cuisine}>
                                    {cuisine}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={filters.sort || 'name'}
                        onValueChange={(value) => handleFilterChange('sort', value)}
                    >
                        <SelectTrigger className="w-[130px] dark:bg-gray-800 dark:border-gray-700">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="name">Name</SelectItem>
                            <SelectItem value="location">Location</SelectItem>
                            <SelectItem value="cuisine">Cuisine</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button
                        variant="outline"
                        size="icon"
                        onClick={toggleSortOrder}
                        className="dark:border-gray-700 dark:text-gray-300 transition-transform hover:scale-105"
                    >
                        <ArrowUpDown className={`h-4 w-4 ${filters.order === 'desc' ? 'rotate-180' : ''} transition-transform duration-200`} />
                    </Button>
                </div>
            </div>

            {/* Mobile Filters Panel */}
            <div
                className={`sm:hidden overflow-hidden transition-all duration-300 ${showFilters ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Select
                        value={filters.location || 'all'}
                        onValueChange={(value) => handleFilterChange('location', value)}
                    >
                        <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600">
                            <SelectValue placeholder="Location" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Locations</SelectItem>
                            {meta?.locations.map((location) => (
                                <SelectItem key={location} value={location}>
                                    {location}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={filters.cuisine || 'all'}
                        onValueChange={(value) => handleFilterChange('cuisine', value)}
                    >
                        <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600">
                            <SelectValue placeholder="Cuisine" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Cuisines</SelectItem>
                            {meta?.cuisines.map((cuisine) => (
                                <SelectItem key={cuisine} value={cuisine}>
                                    {cuisine}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={filters.sort || 'name'}
                        onValueChange={(value) => handleFilterChange('sort', value)}
                    >
                        <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="name">Name</SelectItem>
                            <SelectItem value="location">Location</SelectItem>
                            <SelectItem value="cuisine">Cuisine</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button
                        variant="outline"
                        onClick={toggleSortOrder}
                        className="flex items-center gap-2 dark:border-gray-600 dark:text-gray-300"
                    >
                        <ArrowUpDown className="h-4 w-4" />
                        {filters.order === 'asc' ? 'A-Z' : 'Z-A'}
                    </Button>
                </div>
            </div>

            {/* Results Count */}
            <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                {isLoading ? (
                    <>
                        <div className="h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        Loading restaurants...
                    </>
                ) : (
                    `${restaurants?.length || 0} restaurants found`
                )}
            </div>

            {/* Restaurant Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <RestaurantCardSkeleton key={i} />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {restaurants?.map((restaurant) => (
                        <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                    ))}
                </div>
            )}

            {!isLoading && restaurants?.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">No restaurants found matching your criteria</p>
                    <Button
                        variant="link"
                        onClick={() => {
                            setFilters({ sort: 'name', order: 'asc' });
                            setSearchInput('');
                        }}
                        className="text-blue-600 dark:text-blue-400"
                    >
                        Clear filters
                    </Button>
                </div>
            )}
        </div>
    );
}
