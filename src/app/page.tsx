"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight, Loader2, CheckCircle2, AlertCircle,
  Github, Linkedin, Send, Twitter, Layers, Zap, ShieldCheck, Menu, X
} from "lucide-react";

export default function LandingPage() {
  // 1. States
  const [newsEmail, setNewsEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Auto-hide message after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // 2. Newsletter Handler
  const handleNewsletterSubmit = async () => {
    if (!newsEmail) return;
    // 1. Regex Validation: Sirf sahi email format allow hoga
    // Is se koi hacker 'javascript:alert()' jaisi cheezein nahi daal sakega
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newsEmail)) {
      setMessage({ text: "Please enter a valid email address.", type: 'error' });
      return;
    }

    // 2. Sanitization: Dangerous symbols ko khatam karna
    // Agar koi '<script>' likhay ga toh hum usey 'clean' kar denge
    const cleanEmail = newsEmail.replace(/[<>]/g, "").trim().toLowerCase();

    setSubmitting(true);
    setMessage(null);

    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsEmail }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ text: "You are successfully subscribed!", type: 'success' });
        setNewsEmail("");
      } else {
        setMessage({ text: data.error || "Subscription failed.", type: 'error' });
      }
    } catch (e) {
      setMessage({ text: "Network error. Please try again.", type: 'error' });
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-hidden relative font-sans selection:bg-blue-600 selection:text-white flex flex-col justify-between">

      {/* ==========================================
          BACKGROUND
      ========================================== */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(45deg, #1e3a8a 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
          }}
        ></div>
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[150px]"></div>
      </div>

      {/* ==========================================
          NAVBAR (Clean - Teaser Mode)
      ========================================== */}
      <nav 
        className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#050505]/80 backdrop-blur-md transition-all duration-300"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex justify-between items-center relative">

          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-7 h-7 md:w-8 md:h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-base md:text-lg">B</div>
            <span className="text-lg md:text-xl font-semibold tracking-tight">BaseRise</span>
          </div>

          {/* Center: Leaderboard & Check Profile Links - Desktop Only */}
          <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-8">
            <Link href="/leaderboard" className="text-gray-400 hover:text-blue-500 transition-colors font-medium flex items-center gap-2">
              <Layers size={18} />
              Leaderboard
            </Link>
            <Link href="/lookup" className="text-gray-400 hover:text-blue-500 transition-colors font-medium flex items-center gap-2">
              <ShieldCheck size={18} />
              Check Your Profile
            </Link>
          </div>

          {/* Right Side Actions - Desktop Only */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/waitlist">
              <button className="px-4 md:px-5 py-2 md:py-2.5 bg-blue-600 text-white font-semibold rounded-full text-xs md:text-sm hover:bg-blue-500 transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)]">
                Join Waitlist
              </button>
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Full-Width Dropdown Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-white/5 bg-[#050505]/95 backdrop-blur-md overflow-hidden"
            >
              <div className="px-6 py-4 space-y-2">
                <Link
                  href="/leaderboard"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 w-full px-4 py-4 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-all font-medium"
                >
                  <Layers size={20} />
                  Leaderboard
                </Link>
                <Link
                  href="/lookup"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 w-full px-4 py-4 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-all font-medium"
                >
                  <ShieldCheck size={20} />
                  Check Your Profile
                </Link>
                <Link
                  href="/waitlist"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full px-4 py-4 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-500 transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)]"
                >
                  Join Waitlist
                  <ArrowRight size={18} />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ==========================================
          HERO SECTION (Launchpad Focus)
      ========================================== */}
      <main className="relative z-10 pt-48 pb-10 px-6 max-w-7xl mx-auto w-full">
        <div className="max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-semibold tracking-tight leading-[1.1] mb-8 text-white"
          >
            Access the Future of <br />
            <span className="text-blue-600">Base Ecosystem.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-400 max-w-2xl mb-12 leading-relaxed font-light"
          >
            The premier Launchpad on Base Chain. Secure guaranteed allocations in the next generation of high-potential projects.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 mb-24"
          >
            <Link href="/waitlist">
              <button className="px-10 py-5 bg-blue-600 text-white rounded-full font-bold text-lg hover:bg-blue-500 transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(37,99,235,0.4)]">
                Join Waitlist <ArrowRight size={22} />
              </button>
            </Link>
          </motion.div>
        </div>

        {/* ==========================================
            FEATURES / VISION CARDS
        ========================================== */}
        <section className="relative z-10 pb-20">
          <div className="mb-16">
            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              Your Gateway to <span className="text-blue-500">Early Access.</span>
            </h2>
            <div className="h-1 w-20 bg-blue-600 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Card 1: How it Works */}
            <div className="group relative p-1 rounded-3xl bg-gradient-to-b from-white/10 to-white/5 hover:from-blue-600/50 hover:to-blue-900/50 transition-all duration-500">
              <div className="absolute inset-0 bg-blue-600/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
              <div className="relative h-full bg-[#0a0a0a] rounded-[22px] p-8 border border-white/5 flex flex-col justify-between overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/2" />
                <div>
                  <div className="w-12 h-12 bg-blue-900/30 rounded-full flex items-center justify-center mb-6 border border-blue-500/20 text-blue-400">
                    <Layers size={24} />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-white">How it Works?</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Simple and transparent. Participate in our ecosystem to qualify for tiers. The more you engage, the larger your guaranteed allocation in upcoming project launches.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2: Why Base Chain */}
            <div className="group relative p-1 rounded-3xl bg-gradient-to-b from-white/10 to-white/5 hover:from-purple-600/50 hover:to-purple-900/50 transition-all duration-500">
              <div className="absolute inset-0 bg-purple-600/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
              <div className="relative h-full bg-[#0a0a0a] rounded-[22px] p-8 border border-white/5 flex flex-col justify-between overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/2" />
                <div>
                  <div className="w-12 h-12 bg-purple-900/30 rounded-full flex items-center justify-center mb-6 border border-purple-500/20 text-purple-400">
                    <Zap size={24} />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-white">Why Base Chain?</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Built on Coinbase’s L2, Base offers near-zero gas fees and lightning-fast transactions. It is the fastest-growing on-chain ecosystem, and we give you the first seat at the table.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3: Verified Allocations */}
            <div className="group relative p-1 rounded-3xl bg-gradient-to-b from-white/10 to-white/5 hover:from-indigo-600/50 hover:to-indigo-900/50 transition-all duration-500">
              <div className="absolute inset-0 bg-indigo-600/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
              <div className="relative h-full bg-[#0a0a0a] rounded-[22px] p-8 border border-white/5 flex flex-col justify-between overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/2" />
                <div>
                  <div className="w-12 h-12 bg-indigo-900/30 rounded-full flex items-center justify-center mb-6 border border-indigo-500/20 text-indigo-400">
                    <ShieldCheck size={24} />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-white">Verified Allocations</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Safety first. We rigorously vet every project before listing. Secure your entry into legitimate, high-potential tokens before they hit the public market.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </section>
      </main>

      {/* ==========================================
          FOOTER (Minimal for Teaser Phase)
      ========================================== */}
      <footer className="relative z-10 px-6 pb-6 w-full max-w-7xl mx-auto mt-auto">
        <div className="bg-[#0a0a0a] border border-white/10 rounded-[3rem] p-8 md:p-12 overflow-hidden relative shadow-2xl">

          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-600/5 rounded-full blur-[100px]"></div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 relative z-10">

            {/* Brand Column */}
            <div className="md:col-span-5 space-y-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-lg">B</div>
                <span className="text-2xl font-semibold tracking-tight">BaseRise</span>
              </div>
              <p className="text-gray-400 leading-relaxed max-w-sm">
                BaseRise is the premier launchpad on Base Network. We empower the community with early access to the next wave of DeFi innovation.
              </p>

              <div className="flex gap-4">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-300 group hover:bg-black hover:border-white/30 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    className="text-gray-400 group-hover:text-white transition-colors duration-300 fill-current"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                {/* <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-300 group hover:bg-[#0A66C2] hover:border-[#0A66C2] hover:shadow-[0_0_20px_rgba(10,102,194,0.5)]">
                  <Linkedin size={18} className="text-gray-400 group-hover:text-white transition-colors duration-300" />
                </a> */}
                <a href="https://discord.gg/4TZNtxTc4p" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-300 group hover:bg-[#5865F2] hover:border-[#5865F2] hover:shadow-[0_0_20px_rgba(88,101,242,0.5)]">
                  <svg viewBox="0 0 127.14 96.36" className="w-5 h-5 text-gray-400 fill-current group-hover:text-white transition-colors duration-300"><path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.71,32.65-1.82,56.6.39,80.21a105.73,105.73,0,0,0,32.21,16.15,77.7,77.7,0,0,0,6.89-11.11,68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1,105.25,105.25,0,0,0,32.24-16.14C129.5,50.2,120.78,26.52,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,45.91,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,45.91,96.11,53,91.06,65.69,84.69,65.69Z" /></svg>
                </a>
                <a href="https://t.me/+hT4Hrv0eicE0YzY0" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-300 group hover:bg-[#0088cc] hover:border-[#0088cc] hover:shadow-[0_0_20px_rgba(0,136,204,0.5)]">
                  <Send size={18} className="text-gray-400 group-hover:text-white transition-colors duration-300" />
                </a>
              </div>
            </div>

            {/* Resources (Simplified) */}
            <div className="md:col-span-3 space-y-6 text-center md:text-left">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Resources</h4>
              <ul className="space-y-4 text-gray-300">
                {/* Only keeping Whitepaper as requested */}
                <li>
                  <Link href="/whitepaper" target="_blank" className="hover:text-blue-400 transition-colors">
                    Whitepaper
                  </Link>
                </li>              </ul>
            </div>

            {/* Newsletter Column */}
            <div className="md:col-span-4 space-y-6">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Stay Updated</h4>
              <p className="text-gray-400 text-sm">Join our newsletter to receive alerts on upcoming IDOs and allocations.</p>

              <div>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={newsEmail}
                    onChange={(e) => setNewsEmail(e.target.value)}
                    disabled={submitting}
                    className="bg-white/5 border border-white/10 rounded-full px-5 py-3 w-full text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors shadow-inner disabled:opacity-50"
                  />
                  <button
                    onClick={handleNewsletterSubmit}
                    disabled={submitting}
                    className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-full transition-colors flex-shrink-0 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      <ArrowRight size={20} />
                    )}
                  </button>
                </div>

                {/* SUCCESS / ERROR MESSAGE */}
                <AnimatePresence>
                  {message && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className={`mt-3 text-xs flex items-center gap-2 ${message.type === 'success' ? 'text-green-400' : 'text-red-400'}`}
                    >
                      {message.type === 'success' ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                      <span>{message.text}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
            <p>© BASERISE 2026 | All Rights Reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}