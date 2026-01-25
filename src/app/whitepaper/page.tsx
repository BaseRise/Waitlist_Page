"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, FileText, AlertCircle, Zap, Target } from "lucide-react";
// 1. Import dynamic from next
import dynamic from 'next/dynamic';

// 2. Scene3D ko "Lazy Load" karein (SSR: false ka matlab server par mat chalao)
const Scene3D = dynamic(() => import('./Scene3D'), {
    ssr: false,
    loading: () => <div className="h-[50vh] w-full bg-blue-900/10"></div> // Jab tak 3D load ho, ye dikhao
});

export default function Whitepaper() {
    return (
        <div className="min-h-screen bg-[#050505] text-gray-300 font-sans selection:bg-blue-600 selection:text-white overflow-x-hidden">

            {/* =========================================
          NEW: 3D BACKGROUND SCENE
      ========================================= */}
            {/* Humne isay client-side only bana diya hai */}
            <Scene3D />

            {/* Navbar (Simplified) */}
      // Navbar Section inside whitepaper/page.tsx

            <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#050505]/80 backdrop-blur-md">
                <div className="max-w-4xl mx-auto px-6 h-16 flex justify-between items-center">

                    {/* Close Tab Button */}
                    <button
                        onClick={() => window.close()}
                        className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors cursor-pointer"
                    >
                        <ArrowLeft size={16} /> Close Document
                    </button>

                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center font-bold text-white text-xs">B</div>
                        <span className="font-semibold tracking-tight text-white">
                            Whitepaper <span className="text-gray-500 text-xs font-normal ml-1">v1.0</span>
                        </span>
                    </div>
                </div>
            </nav>
            {/* Main Content */}
            <main className="relative z-20 pt-40 pb-20 px-6 max-w-3xl mx-auto">

                {/* Header with Glass Effect */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-16 border-b border-white/10 pb-10 p-6 bg-[#050505]/40 backdrop-blur-xl rounded-3xl border border-white/5 shadow-2xl"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/20 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
                        BaseRise Protocol
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
                        Democratizing Access to the <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Base Ecosystem.</span>
                    </h1>
                    <p className="text-lg text-gray-200 leading-relaxed drop-shadow-md">
                        A decentralized launchpad designed to empower the community with guaranteed allocations, verified security, and automated participation on the Base L2 network.
                    </p>
                </motion.div>

                {/* Sections */}
                <div className="space-y-16 bg-[#050505]/80 p-8 rounded-3xl border border-white/5 backdrop-blur-sm">

                    {/* Section 1: Abstract */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                            <FileText size={20} className="text-blue-500" /> 1. Abstract
                        </h2>
                        <p className="leading-7 mb-4">
                            The DeFi landscape is evolving, but early-stage investment opportunities remain inaccessible to the average user. High gas fees on Ethereum and the prevalence of "rug pulls" have created a barrier to entry.
                        </p>
                        <p className="leading-7">
                            <strong>BaseRise</strong> is built to solve this. By leveraging Coinbase's Base L2, we offer a low-cost, high-speed environment for launching premier projects. Our protocol ensures fairness through a tiered allocation system, removing the "gas wars" and putting community first.
                        </p>
                    </section>

                    {/* Section 2: The Problem */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                            <AlertCircle size={20} className="text-red-400" /> 2. The Current Problems
                        </h2>
                        <ul className="list-disc pl-5 space-y-3 text-gray-400 marker:text-blue-500">
                            <li><strong>Exclusive Access:</strong> Most launchpads are dominated by whales (large holders), leaving retail investors with dust.</li>
                            <li><strong>Security Risks:</strong> The lack of rigorous vetting allows malicious projects to drain user funds.</li>
                            <li><strong>Complexity:</strong> Manual claiming and staking processes are confusing for newcomers.</li>
                        </ul>
                    </section>

                    {/* Section 3: The Solution */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                            <Zap size={20} className="text-yellow-400" /> 3. The BaseRise Solution
                        </h2>
                        <div className="grid gap-6 mt-6">
                            <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                                <h3 className="text-white font-bold mb-2">Contribution-Based Access</h3>
                                <p className="text-sm">
                                    We prioritize active community members over passive holders. Allocations are earned through
                                    <strong> ecosystem contribution</strong>—including community engagement, platform testing,
                                    and early feedback. The harder you work for the protocol, the higher your allocation rank.
                                </p>                            </div>
                            <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                                <h3 className="text-white font-bold mb-2">Rigorous Vetting</h3>
                                <p className="text-sm">Every project must pass KYC, Audit, and Liquidity Lock requirements before listing on BaseRise.</p>
                            </div>
                        </div>
                    </section>

                    {/* Section 4: Roadmap */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                            <Target size={20} className="text-green-400" /> 4. Roadmap Phase 1
                        </h2>
                        <p className="leading-7 mb-4">
                            We are currently in the <strong>Genesis Phase</strong>. Our focus is strictly on community building and infrastructure testing.
                        </p>
                        <div className="space-y-4 mt-6 border-l-2 border-white/10 pl-6">
                            <div className="relative">
                                <div className="absolute -left-[31px] top-1 w-4 h-4 bg-blue-600 rounded-full border-4 border-[#050505]"></div>
                                <h4 className="text-white font-bold">Q1 2026: Foundation</h4>
                                <p className="text-sm text-gray-500">Waitlist Launch, Community Formation, Initial Partnerships.</p>
                            </div>
                            <div className="relative">
                                <div className="absolute -left-[31px] top-1 w-4 h-4 bg-gray-700 rounded-full border-4 border-[#050505]"></div>
                                <h4 className="text-gray-400 font-bold">Q2 2026: Platform Beta</h4>
                                <p className="text-sm text-gray-500">Staking Contract Audit, Testnet Launchpad Live.</p>
                            </div>
                        </div>
                    </section>

                    {/* Footer Note */}
                    <div className="pt-10 border-t border-white/10 text-center">
                        <p className="text-sm text-gray-500 italic">
                            This document is a living draft (Litepaper) and subject to updates as the protocol evolves.
                        </p>
                    </div>

                </div>
            </main>
        </div>
    );
}