import { supabase } from '../../lib/supabase'; // Path adjust kar lena agar zaroorat ho
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // STEP 1: Pehle check karein ke user exist karta hai ya nahi?
    const { data: existingUser } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .eq('email', email)
      .single();

    // Agar user mil gaya aur wo pehle se ACTIVE hai
    if (existingUser && existingUser.is_active) {
      return NextResponse.json({ 
        error: 'You are already a subscriber!' 
      }, { status: 409 }); // 409 means Conflict
    }

    // STEP 2: Agar user nahi hai, ya inactive hai -> Tab Subscribe/Update karein
    const { error: dbError } = await supabase
      .from('newsletter_subscribers')
      .upsert([{ 
        email: email, 
        is_active: true // Dobara active kar do
      }], { onConflict: 'email' });

    if (dbError) {
      console.error("Database Error:", dbError.message);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Subscribed successfully' 
    });

  } catch (error: any) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}