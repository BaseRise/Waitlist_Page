'use client'
import { motion } from 'framer-motion'
import { XCircle, RefreshCw, AlertTriangle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function ErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030303] text-white font-sans overflow-hidden px-4">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/20 blur-[150px] rounded-full"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-orange-600/15 blur-[100px] rounded-full"
        />
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="relative z-10 max-w-lg w-full p-10 text-center backdrop-blur-2xl bg-gradient-to-b from-red-600/10 to-transparent rounded-[3rem] border border-red-500/20 shadow-2xl"
      >
        {/* Error Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 150, delay: 0.2 }}
          className="relative w-28 h-28 mx-auto mb-8"
        >
          <div className="absolute inset-0 bg-red-600/30 rounded-full blur-xl animate-pulse" />
          <div className="relative w-full h-full bg-gradient-to-br from-red-600/20 to-orange-600/20 rounded-full flex items-center justify-center border border-red-500/30">
            <XCircle size={50} className="text-red-400 drop-shadow-[0_0_20px_rgba(239,68,68,0.5)]" />
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter mb-4">
            Verification <span className="text-red-400">Failed</span>
          </h1>
          <p className="text-gray-400 text-sm mb-8 leading-relaxed">
            We couldn&apos;t verify your email. The link may have expired or is invalid.
          </p>
        </motion.div>

        {/* Reasons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="p-5 bg-white/5 rounded-2xl border border-white/10 mb-8 text-left"
        >
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={16} className="text-yellow-400" />
            <p className="text-xs text-yellow-400 uppercase tracking-widest font-bold">Possible Reasons</p>
          </div>
          <ul className="text-gray-400 text-sm space-y-2">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
              Link expired (older than 10 minutes)
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
              Link has already been used
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
              Invalid or corrupted verification link
            </li>
          </ul>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <Link href="/waitlist">
            <motion.span
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative flex-1 py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl font-bold uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-2 shadow-[0_0_25px_-5px_rgba(59,130,246,0.4)] hover:shadow-[0_0_35px_-5px_rgba(59,130,246,0.6)] cursor-pointer overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                <RefreshCw size={18} />
                Try Again
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </motion.span>
          </Link>
          <Link href="/">
            <motion.span
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 py-4 px-6 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl font-bold uppercase tracking-widest text-sm text-gray-300 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_-5px_rgba(255,255,255,0.05)] hover:shadow-[0_0_25px_-5px_rgba(255,255,255,0.1)]"
            >
              <ArrowLeft size={18} />
              Go Home
            </motion.span>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}
