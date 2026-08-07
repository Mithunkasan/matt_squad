'use client';

import * as React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function OfflinePage() {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center p-4 bg-[#e1e9f2] overflow-hidden select-none">
      {/* Background waves matching main layout */}
      <div className="absolute top-0 left-0 w-64 h-64 sm:w-96 sm:h-96 md:w-[28rem] md:h-[28rem] pointer-events-none z-0">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0,0 L100,0 C75,30 40,65 0,100 Z" fill="url(#top-wave-grad)" />
          <defs>
            <linearGradient id="top-wave-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#9fc2e0" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#73a0c8" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#e1e9f2" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="absolute bottom-0 right-0 w-64 h-64 sm:w-96 sm:h-96 md:w-[28rem] md:h-[28rem] pointer-events-none z-0">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M100,100 L0,100 C25,70 60,35 100,0 Z" fill="url(#bottom-wave-grad)" />
          <defs>
            <linearGradient id="bottom-wave-grad" x1="100%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#73a0c8" stopOpacity="0.4" />
              <stop offset="60%" stopColor="#9fc2e0" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#e1e9f2" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <main className="z-10 w-full max-w-md text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="glass-card shadow-lg border border-white/60 p-8 flex flex-col items-center justify-center rounded-2xl bg-white/70 backdrop-blur-md"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 border border-rose-100/50 text-rose-500 mb-6">
            <WifiOff className="h-8 w-8" />
          </div>

          <h1 className="font-heading font-black text-2xl sm:text-3xl text-slate-800 uppercase tracking-tight mb-2">
            Connection Lost
          </h1>
          <p className="text-sm font-medium text-slate-500 mb-8 max-w-xs leading-relaxed">
            It looks like you are offline. Please check your internet settings and try again.
          </p>

          <Button
            onClick={handleRetry}
            className="w-full h-11 font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#73a0c8]/20"
          >
            <RefreshCw className="h-4 w-4" />
            Retry Connection
          </Button>
        </motion.div>
      </main>
    </div>
  );
}
