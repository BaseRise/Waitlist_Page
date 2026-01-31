import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  
  // Verification ke baad confirmation page par bhejo (with email)
  const next = '/verified' 

  if (token_hash && type) {
    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Token Verify karein
    const { data, error } = await supabaseAdmin.auth.verifyOtp({
      type,
      token_hash,
    })

    if (!error && data.user && data.user.email && data.session) {
      // Database mein Verified status True karein - EMAIL se match karo
      await supabaseAdmin
        .from('waitlist')
        .update({ 
          is_verified: true,
          user_id: data.user.id,
          verified_at: new Date().toISOString()
        })
        .eq('email', data.user.email)

      // User ko Confirmation Page par redirect karein WITH TOKENS in hash
      // Ye tokens verified page par session set karne ke liye use honge
      const redirectTo = request.nextUrl.clone()
      redirectTo.pathname = next
      redirectTo.searchParams.delete('token_hash')
      redirectTo.searchParams.delete('type')
      
      // Pass tokens via hash fragment (more secure than query params)
      const hashParams = new URLSearchParams({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        type: 'magiclink'
      })
      
      return NextResponse.redirect(`${redirectTo.origin}${redirectTo.pathname}#${hashParams.toString()}`)
    }
  }

  // Agar fail ho jaye
  const redirectTo = request.nextUrl.clone()
  redirectTo.pathname = '/error' 
  return NextResponse.redirect(redirectTo)
}