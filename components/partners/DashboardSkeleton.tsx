'use client'

import { motion } from 'framer-motion'

export function DashboardSkeleton() {
    return (
        <div className="min-h-[calc(100vh-4rem)] p-6 md:p-8 space-y-8 animate-pulse">
            {/* Header Skeleton */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                    <div className="h-8 w-64 bg-muted rounded-lg" />
                    <div className="h-4 w-48 bg-muted/60 rounded-md" />
                </div>
                <div className="h-11 w-40 bg-muted rounded-xl" />
            </div>

            {/* Stats Grid Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-32 bg-muted/30 rounded-xl border border-border/50 p-5" />
                ))}
            </div>

            {/* Table Skeleton */}
            <div className="glass-card rounded-xl overflow-hidden border border-border/50">
                <div className="p-5 border-b border-border/20">
                    <div className="h-6 w-32 bg-muted rounded" />
                </div>
                <div className="p-4 space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex gap-4">
                            <div className="w-16 h-12 bg-muted/40 rounded-lg" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 w-1/3 bg-muted/50 rounded" />
                                <div className="h-3 w-1/4 bg-muted/30 rounded" />
                            </div>
                            <div className="w-24 h-6 bg-muted/40 rounded-full" />
                            <div className="w-12 h-6 bg-muted/40 rounded" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Actions Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-32 bg-muted/20 rounded-xl border border-border/30" />
                ))}
            </div>
        </div>
    )
}
