'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

// Types
interface VibeFilters {
    surf: boolean;
    nightlife: boolean;
    silence: boolean;
    forest: boolean;
    beach: boolean;
}

interface Zone {
    id: string;
    name: string;
    description: string;
    vibes: VibeFilters;
    vibeScore: number;
}

interface Venue {
    id: string;
    name: string;
    type: 'restaurant' | 'bar' | 'club' | 'cafe' | 'shop';
    isOpenNow: boolean;
    closesAt: string;
    rating: number;
    priceLevel: 1 | 2 | 3 | 4;
    image?: string;
}

interface Property {
    id: number;
    title: string;
    price: number;
    location: string;
    image: string;
    vibeMatch: number;
}

interface ExplorePanelProps {
    hoveredZone: string | null;
    selectedZone: string | null;
    activeFilters: VibeFilters;
    onSelectZone: (zone: string | null) => void;
}

// Zone data (matching the map)
const ZONES: Record<string, Zone> = {
    'la-barra': {
        id: 'la-barra',
        name: 'La Barra',
        description: 'Epicentro del surf y la vida nocturna. Playa con olas consistentes.',
        vibes: { surf: true, nightlife: true, silence: false, forest: false, beach: true },
        vibeScore: 82,
    },
    'jose-ignacio': {
        id: 'jose-ignacio',
        name: 'José Ignacio',
        description: 'Exclusivo y tranquilo. El refugio de celebridades.',
        vibes: { surf: true, nightlife: false, silence: true, forest: false, beach: true },
        vibeScore: 95,
    },
    'punta-centro': {
        id: 'punta-centro',
        name: 'Punta del Este Centro',
        description: 'El corazón de la península. Casinos y vida urbana.',
        vibes: { surf: false, nightlife: true, silence: false, forest: false, beach: true },
        vibeScore: 75,
    },
    'punta-ballena': {
        id: 'punta-ballena',
        name: 'Punta Ballena',
        description: 'Casapueblo y vistas épicas. Naturaleza y tranquilidad.',
        vibes: { surf: false, nightlife: false, silence: true, forest: true, beach: false },
        vibeScore: 88,
    },
    'manantiales': {
        id: 'manantiales',
        name: 'Manantiales',
        description: 'Equilibrio perfecto entre surf, gastronomía y vida nocturna.',
        vibes: { surf: true, nightlife: true, silence: false, forest: false, beach: true },
        vibeScore: 80,
    },
    'montoya': {
        id: 'montoya',
        name: 'Montoya',
        description: 'Surf local y atardeceres legendarios.',
        vibes: { surf: true, nightlife: false, silence: true, forest: false, beach: true },
        vibeScore: 85,
    },
    'bikini': {
        id: 'bikini',
        name: 'Bikini',
        description: 'Playa virgen y tranquilidad. El secreto mejor guardado.',
        vibes: { surf: true, nightlife: false, silence: true, forest: false, beach: true },
        vibeScore: 87,
    },
    'chihuahua': {
        id: 'chihuahua',
        name: 'Chihuahua',
        description: 'Bosques, lagos y aislamiento total.',
        vibes: { surf: false, nightlife: false, silence: true, forest: true, beach: false },
        vibeScore: 92,
    },
};

// Mock venues (would come from API)
const MOCK_VENUES: Record<string, Venue[]> = {
    'la-barra': [
        { id: '1', name: 'Moby Dick', type: 'restaurant', isOpenNow: true, closesAt: '02:00', rating: 4.5, priceLevel: 3 },
        { id: '2', name: 'Ovo Beach', type: 'club', isOpenNow: true, closesAt: '06:00', rating: 4.2, priceLevel: 4 },
        { id: '3', name: 'Playa Bar', type: 'bar', isOpenNow: true, closesAt: '04:00', rating: 4.0, priceLevel: 2 },
    ],
    'jose-ignacio': [
        { id: '4', name: 'La Huella', type: 'restaurant', isOpenNow: true, closesAt: '23:00', rating: 4.8, priceLevel: 4 },
        { id: '5', name: 'Parador La Huella', type: 'cafe', isOpenNow: true, closesAt: '19:00', rating: 4.5, priceLevel: 3 },
    ],
    'punta-centro': [
        { id: '6', name: 'Conrad Casino', type: 'club', isOpenNow: true, closesAt: '06:00', rating: 4.3, priceLevel: 4 },
        { id: '7', name: 'Soho', type: 'club', isOpenNow: true, closesAt: '06:00', rating: 4.1, priceLevel: 4 },
        { id: '8', name: 'Lo de Tere', type: 'restaurant', isOpenNow: true, closesAt: '01:00', rating: 4.6, priceLevel: 3 },
    ],
};

// Mock properties
const MOCK_PROPERTIES: Record<string, Property[]> = {
    'la-barra': [
        { id: 1, title: 'Casa Frente al Mar', price: 1500000, location: 'La Barra', image: '/images/hero-bg.jpg', vibeMatch: 95 },
        { id: 2, title: 'Apartamento Moderno', price: 450000, location: 'La Barra', image: '/images/hero-bg.jpg', vibeMatch: 87 },
    ],
    'jose-ignacio': [
        { id: 3, title: 'Villa de Lujo', price: 4500000, location: 'José Ignacio', image: '/images/hero-bg.jpg', vibeMatch: 98 },
    ],
};

// Get current time for "open now" filter
function getCurrentHour(): number {
    return new Date().getHours();
}

export default function ExplorePanel({
    hoveredZone,
    selectedZone,
    activeFilters,
    onSelectZone,
}: ExplorePanelProps) {
    const [showOpenOnly, setShowOpenOnly] = useState(true);

    // Get the active zone (selected takes priority over hovered)
    const activeZoneId = selectedZone || hoveredZone;
    const activeZone = activeZoneId ? ZONES[activeZoneId] : null;

    // Get venues for active zone, filtered by open status
    const venues = useMemo(() => {
        if (!activeZoneId) return [];
        const zoneVenues = MOCK_VENUES[activeZoneId] || [];
        return showOpenOnly ? zoneVenues.filter(v => v.isOpenNow) : zoneVenues;
    }, [activeZoneId, showOpenOnly]);

    // Get properties for active zone
    const properties = useMemo(() => {
        if (!activeZoneId) return [];
        return MOCK_PROPERTIES[activeZoneId] || [];
    }, [activeZoneId]);

    // Format price
    const formatPrice = (price: number) => {
        if (price >= 1000000) {
            return `$${(price / 1000000).toFixed(1)}M`;
        }
        return `$${(price / 1000).toFixed(0)}k`;
    };

    // Price level display
    const getPriceLevel = (level: number) => '💲'.repeat(level);

    return (
        <div className="w-full lg:w-96 h-[40vh] lg:h-full bg-white dark:bg-neutral-900 border-t lg:border-t-0 lg:border-l border-neutral-200 dark:border-neutral-800 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
                <h2 className="font-serif text-xl font-bold text-neutral-900 dark:text-white">
                    {activeZone ? activeZone.name : 'Explorador de Barrios'}
                </h2>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                    {activeZone
                        ? activeZone.description
                        : 'Haz hover o clic en una zona del mapa'
                    }
                </p>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
                <AnimatePresence mode="wait">
                    {activeZone ? (
                        <motion.div
                            key={activeZone.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                            className="p-4 space-y-6"
                        >
                            {/* Vibe Score */}
                            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/20 rounded-2xl">
                                <div>
                                    <span className="text-sm text-amber-700 dark:text-amber-300 font-medium">Vibe Score</span>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                                            {activeZone.vibeScore}
                                        </span>
                                        <span className="text-sm text-amber-500">/100</span>
                                    </div>
                                </div>
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg">
                                    <span className="text-2xl">
                                        {activeZone.vibeScore >= 90 ? '🌟' : activeZone.vibeScore >= 80 ? '✨' : '💫'}
                                    </span>
                                </div>
                            </div>

                            {/* Vibe Tags */}
                            <div className="flex flex-wrap gap-2">
                                {activeZone.vibes.surf && (
                                    <span className="px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                                        🏄 Surf Zone
                                    </span>
                                )}
                                {activeZone.vibes.nightlife && (
                                    <span className="px-3 py-1.5 rounded-full bg-red-100 text-red-700 text-sm font-medium">
                                        🌙 Vida Nocturna
                                    </span>
                                )}
                                {activeZone.vibes.silence && (
                                    <span className="px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                                        🧘 Silencio Total
                                    </span>
                                )}
                                {activeZone.vibes.forest && (
                                    <span className="px-3 py-1.5 rounded-full bg-lime-100 text-lime-700 text-sm font-medium">
                                        🌲 Bosque
                                    </span>
                                )}
                                {activeZone.vibes.beach && (
                                    <span className="px-3 py-1.5 rounded-full bg-amber-100 text-amber-700 text-sm font-medium">
                                        🏖️ Playa
                                    </span>
                                )}
                            </div>

                            {/* Venues Section (shown when Nightlife filter is active) */}
                            {(activeFilters.nightlife || venues.length > 0) && (
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-medium text-neutral-900 dark:text-white">
                                            Locales {showOpenOnly ? 'Abiertos Ahora' : 'en la Zona'}
                                        </h3>
                                        <button
                                            onClick={() => setShowOpenOnly(!showOpenOnly)}
                                            className={`text-xs px-2 py-1 rounded-full transition-colors ${showOpenOnly
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-neutral-100 text-neutral-600'
                                                }`}
                                        >
                                            {showOpenOnly ? '🟢 Solo Abiertos' : 'Todos'}
                                        </button>
                                    </div>

                                    <div className="space-y-2">
                                        {venues.length > 0 ? venues.map(venue => (
                                            <div
                                                key={venue.id}
                                                className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h4 className="font-medium text-neutral-900 dark:text-white">
                                                            {venue.name}
                                                        </h4>
                                                        <div className="flex items-center gap-2 text-sm text-neutral-500">
                                                            <span>{venue.type === 'restaurant' ? '🍽️' : venue.type === 'bar' ? '🍸' : venue.type === 'club' ? '🎵' : '☕'}</span>
                                                            <span>⭐ {venue.rating}</span>
                                                            <span>{getPriceLevel(venue.priceLevel)}</span>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className={`text-xs px-2 py-1 rounded-full ${venue.isOpenNow ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                            }`}>
                                                            {venue.isOpenNow ? `Cierra ${venue.closesAt}` : 'Cerrado'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        )) : (
                                            <p className="text-sm text-neutral-500 text-center py-4">
                                                No hay locales {showOpenOnly ? 'abiertos ahora' : 'registrados'} en esta zona
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Properties Section */}
                            {properties.length > 0 && (
                                <div>
                                    <h3 className="font-medium text-neutral-900 dark:text-white mb-3">
                                        Propiedades en {activeZone.name}
                                    </h3>
                                    <div className="space-y-3">
                                        {properties.map(property => (
                                            <div
                                                key={property.id}
                                                className="group rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-700 hover:shadow-lg transition-all duration-300 cursor-pointer"
                                            >
                                                <div className="relative h-32">
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                                                    <div className="absolute bottom-2 left-3 z-20">
                                                        <span className="text-white font-bold">
                                                            {formatPrice(property.price)}
                                                        </span>
                                                    </div>
                                                    <div className="absolute top-2 right-2 z-20">
                                                        <span className="px-2 py-1 rounded-full bg-amber-500 text-white text-xs font-medium">
                                                            {property.vibeMatch}% Match
                                                        </span>
                                                    </div>
                                                    <div className="w-full h-full bg-neutral-200 dark:bg-neutral-700" />
                                                </div>
                                                <div className="p-3">
                                                    <h4 className="font-medium text-neutral-900 dark:text-white truncate">
                                                        {property.title}
                                                    </h4>
                                                    <p className="text-sm text-neutral-500">{property.location}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center h-full p-8 text-center"
                        >
                            <div className="w-20 h-20 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
                                <span className="text-4xl">🗺️</span>
                            </div>
                            <h3 className="font-medium text-neutral-900 dark:text-white mb-2">
                                Explora los Barrios
                            </h3>
                            <p className="text-sm text-neutral-500 max-w-xs">
                                Usa los toggles para filtrar por estilo de vida y haz clic en una zona para ver detalles.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Footer with action */}
            {activeZone && (
                <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
                    <button className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg shadow-amber-500/25">
                        Ver Todas las Propiedades en {activeZone.name}
                    </button>
                </div>
            )}
        </div>
    );
}
