import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'


export async function POST(request: Request) {
    try {
        // 1. Authenticate the user
        const supabase = await createClient()

        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized: You must be logged in to create an agency.' },
                { status: 401 }
            )
        }

        // 2. Parse request body
        const body = await request.json()
        const { agencyName, agencySlug, city, description, logoUrl } = body

        if (!agencyName || !city) {
            return NextResponse.json(
                { error: 'Missing required fields: agencyName and city are required.' },
                { status: 400 }
            )
        }

        // 3. Create Agency and Link User (Using Service Role to bypass RLS for creation if needed, 
        //    or use user's client if RLS allows. 
        //    Schema says "Authenticated users can create agencies", so user's client is fine for agency.
        //    Schema says "Agency owners can manage members" for insert agency_users with check (user_id = auth.uid()).
        //    So standard client should work for BOTH. Let's try standard client first for better security context.)

        // HOWEVER, to link multiple tables (agencies + agency_users) transactionally or safely, 
        // we might want service role if RLS is tricky. 
        // Schema: "Authenticated users can create agencies" -> OK.
        // Schema: "Agency owners can manage members" -> Insert check: (user_id = auth.uid() OR owner exists).
        // Since we are creating the agency, we are NOT owner yet in agency_users. 
        // We insert agency (gets ID). Then insert agency_user (agency_id, user_id, role='owner').
        // RLS for agency_users insert: check(user_id = auth.uid()). This matches!
        // So standard client IS sufficient.

        // A. Insert Agency
        const { data: agencyData, error: agencyError } = await supabase
            .from('agencies')
            .insert({
                name: agencyName,
                slug: agencySlug, // Should handle uniqueness error
                description: description,
                city: city,
                logo_url: logoUrl,
                tier_subscription: 'basic'
            })
            .select()
            .single()

        if (agencyError) {
            // Handle unique slug error specifically if possible
            if (agencyError.code === '23505') { // unique_violation
                return NextResponse.json({ error: 'Agency URL (slug) already exists. Please choose another name.' }, { status: 409 })
            }
            return NextResponse.json({ error: agencyError.message }, { status: 400 })
        }

        const agencyId = agencyData.id as number

        // B. Insert Agency User (Link)
        const { error: linkError } = await supabase
            .from('agency_users')
            .insert({
                agency_id: agencyId,
                user_id: user.id,
                role: 'owner'
            })

        if (linkError) {
            // Ideally we should rollback agency creation here, but we can't easily with standard client unless we delete.
            // Let's try to delete the agency we just created to keep data clean.
            await supabase.from('agencies').delete().eq('id', agencyId)

            return NextResponse.json({ error: 'Failed to link user to agency: ' + linkError.message }, { status: 400 })
        }

        return NextResponse.json({
            success: true,
            agency: agencyData,
            message: 'Agency created and linked successfully.'
        })

    } catch (error: any) {
        console.error('Create Agency Error:', error)
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}
