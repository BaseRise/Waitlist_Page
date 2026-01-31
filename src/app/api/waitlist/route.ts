import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import crypto from 'crypto'
import dns from 'dns'
import { promisify } from 'util'

// 1. Resend Initialize
const resend = new Resend(process.env.RESEND_API_KEY);

const resolveMx = promisify(dns.resolveMx)

async function isValidEmailDomain(email: string): Promise<boolean> {
  try {
    const domain = email.split('@')[1]
    if (!domain) return false

    // Add timeout to prevent cold start hanging
    const timeoutPromise = new Promise<null>((_, reject) =>
      setTimeout(() => reject(new Error('DNS timeout')), 5000)
    )

    const mxRecords = await Promise.race([resolveMx(domain), timeoutPromise])
    return !!(mxRecords && mxRecords.length > 0)
  } catch (error) {
    console.log(`❌ DNS Check Failed for: ${email}`, error)
    // On timeout or error, allow common email providers
    const domain = email.split('@')[1]?.toLowerCase()
    const trustedDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'protonmail.com', 'live.com', 'msn.com']
    if (trustedDomains.includes(domain)) {
      return true
    }
    return false
  }
}

function generateRefCode(): string {
  return 'BR' + crypto.randomBytes(4).toString('hex').toUpperCase()
}

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}

export async function POST(request: NextRequest) {
  try {
    const { email: rawEmail, referredBy: rawRef } = await request.json();

    const email = rawEmail?.replace(/[<>]/g, "").trim().toLowerCase();
    const referredBy = rawRef?.replace(/[<>]/g, "").trim() || null;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json({ error: 'A valid email is required' }, { status: 400 });
    }

    // const isDomainValid = await isValidEmailDomain(email);
    // if (!isDomainValid) {
    //   return NextResponse.json({ error: 'Invalid email domain.' }, { status: 400 });
    // }

    const origin = request.headers.get('origin');
    const siteUrl = origin || process.env.NEXT_PUBLIC_SITE_URL || 'https://baserise.online';
    const supabaseAdmin = getSupabaseAdmin()

    // --- 1. Check Existing User ---
    const { data: existingUser } = await supabaseAdmin
      .from('waitlist')
      .select('email, is_verified, ref_code')
      .eq('email', email)
      .single()

    // Check if user exists in Supabase Auth
    const { data: authUsers } = await supabaseAdmin.auth.admin.listUsers()
    const userExistsInAuth = authUsers?.users?.some(u => u.email === email)

    if (existingUser) {
      if (existingUser.is_verified) {
        return NextResponse.json({
          error: 'This email is already verified!',
          refCode: existingUser.ref_code
        }, { status: 400 })
      } else {
        // Existing user - always use magiclink
        const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
          type: 'magiclink',
          email: email,
          options: { redirectTo: `${siteUrl}/verified` }
        });

        if (linkError) throw linkError;

        await resend.emails.send({
          from: 'BaseRise Confirmation <verify@baserise.online>',
          to: email,
          subject: 'Confirm your genesis spot on BaseRise 🚀',
          html: `
        <div style="font-family: sans-serif; text-align: center;">
          <h2>Welcome Back!</h2>
          <p>It seems you didn't verify your spot yet. Click below:</p>
          <a href="${linkData.properties.action_link}" 
             style="background:#2563eb; color:white; padding:12px 24px; text-decoration:none; border-radius:8px; display:inline-block; font-weight:bold;">
            CONFIRM MY SPOT
          </a>
        </div>
      `
        });

        return NextResponse.json({ success: true, message: 'Verification email resent!' })
      }
    }

    // --- 2. Create New User ---
    const refCode = generateRefCode()
    const { error: insertError } = await supabaseAdmin
      .from('waitlist')
      .insert({
        email,
        referred_by: referredBy || null,
        ref_code: refCode,
        is_verified: false,
        created_at: new Date().toISOString()
      })

    if (insertError) {
      return NextResponse.json({ error: 'Failed to add to waitlist' }, { status: 500 })
    }

    // Use magiclink if user exists in Auth, otherwise signup
    const linkType = userExistsInAuth ? 'magiclink' : 'signup'
    const linkOptions: any = {
      type: linkType,
      email: email,
      options: { redirectTo: `${siteUrl}/verified` }
    }

    if (linkType === 'signup') {
      linkOptions.password = crypto.randomBytes(16).toString('hex')
    }

    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink(linkOptions)

    if (linkError) throw linkError;
    await resend.emails.send({
      from: 'BaseRise Confirmation <verify@baserise.online>',
      to: email,
      subject: 'Confirm your genesis spot on BaseRise 🚀',
      html: `
        <div style="font-family: sans-serif; text-align: center;">
          <h2>Welcome to the Evolution!</h2>
          <p>Click the button below to verify your spot and activate your referral dashboard.</p>
          <a href="${linkData.properties.action_link}" 
             style="background:#2563eb; color:white; padding:12px 24px; text-decoration:none; border-radius:8px; display:inline-block; font-weight:bold;">
            CONFIRM MY SPOT
          </a>
          <p style="margin-top:20px; font-size:12px; color:#666;">This link will redirect you to the protocol initialization page.</p>
        </div>
      `
    });

    return NextResponse.json({
      success: true,
      message: 'Check your email for verification link!'
    })

  } catch (error) {
    console.error('Waitlist API error:', error)
    // Better error logging
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      })
    }
    return NextResponse.json({
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? String(error) : undefined
    }, { status: 500 })
  }
}