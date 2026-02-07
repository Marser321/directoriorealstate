"use client";

import React from "react";
import { PropertyCard } from "@/components/luxe/PropertyCard";

// Datos de prueba
const mockProperty = {
    id: 1,
    title: "Villa Marítima Exclusiva",
    price: 2500000,
    currency: "USD",
    bedrooms: 5,
    bathrooms: 4,
    built_area: 450,
    main_image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2671&auto=format&fit=crop",
    location: "La Barra, Punta del Este",
    status: "EN_VENTA"
};

const mockProperty2 = {
    id: 2,
    title: "Penthouse Panorámico",
    price: 1200000,
    currency: "USD",
    bedrooms: 3,
    bathrooms: 3,
    built_area: 280,
    main_image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2670&auto=format&fit=crop",
    location: "Playa Mansa, Punta del Este",
    status: "ALQUILER_TEMPORAL"
};

export default function Test3DCardPage() {
    return (
        <div className="min-h-screen bg-neutral-100 dark:bg-black py-20 px-4">
            <div className="max-w-7xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-serif font-bold text-neutral-800 dark:text-[#D4AF37]">
                        3D Property Card Test
                    </h1>
                    <p className="text-neutral-600 dark:text-neutral-400">
                        Aceternity UI "Sniping" Implementation with Luxe Estate Palette
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                    <PropertyCard property={mockProperty} />
                    <PropertyCard property={mockProperty2} />
                    <PropertyCard property={{ ...mockProperty, id: 3, title: "Residencia Bosque", main_image: "https://images.unsplash.com/photo-1600596542815-2a4d9fddace7?q=80&w=2670&auto=format&fit=crop" }} />
                </div>
            </div>
        </div>
    );
}
