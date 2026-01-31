'use client'
import { useState, useEffect, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Clock, Loader2, Sparkles, Shield, AlertTriangle, RefreshCw, CheckCircle2, Home, ArrowRight } from 'lucide-react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/app/lib/supabase'

const TIMER_DURATION = 600 // 10 minutes in seconds

function CheckEmailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email')

  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION)
  const [isExpired, setIsExpired] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isVerified, setIsVerified] = useState(false)

  // Initialize timer from localStorage (persists across refresh)
  useEffect(() => {
    if (!email) return

    const storageKey = `baserise_timer_${email}`
    const storedStartTime = localStorage.getItem(storageKey)

    if (storedStartTime) {
      // Calculate remaining time based on when timer started
      const startTime = parseInt(storedStartTime, 10)
      const elapsed = Math.floor((Date.now() - startTime) / 1000)
      const remaining = Math.max(0, TIMER_DURATION - elapsed)

      setTimeLeft(remaining)
      if (remaining <= 0) {
        setIsExpired(true)
      }
    } else {
      // First visit - store the start time
      localStorage.setItem(storageKey, Date.now().toString())
    }

    setIsLoaded(true)
  }, [email])

  // Timer countdown
  useEffect(() => {
    if (!isLoaded || isExpired) return

    if (timeLeft <= 0) {
      setIsExpired(true)
      return
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsExpired(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, isLoaded, isExpired])

  // Clear timer from localStorage when trying again
  const handleTryAgain = () => {
    if (email) {
      localStorage.removeItem(`baserise_timer_${email}`)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  // BroadcastChannel Listener - Tab B se signal receive karega
  useEffect(() => {
    if (typeof window === 'undefined') return

    const channel = new BroadcastChannel('baserise_verification')

    channel.onmessage = (event) => {
      if (event.data.type === 'EMAIL_VERIFIED' && event.data.email === email) {
        // Clear timer from localStorage
        if (email) {
          localStorage.removeItem(`baserise_timer_${email}`)
          // Store email securely in localStorage (no URL exposure)
          localStorage.setItem('baserise_verified_email', email)
        }
        // Show success state
        setIsVerified(true)
      }
    }

    return () => channel.close()
  }, [email, router])

  // Backup Polling - Har 3 second check karo
  useEffect(() => {
    if (!email || isExpired) return

    const checkVerification = async () => {
      try {
        const { data } = await supabase
          .from('waitlist')
          .select('is_verified')
          .eq('email', email)
          .single()

        if (data && data.is_verified === true) {
          // Clear timer from localStorage
          localStorage.removeItem(`baserise_timer_${email}`)
          // Store email securely in localStorage (no URL exposure)
          localStorage.setItem('baserise_verified_email', email)
          // Show success state
          setIsVerified(true)
        }
      } catch (error) {
        console.error("Verification check failed", error)
      }
    }

    const intervalId = setInterval(checkVerification, 3000)
    return () => clearInterval(intervalId)
  }, [email, router, isExpired])

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#030303] text-white overflow-hidden font-sans px-4">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute top-[-20%] left-[-10%] w-[50%] h-[50%] ${isVerified ? 'bg-green-600/15' : 'bg-blue-600/15'} blur-[150px] rounded-full animate-pulse`} />
        <div className={`absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] ${isVerified ? 'bg-emerald-600/15' : 'bg-purple-600/15'} blur-[150px] rounded-full animate-pulse`} style={{ animationDelay: '1s' }} />
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] ${isVerified ? 'bg-green-600/10' : 'bg-indigo-600/10'} blur-[120px] rounded-full animate-pulse`} style={{ animationDelay: '2s' }} />
      </div>

      {/* Floating Particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-1 h-1 ${isVerified ? 'bg-green-400/40' : 'bg-blue-400/40'} rounded-full`}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 1, 0],
            y: [-20, -100],
            x: [0, Math.random() * 40 - 20],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.5,
          }}
          style={{
            left: `${20 + i * 12}%`,
            bottom: '30%',
          }}
        />
      ))}

      <AnimatePresence mode="wait">
        {/* SUCCESS STATE - Mail Verified */}
        {isVerified ? (
          <motion.div
            key="verified"
            initial={{ scale: 0.8, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="relative z-10 max-w-md w-full p-1 bg-gradient-to-b from-green-500/30 to-emerald-500/10 rounded-[2.5rem] shadow-[0_0_80px_-20px_rgba(34,197,94,0.4)]"
          >
            <div className="bg-[#0A0A0A]/95 rounded-[2.3rem] p-10 text-center backdrop-blur-xl">
              {/* Confetti Effect */}
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    background: ['#22c55e', '#10b981', '#34d399', '#6ee7b7', '#fbbf24', '#a78bfa'][i % 6],
                    left: `${10 + Math.random() * 80}%`,
                    top: `${10 + Math.random() * 30}%`,
                  }}
                  initial={{ opacity: 0, scale: 0, y: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0.5],
                    y: [0, -50 - Math.random() * 50],
                    x: [0, (Math.random() - 0.5) * 100],
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.1,
                    repeat: Infinity,
                    repeatDelay: 3,
                  }}
                />
              ))}

              {/* Animated Check Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="relative w-28 h-28 mx-auto mb-8"
              >
                <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl animate-pulse" />
                <div className="relative w-full h-full bg-gradient-to-br from-green-500/20 to-emerald-500/10 rounded-full flex items-center justify-center border-2 border-green-500/30 shadow-[0_0_50px_-10px_rgba(34,197,94,0.5)]">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: 'spring' }}
                  >
                    <CheckCircle2 size={56} className="text-green-400" />
                  </motion.div>
                </div>
                {/* Sparkles around check */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-1 -right-1"
                >
                  <Sparkles className="text-yellow-400" size={24} />
                </motion.div>
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="absolute -bottom-1 -left-1"
                >
                  <Sparkles className="text-green-400" size={18} />
                </motion.div>
              </motion.div>

              {/* Success Text */}
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-3xl md:text-4xl font-black uppercase italic tracking-tight text-white mb-4"
              >
                Mail <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">Verified!</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-gray-400 text-sm mb-8 leading-relaxed max-w-xs mx-auto"
              >
                Your email has been successfully verified. You're now on the BaseRise waitlist!
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="space-y-4"
              >
                <Link href="/">
                  <motion.span
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-xl text-sm font-bold uppercase tracking-widest text-white transition-all duration-300 cursor-pointer shadow-[0_0_25px_-5px_rgba(34,197,94,0.5)] hover:shadow-[0_0_40px_-5px_rgba(34,197,94,0.7)]"
                  >
                    <Home size={16} />
                    Back to Home
                  </motion.span>
                </Link>
              </motion.div>

              {/* Decorative Elements */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 }}
                className="flex items-center justify-center gap-3 text-xs text-gray-500 uppercase tracking-widest mt-8"
              >
                <div className="w-8 h-px bg-gradient-to-r from-transparent to-green-500/50" />
                <Shield size={12} className="text-green-500/70" />
                <span>Secured</span>
                <div className="w-8 h-px bg-gradient-to-l from-transparent to-green-500/50" />
              </motion.div>
            </div>
          </motion.div>
        ) : (
          /* WAITING STATE - Original UI */
          <motion.div
            key="waiting"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative z-10 max-w-md w-full p-8 md:p-10 text-center backdrop-blur-2xl bg-white/[0.03] border border-white/10 rounded-[2.5rem] shadow-2xl"
          >
        {/* Icon with Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className="relative w-24 h-24 mx-auto mb-8"
        >
          <div className="absolute inset-0 bg-blue-600/20 rounded-full blur-xl animate-pulse" />
          <div className="relative w-full h-full bg-gradient-to-br from-blue-600/30 to-purple-600/30 rounded-full flex items-center justify-center border border-blue-500/30">
            <Mail className="text-blue-400" size={36} />
          </div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute -top-1 -right-1"
          >
            <Sparkles className="text-yellow-400" size={20} />
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter mb-3"
        >
          Verify Your <span className="text-blue-400">Mail</span>
        </motion.h2>

        {/* Alert Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-center gap-2 mb-6 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full"
        >
          <Shield size={14} className="text-yellow-400" />
          <p className="text-xs font-bold uppercase tracking-wider text-yellow-400">
            Please verify your mail first
          </p>
        </motion.div>

        {/* Email Display */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-gray-400 text-sm mb-4 leading-relaxed"
        >
          We sent a secure confirmation link to<br />
          <span className="text-white font-bold text-base">{email}</span>
        </motion.p>

        {/* Spam Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex items-center gap-2 px-4 py-2.5 mb-8 bg-orange-500/10 border border-orange-500/20 rounded-xl"
        >
          <span className="text-orange-400 text-lg">📬</span>
          <p className="text-xs text-orange-300/90 font-medium">
            Can't find it? Please check your <span className="font-bold text-orange-400">Spam</span> or <span className="font-bold text-orange-400">Junk</span> folder
          </p>
        </motion.div>

        {/* Timer */}
        <AnimatePresence mode="wait">
          {!isExpired ? (
            <motion.div
              key="timer"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-2xl border border-white/10 mb-8"
            >
              <Clock size={20} className="text-blue-400" />
              <div className="text-left">
                <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Link Expires In</p>
                <p className="text-2xl font-mono font-black tracking-widest text-blue-400">
                  {formatTime(timeLeft)}
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="expired"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-4 px-6 py-4 bg-red-600/10 rounded-2xl border border-red-500/20 mb-8"
            >
              <div className="flex items-center gap-3">
                <AlertTriangle size={20} className="text-red-400" />
                <div className="text-left">
                  <p className="text-[10px] uppercase tracking-widest text-red-400 font-bold">Link Expired</p>
                  <p className="text-sm text-gray-400">Please request a new verification email</p>
                </div>
              </div>
              <Link
                href="/"
                onClick={handleTryAgain}
              >
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-full font-bold uppercase text-sm tracking-wider transition-all duration-300 shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)] hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.7)] cursor-pointer"
                >
                  <RefreshCw size={16} />
                  Try Again
                </motion.span>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Waiting Status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="pt-6 border-t border-white/5"
        >
          <div className="flex items-center justify-center gap-2 text-gray-500">
            <Loader2 size={14} className="animate-spin text-blue-400" />
            <p className="text-xs uppercase tracking-widest font-bold">
              Waiting for confirmation...
            </p>
          </div>
          <p className="text-[10px] text-gray-600 mt-2">
            This page will automatically update once verified
          </p>
        </motion.div>
      </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function CheckEmail() {
  return (
    <Suspense fallback={
      <div className="text-white bg-[#030303] h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" size={32} />
      </div>
    }>
      <CheckEmailContent />
    </Suspense>
  )
}