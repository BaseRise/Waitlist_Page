"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Twitter, Linkedin, Github, Send, Mail } from "lucide-react";

export default function LandingPage() {
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
      </div>

      {/* ==========================================
          NAVBAR
      ========================================== */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#050505]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-lg">B</div>
            <span className="text-xl font-semibold tracking-tight">BaseRise</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <a href="#" className="hover:text-blue-400 transition-colors">Products</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Ecosystem</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Developers</a>
          </div>

          <div className="flex items-center gap-4">
            <button className="hidden md:block text-sm font-medium text-gray-300 hover:text-white">Log in</button>
            <button className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-full text-sm hover:bg-blue-500 transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)]">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* ==========================================
          HERO SECTION
      ========================================== */}
      <main className="relative z-10 pt-32 pb-20 px-6 max-w-7xl mx-auto w-full">
        <div className="max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-sm font-medium mb-8 text-blue-200 backdrop-blur-sm"
          >
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span>Baserise Mainnet is now Live</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-semibold tracking-tight leading-[1.1] mb-8 text-white"
          >
            The Next <span className="text-blue-600">Evolution</span><br />
            of On-Chain Finance.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-400 max-w-2xl mb-10 leading-relaxed font-light"
          >
            Baserise delivers the premier yield & reward protocol on Base. 
            Secure, scalable, and built for the next 10,000 innovators.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 mb-24"
          >
            <button className="px-8 py-4 bg-blue-600 text-white rounded-full font-bold text-lg hover:bg-blue-500 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.4)]">
               Secure Your Spot <ArrowRight size={20} />
            </button>
            <button className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-full font-bold text-lg hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
              View Documentation
            </button>
          </motion.div>
        </div>
      </main>

      {/* ==========================================
          FOOTER (Sahara Style Floating Card)
      ========================================== */}
      <footer className="relative z-10 px-6 pb-6 w-full max-w-7xl mx-auto mt-auto">
        <div className="bg-[#0a0a0a] border border-white/10 rounded-[3rem] p-8 md:p-12 overflow-hidden relative">
            
            {/* Background Glow inside footer */}
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-600/5 rounded-full blur-[100px]"></div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 relative z-10">
                
                {/* Left Column: Brand & Socials */}
                <div className="md:col-span-5 space-y-8">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-lg">B</div>
                        <span className="text-2xl font-semibold tracking-tight">BaseRise</span>
                    </div>
                    <p className="text-gray-400 leading-relaxed max-w-sm">
                        Baserise is the first decentralized yield-layer on Base. We help users maximize their on-chain potential through secure, automated protocols.
                    </p>
                    
                    {/* Social Icons */}
                    <div className="flex gap-4">
                        <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 transition-all group">
                            <Twitter size={18} className="text-gray-400 group-hover:text-white" />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 transition-all group">
                            <Linkedin size={18} className="text-gray-400 group-hover:text-white" />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 transition-all group">
                            <Github size={18} className="text-gray-400 group-hover:text-white" />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 transition-all group">
                            <Send size={18} className="text-gray-400 group-hover:text-white" />
                        </a>
                    </div>
                </div>

                {/* Middle Column: Links */}
                <div className="md:col-span-3 space-y-6">
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Resources</h4>
                    <ul className="space-y-4 text-gray-300">
                        <li><a href="#" className="hover:text-blue-400 transition-colors">Media Kit</a></li>
                        <li><a href="#" className="hover:text-blue-400 transition-colors">Smart Contracts</a></li>
                        <li><a href="#" className="hover:text-blue-400 transition-colors">Whitepaper</a></li>
                        <li><a href="#" className="hover:text-blue-400 transition-colors">Security Audit</a></li>
                    </ul>
                </div>

                {/* Right Column: Newsletter */}
                <div className="md:col-span-4 space-y-6">
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Stay Updated</h4>
                    <p className="text-gray-400 text-sm">Get the latest updates on protocol upgrades and governance.</p>
                    
                    <div className="flex gap-2">
                        <input 
                            type="email" 
                            placeholder="Enter your email" 
                            className="bg-white/5 border border-white/10 rounded-full px-5 py-3 w-full text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                        />
                        <button className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-full transition-colors flex-shrink-0">
                            <ArrowRight size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Bar: Copyright */}
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