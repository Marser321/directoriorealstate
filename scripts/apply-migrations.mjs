/**
 * Script to apply database migrations to Supabase
 * Run with: node scripts/apply-migrations.mjs
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Configuration
const SUPABASE_URL = 'https://xtvjroywvlzewzmgustk.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0dmpyb3l3dmx6ZXd6bWd1c3RrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDI2ODI4MCwiZXhwIjoyMDg1ODQ0MjgwfQ.TqUTRbykfWq4ekBRatovkQN5n7slEeEwfZBVKHXo7XM'

// Create admin client with service role
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
})

async function applyMigrations() {
    console.log('🚀 Starting Supabase migrations...\n')

    try {
        // Read the schema file
        const schemaPath = join(__dirname, '..', 'supabase', 'schema.sql')
        const schema = readFileSync(schemaPath, 'utf-8')

        // Split by statement (simple split, may need adjustment for complex SQL)
        // We'll execute the whole thing at once using the REST API

        console.log('📄 Schema file loaded successfully')
        console.log('📊 Applying schema to Supabase...\n')

        // Use the SQL endpoint directly
        const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_SERVICE_KEY,
                'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
                'Content-Type': 'application/json'
            }
        })

        // Note: We can't execute raw SQL via REST API
        // We need to use the management API or dashboard
        // Let's print instructions instead

        console.log('⚠️  Direct SQL execution requires the Supabase CLI or Dashboard')
        console.log('\n📋 Please execute the following in Supabase Dashboard > SQL Editor:\n')
        console.log('------- COPY FROM HERE -------\n')
        console.log(schema)
        console.log('\n------- COPY TO HERE -------\n')

        console.log('✅ After executing, run this script again to verify tables exist.')

    } catch (error) {
        console.error('❌ Error:', error.message)
        process.exit(1)
    }
}

async function verifyTables() {
    console.log('\n🔍 Verifying tables...\n')

    const tables = ['locations', 'agencies', 'profiles', 'agency_users', 'properties']

    for (const table of tables) {
        try {
            const { data, error } = await supabase
                .from(table)
                .select('*')
                .limit(1)

            if (error && error.code === '42P01') {
                console.log(`❌ ${table}: NOT FOUND`)
            } else if (error) {
                console.log(`⚠️  ${table}: ${error.message}`)
            } else {
                console.log(`✅ ${table}: EXISTS`)
            }
        } catch (e) {
            console.log(`❌ ${table}: Error checking`)
        }
    }
}

async function createStorageBucket() {
    console.log('\n📦 Creating storage bucket for agency logos...\n')

    try {
        const { data, error } = await supabase.storage.createBucket('agency-logos', {
            public: true,
            fileSizeLimit: 5242880, // 5MB
            allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']
        })

        if (error) {
            if (error.message.includes('already exists')) {
                console.log('✅ Bucket "agency-logos" already exists')
            } else {
                console.log('⚠️  Could not create bucket:', error.message)
            }
        } else {
            console.log('✅ Bucket "agency-logos" created successfully!')
        }
    } catch (e) {
        console.log('⚠️  Storage API error:', e.message)
    }
}

// Run
async function main() {
    await applyMigrations()
    await verifyTables()
    await createStorageBucket()

    console.log('\n🎉 Migration script completed!')
    console.log('\nNext steps:')
    console.log('1. Copy the SQL above and paste it in Supabase Dashboard > SQL Editor')
    console.log('2. Click "Run" to execute')
    console.log('3. Restart your dev server to pick up the new .env.local')
}

main()
