'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check, Users, Share2, Loader2, ArrowRight, Trophy, Link as LinkIcon, Zap, ShieldAlert, X } from 'lucide-react'
import { supabase } from '@/app/lib/supabase'
import Link from 'next/link'

function RefCodeContent() {
  const [email, setEmail] = useState<string | null>(null)
  const [refCode, setRefCode] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState(false)
  const [referralCount, setReferralCount] = useState(0)
  const [position, setPosition] = useState<number | null>(null)

  // 🔒 100% SECURE: Get email from Supabase Auth Session (tamper-proof)
  useEffect(() => {
    const getAuthenticatedUser = async () => {
      try {
        // Small delay to ensure session is properly loaded after redirect
        await new Promise(resolve => setTimeout(resolve, 100))

        let session = null

        // Try to get session, with retry
        for (let i = 0; i < 3; i++) {
          const { data, error } = await supabase.auth.getSession()
          if (!error && data.session?.user?.email) {
            session = data.session
            break
          }
          await new Promise(resolve => setTimeout(resolve, 500))
        }

        if (!session?.user?.email) {
          // No valid session - user not authenticated
          setAuthError(true)
          setLoading(false)
          return
        }

        // ✅ Email comes from Supabase Auth - cannot be tampered
        console.log('🔐 Session email:', session.user.email)
        setEmail(session.user.email)
      } catch (err) {
        console.error('Session error:', err)
        setAuthError(true)
        setLoading(false)
      }
    }

    getAuthenticatedUser()
  }, [])

  useEffect(() => {
    if (!email) return
    const fetchUserData = async () => {
      try {
        // Get current session for authenticated request
        const { data: { session } } = await supabase.auth.getSession()

        if (!session) {
          console.log('No session for data fetch')
          setLoading(false)
          return
        }

        // Fetch user's ref_code and is_verified status
        const { data: userData, error: userError } = await supabase
          .from('waitlist')
          .select('ref_code, created_at, is_verified')
          .eq('email', email)
          .single()
        console.log('📧 Querying database for email:', email)
        console.log('User data fetched:', userData, userError)

        if (userError) {
          console.error('Error fetching user data:', userError)
        }

        if (userData?.ref_code) {
          setRefCode(userData.ref_code)

          // Count referrals (users who signed up with this ref_code)
          const { count: refCount } = await supabase
            .from('waitlist')
            .select('*', { count: 'exact', head: true })
            .eq('referred_by', userData.ref_code)

          setReferralCount(refCount || 0)

          // Calculate position based on verified users before this user + referral bonus
          const { count: usersBeforeCount } = await supabase
            .from('waitlist')
            .select('*', { count: 'exact', head: true })
            .eq('is_verified', true)
            .lt('created_at', userData.created_at)

          const basePosition = (usersBeforeCount || 0) + 1
          const referralBoost = (refCount || 0) * 5
          const finalPosition = Math.max(1, basePosition - referralBoost)

          setPosition(finalPosition)
        }
      } catch (error) { console.error(error) }
      finally { setLoading(false) }
    }
    fetchUserData()
  }, [email])

  const referralLink = refCode ? `${typeof window !== 'undefined' ? window.location.origin : ''}/waitlist?ref=${refCode}` : ''

  const copyToClipboard = async () => {
    if (!referralLink) return
    await navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Loading State
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#030303]"><Loader2 className="animate-spin text-blue-500" /></div>

  // 🔒 Auth Error - User not logged in
  if (authError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030303] text-white px-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full p-8 text-center bg-black/40 backdrop-blur-xl rounded-[2rem] border border-red-500/20"
        >
          <div className="w-20 h-20 mx-auto mb-6 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
            <ShieldAlert size={40} className="text-red-400" />
          </div>
          <h1 className="text-2xl font-black uppercase italic tracking-tight text-white mb-2">Access Denied</h1>
          <p className="text-gray-400 text-sm mb-6">You need to verify your email first to view your dashboard.</p>
          <Link href="/waitlist">
            <motion.span
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-xs font-bold uppercase tracking-widest cursor-pointer"
            >
              Join Waitlist
              <ArrowRight size={14} />
            </motion.span>
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#030303] text-white font-sans overflow-hidden px-4 relative">

      {/* Dynamic Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[20%] w-96 h-96 bg-blue-600/10 blur-[100px] rounded-full animate-pulse" />
        <div className="absolute bottom-[10%] right-[20%] w-96 h-96 bg-indigo-600/10 blur-[100px] rounded-full animate-pulse delay-1000" />
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 w-full max-w-lg"
      >
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full mb-6">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-green-500">Spot Secured</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter mb-2">
            You're on the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">List</span>
          </h1>
          <p className="text-gray-400 text-sm">Boost your position by inviting friends.</p>
        </div>

        {/* Main Card */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-1 shadow-2xl overflow-hidden">
          <div className="bg-[#0A0A0A]/80 rounded-[1.4rem] p-6 md:p-8 space-y-8">

            {/* Referral Code Ticket */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Your Access Code</label>
              <div
                onClick={copyToClipboard}
                className="group cursor-pointer relative bg-black/50 border border-white/10 hover:border-blue-500/50 rounded-xl p-6 text-center transition-all duration-300"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 opacity-20 group-hover:opacity-100 transition-opacity" />
                <p className="text-3xl md:text-4xl font-mono font-black tracking-[0.2em] text-white group-hover:scale-105 transition-transform">
                  {refCode || '....'}
                </p>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} className="text-blue-500" />}
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                whileHover={{ scale: 1.02, borderColor: 'rgba(59, 130, 246, 0.3)' }}
                className="group p-5 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl border border-white/10 flex flex-col items-center justify-center gap-2 cursor-default transition-all duration-300 hover:shadow-[0_0_30px_-10px_rgba(59,130,246,0.3)]"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users size={20} className="text-blue-400" />
                </div>
                <span className="text-3xl font-black bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{referralCount}</span>
                <span className="text-[10px] uppercase tracking-widest text-gray-500">Referrals</span>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02, borderColor: 'rgba(234, 179, 8, 0.3)' }}
                className="group p-5 bg-gradient-to-br from-yellow-500/5 to-orange-500/5 rounded-2xl border border-white/10 flex flex-col items-center justify-center gap-2 cursor-default transition-all duration-300 hover:shadow-[0_0_30px_-10px_rgba(234,179,8,0.3)]"
              >
                <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Trophy size={20} className="text-yellow-400" />
                </div>
                <span className="text-3xl font-black bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">#{position?.toLocaleString() || '...'}</span>
                <span className="text-[10px] uppercase tracking-widest text-gray-500">Position</span>
              </motion.div>
            </div>

            {/* Referral Boost Info */}
            {referralCount > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl"
              >
                <Zap size={16} className="text-green-400" />
                <span className="text-xs text-green-400 font-bold">+{referralCount * 5} Position Boost from referrals!</span>
              </motion.div>
            )}

            {/* Share Link */}
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={copyToClipboard}
                className="group relative flex-1 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl font-bold uppercase text-xs tracking-wider transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)] hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.7)] overflow-hidden cursor-pointer"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {copied ? <><Check size={16} /> Copied!</> : <><LinkIcon size={16} /> Copy Link</>}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </motion.button>
              <motion.a
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                href={`https://twitter.com/intent/tweet?text=I just joined @BaseRise early access! Get your spot 👉 ${encodeURIComponent(referralLink)}`}
                target="_blank"
                className="px-5 py-4 bg-black border border-white/20 hover:border-white/40 hover:bg-white/10 rounded-xl flex items-center justify-center transition-all duration-300 hover:shadow-[0_0_20px_-5px_rgba(255,255,255,0.2)] cursor-pointer"
              >
                <span className="text-lg font-bold">𝕏</span>
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                href={`https://wa.me/?text=${encodeURIComponent('Join BaseRise early access! ' + referralLink)}`}
                target="_blank"
                className="px-5 py-4 bg-green-500/10 border border-green-500/20 hover:border-green-500/40 hover:bg-green-500/20 rounded-xl flex items-center justify-center transition-all duration-300 hover:shadow-[0_0_20px_-5px_rgba(34,197,94,0.3)] cursor-pointer"
              >
                <Share2 size={18} className="text-green-500" />
              </motion.a>
            </div>

          </div>
        </div>

        {/* Close Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <motion.button
            onClick={() => window.close()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white bg-white/0 hover:bg-white/5 border border-transparent hover:border-white/10 transition-all duration-300 cursor-pointer group"
          >
            <X size={14} />
            <span>Close This Page</span>
          </motion.button>
        </motion.div>

      </motion.div>
    </div>
  )
}

export default RefCodeContent