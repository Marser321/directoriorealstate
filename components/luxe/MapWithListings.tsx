'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { PropertyCard } from './PropertyCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Map as MapIcon, List, Grid3X3 } from 'lucide-react';

// Dynamic import to avoid SSR issues with Leaflet
const LuxeMap = dynamic(() => import('./LuxeMap'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full min-h-[500px] bg-muted/50 rounded-xl flex items-center justify-center">
            <Skeleton className="w-full h-full absolute inset-0 rounded-xl" />
            <span className="relative z-10 text-muted-foreground font-medium">Cargando mapa...</span>
        </div>
    ),
});

interface Property {
    id: number | string;
    title: string;
    slug?: string;
    price: number;
    currency: string | null;
    bedrooms: number;
    bathrooms: number;
    built_area: number;
    main_image: string;
    images?: string[];
    location?: string;
    status?: string;
    lifestyle_tags?: string[];
    lat?: number;
    lng?: number;
}

interface MapWithListingsProps {
    properties: Property[];
    title?: string;
    subtitle?: string;
}

export function MapWithListings({
    properties,
    title = "Explora en el Mapa",
    subtitle = "Encuentra propiedades por ubicación"
}: MapWithListingsProps) {
    const [hoveredPropertyId, setHoveredPropertyId] = useState<string | number | null>(null);
    const [viewMode, setViewMode] = useState<'split' | 'map' | 'list'>('split');

    const handlePropertyHover = (id: string | number | null) => {
        setHoveredPropertyId(id);
    };

    const handleMarkerClick = (id: string | number) => {
        // Navigate to property detail
        window.location.href = `/property/${id}`;
    };

    return (
        <section className="py-24 bg-background">
            <div className="container mx-auto px-6">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
                >
                    <div>
                        <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-2">
                            {title}
                        </h2>
                        <div className="h-1 w-20 bg-gradient-to-r from-[#D4AF37] to-[#E8D48A] rounded-full mb-4" />
                        <p className="text-muted-foreground text-lg">{subtitle}</p>
                    </div>

                    {/* View Mode Toggle */}
                    <div className="flex bg-muted rounded-full p-1">
                        <button
                            onClick={() => setViewMode('split')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${viewMode === 'split'
                                ? 'bg-white shadow-sm text-foreground'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <Grid3X3 className="w-4 h-4" />
                            <span className="hidden sm:inline">Split</span>
                        </button>
                        <button
                            onClick={() => setViewMode('map')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${viewMode === 'map'
                                ? 'bg-white shadow-sm text-foreground'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <MapIcon className="w-4 h-4" />
                            <span className="hidden sm:inline">Mapa</span>
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${viewMode === 'list'
                                ? 'bg-white shadow-sm text-foreground'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <List className="w-4 h-4" />
                            <span className="hidden sm:inline">Lista</span>
                        </button>
                    </div>
                </motion.div>

                {/* Main Content */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className={`grid gap-6 ${viewMode === 'split'
                        ? 'lg:grid-cols-2'
                        : 'grid-cols-1'
                        }`}
                >
                    {/* Map */}
                    {viewMode !== 'list' && (
                        <div className={`rounded-xl overflow-hidden border border-border shadow-lg ${viewMode === 'map' ? 'h-[70vh]' : 'h-[500px] lg:h-[600px]'
                            }`}>
                            <LuxeMap
                                properties={properties}
                                hoveredPropertyId={hoveredPropertyId}
                                onMarkerHover={handlePropertyHover}
                                onMarkerClick={handleMarkerClick}
                            />
                        </div>
                    )}

                    {/* Property List */}
                    {viewMode !== 'map' && (
                        <div className={`space-y-4 ${viewMode === 'split'
                            ? 'max-h-[600px] overflow-y-auto pr-2 scrollbar-hide'
                            : ''
                            }`}>
                            {properties.map((property, index) => (
                                <motion.div
                                    key={property.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.05 }}
                                    onMouseEnter={() => handlePropertyHover(property.id)}
                                    onMouseLeave={() => handlePropertyHover(null)}
                                    className={`transition-all duration-300 ${hoveredPropertyId === property.id
                                        ? 'ring-2 ring-[#D4AF37] rounded-2xl'
                                        : ''
                                        }`}
                                >
                                    <PropertyCard property={property} index={0} />
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Property count */}
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center text-muted-foreground mt-8"
                >
                    Mostrando {properties.length} propiedades en Punta del Este
                </motion.p>
            </div>
        </section>
    );
}
