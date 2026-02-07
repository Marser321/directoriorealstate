// @regression-guard-locked: Luxe Estate v2.0 - Complete redesign

import { HeroSection } from "@/components/luxe/HeroSection";
import { BentoGrid } from "@/components/luxe/BentoGrid";
import { LifestyleCategories } from "@/components/luxe/LifestyleCategories";
import { MapWithListings } from "@/components/luxe/MapWithListings";
import { Footer } from "@/components/luxe/Footer";

// This would typically come from a database or API
const FEATURED_PROPERTIES = [
  {
    id: 1,
    title: "Villa Marítima Exclusiva",
    price: 2500000,
    currency: "USD",
    bedrooms: 5,
    bathrooms: 4,
    built_area: 450,
    location: "La Barra",
    images: ["/images/placeholders/luxury-villa.jpg", "/images/placeholders/interior-view.jpg"],
    main_image: "/images/placeholders/luxury-villa.jpg",
    status: "en_venta",
    lifestyle_tags: ["Frente al Mar", "Diseño"]
  },
  {
    id: 2,
    title: "Penthouse en Punta",
    price: 1200000,
    currency: "USD",
    bedrooms: 3,
    bathrooms: 3,
    built_area: 280,
    location: "Punta del Este",
    main_image: "/images/placeholders/urban-penthouse.jpg",
    status: "en_venta",
    lifestyle_tags: ["Vistas", "Lujo"]
  },
  {
    id: 3,
    title: "Chacra en José Ignacio",
    price: 3800000,
    currency: "USD",
    bedrooms: 6,
    bathrooms: 5,
    built_area: 600,
    location: "José Ignacio",
    main_image: "/images/placeholders/farm-ranch.jpg",
    status: "en_venta",
    lifestyle_tags: ["Naturaleza", "Privacidad"]
  },
  {
    id: 4,
    title: "Casa de Playa Moderna",
    price: 1800000,
    currency: "USD",
    bedrooms: 4,
    bathrooms: 4,
    built_area: 350,
    location: "Manantiales",
    main_image: "/images/placeholders/beach-house.jpg",
    status: "en_venta",
    lifestyle_tags: ["Playa", "Surf"]
  },
  {
    id: 5,
    title: "Residencia del Golf",
    price: 2100000,
    currency: "USD",
    bedrooms: 4,
    bathrooms: 5,
    built_area: 400,
    location: "Golf",
    main_image: "/images/placeholders/golf-estate.jpg",
    status: "en_venta",
    lifestyle_tags: ["Golf", "Seguridad"]
  },
  {
    id: 6,
    title: "Apartamento Premium",
    price: 950000,
    currency: "USD",
    bedrooms: 2,
    bathrooms: 2,
    built_area: 120,
    location: "Peninsula",
    main_image: "/images/placeholders/modern-apartment.jpg",
    status: "en_venta",
    lifestyle_tags: ["Céntrico", "Inversión"]
  }
];

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-background text-foreground">
      {/* 1. HERO SECTION - Cinematic */}
      <HeroSection />

      {/* 2. LIFESTYLE CATEGORIES */}
      <LifestyleCategories />

      {/* 3. FEATURED PROPERTIES - Bento Grid */}
      <BentoGrid
        properties={FEATURED_PROPERTIES}
        title="Propiedades Destacadas"
        subtitle="Selección curada de propiedades exclusivas en Punta del Este"
      />

      {/* 4. MAP WITH LISTINGS - Interactive */}
      <MapWithListings
        properties={FEATURED_PROPERTIES}
        title="Explora en el Mapa"
        subtitle="Encuentra propiedades por ubicación en Punta del Este"
      />

      {/* 5. VALUE PROPOSITION */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="space-y-4 px-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#E8D48A] rounded-full flex items-center justify-center mx-auto text-white mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-serif font-bold text-foreground">Expertise Inigualable</h3>
              <p className="text-muted-foreground leading-relaxed">
                Más de 20 años de experiencia en el mercado de lujo de Punta del Este, guiando a inversores y familias.
              </p>
            </div>

            <div className="space-y-4 px-4 md:border-x border-border">
              <div className="w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#E8D48A] rounded-full flex items-center justify-center mx-auto text-white mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-serif font-bold text-foreground">Inventario Exclusivo</h3>
              <p className="text-muted-foreground leading-relaxed">
                Acceso a propiedades off-market y las más codiciadas en La Barra, Manantiales y José Ignacio.
              </p>
            </div>

            <div className="space-y-4 px-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#E8D48A] rounded-full flex items-center justify-center mx-auto text-white mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-serif font-bold text-foreground">Concierge Local</h3>
              <p className="text-muted-foreground leading-relaxed">
                Más allá del Real Estate, te conectamos con el lifestyle. Desde clubs privados hasta asesoría legal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FOOTER */}
      <Footer />
    </main>
  );
}
