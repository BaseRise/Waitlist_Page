import { NextRequest, NextResponse } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Lazy initialization to avoid cold start issues
let ratelimit: Ratelimit | null = null

function getRateLimiter() {
  if (!ratelimit) {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
    ratelimit = new Ratelimit({
      redis: redis,
      limiter: Ratelimit.slidingWindow(3, '60 s'), // 1 min mein 3 requests
    })
  }
  return ratelimit
}

export async function middleware(request: NextRequest) {
  // Sirf API routes par check lagayein
  if (request.nextUrl.pathname.startsWith('/api/waitlist')) {
    try {
      // 'ip' header se uthana behtar hai kyunke NextRequest.ip kabhi undefined hota hai
      const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1"

      // Add timeout to rate limit check to prevent cold start hanging
      const timeoutPromise = new Promise<{ success: true }>((resolve) => 
        setTimeout(() => resolve({ success: true }), 3000)
      )

      const rateLimitPromise = getRateLimiter().limit(ip)
      
      const result = await Promise.race([rateLimitPromise, timeoutPromise])

      if (!result.success) {
        return NextResponse.json(
          { error: 'Too many requests. Please wait 1 minute.' },
          { status: 429 }
        )
      }
    } catch (error) {
      // If rate limiting fails, allow the request to proceed
      console.error('Rate limit error:', error)
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*',
}