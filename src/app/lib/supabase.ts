import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

function requireEnv(name: string, value: string | undefined): string {
	if (!value) throw new Error(`Missing environment variable: ${name}`)
	return value
}

/**
 * Server-side Supabase client.
 * Prefer `SUPABASE_SERVICE_ROLE_KEY` so inserts work with RLS enabled.
 */
export function getSupabaseServerClient() {
	const url = requireEnv('NEXT_PUBLIC_SUPABASE_URL', process.env.NEXT_PUBLIC_SUPABASE_URL)
	const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

	const supabaseKey = requireEnv(
		'SUPABASE_SERVICE_ROLE_KEY (preferred) or NEXT_PUBLIC_SUPABASE_ANON_KEY',
		key,
	)

	return createClient(url, supabaseKey, {
		auth: { persistSession: false, autoRefreshToken: false },
	})
}