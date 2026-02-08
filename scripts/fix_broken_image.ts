
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xtvjroywvlzewzmgustk.supabase.co';
// Using the same service role key as seed_data.ts
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0dmpyb3l3dmx6ZXd6bWd1c3RrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDI2ODI4MCwiZXhwIjoyMDg1ODQ0MjgwfQ.TqUTRbykfWq4ekBRatovkQN5n7slEeEwfZBVKHXo7XM';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const BAD_IMAGE_PART = '2250c38552f7';
const GOOD_IMAGE_URL = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2670&auto=format&fit=crop';

async function fixImage() {
    console.log('🔧 Starting Image Fix...');

    // 1. Find the property with the bad image
    const { data: properties, error: fetchError } = await supabase
        .from('properties')
        .select('id, title, main_image')
        .ilike('main_image', `%${BAD_IMAGE_PART}%`);

    if (fetchError) {
        console.error('❌ Error fetching properties:', fetchError);
        return;
    }

    if (!properties || properties.length === 0) {
        console.log('✅ No broken images found to fix.');
        return;
    }

    console.log(`Found ${properties.length} properties with broken images.`);

    // 2. Update them
    for (const prop of properties) {
        console.log(`Updating property: ${prop.title} (${prop.id})...`);
        const { error: updateError } = await supabase
            .from('properties')
            .update({ main_image: GOOD_IMAGE_URL })
            .eq('id', prop.id);

        if (updateError) {
            console.error(`❌ Failed to update property ${prop.id}:`, updateError);
        } else {
            console.log(`✅ Fixed property ${prop.id}`);
        }
    }

    // 3. Optional: Deduplicate if we created multiples (Not doing it now to be safe, just fixing the visual bug)
    console.log('✨ Image fix complete.');
}

fixImage();
