"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Mail, Lock, ArrowRight, Trophy, Users, Star, Copy, Check } from "lucide-react";
import { FaWhatsapp, FaXTwitter } from "react-icons/fa6";
import Link from "next/link";

// Supabase Client (Frontend wala)
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LookupPage() {
    const [step, setStep] = useState<"EMAIL" | "OTP" | "RESULT">("EMAIL");
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes = 300 seconds
    const [isTimerActive, setIsTimerActive] = useState(false);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [stats, setStats] = useState<any>(null);
    const [copied, setCopied] = useState(false);

    // 🧠 Logic: Timer Functionality
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isTimerActive && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsTimerActive(false);
            // Timer cleanup handled, UI will update based on timeLeft === 0
        }
        return () => clearInterval(timer);
    }, [isTimerActive, timeLeft]);

    // Format seconds to MM:SS
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Jab OTP send ho jaye, tab timer start karein
    const handleSendOTP = async () => {
        // ... aapka existing API call logic
        setStep("OTP");
        setTimeLeft(300); // Reset timer to 5 mins
        setIsTimerActive(true);
        setLoading(false);
    };

    // STEP 1: Send OTP
    const sendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // Pehle check karo user exist karta hai ya nahi?
            const { data: userExists } = await supabase
                .from("waitlist")
                .select("email")
                .eq("email", email.toLowerCase())
                .eq("is_verified", true) // Sirf verified users lookup kar saken
                .single();

            if (!userExists) {
                throw new Error("Email not found or not verified in waitlist.");
            }

            // Supabase ka built-in Magic Link / OTP sender
            const { error: otpError } = await supabase.auth.signInWithOtp({
                email: email,
                options: { shouldCreateUser: false }, // Naya user nahi banana
            });

            if (otpError) throw otpError;

            setStep("OTP");
            setTimeLeft(300); // 5 minutes timer
            setIsTimerActive(true);
        } catch (err: any) {
            setError(err.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    // STEP 2: Verify OTP & Fetch Stats
    const verifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // OTP Verify karo
            const { error: verifyError } = await supabase.auth.verifyOtp({
                email,
                token: otp,
                type: "email",
            });

            if (verifyError) throw new Error("Invalid OTP code.");

            // Agar verify ho gaya, tu SQL Function call karo
            const { data: userStats, error: statsError } = await supabase
                .rpc("get_user_stats", { input_email: email });

            if (statsError || !userStats || userStats.length === 0) {
                throw new Error("Could not fetch stats.");
            }

            setStats(userStats[0]); // Data set karo
            setStep("RESULT"); // Result dikhao
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Helper to copy Ref Code with fallback for mobile
    const copyToClipboard = () => {
        if (!stats?.ref_code) return;
        const link = `${window.location.origin}/waitlist?ref=${stats.ref_code}`;

        // Try modern clipboard API first (secure contexts)
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(link).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }).catch(() => {
                // Fallback if clipboard API fails
                fallbackCopy(link);
            });
        } else {
            // Fallback for non-secure contexts (http://192.168.x.x etc.)
            fallbackCopy(link);
        }
    };

    // Fallback copy using textarea + execCommand
    const fallbackCopy = (text: string) => {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        textArea.style.top = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            document.execCommand('copy');
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Fallback copy failed:', err);
            // As last resort, prompt user to manually copy
            window.prompt('Copy this link:', text);
        }

        document.body.removeChild(textArea);
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center p-6 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />

            <div className="w-full max-w-md relative z-10 my-auto">
                <Link href="/" className="block mb-6 text-gray-500 hover:text-white transition-colors text-sm w-fit">
                    ← Back to Home
                </Link>

                <h1 className="text-3xl font-bold text-center mb-2">
                    {step === "OTP" ? "OTP Verification" : step === "RESULT" ? "YOUR STATS" : "Check Your Status"}
                </h1>
                <p className="text-gray-400 text-center mb-8 text-sm">
                    {step === "OTP" ? "Enter OTP to proceed next" : step === "RESULT" ? "Your live stats are here" : "Enter your email to verify identity and view your rank."}
                </p>

                <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 shadow-2xl backdrop-blur-xl">
                    <AnimatePresence mode="wait">

                        {/* --- STEP 1: EMAIL INPUT --- */}
                        {step === "EMAIL" && (
                            <motion.form
                                key="email-form"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                onSubmit={sendOtp}
                                className="space-y-4"
                            >
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                                setError(""); // Clear error when typing
                                            }}
                                            placeholder="you@example.com"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                        />
                                    </div>
                                </div>
                                <button
                                    disabled={loading}
                                    type="submit"
                                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={20} /> : <>Send OTP <ArrowRight size={18} /></>}
                                </button>
                            </motion.form>
                        )}

                        {/* --- STEP 2: OTP INPUT --- */}
                        {step === "OTP" && (
                            <motion.form
                                key="otp-form"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                onSubmit={verifyOtp}
                                className="space-y-6"
                            >
                                {/* Header Section with Timer */}
                                <div className="text-center space-y-4">
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">Verify Identity</h2>
                                        <p className="text-gray-400 text-sm mt-1">
                                            Code sent to <span className="text-white font-medium">{email}</span>
                                        </p>
                                    </div>

                                    {/* ⏳ Aesthetic Timer UI */}
                                    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border ${timeLeft < 60
                                        ? 'border-red-500/50 bg-red-500/10 text-red-400'
                                        : 'border-blue-500/50 bg-blue-500/10 text-blue-400'
                                        } transition-colors duration-300`}>
                                        <span className="text-[10px] uppercase tracking-widest font-bold">Expires in</span>
                                        <span className="font-mono font-bold text-base">{formatTime(timeLeft)}</span>
                                    </div>
                                </div>

                                {/* Input & Buttons */}
                                <div className="space-y-4">
                                    {timeLeft === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-6 space-y-4 bg-red-500/10 rounded-xl border border-red-500/20">
                                            <div className="text-center">
                                                <h3 className="text-red-500 font-bold text-lg mb-1">OTP Expired</h3>
                                                <p className="text-gray-400 text-sm px-4">
                                                    Your verification code has expired. Please request a new one.
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setStep("EMAIL");
                                                    setIsTimerActive(false);
                                                    setOtp("");
                                                    setError("");
                                                }}
                                                className="bg-white text-black px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors shadow-lg"
                                            >
                                                Request New Code
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <input
                                                type="text"
                                                required
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} // Only numbers
                                                placeholder="000000"
                                                disabled={timeLeft === 0}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 text-center text-3xl text-white placeholder:text-white/10 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all tracking-[0.5em] font-mono disabled:opacity-50 disabled:cursor-not-allowed"
                                            />

                                            <button
                                                disabled={loading || otp.length < 6 || timeLeft === 0}
                                                type="submit"
                                                className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-500 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 active:scale-[0.98]"
                                            >
                                                {loading ? (
                                                    <Loader2 className="animate-spin" size={20} />
                                                ) : (
                                                    "Verify & View Stats"
                                                )}
                                            </button>

                                            {/* Change Email Button */}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setStep("EMAIL");      // 1. Wapis jao
                                                    setIsTimerActive(false); // 2. Timer roko
                                                    setOtp("");            // 3. 🧹 SAFAI: OTP input khali karo
                                                    setError("");          // 4. 🧹 SAFAI: Purana error hatao
                                                }}
                                                className="w-full text-xs text-gray-500 hover:text-white mt-2 transition-colors py-2"
                                            >
                                                Didn't receive code? Change Email
                                            </button>
                                        </>
                                    )}
                                </div>
                            </motion.form>
                        )}

                        {/* --- STEP 3: RESULT DASHBOARD --- */}
                        {step === "RESULT" && stats && (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="space-y-6"
                            >
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(234,179,8,0.4)]">
                                        <Trophy className="text-white" size={32} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-white">Rank #{stats.current_rank}</h2>
                                    <p className="text-gray-400 text-sm">Top {stats.current_rank <= 100 ? "100 Elite" : "Contributor"}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-center">
                                        <div className="flex justify-center mb-2 text-blue-400"><Users size={20} /></div>
                                        <div className="text-2xl font-bold">{stats.total_referrals}</div>
                                        <div className="text-[10px] uppercase tracking-wider text-gray-500">Referrals</div>
                                    </div>
                                    <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-center">
                                        <div className="flex justify-center mb-2 text-purple-400"><Star size={20} /></div>
                                        <div className="text-2xl font-bold">{stats.points}</div>
                                        <div className="text-[10px] uppercase tracking-wider text-gray-500">Points</div>
                                    </div>
                                </div>

                                <div className="bg-blue-600/10 border border-blue-500/30 p-4 rounded-xl relative overflow-hidden">
                                    <p className="text-[10px] uppercase tracking-wider text-blue-400 mb-2 font-bold">
                                        Your Referral Link
                                    </p>

                                    <div className="flex items-center gap-2 bg-black/40 rounded-lg p-2 border border-blue-500/20">
                                        {/* Scrollable + Selectable Input - User can manually copy too */}
                                        <input
                                            type="text"
                                            readOnly
                                            value={`${typeof window !== 'undefined' ? window.location.origin : ''}/waitlist?ref=${stats.ref_code}`}
                                            onClick={(e) => (e.target as HTMLInputElement).select()}
                                            className="flex-1 bg-transparent text-sm font-mono text-white/90 outline-none border-none overflow-x-auto whitespace-nowrap cursor-text select-all"
                                            style={{ WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
                                        />

                                        {/* Copy Button with Tooltip */}
                                        <div className="relative group/copy flex-shrink-0">
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    copyToClipboard();
                                                }}
                                                aria-label="Copy referral link"
                                                className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200 hover:scale-110"
                                            >
                                                {copied ? (
                                                    <Check size={18} className="text-green-400" />
                                                ) : (
                                                    <Copy size={18} className="text-blue-400" />
                                                )}
                                            </button>

                                            {/* Tooltip - Desktop hover / shows "Copied!" on click */}
                                            <span className={`absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-[10px] font-bold whitespace-nowrap transition-all duration-200 ${copied
                                                    ? 'bg-green-500 text-white opacity-100 scale-100'
                                                    : 'bg-gray-800 text-gray-300 opacity-0 group-hover/copy:opacity-100 scale-90 group-hover/copy:scale-100'
                                                }`}>
                                                {copied ? 'Copied!' : 'Copy link'}
                                            </span>
                                        </div>
                                    </div>

                                    <p className="text-[10px] text-gray-500 mt-3 text-center flex items-center justify-center gap-3">
                                        <span>Share this link to boost your rank</span>
                                        
                                        {/* Twitter/X Share Button */}
                                        <motion.a
                                            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`🚀 I just secured my spot on @BaseRise waitlist!\n\nJoin me and get early access 👇\n${typeof window !== 'undefined' ? window.location.origin : ''}/waitlist?ref=${stats.ref_code}`)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group relative w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center cursor-pointer hover:bg-white hover:border-white transition-all duration-300"
                                            whileHover={{ scale: 1.15, y: -2 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <FaXTwitter size={14} className="text-gray-400 group-hover:text-black transition-colors duration-300" />
                                            <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-white text-black text-[9px] font-bold rounded opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-200 whitespace-nowrap shadow-lg">
                                                Share to X
                                            </span>
                                        </motion.a>

                                        {/* WhatsApp Share Button */}
                                        <motion.a
                                            href={`https://wa.me/?text=${encodeURIComponent(`🚀 Hey! I just joined the BaseRise waitlist and secured my early access spot!\n\nYou should join too before spots fill up 👇\n${typeof window !== 'undefined' ? window.location.origin : ''}/waitlist?ref=${stats.ref_code}`)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group relative w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center cursor-pointer hover:bg-green-500 hover:border-green-500 transition-all duration-300"
                                            whileHover={{ scale: 1.15, y: -2 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <FaWhatsapp size={15} className="text-gray-400 group-hover:text-white transition-colors duration-300" />
                                            <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-green-500 text-white text-[9px] font-bold rounded opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-200 whitespace-nowrap shadow-lg">
                                                Share to WhatsApp
                                            </span>
                                        </motion.a>
                                    </p>
                                </div>

                                <button
                                    onClick={() => {
                                        setStep("EMAIL");
                                        setOtp("");
                                        setEmail("");
                                        setStats(null);
                                    }}
                                    className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 text-sm py-3 rounded-xl transition-all"
                                >
                                    Check Another Email
                                </button>
                            </motion.div>
                        )}

                    </AnimatePresence>

                    {/* Error Message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 space-y-2"
                        >
                            <p className="text-red-400 text-xs text-center bg-red-400/10 py-2 rounded-lg border border-red-400/20">
                                {error}
                            </p>
                            {error.includes("not found") || error.includes("not verified") ? (
                                <Link href="/waitlist">
                                    <p className="text-blue-400 hover:text-blue-300 text-xs text-center cursor-pointer underline transition-colors">
                                        Click here to join
                                    </p>
                                </Link>
                            ) : null}
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}