import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

// Create a Supabase client for server-side use
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://realstate-nu.vercel.app'

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/search`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/partners/registro`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
    ]

    // Fetch all active properties from Supabase
    const { data: properties, error } = await supabase
        .from('properties')
        .select('id, updated_at, is_featured')
        .in('status', ['for_sale', 'for_rent'])
        .order('is_featured', { ascending: false })
        .order('updated_at', { ascending: false })

    if (error) {
        console.error('Sitemap: Failed to fetch properties:', error)
        return staticPages
    }

    // Generate property URLs
    const propertyPages: MetadataRoute.Sitemap = (properties || []).map((property) => ({
        url: `${baseUrl}/property/${property.id}`,
        lastModified: new Date(property.updated_at),
        changeFrequency: 'weekly' as const,
        // Featured properties get higher priority
        priority: property.is_featured ? 0.9 : 0.7,
    }))

    return [...staticPages, ...propertyPages]
}
