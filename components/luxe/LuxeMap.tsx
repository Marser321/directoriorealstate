'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useMemo } from 'react';

// Custom Gold Marker Icon
const createIcon = (isHighlighted: boolean) => {
    const color = isHighlighted ? '#D4AF37' : '#0A0A0A';
    const size = isHighlighted ? 40 : 30;

    return L.divIcon({
        className: 'custom-marker',
        html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border: 3px solid white;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        transition: all 0.3s ease;
        ${isHighlighted ? 'animation: bounce 0.5s ease;' : ''}
      "></div>
    `,
        iconSize: [size, size],
        iconAnchor: [size / 2, size],
        popupAnchor: [0, -size],
    });
};

// Default icon for initial render
const DefaultIcon = createIcon(false);
const HighlightedIcon = createIcon(true);

L.Marker.prototype.options.icon = DefaultIcon;

// Punta del Este Coordinates
const CENTER_LAT = -34.9126;
const CENTER_LNG = -54.8711;

interface Property {
    id: number | string;
    title: string;
    price: number;
    currency: string | null;
    lat?: number;
    lng?: number;
    location?: string;
    main_image?: string;
}

interface LuxeMapProps {
    properties: Property[];
    hoveredPropertyId: string | number | null;
    onMarkerHover?: (id: string | number | null) => void;
    onMarkerClick?: (id: string | number) => void;
}

// Component to handle map fly-to animation
function FlyToMarker({ lat, lng, shouldFly }: { lat: number; lng: number; shouldFly: boolean }) {
    const map = useMap();

    useEffect(() => {
        if (shouldFly && lat && lng) {
            map.flyTo([lat, lng], 13, { duration: 0.8 });
        }
    }, [lat, lng, shouldFly, map]);

    return null;
}

export default function LuxeMap({
    properties,
    hoveredPropertyId,
    onMarkerHover,
    onMarkerClick
}: LuxeMapProps) {

    // Find the hovered property for fly-to
    const hoveredProperty = useMemo(() =>
        properties.find(p => p.id === hoveredPropertyId),
        [properties, hoveredPropertyId]
    );

    // Assign mock coordinates if not present
    const propertiesWithCoords = useMemo(() => {
        const mockCoords = [
            { lat: -34.915, lng: -54.86 },
            { lat: -34.85, lng: -54.70 },
            { lat: -34.94, lng: -54.91 },
            { lat: -34.88, lng: -54.75 },
            { lat: -34.92, lng: -54.82 },
            { lat: -34.90, lng: -54.88 },
        ];

        return properties.map((p, i) => ({
            ...p,
            lat: p.lat || mockCoords[i % mockCoords.length].lat,
            lng: p.lng || mockCoords[i % mockCoords.length].lng,
        }));
    }, [properties]);

    const formatPrice = (price: number, currency: string | null) => {
        if (price >= 1000000) {
            return `${currency === 'USD' ? 'USD' : '$'} ${(price / 1000000).toFixed(1)}M`;
        }
        return `${currency === 'USD' ? 'USD' : '$'} ${(price / 1000).toFixed(0)}k`;
    };

    return (
        <>
            {/* CSS for marker animation */}
            <style jsx global>{`
        @keyframes bounce {
          0%, 100% { transform: rotate(-45deg) translateY(0); }
          50% { transform: rotate(-45deg) translateY(-10px); }
        }
        .custom-marker {
          background: transparent !important;
          border: none !important;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        }
        .leaflet-popup-content {
          margin: 12px 16px;
        }
      `}</style>

            <MapContainer
                center={[CENTER_LAT, CENTER_LNG]}
                zoom={11}
                scrollWheelZoom={true}
                className="w-full h-full z-0 rounded-xl"
                style={{ background: '#FAFAFA' }}
            >
                {/* Premium Light Tiles */}
                <TileLayer
                    attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />

                {/* Fly to hovered property */}
                {hoveredProperty && (
                    <FlyToMarker
                        lat={hoveredProperty.lat || CENTER_LAT}
                        lng={hoveredProperty.lng || CENTER_LNG}
                        shouldFly={!!hoveredPropertyId}
                    />
                )}

                {/* Property Markers */}
                {propertiesWithCoords.map((property) => {
                    const isHighlighted = property.id === hoveredPropertyId;

                    return (
                        <Marker
                            key={property.id}
                            position={[property.lat!, property.lng!]}
                            icon={isHighlighted ? HighlightedIcon : DefaultIcon}
                            eventHandlers={{
                                mouseover: () => onMarkerHover?.(property.id),
                                mouseout: () => onMarkerHover?.(null),
                                click: () => onMarkerClick?.(property.id),
                            }}
                        >
                            <Popup>
                                <div className="text-center min-w-[180px]">
                                    {property.main_image && (
                                        <img
                                            src={property.main_image}
                                            alt={property.title}
                                            className="w-full h-24 object-cover rounded-lg mb-2"
                                        />
                                    )}
                                    <strong className="block text-foreground font-serif text-lg">
                                        {property.title}
                                    </strong>
                                    <span className="text-muted-foreground text-sm block mb-1">
                                        {property.location || 'Punta del Este'}
                                    </span>
                                    <span className="text-[#D4AF37] font-bold text-lg">
                                        {formatPrice(property.price, property.currency)}
                                    </span>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </>
    );
}
