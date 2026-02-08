import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { PropertyTable } from '@/components/admin/property-table'

export default async function AdminPropertiesPage() {
    const cookieStore = await cookies()

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {
                    }
                },
            },
        }
    )

    // Fetch properties with agency details
    const { data: properties } = await supabase
        .from('properties')
        .select(`
            *,
            agencies (
                id,
                name
            )
        `)
        .order('created_at', { ascending: false })

    // Fetch agencies for assignment dropdown
    const { data: agencies } = await supabase
        .from('agencies')
        .select('id, name')
        .order('name')

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Propiedades</h1>
                <p className="text-slate-500 mt-2">
                    Visualiza y reasigna propiedades entre agencias.
                </p>
            </div>

            <PropertyTable
                properties={properties || []}
                agencies={agencies || []}
            />
        </div>
    )
}
