
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://xtvjroywvlzewzmgustk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0dmpyb3l3dmx6ZXd6bWd1c3RrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyNjgyODAsImV4cCI6MjA4NTg0NDI4MH0.LQ1LU4FFKDUzHLqyhq0vf0FnmK6PFSXEcw6wt8p7aBM';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0dmpyb3l3dmx6ZXd6bWd1c3RrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDI2ODI4MCwiZXhwIjoyMDg1ODQ0MjgwfQ.TqUTRbykfWq4ekBRatovkQN5n7slEeEwfZBVKHXo7XM';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function diagnose() {
    console.log('--- Diagnosing Supabase ---');

    try {
        // 1. Check Properties Table (Anon)
        const { count: countAnon, error: errorAnon } = await supabase
            .from('properties')
            .select('*', { count: 'exact', head: true });

        console.log('Properties (Anon - RLS applies):', errorAnon ? `Error: ${errorAnon.message}` : countAnon);

        // 2. Check Properties Table (Admin)
        const { count: countAdmin, error: errorAdmin } = await supabaseAdmin
            .from('properties')
            .select('*', { count: 'exact', head: true });
        console.log('Properties (Admin - Bypass RLS):', errorAdmin ? `Error: ${errorAdmin.message}` : countAdmin);

        // 3. Check Agencies
        const { count: countAgencies, error: errorAgencies } = await supabaseAdmin
            .from('agencies')
            .select('*', { count: 'exact', head: true });
        console.log('Agencies (Admin):', errorAgencies ? `Error: ${errorAgencies.message}` : countAgencies);

        // 4. Sample Property (Admin) to checks columns
        if (countAdmin && countAdmin > 0) {
            const { data: properties, error: propError } = await supabaseAdmin
                .from('properties')
                .select('*')
                .limit(1);
            if (properties && properties.length > 0) {
                console.log('Sample Property Keys:', Object.keys(properties[0]));
            }
        }

    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

diagnose();
