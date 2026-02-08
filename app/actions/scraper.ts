'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function triggerScraper(agencyUrl: string) {
    const supabase = await createClient()

    try {
        // 1. Check permission (Admin only)
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Unauthorized')

        // 2. Create detailed log entry
        const { data: log, error: logError } = await supabase
            .from('scraping_logs')
            .insert({
                agency_url: agencyUrl,
                status: 'pending',
                properties_count: 0
            })
            .select()
            .single()

        if (logError) throw new Error(logError.message)

        // 3. Call n8n Webhook
        const n8nUrl = process.env.N8N_SCRAPER_WEBHOOK_URL || 'https://n8n.placeholder.com/webhook/scraper'

        // Don't await this if it takes too long, or await if it returns immediate confirmation
        // For now we await to ensure it reached n8n
        const response = await fetch(n8nUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                agencyUrl,
                jobId: log.id, // Send log ID so n8n can report back
                callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/ingest-properties`
            })
        })

        if (!response.ok) {
            // Mark as failed if n8n doesn't accept
            await supabase.from('scraping_logs').update({ status: 'failed', error_message: 'n8n connection failed' }).eq('id', log.id)
            throw new Error('Failed to trigger n8n workflow')
        }

        // 4. Update status to processing
        await supabase
            .from('scraping_logs')
            .update({ status: 'processing' })
            .eq('id', log.id)

        revalidatePath('/admin/scraper')
        return { success: true, message: 'Scraping started', logId: log.id }

    } catch (error: any) {
        console.error('Scraper Action Error:', error)
        return { success: false, message: error.message }
    }
}
