import { NextRequest, NextResponse } from 'next/server'
import { stripe, isStripeConfigured, FEATURED_PRODUCT } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

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
    if (!isStripeConfigured() || !stripe) {
        return NextResponse.json(
            { error: 'Stripe is not configured' },
            { status: 400 }
        )
    }

    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
        return NextResponse.json(
            { error: 'Missing stripe-signature header' },
            { status: 400 }
        )
    }

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (err) {
        console.error('Webhook signature verification failed:', err)
        return NextResponse.json(
            { error: 'Webhook signature verification failed' },
            { status: 400 }
        )
    }

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session
        const { propertyId, durationDays } = session.metadata || {}

        if (propertyId) {
            const days = parseInt(durationDays || FEATURED_PRODUCT.durationDays.toString())
            const expiresAt = new Date()
            expiresAt.setDate(expiresAt.getDate() + days)

            const { error } = await getSupabaseAdmin()
                .from('properties')
                .update({
                    is_featured: true,
                    featured_expires_at: expiresAt.toISOString()
                })
                .eq('id', parseInt(propertyId))

            if (error) {
                console.error('Failed to update property:', error)
                return NextResponse.json({ error: error.message }, { status: 500 })
            }

            console.log(`Property ${propertyId} featured until ${expiresAt.toISOString()}`)
        }
    }

    return NextResponse.json({ received: true })
}
