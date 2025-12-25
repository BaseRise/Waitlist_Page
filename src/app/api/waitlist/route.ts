import { NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/app/lib/supabase'

function normalizeEmail(email: unknown): string | null {
    if (typeof email !== 'string') return null
    const normalized = email.trim().toLowerCase()
    return normalized ? normalized : null
}

export async function POST(request: Request) {
    try {
        const body = await request.json().catch(() => null)
        const email = normalizeEmail(body?.email)
        const referredBy = typeof body?.referredBy === 'string' ? body.referredBy.trim() : null

        if (!email) {
            return NextResponse.json({ error: 'Email is required.' }, { status: 400 })
        }

        const supabase = getSupabaseServerClient()

        // 1. Check total count (10,000 limit)
        const { count, error: countError } = await supabase
            .from('waitlist')
            .select('*', { count: 'exact', head: true })

        if (countError) {
            return NextResponse.json(
                { error: `Unable to check waitlist capacity: ${countError.message}` },
                { status: 500 },
            )
        }

        if (count !== null && count >= 10000) {
            return NextResponse.json(
                { error: 'Waitlist is currently full!' }, 
                { status: 403 }
            )
        }

        // 2. Insert user
        const { data, error } = await supabase
            .from('waitlist')
            .insert([{ 
                email, 
                referred_by: referredBy || null 
            }])
            .select() // Database se naya record wapis mangwaayein

        if (error) {
            if (error.code === '23505') {
                return NextResponse.json({ error: 'You are already on the list!' }, { status: 400 })
            }

            // Most common: anon key + RLS enabled with no INSERT policy.
            if (error.code === '42501') {
                const hasServiceRole = !!process.env.SUPABASE_SERVICE_ROLE_KEY
                return NextResponse.json(
                    {
                        error: hasServiceRole
                            ? error.message
                            : 'Insert blocked by Supabase RLS for table "waitlist". Fix by adding SUPABASE_SERVICE_ROLE_KEY to `.env.local` (server-only) or create an INSERT policy for anon on `waitlist`.',
                    },
                    { status: 500 },
                )
            }
            return NextResponse.json({ error: error.message }, { status: 400 })
        }

        // 3. Check if referral code was generated
        if (!data || data.length === 0 || !data[0].ref_code) {
            return NextResponse.json({ error: 'Database failed to generate referral code' }, { status: 500 })
        }

        return NextResponse.json({ 
            message: 'Success', 
            refCode: data[0].ref_code 
        }, { status: 200 })

    } catch (err) {
        const message = err instanceof Error ? err.message : 'Internal Server Error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}