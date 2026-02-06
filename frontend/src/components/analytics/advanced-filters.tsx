'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from 'recharts';
import {
    Calendar,
    Filter,
    IndianRupee,
    Clock,
    Store,
    TrendingUp,
    ShoppingBag,
    ChevronDown,
    ChevronUp,
    RotateCcw,
    Sparkles,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { analyticsApi, restaurantApi } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import type { Restaurant } from '@/types';

const COLORS = ['#3b82f6', '#10b981', '#f97316', '#8b5cf6', '#ec4899', '#06b6d4'];

const HOUR_OPTIONS = Array.from({ length: 24 }, (_, i) => ({
    value: i,
    label: i === 0 ? '12:00 AM' : i < 12 ? `${i}:00 AM` : i === 12 ? '12:00 PM' : `${i - 12}:00 PM`,
}));

type FilterState = {
    restaurant_id: number | undefined;
    start_date: string;
    end_date: string;
    min_amount: number | undefined;
    max_amount: number | undefined;
    start_hour: number | undefined;
    end_hour: number | undefined;
    group_by: 'day' | 'hour' | 'restaurant';
};

const defaultFilters: FilterState = {
    restaurant_id: undefined,
    start_date: '2025-06-22',
    end_date: '2025-06-28',
    min_amount: undefined,
    max_amount: undefined,
    start_hour: undefined,
    end_hour: undefined,
    group_by: 'day',
};

export function AdvancedFilters() {
    const [showFilters, setShowFilters] = useState(true);

    // Pending filters (user is editing)
    const [pendingFilters, setPendingFilters] = useState<FilterState>({ ...defaultFilters });

    // Applied filters (used for data fetching)
    const [appliedFilters, setAppliedFilters] = useState<FilterState>({ ...defaultFilters });

    // Fetch restaurants for dropdown
    const { data: restaurants } = useQuery({
        queryKey: ['restaurants-list'],
        queryFn: () => restaurantApi.getAll(),
    });

    // Fetch filtered analytics - only uses appliedFilters, not pendingFilters
    const { data: analytics, isLoading } = useQuery({
        queryKey: ['filtered-analytics', appliedFilters],
        queryFn: () => analyticsApi.getFiltered({
            restaurant_id: appliedFilters.restaurant_id,
            start_date: appliedFilters.start_date,
            end_date: appliedFilters.end_date,
            min_amount: appliedFilters.min_amount,
            max_amount: appliedFilters.max_amount,
            start_hour: appliedFilters.start_hour,
            end_hour: appliedFilters.end_hour,
            group_by: appliedFilters.group_by,
        }),
        enabled: !!appliedFilters.start_date && !!appliedFilters.end_date,
        refetchOnWindowFocus: false,
        staleTime: Infinity,
    });

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const handleApplyFilters = () => {
        setAppliedFilters({ ...pendingFilters });
        toast.success('Filters Applied', {
            description: `Showing data from ${pendingFilters.start_date} to ${pendingFilters.end_date}`,
            icon: <Sparkles className="h-4 w-4" />,
        });
    };

    const handleReset = () => {
        setPendingFilters({ ...defaultFilters });
        setAppliedFilters({ ...defaultFilters });
        toast.info('Filters Reset', {
            description: 'All filters have been cleared',
            icon: <RotateCcw className="h-4 w-4" />,
        });
    };

    const activeFiltersCount = [
        pendingFilters.restaurant_id,
        pendingFilters.min_amount,
        pendingFilters.max_amount,
        pendingFilters.start_hour !== undefined,
        pendingFilters.end_hour !== undefined,
    ].filter(Boolean).length;

    // Prepare chart data - memoized to prevent re-animation
    const chartData = React.useMemo(() => {
        return analytics?.breakdown.map((item, index) => ({
            name: item.group,
            orders: item.order_count,
            revenue: item.total_revenue,
            avgValue: item.avg_order_value,
            fill: COLORS[index % COLORS.length],
        })) || [];
    }, [analytics]);

    // Custom tooltip style with visible dark text
    const CustomTooltipStyle = {
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        padding: '8px 12px',
        color: '#1f2937',
    };

    return (
        <div className="space-y-6">
            {/* Filter Panel */}
            <Card className="dark:bg-gray-800/50 dark:border-gray-700">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2 dark:text-gray-100">
                            <Filter className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            Advanced Filters
                            {activeFiltersCount > 0 && (
                                <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                                    {activeFiltersCount} active
                                </Badge>
                            )}
                        </CardTitle>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowFilters(!showFilters)}
                            className="dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            {showFilters ? (
                                <ChevronUp className="h-4 w-4" />
                            ) : (
                                <ChevronDown className="h-4 w-4" />
                            )}
                        </Button>
                    </div>
                </CardHeader>
                <div className={`overflow-hidden transition-all duration-300 ${showFilters ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <CardContent className="space-y-4">
                        {/* Row 1: Restaurant & Date Range */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                    <Store className="h-4 w-4" />
                                    Restaurant
                                </label>
                                <Select
                                    value={pendingFilters.restaurant_id?.toString() || 'all'}
                                    onValueChange={(v) =>
                                        setPendingFilters({ ...pendingFilters, restaurant_id: v === 'all' ? undefined : parseInt(v) })
                                    }
                                >
                                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100">
                                        <SelectValue placeholder="All Restaurants" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Restaurants</SelectItem>
                                        {restaurants?.map((r: Restaurant) => (
                                            <SelectItem key={r.id} value={r.id.toString()}>
                                                {r.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    Start Date
                                </label>
                                <Input
                                    type="date"
                                    value={pendingFilters.start_date}
                                    onChange={(e) => setPendingFilters({ ...pendingFilters, start_date: e.target.value })}
                                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    End Date
                                </label>
                                <Input
                                    type="date"
                                    value={pendingFilters.end_date}
                                    onChange={(e) => setPendingFilters({ ...pendingFilters, end_date: e.target.value })}
                                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                                />
                            </div>
                        </div>

                        {/* Row 2: Amount Range */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                    <IndianRupee className="h-4 w-4" />
                                    Min Order Amount (₹)
                                </label>
                                <Input
                                    type="number"
                                    placeholder="e.g., 100"
                                    value={pendingFilters.min_amount || ''}
                                    onChange={(e) =>
                                        setPendingFilters({
                                            ...pendingFilters,
                                            min_amount: e.target.value ? parseInt(e.target.value) : undefined,
                                        })
                                    }
                                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                    <IndianRupee className="h-4 w-4" />
                                    Max Order Amount (₹)
                                </label>
                                <Input
                                    type="number"
                                    placeholder="e.g., 500"
                                    value={pendingFilters.max_amount || ''}
                                    onChange={(e) =>
                                        setPendingFilters({
                                            ...pendingFilters,
                                            max_amount: e.target.value ? parseInt(e.target.value) : undefined,
                                        })
                                    }
                                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                                />
                            </div>
                        </div>

                        {/* Row 3: Hour Range */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    Start Hour
                                </label>
                                <Select
                                    value={pendingFilters.start_hour?.toString() || 'all'}
                                    onValueChange={(v) =>
                                        setPendingFilters({ ...pendingFilters, start_hour: v === 'all' ? undefined : parseInt(v) })
                                    }
                                >
                                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100">
                                        <SelectValue placeholder="Any Hour" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Any Hour</SelectItem>
                                        {HOUR_OPTIONS.map((h) => (
                                            <SelectItem key={h.value} value={h.value.toString()}>
                                                {h.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    End Hour
                                </label>
                                <Select
                                    value={pendingFilters.end_hour?.toString() || 'all'}
                                    onValueChange={(v) =>
                                        setPendingFilters({ ...pendingFilters, end_hour: v === 'all' ? undefined : parseInt(v) })
                                    }
                                >
                                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100">
                                        <SelectValue placeholder="Any Hour" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Any Hour</SelectItem>
                                        {HOUR_OPTIONS.map((h) => (
                                            <SelectItem key={h.value} value={h.value.toString()}>
                                                {h.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Row 4: Group By & Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 items-end justify-between pt-2 border-t dark:border-gray-700">
                            <div className="space-y-2 w-full sm:w-auto">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Group Results By</label>
                                <Select
                                    value={pendingFilters.group_by}
                                    onValueChange={(v: 'day' | 'hour' | 'restaurant') =>
                                        setPendingFilters({ ...pendingFilters, group_by: v })
                                    }
                                >
                                    <SelectTrigger className="w-[180px] dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="day">By Day</SelectItem>
                                        <SelectItem value="hour">By Hour</SelectItem>
                                        <SelectItem value="restaurant">By Restaurant</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex gap-2 w-full sm:w-auto">
                                <Button
                                    variant="outline"
                                    onClick={handleReset}
                                    className="flex-1 sm:flex-none dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                                >
                                    Reset
                                </Button>
                                <Button
                                    onClick={handleApplyFilters}
                                    className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 transition-all duration-200"
                                >
                                    Apply Filters
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </div>
            </Card>

            {/* Summary Cards - Enhanced Dark Mode */}
            {analytics && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0 shadow-lg shadow-blue-500/20 dark:shadow-blue-500/10">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-blue-100 flex items-center gap-2">
                                <ShoppingBag className="h-4 w-4" />
                                Filtered Orders
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-white font-mono">
                                {analytics.summary.filtered_orders}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 border-0 shadow-lg shadow-emerald-500/20 dark:shadow-emerald-500/10">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-emerald-100 flex items-center gap-2">
                                <IndianRupee className="h-4 w-4" />
                                Total Revenue
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-white font-mono">
                                {formatCurrency(analytics.summary.total_revenue)}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-orange-500 to-orange-600 border-0 shadow-lg shadow-orange-500/20 dark:shadow-orange-500/10">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-orange-100 flex items-center gap-2">
                                <TrendingUp className="h-4 w-4" />
                                Avg Order Value
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-white font-mono">
                                {formatCurrency(analytics.summary.avg_order_value)}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Charts */}
            {isLoading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="h-80 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
                    <div className="h-80 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
                </div>
            ) : analytics && chartData.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Bar Chart - Orders & Revenue */}
                    <Card className="dark:bg-gray-800/50 dark:border-gray-700">
                        <CardHeader>
                            <CardTitle className="text-lg dark:text-gray-100">
                                Orders by {appliedFilters.group_by === 'day' ? 'Day' : appliedFilters.group_by === 'hour' ? 'Hour' : 'Restaurant'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
                                    <XAxis
                                        dataKey="name"
                                        tick={{ fontSize: 11, fill: '#6b7280' }}
                                        angle={appliedFilters.group_by === 'restaurant' ? -45 : 0}
                                        textAnchor={appliedFilters.group_by === 'restaurant' ? 'end' : 'middle'}
                                        height={appliedFilters.group_by === 'restaurant' ? 80 : 30}
                                    />
                                    <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
                                    <Tooltip
                                        contentStyle={CustomTooltipStyle}
                                        cursor={false}
                                        labelStyle={{ color: '#1f2937', fontWeight: 600 }}
                                        formatter={(value, name) => [
                                            name === 'orders' ? value : formatCurrency(Number(value) || 0),
                                            name === 'orders' ? 'Orders' : 'Revenue',
                                        ]}
                                    />
                                    <Bar dataKey="orders" fill="#3b82f6" radius={[4, 4, 0, 0]} name="orders" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Pie Chart - Revenue Distribution */}
                    <Card className="dark:bg-gray-800/50 dark:border-gray-700">
                        <CardHeader>
                            <CardTitle className="text-lg dark:text-gray-100">Revenue Distribution</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="revenue"
                                        isAnimationActive={false}
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={CustomTooltipStyle}
                                        labelStyle={{ color: '#1f2937', fontWeight: 600 }}
                                        formatter={(value) => formatCurrency(Number(value) || 0)}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>
            ) : (
                <Card className="py-12 dark:bg-gray-800/50 dark:border-gray-700">
                    <CardContent className="text-center text-gray-500 dark:text-gray-400">
                        No data matches your filter criteria. Try adjusting your filters.
                    </CardContent>
                </Card>
            )}

            {/* Data Table */}
            {analytics && chartData.length > 0 && (
                <Card className="dark:bg-gray-800/50 dark:border-gray-700">
                    <CardHeader>
                        <CardTitle className="text-lg dark:text-gray-100">Detailed Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b dark:border-gray-700">
                                        <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                                            {appliedFilters.group_by === 'day' ? 'Date' : appliedFilters.group_by === 'hour' ? 'Hour' : 'Restaurant'}
                                        </th>
                                        <th className="text-right py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Orders</th>
                                        <th className="text-right py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Revenue</th>
                                        <th className="text-right py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Avg Value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {analytics.breakdown.map((item, index) => (
                                        <tr key={index} className="border-b last:border-0 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                            <td className="py-3 px-4 font-medium dark:text-gray-200">{item.group}</td>
                                            <td className="py-3 px-4 text-right font-mono dark:text-gray-300">{item.order_count}</td>
                                            <td className="py-3 px-4 text-right font-mono text-green-600 dark:text-emerald-400">
                                                {formatCurrency(item.total_revenue)}
                                            </td>
                                            <td className="py-3 px-4 text-right font-mono dark:text-gray-300">
                                                {formatCurrency(item.avg_order_value)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
