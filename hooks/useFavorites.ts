'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'luxe-favorites';

/**
 * Hook para gestionar favoritos con persistencia en localStorage
 * @returns Métodos y estado para manejar favoritos
 */
export function useFavorites() {
    const [favorites, setFavorites] = useState<(string | number)[]>([]);
    const [isHydrated, setIsHydrated] = useState(false);

    // Hidratar desde localStorage (solo en cliente)
    useEffect(() => {
        if (typeof window === 'undefined') return;

        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                setFavorites(JSON.parse(saved));
            }
        } catch (e) {
            console.error('Error loading favorites:', e);
        }
        setIsHydrated(true);
    }, []);

    // Persistir cambios
    useEffect(() => {
        if (!isHydrated) return;

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
        } catch (e) {
            console.error('Error saving favorites:', e);
        }
    }, [favorites, isHydrated]);

    const toggleFavorite = useCallback((id: string | number) => {
        setFavorites(prev => {
            const stringId = String(id);
            const exists = prev.some(f => String(f) === stringId);

            if (exists) {
                return prev.filter(f => String(f) !== stringId);
            }
            return [...prev, id];
        });
    }, []);

    const isFavorite = useCallback((id: string | number) => {
        return favorites.some(f => String(f) === String(id));
    }, [favorites]);

    const clearFavorites = useCallback(() => {
        setFavorites([]);
    }, []);

    return {
        favorites,
        toggleFavorite,
        isFavorite,
        clearFavorites,
        isHydrated,
    };
}
