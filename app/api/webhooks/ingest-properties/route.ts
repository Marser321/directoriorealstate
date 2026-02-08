import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Initialize Supabase Admin Client (Service Role)
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    }
)

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { agencyUrl, properties, status, jobId } = body

        console.log(`[Ingest] Received ${properties?.length || 0} properties for ${agencyUrl}`)

        // 1. Update Log if jobId is provided (from n8n)
        if (jobId) {
            const { error: logError } = await supabaseAdmin
                .from('scraping_logs')
                .update({
                    status: status || 'completed',
                    properties_count: properties?.length || 0,
                    error_message: null
                })
                .eq('id', jobId)

            if (logError) console.error('[Ingest] Failed to update log:', logError)
        }

        if (!properties || !Array.isArray(properties)) {
            return NextResponse.json({ error: 'Invalid properties data' }, { status: 400 })
        }

        // 2. Map properties to DB schema
        // Assuming n8n sends: { title, price, currency, url, images[], location, ... }
        const propertiesToUpsert = properties.map((p: any) => ({
            source: 'other', // or 'agency_scraper'
            original_url: p.url,
            url: p.url,
            title: p.title,
            address: p.address || p.location,
            city: p.city || 'Unknown',
            listed_price: p.price,
            currency: p.currency || 'USD',
            images: p.images || [],
            description: p.description,
            built_area: p.builtArea,
            land_area: p.landArea,
            status: 'new',
            owner_name: p.contactName,
            owner_phone: p.contactPhone,
            meta: {
                scraped_at: new Date().toISOString(),
                agency_source: agencyUrl
            }
        }))

        // 3. Upsert into prospect_properties
        const { data, error } = await supabaseAdmin
            .from('prospect_properties')
            .upsert(propertiesToUpsert, {
                onConflict: 'original_url',
                ignoreDuplicates: false
            })

        if (error) {
            console.error('[Ingest] Database error:', error)
            // Update log with error
            if (jobId) {
                await supabaseAdmin
                    .from('scraping_logs')
                    .update({ status: 'failed', error_message: error.message })
                    .eq('id', jobId)
            }
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({
            success: true,
            count: properties.length,
            message: 'Properties ingested successfully'
        })

    } catch (error: any) {
        console.error('[Ingest] Unexpected error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
