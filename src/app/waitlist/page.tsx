'use client'
import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'

function EarlyAccessContent() {
  const searchParams = useSearchParams()
  const referredBy = searchParams.get('ref')
  
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, referredBy }),
      })

      const data = await res.json()
      if (res.ok) {
        // Clear old timer for this email so it starts fresh
        localStorage.removeItem(`baserise_timer_${email}`)
        // Redirect to check-email page with email param
        window.location.href = `/check-email?email=${encodeURIComponent(email)}`
      } else {
        setErrorMessage(typeof data?.error === 'string' ? data.error : 'Something went wrong')
        setStatus('error')
      }
    } catch {
      setErrorMessage('Network error. Please try again.')
      setStatus('error')
    }
  }

  return (
    <main className="relative z-10 max-w-4xl w-full text-center flex flex-col items-center">
      <div className="flex justify-center mb-6 relative">
        <div className="float-animation w-24 h-24 rounded-full bg-blue-600 blur-[50px] opacity-30 absolute top-[-10px]"></div>
        <div className="relative w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-800 rounded-2xl rotate-12 flex items-center justify-center shadow-2xl border border-white/20 z-20">
          <span className="text-3xl font-black -rotate-12 text-white">B</span>
        </div>
      </div>

      <div className="animate-in fade-in duration-700 w-full">
        <div className="space-y-4 mb-8">
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.85] uppercase text-white">
            THE NEXT <br /> <span className="text-blue-600">EVOLUTION</span>
          </h1>
          <p className="text-gray-400 text-base md:text-xl max-w-xl mx-auto font-medium opacity-80 leading-snug">
            The premier yield & reward protocol on Base. <br />
            <span className="text-white/70 italic font-bold text-sm md:text-lg">Available for first 10,000 users only.</span>
          </p>
        </div>
        <div className="max-w-md mx-auto px-4">
          <form onSubmit={handleSubmit} className="input-container p-1.5 rounded-2xl flex flex-col md:flex-row items-center gap-2 md:gap-0 bg-white/5 border border-white/10 hover:border-blue-500/30 transition-all duration-300 hover:shadow-[0_0_40px_-15px_rgba(59,130,246,0.3)]">
            <input type="email" required placeholder="Enter your email" className="bg-transparent border-none outline-none flex-1 px-5 py-3 text-white placeholder:text-gray-600 font-semibold w-full text-sm" value={email} onChange={(e) => setEmail(e.target.value)} />
            <button type="submit" disabled={status === 'loading'} className="group relative btn-shimmer cursor-pointer disabled:cursor-not-allowed w-full md:w-auto px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest text-white disabled:opacity-50 transition-all duration-300 hover:shadow-[0_0_30px_-5px_rgba(0,82,255,0.6)] hover:scale-[1.02] active:scale-[0.98] overflow-hidden">
              <span className="relative z-10">{status === 'loading' ? 'Securing...' : 'Secure Spot'}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </button>
          </form>
          <div className="mt-8 flex flex-col items-center gap-6">
              <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                      <div className="w-6 h-6 rounded-full border border-black bg-gray-800"></div>
                      <div className="w-6 h-6 rounded-full border border-black bg-blue-900"></div>
                      <div className="w-6 h-6 rounded-full border border-black bg-indigo-900"></div>
                  </div>
                  <p className="text-[9px] md:text-xs text-gray-500 uppercase tracking-widest font-bold opacity-60 italic">Invitations active on Base Mainnet</p>
              </div>
              <div className="flex flex-col items-center gap-3">
                <h3 className="text-blue-500 font-black text-[10px] tracking-[0.3em] italic uppercase opacity-80">Socials</h3>
                <div className="flex items-center justify-center gap-4">
                  <a href="#" className="group relative w-12 h-12 flex items-center justify-center rounded-2xl bg-[#121212] border border-white/5 transition-all duration-300 ease-out hover:scale-110 hover:border-white/20 hover:shadow-[0_0_25px_-5px_rgba(255,255,255,0.2)] cursor-pointer">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 text-white fill-current group-hover:text-blue-400 transition-colors"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                    <div className="absolute inset-0 rounded-2xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                  <a href="#" className="group relative w-12 h-12 flex items-center justify-center rounded-2xl bg-[#121212] border border-white/5 transition-all duration-300 ease-out hover:bg-[#5865F2]/20 hover:scale-110 hover:border-[#5865F2]/30 hover:shadow-[0_0_25px_-5px_rgba(88,101,242,0.4)] cursor-pointer">
                    <svg viewBox="0 0 127.14 96.36" className="w-6 h-6 text-white fill-current group-hover:text-[#5865F2] transition-colors"><path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.71,32.65-1.82,56.6.39,80.21a105.73,105.73,0,0,0,32.21,16.15,77.7,77.7,0,0,0,6.89-11.11,68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1,105.25,105.25,0,0,0,32.24-16.14C129.5,50.2,120.78,26.52,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,45.91,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,45.91,96.11,53,91.06,65.69,84.69,65.69Z"/></svg>
                    <div className="absolute inset-0 rounded-2xl bg-[#5865F2]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </div>
              </div>
          </div>
          {status === 'error' && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 mt-4 font-bold text-xs italic uppercase">
              {errorMessage || 'Registration Failed. Please try again.'}
            </motion.p>
          )}
        </div>
      </div>
    </main>
  )
}

export default function EarlyAccess() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 text-white bg-black">
      <div className="mesh-bg" />
      <Suspense fallback={<div className="text-white font-black animate-pulse uppercase tracking-[0.5em] text-[10px]">Loading...</div>}>
        <EarlyAccessContent />
      </Suspense>
    </div>
  )
}