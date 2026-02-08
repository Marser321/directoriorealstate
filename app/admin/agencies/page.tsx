import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { AgencyTable } from '@/components/admin/agency-table'
import { CreateAgencyDialog } from '@/components/admin/create-agency-dialog'

export default async function AdminAgenciesPage() {
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

    const { data: agencies } = await supabase
        .from('agencies')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Inmobiliarias</h1>
                    <p className="text-slate-500 mt-2">
                        Gestiona las agencias registradas en la plataforma.
                    </p>
                </div>
                <CreateAgencyDialog />
            </div>

            <AgencyTable agencies={agencies || []} />
        </div>
    )
}
