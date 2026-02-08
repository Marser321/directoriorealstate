
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xtvjroywvlzewzmgustk.supabase.co';
// READ FROM .env.local manually if needed, or hardcode for this script since it's a dev tool
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0dmpyb3l3dmx6ZXd6bWd1c3RrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDI2ODI4MCwiZXhwIjoyMDg1ODQ0MjgwfQ.TqUTRbykfWq4ekBRatovkQN5n7slEeEwfZBVKHXo7XM';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const LOCATIONS = [
    { name: 'Punta del Este', slug: 'punta-del-este', type: 'city' },
    { name: 'La Barra', slug: 'la-barra', type: 'zone' },
    { name: 'Manantiales', slug: 'manantiales', type: 'zone' },
    { name: 'José Ignacio', slug: 'jose-ignacio', type: 'zone' },
];

const AGENCIES = [
    { name: 'Luxe Estate', slug: 'luxe-estate', tier_subscription: 'enterprise', is_verified: true, description: 'Exclusive properties for the discerning few.' },
    { name: 'Punta Prime', slug: 'punta-prime', tier_subscription: 'pro', is_verified: true, description: 'Your gateway to Punta living.' },
    { name: 'Ocean View Realty', slug: 'ocean-view', tier_subscription: 'basic', is_verified: false, description: 'Best views in town.' },
    { name: 'Coastal Living', slug: 'coastal-living', tier_subscription: 'pro', is_verified: true, description: 'Live the coastal dream.' },
    { name: 'Horizon Properties', slug: 'horizon-prop', tier_subscription: 'basic', is_verified: false, description: 'Broadening your horizons.' },
];

const PROPERTIES_TEMPLATE = [
    { title: 'Villa Marítima Exclusiva', price: 2500000, bedrooms: 5, bathrooms: 4, built_area: 450, main_image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2671&auto=format&fit=crop' },
    { title: 'Penthouse en Punta', price: 1200000, bedrooms: 3, bathrooms: 3, built_area: 280, main_image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2670&auto=format&fit=crop' },
    { title: 'Chacra en José Ignacio', price: 3800000, bedrooms: 6, bathrooms: 5, built_area: 600, main_image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2670&auto=format&fit=crop' },
    { title: 'Casa de Playa Moderna', price: 1800000, bedrooms: 4, bathrooms: 4, built_area: 350, main_image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2653&auto=format&fit=crop' },
    { title: 'Residencia del Golf', price: 2100000, bedrooms: 4, bathrooms: 5, built_area: 400, main_image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2670&auto=format&fit=crop' },
    { title: 'Apartamento Premium', price: 950000, bedrooms: 2, bathrooms: 2, built_area: 120, main_image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2670&auto=format&fit=crop' },
    { title: "Sunset Villa", price: 3200000, bedrooms: 5, bathrooms: 5, built_area: 500, main_image: "https://images.unsplash.com/photo-1600607687644-c7f32b50b5c2?q=80&w=2670&auto=format&fit=crop" },
    { title: "Oceanfront Condo", price: 1500000, bedrooms: 3, bathrooms: 2, built_area: 200, main_image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2670&auto=format&fit=crop" },
    { title: "Countryside Estate", price: 2800000, bedrooms: 6, bathrooms: 6, built_area: 700, main_image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2670&auto=format&fit=crop" },
    { title: "Modern Beach House", price: 1950000, bedrooms: 4, bathrooms: 3, built_area: 320, main_image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=2684&auto=format&fit=crop" },
    { title: "Luxury Penthouse", price: 4500000, bedrooms: 4, bathrooms: 4, built_area: 400, main_image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2653&auto=format&fit=crop" },
    { title: "Seaside Retreat", price: 850000, bedrooms: 2, bathrooms: 1, built_area: 100, main_image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=2670&auto=format&fit=crop" }
];

async function seed() {
    console.log('🌱 Starting Seed Process...');

    // 1. Locations
    console.log('📍 Seeding Locations...');
    const { data: locations, error: locError } = await supabase
        .from('locations')
        .upsert(LOCATIONS, { onConflict: 'slug' })
        .select();

    if (locError) {
        console.error('Error (Locations):', locError);
        return;
    }
    console.log(`✅ ${locations.length} Locations inserted/updated.`);

    // 2. Agencies
    console.log('🏢 Seeding Agencies...');
    const { data: agencies, error: agencyError } = await supabase
        .from('agencies')
        .upsert(AGENCIES, { onConflict: 'slug' })
        .select();

    if (agencyError) {
        console.error('Error (Agencies):', agencyError);
        return;
    }
    console.log(`✅ ${agencies.length} Agencies inserted/updated.`);

    // 3. Properties
    console.log('🏠 Seeding Properties...');

    const propertiesToInsert = PROPERTIES_TEMPLATE.map((prop, index) => {
        // Round robin assign location and agency
        const loc = locations[index % locations.length];
        const agency = agencies[index % agencies.length];

        // Safe handling for potentially missing ID
        if (!loc?.id || !agency?.id) {
            console.warn(`Skipping property ${prop.title} due to missing location or agency id.`);
            return null;
        };

        return {
            title: prop.title,
            slug: prop.title.toLowerCase().replace(/ /g, '-') + '-' + Math.random().toString(36).substr(2, 5),
            description: `Exquisite property located in ${loc.name}. Featured by ${agency.name}.`,
            price: prop.price,
            currency: 'USD',
            status: 'for_sale',
            is_featured: index < 4, // First 4 are featured
            built_area: prop.built_area,
            bedrooms: prop.bedrooms,
            bathrooms: prop.bathrooms,
            location_id: loc.id,
            agency_id: agency.id,
            main_image: prop.main_image,
            lifestyle_tags: ['Luxe', 'Exclusive', loc.type === 'beach' ? 'Beachfront' : 'Nature'],
            features: { pool: true, bbq: true, security: true },
        };
    }).filter(Boolean); // Filter out nulls

    const { data: properties, error: propError } = await supabase
        .from('properties')
        .upsert(propertiesToInsert, { onConflict: 'slug' })
        .select();

    if (propError) {
        console.error('Error (Properties):', propError);
    } else {
        console.log(`✅ ${properties.length} Properties inserted/updated.`);
    }

    console.log('🚀 Seed Complete!');
}

seed();
