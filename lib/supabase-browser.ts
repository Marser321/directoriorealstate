'use client'

import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/database.types'

/**
 * Creates a Supabase client for use in browser/client components.
 * Uses cookie-based authentication for session persistence.
 */
export function createSupabaseBrowserClient() {
    return createBrowserClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    ) as any
}

// Singleton instance for use across the app
let browserClient: ReturnType<typeof createSupabaseBrowserClient> | null = null

export function getSupabaseBrowserClient() {
    if (!browserClient) {
        browserClient = createSupabaseBrowserClient()
    }
    return browserClient
}
