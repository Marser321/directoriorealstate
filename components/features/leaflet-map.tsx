
"use client"

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect } from 'react'

// Fix for default Leaflet marker icons in Next.js
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
})
L.Marker.prototype.options.icon = DefaultIcon

// Punta del Este Coordinates
const CENTER_LAT = -34.9126
const CENTER_LNG = -54.8711

// Mock Data for Visualization (Until DB Connected)
const MOCK_PINS = [
    { id: 1, lat: -34.915, lng: -54.86, title: "Villa Marítima", price: "$2.5M" },
    { id: 2, lat: -34.85, lng: -54.7, title: "Chacra J. Ignacio", price: "$1.8M" },
    { id: 3, lat: -34.94, lng: -54.91, title: "Penthouse Brava", price: "$950k" },
]

export default function LeafletMap() {

    useEffect(() => {
        // Cleanup required for strict mode sometimes, though React-Leaflet handles usually
    }, [])

    return (
        <MapContainer
            center={[CENTER_LAT, CENTER_LNG]}
            zoom={11}
            scrollWheelZoom={false}
            className="w-full h-full z-0"
            style={{ background: '#f1f5f9' }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {MOCK_PINS.map(pin => (
                <Marker key={pin.id} position={[pin.lat, pin.lng]}>
                    <Popup>
                        <div className="text-center">
                            <strong className="block text-slate-900 font-serif">{pin.title}</strong>
                            <span className="text-[#C6A665] font-bold">{pin.price}</span>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    )
}
