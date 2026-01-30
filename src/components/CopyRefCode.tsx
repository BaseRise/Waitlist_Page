"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";

export default function CopyRefCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      // 1. Sirf code ke bajaye poora Referral Link banayein
      const refLink = `${window.location.origin}/waitlist?ref=${code}`;
      
      // 2. Clipboard mein poora link bhej dein
      await navigator.clipboard.writeText(refLink);
      
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  return (
    <div className="relative group flex items-center justify-center">
      {/* Tooltip message update */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-blue-600 text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-xl">
        {copied ? "LINK COPIED! 🔗" : "Click here to Copy 📋"}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-blue-600"></div>
      </div>

      <button
        onClick={handleCopy}
        className={`flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold border transition-all ${
          copied 
            ? "bg-green-500/20 border-green-500 text-green-400" 
            : "bg-white/5 border-white/10 text-blue-400 hover:bg-blue-600/20 hover:border-blue-500/50"
        }`}
      >
        {code}
        {copied ? <Check size={12} /> : <Copy size={12} className="opacity-50 group-hover:opacity-100" />}
      </button>
    </div>
  );
}