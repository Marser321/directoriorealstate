import { NextRequest, NextResponse } from 'next/server'
import { stripe, isStripeConfigured, FEATURED_PRODUCT } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'

// Lazy Supabase admin client (created at runtime, not build time)
function getSupabaseAdmin() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!url || !key) {
        throw new Error('Supabase environment variables not configured')
    }

    return createClient(url, key)
}

export async function POST(request: NextRequest) {
    try {
        const { propertyId, propertyTitle } = await request.json()

        if (!propertyId) {
            return NextResponse.json({ error: 'Property ID is required' }, { status: 400 })
        }

        // Get Supabase client at runtime
        const supabaseAdmin = getSupabaseAdmin()

        // SIMULATION MODE: If Stripe is not configured, update directly
        if (!isStripeConfigured() || !stripe) {
            const expiresAt = new Date()
            expiresAt.setDate(expiresAt.getDate() + FEATURED_PRODUCT.durationDays)

            const { error } = await supabaseAdmin
                .from('properties')
                .update({
                    is_featured: true,
                    featured_expires_at: expiresAt.toISOString()
                })
                .eq('id', propertyId)

            if (error) {
                return NextResponse.json({ error: error.message }, { status: 500 })
            }

            return NextResponse.json({
                mode: 'simulation',
                success: true,
                message: `Propiedad destacada por ${FEATURED_PRODUCT.durationDays} días (modo simulación)`,
                expiresAt: expiresAt.toISOString()
            })
        }

        // REAL MODE: Create Stripe Checkout session
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: FEATURED_PRODUCT.name,
                            description: `${propertyTitle || 'Propiedad'} - ${FEATURED_PRODUCT.description}`,
                        },
                        unit_amount: FEATURED_PRODUCT.priceUsd,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${baseUrl}/partners/dashboard?featured=success&propertyId=${propertyId}`,
            cancel_url: `${baseUrl}/partners/dashboard?featured=cancelled`,
            metadata: {
                propertyId: propertyId.toString(),
                durationDays: FEATURED_PRODUCT.durationDays.toString(),
            },
        })

        return NextResponse.json({
            mode: 'live',
            url: session.url
        })
    } catch (error) {
        console.error('Stripe checkout error:', error)
        return NextResponse.json(
            { error: 'Failed to create checkout session' },
            { status: 500 }
        )
    }
}
