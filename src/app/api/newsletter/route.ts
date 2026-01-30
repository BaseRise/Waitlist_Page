import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// ⚠️ CHANGE: Service Role Key use karein (Bypass RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! 
)

export async function POST(req: Request) {
  try {
    const { email: rawEmail } = await req.json();

    // 1. Sanitization (Security Layer)
    const email = rawEmail?.replace(/[<>]/g, "").trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }

    // 2. Check Existing User (Admin client use kar rahay hain)
    const { data: existingUser } = await supabaseAdmin
      .from('newsletter_subscribers')
      .select('*')
      .eq('email', email)
      .single();

    if (existingUser && existingUser.is_active) {
      return NextResponse.json({ error: 'Already subscribed!' }, { status: 409 });
    }

    // 3. Insert / Update (Admin client bypasses RLS error)
    const { error: dbError } = await supabaseAdmin
      .from('newsletter_subscribers')
      .upsert([{ 
        email: email, 
        is_active: true 
      }], { onConflict: 'email' });

    if (dbError) {
      console.error("DB Error:", dbError.message);
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }
    
    return NextResponse.json({ success: true, message: 'Subscribed!' });

  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}