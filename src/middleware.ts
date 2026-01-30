import { NextRequest, NextResponse } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(3, '60 s'), // 1 min mein 3 requests
})

export async function middleware(request: NextRequest) {
  // Sirf API routes par check lagayein
  if (request.nextUrl.pathname.startsWith('/api/waitlist')) {
    // 'ip' header se uthana behtar hai kyunke NextRequest.ip kabhi undefined hota hai
    const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1"

    const { success, limit, reset, remaining } = await ratelimit.limit(ip)

    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait 1 minute.' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': reset.toString(),
          }
        }
      )
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*',
}