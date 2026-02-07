
import { notFound } from "next/navigation"
import SearchPage from "@/app/search/page"

// This page catches all SEO-friendly URLs like:
// /punta-del-este
// /punta-del-este/la-barra
// /punta-del-este/la-barra/waterfront

interface PageProps {
    params: Promise<{
        city: string
        slug?: string[]
    }>
}

export async function generateMetadata({ params }: PageProps) {
    const { city, slug } = await params

    // Logic to parse params and generate smart SEO titles
    // Mock logic for now implies we would look up these slugs in DB
    const zone = slug?.[0]
    const lifestyle = slug?.[1]

    const titleLocation = zone
        ? `${zone.replace('-', ' ')}, ${city.replace('-', ' ')}`
        : city.replace('-', ' ')

    const titleStart = lifestyle
        ? `${lifestyle.replace('-', ' ')} Properties`
        : `Luxury Real Estate`

    return {
        title: `${titleStart} in ${titleLocation} | Luxe Estate`,
        description: `Descubra propiedades exclusivas en ${titleLocation}. Navegue por nuestra selección curada de casas de lujo.`,
    }
}

export default async function DynamicSEOPage({ params }: PageProps) {
    const { city, slug } = await params

    // In a real implementation, we would pass these params 
    // to the SearchPage (or a SearchContainer) to pre-filter the results.
    // For now, we render the Search Page UI.

    return <SearchPage />
}
