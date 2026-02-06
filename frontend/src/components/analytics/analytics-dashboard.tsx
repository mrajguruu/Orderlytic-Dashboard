'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { Calendar, TrendingUp, ShoppingBag, IndianRupee, Clock, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAnalyticsTrends } from '@/hooks/useApi';
import type { DailyMetric } from '@/types';

interface AnalyticsDashboardProps {
    restaurantId: number;
}

// Custom tooltip style for clean design
const CustomTooltipStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    padding: '8px 12px',
    color: '#1f2937',
};

const CustomLabelStyle = {
    color: '#1f2937',
    fontWeight: 600,
};

export function AnalyticsDashboard({ restaurantId }: AnalyticsDashboardProps) {
    // Default date range: last 7 days (matching the data)
    const [startDate, setStartDate] = useState('2025-06-22');
    const [endDate, setEndDate] = useState('2025-06-28');

    const { data: trends, isLoading, error, refetch } = useAnalyticsTrends(
        restaurantId,
        startDate,
        endDate
    );

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    // Prepare chart data
    const chartData = trends?.daily_metrics.map((metric: DailyMetric) => ({
        date: format(new Date(metric.date), 'MMM dd'),
        fullDate: metric.date,
        dayOfWeek: metric.day_of_week,
        orders: metric.order_count,
        revenue: metric.total_revenue,
        avgOrderValue: metric.avg_order_value,
        peakHour: metric.peak_hour.hour,
        peakHourFormatted: metric.peak_hour.hour_formatted,
        peakHourOrders: metric.peak_hour.order_count,
    })) || [];

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-red-600 dark:text-red-400 mb-4">Failed to load analytics data</p>
                <Button onClick={() => refetch()} className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Retry
                </Button>
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
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setStartDate('2025-06-22');
                                    setEndDate('2025-06-28');
                                }}
                                className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                                All Data
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Summary Cards - Vibrant Gradient */}
            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-32 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0 shadow-lg shadow-blue-500/20">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-blue-100 flex items-center gap-2">
                                <ShoppingBag className="h-4 w-4" />
                                Total Orders
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-white font-mono">
                                {trends?.summary.total_orders || 0}
                            </p>
                            <p className="text-xs text-blue-200 mt-1">
                                {trends?.date_range.days} days
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 border-0 shadow-lg shadow-emerald-500/20">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-emerald-100 flex items-center gap-2">
                                <IndianRupee className="h-4 w-4" />
                                Total Revenue
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-white font-mono">
                                {formatCurrency(trends?.summary.total_revenue || 0)}
                            </p>
                            <p className="text-xs text-emerald-200 mt-1">
                                For selected period
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-orange-500 to-orange-600 border-0 shadow-lg shadow-orange-500/20">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-orange-100 flex items-center gap-2">
                                <TrendingUp className="h-4 w-4" />
                                Avg Order Value
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-white font-mono">
                                {formatCurrency(trends?.summary.avg_order_value || 0)}
                            </p>
                            <p className="text-xs text-orange-200 mt-1">
                                Per order average
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-500 to-purple-600 border-0 shadow-lg shadow-purple-500/20">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-purple-100 flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                Peak Hour
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-white font-mono">
                                {trends?.summary.most_common_peak_hour_formatted || 'N/A'}
                            </p>
                            <p className="text-xs text-purple-200 mt-1">
                                Most common busy hour
                            </p>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Daily Orders Chart */}
                <Card className="dark:bg-gray-800/50 dark:border-gray-700">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2 dark:text-gray-100">
                            <ShoppingBag className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            Daily Orders
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
                        ) : (
                            <ResponsiveContainer width="100%" height={280}>
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
                                    <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#6b7280' }} />
                                    <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
                                    <Tooltip
                                        contentStyle={CustomTooltipStyle}
                                        labelStyle={CustomLabelStyle}
                                        cursor={false}
                                        labelFormatter={(label, payload) => {
                                            const data = payload?.[0]?.payload;
                                            return data ? `${data.dayOfWeek}, ${label}` : label;
                                        }}
                                    />
                                    <Bar dataKey="orders" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Orders" />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>

                {/* Daily Revenue Chart */}
                <Card className="dark:bg-gray-800/50 dark:border-gray-700">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2 dark:text-gray-100">
                            <IndianRupee className="h-5 w-5 text-green-600 dark:text-emerald-400" />
                            Daily Revenue
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
                        ) : (
                            <ResponsiveContainer width="100%" height={280}>
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
                                    <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#6b7280' }} />
                                    <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} tickFormatter={(v) => `₹${v / 1000}k`} />
                                    <Tooltip
                                        contentStyle={CustomTooltipStyle}
                                        labelStyle={CustomLabelStyle}
                                        cursor={false}
                                        formatter={(value) => [formatCurrency(Number(value) || 0), 'Revenue']}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#10b981"
                                        strokeWidth={3}
                                        dot={{ fill: '#10b981', strokeWidth: 2 }}
                                        name="Revenue"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>

                {/* Average Order Value Chart */}
                <Card className="dark:bg-gray-800/50 dark:border-gray-700">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2 dark:text-gray-100">
                            <TrendingUp className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                            Average Order Value
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
                        ) : (
                            <ResponsiveContainer width="100%" height={280}>
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
                                    <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#6b7280' }} />
                                    <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} tickFormatter={(v) => `₹${v}`} />
                                    <Tooltip
                                        contentStyle={CustomTooltipStyle}
                                        labelStyle={CustomLabelStyle}
                                        cursor={false}
                                        formatter={(value) => [formatCurrency(Number(value) || 0), 'Avg Value']}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="avgOrderValue"
                                        stroke="#f97316"
                                        strokeWidth={3}
                                        dot={{ fill: '#f97316', strokeWidth: 2 }}
                                        name="Avg Order Value"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>

                {/* Peak Hour Chart */}
                <Card className="dark:bg-gray-800/50 dark:border-gray-700">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2 dark:text-gray-100">
                            <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            Peak Order Hour
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
                        ) : (
                            <ResponsiveContainer width="100%" height={280}>
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
                                    <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#6b7280' }} />
                                    <YAxis
                                        tick={{ fontSize: 12, fill: '#6b7280' }}
                                        domain={[0, 23]}
                                        tickFormatter={(v) => `${v}:00`}
                                    />
                                    <Tooltip
                                        contentStyle={CustomTooltipStyle}
                                        labelStyle={CustomLabelStyle}
                                        cursor={false}
                                        formatter={(value) => [`${value}:00`, 'Peak Hour']}
                                    />
                                    <Bar dataKey="peakHour" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Peak Hour" />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
