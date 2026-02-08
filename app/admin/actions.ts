'use server'

import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Database } from '@/types/database.types'

// Initialize Supabase Admin Client (Service Role)
// ONLY use this in server actions that are protected by admin checks
const supabaseAdmin = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * Validates if the current user is a Super Admin
 */
async function checkSuperAdmin() {
    const cookieStore = await cookies()
    const supabase = createClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value }) =>
                            cookieStore.set(name, value)
                        )
                    } catch {
                        // usage in Server Components
                    }
                },
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single()

    if (!profile?.is_admin) throw new Error('Forbidden: Admin access required')

    return user
}

/**
 * Logs an admin action to the database
 */
export async function logAdminAction(action: string, targetResource: string, details?: any) {
    try {
        const user = await checkSuperAdmin()

        await supabaseAdmin.from('admin_logs').insert({
            admin_id: user.id,
            action,
            target_resource: targetResource,
            details: details ? details : null
        })
    } catch (error) {
        console.error('Failed to log admin action:', error)
        // Don't throw here to prevent blocking the main action if logging fails
    }
}

/**
 * Generates a magic link for impersonating a user
 * @param userId The ID of the user to impersonate
 */
export async function impersonateUser(userId: string) {
    try {
        const adminUser = await checkSuperAdmin()

        // 1. Log the impersonation attempt
        await logAdminAction('impersonate_user', `user:${userId}`, {
            reason: 'Admin impersonation request'
        })

        // 2. Generate a magic link for the target user
        const { data, error } = await supabaseAdmin.auth.admin.generateLink({
            type: 'magiclink',
            email: await getUserEmail(userId),
        })

        if (error) throw error

        // 3. Return the link (in a real app, we might redirect directly)
        // For security, usually we'd verify the admin's password again here

        if (!data.properties?.action_link) {
            throw new Error('Failed to generate impersonation link')
        }

        return { success: true, url: data.properties.action_link }

    } catch (error: any) {
        console.error('Impersonation failed:', error)
        return { success: false, error: error.message }
    }
}

/**
 * Helper to get user email (since it's not in public.profiles usually)
 */
async function getUserEmail(userId: string) {
    const { data: { user }, error } = await supabaseAdmin.auth.admin.getUserById(userId)
    if (error || !user) throw new Error('User not found')
    return user.email!
}
