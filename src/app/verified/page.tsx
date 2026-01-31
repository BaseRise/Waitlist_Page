'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Loader2, XCircle, ArrowRight, ShieldCheck, Lock } from 'lucide-react'
import { supabase } from '@/app/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function VerifiedSuccess() {
  const [status, setStatus] = useState<'verifying' | 'confirmed' | 'success' | 'already_verified' | 'error'>('verifying')
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      try {
        // 1. Handle Magic Link Tokens
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const accessToken = hashParams.get('access_token')
        const refreshToken = hashParams.get('refresh_token')

        let sessionUser = null

        if (accessToken && refreshToken) {
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          })
          if (!error) {
            sessionUser = data.user
            // Clear hash from URL for security (tokens should not remain visible)
            window.history.replaceState(null, '', window.location.pathname)
          }
        } else {
          const { data: { session } } = await supabase.auth.getSession()
          sessionUser = session?.user
        }

        if (sessionUser?.email) {
          setUserEmail(sessionUser.email)
          setUserId(sessionUser.id)

          // 🛑 2. Check DB Status immediately (The Fix)
          const { data: dbUser, error: dbError } = await supabase
            .from('waitlist')
            .select('is_verified')
            .eq('email', sessionUser.email)
            .single()

          if (dbUser?.is_verified) {
            setStatus('already_verified') // Agar pehle se verified hai
          } else {
            setStatus('confirmed') // Agar naya hai aur finalize karna hai
          }
        } else {
          setStatus('error')
        }
      } catch (err) {
        setStatus('error')
      }
    }
    checkSession()
  }, [])

  const handleFinalize = async () => {
    if (!userEmail || !userId) return

    setIsUpdating(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()

      const response = await fetch('/api/auth/verify-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ email: userEmail, userId: userId })
      })

      if (response.ok) {
        // Broadcast to Tab A
        const channel = new BroadcastChannel('baserise_verification')
        channel.postMessage({ type: 'EMAIL_VERIFIED', email: userEmail })
        setTimeout(() => channel.close(), 1000)

        localStorage.removeItem(`baserise_timer_${userEmail}`)
        // Store email in localStorage for ref-code page (secure, no URL exposure)
        localStorage.setItem('baserise_verified_email', userEmail)
        setStatus('success')
        
        // Auto redirect to ref-code page after showing success briefly
        setTimeout(() => {
          router.push('/ref-code')
        }, 2500)
      } else {
        setStatus('error')
      }
    } catch (err) {
      setStatus('error')
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030303] text-white font-sans overflow-hidden px-4 relative">

      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full mix-blend-screen" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 blur-[120px] rounded-full mix-blend-screen" />

      <AnimatePresence mode="wait">

        {/* STATE: LOADING */}
        {status === 'verifying' && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center z-10">
            <div className="relative w-16 h-16 mx-auto mb-6">
              <div className="absolute inset-0 border-t-2 border-blue-500 rounded-full animate-spin" />
              <div className="absolute inset-2 border-t-2 border-purple-500 rounded-full animate-spin direction-reverse" />
            </div>
            <p className="uppercase tracking-[0.2em] text-xs font-bold text-blue-400/80">Securing Connection...</p>
          </motion.div>
        )}

        {/* STATE: FINALIZE BUTTON (Only for new verifications) */}
        {status === 'confirmed' && (
          <motion.div
            key="confirm"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative z-10 max-w-md w-full p-1 bg-gradient-to-b from-white/10 to-white/5 rounded-[2rem] border border-white/10 shadow-2xl backdrop-blur-2xl"
          >
            <div className="bg-[#0A0A0A]/90 rounded-[1.9rem] p-8 text-center h-full">
              <div className="w-20 h-20 mx-auto mb-6 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20 shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)]">
                <ShieldCheck size={40} className="text-blue-500" />
              </div>

              <h1 className="text-3xl font-black uppercase italic tracking-tighter mb-3">
                Finalize <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Access</span>
              </h1>
              <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                Your email is confirmed. Click below to cryptographically link your identity to the waitlist.
              </p>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleFinalize}
                disabled={isUpdating}
                className="group relative w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl font-black uppercase tracking-widest text-sm transition-all shadow-[0_0_25px_-5px_rgba(37,99,235,0.5)] hover:shadow-[0_0_40px_-5px_rgba(37,99,235,0.7)] disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden cursor-pointer"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isUpdating ? <Loader2 className="animate-spin" /> : <>Initialize BaseRise<ArrowRight size={16} /></>}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* STATE: SUCCESS (Just verified) */}
        {status === 'success' && (
          <motion.div
            key="success"
            initial={{ scale: 0.8, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="relative z-10 max-w-md w-full p-1 bg-gradient-to-b from-green-500/30 to-emerald-500/10 rounded-[2rem] shadow-[0_0_80px_-20px_rgba(34,197,94,0.4)]"
          >
            <div className="bg-[#0A0A0A]/95 rounded-[1.9rem] p-10 text-center backdrop-blur-xl">
              {/* Animated Check Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-green-500/20 to-emerald-500/10 rounded-full flex items-center justify-center border-2 border-green-500/30 shadow-[0_0_50px_-10px_rgba(34,197,94,0.5)]"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: 'spring' }}
                >
                  <CheckCircle2 size={50} className="text-green-400" />
                </motion.div>
              </motion.div>

              {/* Success Text */}
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-3xl font-black uppercase italic tracking-tight text-white mb-3"
              >
                Spot <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">Secured</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-gray-400 text-sm mb-8 leading-relaxed max-w-xs mx-auto"
              >
                Your position on the waitlist is now confirmed. Redirecting to your dashboard...
              </motion.p>

              {/* Loading indicator for redirect */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="flex items-center justify-center gap-2 mb-6"
              >
                <Loader2 size={16} className="animate-spin text-green-400" />
                <span className="text-xs text-green-400/80 uppercase tracking-widest font-bold">Loading Dashboard</span>
              </motion.div>

              {/* Decorative Elements */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                className="flex items-center justify-center gap-3 text-xs text-gray-500 uppercase tracking-widest"
              >
                <div className="w-8 h-px bg-gradient-to-r from-transparent to-green-500/50" />
                <ShieldCheck size={14} className="text-green-500/70" />
                <span>BaseRise Initialized</span>
                <div className="w-8 h-px bg-gradient-to-l from-transparent to-green-500/50" />
              </motion.div>

              {/* Pulsing Glow Effect */}
              <div className="absolute inset-0 rounded-[1.9rem] bg-green-500/5 animate-pulse pointer-events-none" />
            </div>
          </motion.div>
        )}

        {/* STATE: ALREADY VERIFIED (Revisit fix) */}
        {status === 'already_verified' && (
          <motion.div
            key="already"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative z-10 max-w-md w-full p-8 text-center bg-black/40 backdrop-blur-xl rounded-[2rem] border border-blue-500/20"
          >
            <div className="w-20 h-20 mx-auto mb-6 bg-blue-500/10 rounded-full flex items-center justify-center border border-blue-500/20">
              <Lock size={40} className="text-blue-400" />
            </div>
            <h1 className="text-2xl font-black uppercase italic tracking-tight text-white mb-2">Already Verified</h1>
            <p className="text-gray-400 text-sm mb-6">You have already verified your spot.</p>
            <Link href="/ref-code" className="group text-blue-400 text-xs font-bold uppercase tracking-widest hover:text-blue-300 transition-all duration-300 border-b border-blue-500/30 hover:border-blue-400/50 pb-1 cursor-pointer inline-flex items-center gap-1">
              View Your Dashboard
              <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        )}

        {/* STATE: ERROR (Invalid/Expired) */}
        {status === 'error' && (
          <motion.div key="error" className="relative z-10 text-center p-8 max-w-sm w-full bg-red-950/10 border border-red-500/20 rounded-3xl backdrop-blur-md">
            <XCircle size={50} className="text-red-500 mx-auto mb-4" />
            <h1 className="text-xl font-bold uppercase text-red-400 mb-2">Link Expired</h1>
            <p className="text-gray-500 text-xs mb-6">This verification link is invalid or has expired.</p>
            <Link href="/">
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer shadow-[0_0_15px_-5px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_-5px_rgba(255,255,255,0.2)]"
              >
                Start Over
              </motion.span>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}