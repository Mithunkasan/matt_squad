'use client';

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AnimatedNumber } from "./animated-number";

import { Pointer } from "lucide-react";

interface AmountCircleProps {
  amount: number;
}

export const AmountCircle: React.FC<AmountCircleProps> = ({ amount }) => {
  return (
    <Link href="/admin" className="flex flex-col items-center gap-3 no-underline group select-none">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 350, damping: 18 }}
        className="relative flex h-64 w-64 cursor-pointer items-center justify-center rounded-full border border-blue-200/50 bg-white shadow-xl animate-blink-glow select-none"
      >
        {/* Neon radial glow backdrops */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#73a0c8]/20 to-blue-400/20 blur-xl pointer-events-none opacity-80" />
        <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-white/10 via-white/40 to-white/80 pointer-events-none" />

        {/* SVG ring patterns */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 256 256">
          {/* Dashed outer ring */}
          <circle cx="128" cy="128" r="108" stroke="#73a0c8" strokeWidth="2" strokeDasharray="5 5" fill="none" className="opacity-80" />
          {/* Solid accent inner ring */}
          <circle cx="128" cy="128" r="96" stroke="rgba(115, 160, 200, 0.15)" strokeWidth="1" fill="none" />
        </svg>

        {/* Content wrapper */}
        <div className="text-center z-10 flex flex-col items-center justify-center p-6">
          <div className="text-6xl font-black tracking-tight text-slate-800 font-heading">
            <AnimatedNumber value={amount} />
          </div>
          <span className="mt-2 text-[11px] font-semibold uppercase tracking-widest text-[#73a0c8] font-heading">
            Total Task Amount
          </span>
        </div>

        {/* Hover Pointer Hand Indicator at bottom inside circle */}
        <div className="absolute bottom-6 flex flex-col items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <Pointer className="h-5 w-5 text-blue-500 rotate-90 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300" />
        </div>
      </motion.div>
      
      {/* Click to Manage Tasks Label */}
      <span className="text-xs font-semibold text-[#4a80b0] tracking-wider uppercase opacity-90 group-hover:opacity-100 group-hover:text-blue-600 transition-colors duration-300">
        Click to Manage Tasks
      </span>
    </Link>
  );
};
