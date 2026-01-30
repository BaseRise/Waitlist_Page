import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { email: rawEmail } = await request.json();
    const email = rawEmail?.replace(/[<>]/g, "").trim().toLowerCase();

    // 1. Check User Existence (Sirf verified users allowed)
    const { data: user } = await supabaseAdmin
      .from('waitlist')
      .select('email, is_verified')
      .eq('email', email)
      .single();

    if (!user || !user.is_verified) {
      return NextResponse.json({ error: "Email not found or not verified." }, { status: 404 });
    }

    // 2. Send OTP (SignIn without creating new user)
    const { error: otpError } = await supabaseAdmin.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false, // 👈 Yeh Lookup ke liye critical hai
      }
    });

    if (otpError) return NextResponse.json({ error: otpError.message }, { status: 500 });

    return NextResponse.json({ success: true, message: "OTP sent successfully!" });

  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}