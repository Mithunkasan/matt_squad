'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Sparkles } from 'lucide-react';
import { Button } from './ui/button';

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = React.useState<any>(null);
  const [isVisible, setIsVisible] = React.useState(false);
  const [isStandalone, setIsStandalone] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const isStandaloneMode = 
        window.matchMedia('(display-mode: standalone)').matches || 
        (navigator as any).standalone === true;
      
      setIsStandalone(isStandaloneMode);

      const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e);
        if (!isStandaloneMode) {
          setIsVisible(true);
        }
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      };
    }
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to install prompt: ${outcome}`);

    setDeferredPrompt(null);
    setIsVisible(false);
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (isStandalone || !isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.95 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 z-50 max-w-sm pointer-events-auto"
      >
        <div className="glass-card shadow-2xl border border-white/60 p-5 rounded-2xl bg-white/85 backdrop-blur-lg flex flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#73a0c8]/10 text-[#73a0c8] border border-[#73a0c8]/20">
                <Sparkles className="h-5 w-5 text-[#73a0c8] animate-pulse" />
              </div>
              <div className="text-left">
                <h4 className="font-heading font-black text-sm text-slate-800 uppercase tracking-tight">
                  MATT SQUAD App
                </h4>
                <p className="text-[11px] font-medium text-slate-500 mt-0.5 leading-relaxed">
                  Install the app on your device for quick access and full-screen experience.
                </p>
              </div>
            </div>
            <button 
              onClick={handleDismiss}
              className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDismiss}
              className="flex-1 h-9 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 cursor-pointer"
            >
              Maybe Later
            </Button>
            <Button
              size="sm"
              onClick={handleInstallClick}
              className="flex-1 h-9 rounded-xl text-xs font-bold gap-1.5 cursor-pointer shadow-md shadow-[#73a0c8]/30"
            >
              <Download className="h-3.5 w-3.5" />
              Install
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
