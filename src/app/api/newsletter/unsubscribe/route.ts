import { supabase } from '../../../lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Invalid link' }, { status: 400 });
    }

    // User ko list se delete nahi karte, bas inactive kar dete hain
    const { error } = await supabase
      .from('newsletter_subscribers')
      .update({ is_active: false })
      .eq('email', email);

    if (error) {
      console.error("Unsub Error:", error.message);
      return NextResponse.json({ error: 'Error processing request' }, { status: 500 });
    }

    // Professional success message
    return new Response("You have been successfully unsubscribed from BaseRise updates.", {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });

  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}