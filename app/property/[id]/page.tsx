import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import PropertyDetailClient from './PropertyDetailClient'

// Server-side Supabase client
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface PropertyPageProps {
    params: Promise<{ id: string }>
}

// Fetch property data
async function getProperty(id: string) {
    const { data, error } = await supabase
        .from('properties')
        .select(`
            *,
            location:locations(name, slug),
            agency:agencies(name, slug, whatsapp, contact_phone)
        `)
        .eq('id', id)
        .single()

    if (error || !data) return null
    return data
}

// SEO: Generate dynamic metadata
// Format: [Type] en [Neighborhood] - [Price] | Luxe Estate
export async function generateMetadata({ params }: PropertyPageProps): Promise<Metadata> {
    const { id } = await params
    const property = await getProperty(id)

    if (!property) {
        return {
            title: 'Propiedad no encontrada | Luxe Estate',
        }
    }

    // Format price
    const formattedPrice = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: property.currency || 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(property.price)

    // Get property type from status
    const typeMap: Record<string, string> = {
        'for_sale': 'Casa en Venta',
        'for_rent': 'Casa en Alquiler',
        'sold': 'Vendida',
        'rented': 'Alquilada',
    }
    const propertyType = typeMap[property.status || 'for_sale'] || 'Propiedad'

    // Location name
    const locationName = property.location?.name || 'Uruguay'

    // Build title: [Type] en [Neighborhood] - [Price] | Luxe Estate
    const title = `${propertyType} en ${locationName} - ${formattedPrice} | Luxe Estate`

    // Build description
    const description = property.description
        ? property.description.slice(0, 160) + '...'
        : `${propertyType} en ${locationName}. ${property.bedrooms || 0} dormitorios, ${property.bathrooms || 0} baños. ${formattedPrice}`

    // Build OG image URL with property details
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://realstate-nu.vercel.app'
    const ogParams = new URLSearchParams({
        title: property.title,
        price: formattedPrice,
        location: locationName,
        bedrooms: (property.bedrooms || 0).toString(),
        bathrooms: (property.bathrooms || 0).toString(),
        area: (property.built_area || 0).toString(),
        ...(property.main_image && { image: property.main_image }),
    })
    const ogImageUrl = `${baseUrl}/api/og?${ogParams.toString()}`

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: 'website',
            url: `${baseUrl}/property/${id}`,
            images: [
                {
                    url: ogImageUrl,
                    width: 1200,
                    height: 630,
                    alt: property.title,
                },
            ],
            siteName: 'Luxe Estate',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [ogImageUrl],
        },
    }
}

export default async function PropertyPage({ params }: PropertyPageProps) {
    const { id } = await params
    const property = await getProperty(id)

    if (!property) {
        notFound()
    }

    // Transform data for client component
    const clientData = {
        id: property.id,
        title: property.title,
        location: property.location?.name || 'Uruguay',
        badge: property.is_featured ? 'Destacada' : (property.status === 'for_sale' ? 'En Venta' : 'En Alquiler'),
        price: property.price,
        currency: property.currency || 'USD',
        bedrooms: property.bedrooms || 0,
        bathrooms: property.bathrooms || 0,
        builtArea: property.built_area || 0,
        plotArea: property.plot_area || 0,
        description: property.description ? [property.description] : [],
        amenities: Array.isArray(property.lifestyle_tags) ? property.lifestyle_tags : [],
        images: property.images?.map((src: string, i: number) => ({
            src,
            alt: `${property.title} - Imagen ${i + 1}`
        })) || (property.main_image ? [{ src: property.main_image, alt: property.title }] : []),
        agent: {
            name: property.agency?.name || 'Luxe Estate',
            title: 'Asesor Inmobiliario',
            phone: property.agency?.contact_phone || '',
            whatsapp: property.agency?.whatsapp || '',
            avatar: '/images/placeholders/agent-profile.jpg',
        },
    }

    return <PropertyDetailClient property={clientData} />
}
