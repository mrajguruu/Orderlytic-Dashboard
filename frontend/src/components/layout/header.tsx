'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { BarChart3, Store, Trophy, Menu, X, SlidersHorizontal, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const navigation = [
    { name: 'Restaurants', href: '/restaurants', icon: Store },
    { name: 'Top Performers', href: '/top-restaurants', icon: Trophy },
    { name: 'Advanced Filters', href: '/filters', icon: SlidersHorizontal },
];

export function Header() {
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Avoid hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-gray-900/95 dark:border-gray-800">
            <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8">
                {/* Logo */}
                <div className="flex lg:flex-1">
                    <Link href="/restaurants" className="-m-1.5 p-1.5 flex items-center gap-2 group">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300 group-hover:scale-105">
                            <BarChart3 className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent dark:from-blue-400 dark:to-blue-600">
                            OrderLytic
                        </span>
                    </Link>
                </div>

                {/* Mobile menu button */}
                <div className="flex items-center gap-2 lg:hidden">
                    {/* Dark mode toggle - Mobile */}
                    {mounted && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className="transition-transform hover:scale-110"
                        >
                            {theme === 'dark' ? (
                                <Sun className="h-5 w-5 text-yellow-500" />
                            ) : (
                                <Moon className="h-5 w-5 text-gray-600" />
                            )}
                        </Button>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <Menu className="h-6 w-6" />
                        )}
                    </Button>
                </div>

                {/* Desktop navigation */}
                <div className="hidden lg:flex lg:gap-x-8">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    'flex items-center gap-2 text-sm font-medium transition-all duration-200 hover:scale-105',
                                    isActive
                                        ? 'text-blue-600 dark:text-blue-400'
                                        : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
                                )}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.name}
                            </Link>
                        );
                    })}
                </div>

                {/* Desktop right section */}
                <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:gap-4">
                    {/* Dark mode toggle - Desktop */}
                    {mounted && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className="transition-transform hover:scale-110"
                        >
                            {theme === 'dark' ? (
                                <Sun className="h-5 w-5 text-yellow-500" />
                            ) : (
                                <Moon className="h-5 w-5 text-gray-600" />
                            )}
                        </Button>
                    )}
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        Kitchen Spurs Analytics
                    </span>
                </div>
            </nav>

            {/* Mobile menu */}
            <div
                className={cn(
                    'lg:hidden border-t bg-white dark:bg-gray-900 dark:border-gray-800 overflow-hidden transition-all duration-300',
                    mobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
                )}
            >
                <div className="space-y-1 px-4 py-3">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={cn(
                                    'flex items-center gap-3 rounded-lg px-3 py-2 text-base font-medium transition-all duration-200',
                                    isActive
                                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100'
                                )}
                            >
                                <item.icon className="h-5 w-5" />
                                {item.name}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </header>
    );
}
