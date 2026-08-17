'use client';

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/ui/logo";
import { GoalCard, BalanceCard } from "@/components/ui/stat-cards";
import { AmountCircle } from "@/components/ui/amount-circle";
import { Calendar, Clock, Hourglass, Sparkles, ArrowLeft, ArrowRight } from "lucide-react";

interface GoalData {
  amount: number;
  startDate?: string | null;
  startTime?: string | null;
  endDate?: string | null;
  endTime?: string | null;
  tasks: Array<{ id: string; taskName: string; amount: number }>;
}

interface LandingContentProps {
  goal1: GoalData;
  goal2: GoalData;
}

export default function LandingContent({
  goal1,
  goal2,
}: LandingContentProps) {
  const [activeGoalSet, setActiveGoalSet] = React.useState<1 | 2>(1);

  // Active goal variables
  const currentGoalSet = activeGoalSet === 1 ? goal1 : goal2;
  const initialGoal = currentGoalSet.amount;
  const initialTotalTaskAmount = currentGoalSet.tasks.reduce((sum, task) => sum + task.amount, 0);
  const balance = initialGoal - initialTotalTaskAmount;
  const startDate = currentGoalSet.startDate;
  const startTime = currentGoalSet.startTime;
  const endDate = currentGoalSet.endDate;
  const endTime = currentGoalSet.endTime;

  const [daysRemaining, setDaysRemaining] = React.useState<number | null>(null);
  const [campaignStatus, setCampaignStatus] = React.useState<"not-started" | "active" | "ended" | null>(null);

  React.useEffect(() => {
    if (!endDate) {
      setDaysRemaining(null);
      setCampaignStatus(null);
      return;
    }

    const calculateTime = () => {
      const now = new Date();
      
      // Parse start and end date/times
      const startStr = startDate ? `${startDate}T${startTime || '00:00'}` : null;
      const endStr = `${endDate}T${endTime || '23:59:59'}`;
      
      const start = startStr ? new Date(startStr) : null;
      const end = new Date(endStr);
      
      if (start && now < start) {
        setCampaignStatus("not-started");
        const diffMs = start.getTime() - now.getTime();
        const diffDays = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
        setDaysRemaining(diffDays);
      } else if (now > end) {
        setCampaignStatus("ended");
        setDaysRemaining(0);
      } else {
        setCampaignStatus("active");
        const diffMs = end.getTime() - now.getTime();
        const diffDays = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
        setDaysRemaining(diffDays);
      }
    };

    calculateTime();
    // Update every minute
    const timer = setInterval(calculateTime, 60000);
    return () => clearInterval(timer);
  }, [startDate, startTime, endDate, endTime]);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-between p-4 md:p-8 bg-[#e1e9f2] overflow-hidden select-none">
      
      {/* Background Corner Wave Graphics (Replica Illustration style) */}
      {/* Top Left Wave */}
      <div className="absolute top-0 left-0 w-64 h-64 sm:w-96 sm:h-96 md:w-[28rem] md:h-[28rem] pointer-events-none z-0 select-none">
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

      {/* Bottom Right Wave */}
      <div className="absolute bottom-0 right-0 w-64 h-64 sm:w-96 sm:h-96 md:w-[28rem] md:h-[28rem] pointer-events-none z-0 select-none">
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

      {/* Background Sparkles */}
      <div className="absolute left-[12%] top-[28%] pointer-events-none text-[#73a0c8]/40 animate-float z-0">
        <Sparkles className="h-6 w-6 stroke-[1.5]" />
      </div>
      <div className="absolute right-[15%] top-[52%] pointer-events-none text-[#73a0c8]/40 animate-float z-0" style={{ animationDelay: '2.5s' }}>
        <Sparkles className="h-5 w-5 stroke-[1.5]" />
      </div>

      {/* Dot Grid Backgrounds */}
      <div className="absolute left-6 sm:left-12 top-1/3 w-16 h-32 replica-dot-grid opacity-30 pointer-events-none z-0" />
      <div className="absolute right-6 sm:right-12 top-1/4 w-16 h-32 replica-dot-grid opacity-30 pointer-events-none z-0" />

      {/* Top Header Logo */}
      <header className="w-full flex justify-center py-2 z-10 select-none">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Logo iconOnly={true} className="scale-110" />
        </motion.div>
      </header>

      {/* Main Container */}
      <main className="flex-grow flex flex-col items-center justify-center w-full max-w-2xl py-6 z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1, type: "spring", bounce: 0.15 }}
          className="text-center w-full flex flex-col items-center justify-center"
        >
          {/* Main Title heading (replica layout) */}
          <h1 className="font-heading font-black text-slate-800 text-5xl sm:text-6xl md:text-7xl lg:text-7xl uppercase tracking-tight select-none mb-2">
            MATT <span className="bg-gradient-to-r from-[#2e5d8a] to-[#4a80b0] bg-clip-text text-transparent">SQUAD</span>
          </h1>

          {/* Subtitle Divider Lines */}
          <div className="flex items-center justify-center gap-4 w-full max-w-xs mb-8">
            <div className="h-[1px] flex-grow bg-slate-300/60" />
            <span className="text-[10px] sm:text-xs uppercase tracking-widest text-slate-500 font-bold whitespace-nowrap">
              Plan. Track. Achieve.
            </span>
            <div className="h-[1px] flex-grow bg-slate-300/60" />
          </div>

          {/* Arrow navigation bar - placed above "Your Goal" content */}
          <div className="relative w-full max-w-md flex items-center justify-between px-6 mb-4 z-20">
            {/* Left Arrow (only visible on Goal Set 2) */}
            <div className="w-10 h-10 flex items-center justify-center">
              {activeGoalSet === 2 && (
                <motion.button
                  whileHover={{ scale: 1.1, x: -2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setActiveGoalSet(1)}
                  className="p-2 rounded-full bg-white/85 border border-white/60 text-[#4a80b0] hover:text-blue-600 shadow-sm cursor-pointer flex items-center justify-center transition-colors"
                >
                  <ArrowLeft className="h-5 w-5 stroke-[2.5]" />
                </motion.button>
              )}
            </div>

            <span className="text-[11px] font-bold uppercase tracking-widest text-[#4a80b0]/80 bg-white/60 border border-white/40 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-sm select-none">
              Goal Set {activeGoalSet}
            </span>

            {/* Right Arrow (only visible on Goal Set 1) */}
            <div className="w-10 h-10 flex items-center justify-center">
              {activeGoalSet === 1 && (
                <motion.button
                  whileHover={{ scale: 1.1, x: 2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setActiveGoalSet(2)}
                  className="p-2 rounded-full bg-white/85 border border-white/60 text-[#4a80b0] hover:text-blue-600 shadow-sm cursor-pointer flex items-center justify-center transition-colors"
                >
                  <ArrowRight className="h-5 w-5 stroke-[2.5]" />
                </motion.button>
              )}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeGoalSet}
              initial={{ opacity: 0, x: activeGoalSet === 1 ? -30 : 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: activeGoalSet === 1 ? 30 : -30 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="w-full flex flex-col items-center justify-center"
            >
              {/* Campaign Timeline Countdown Banner */}
              {endDate && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.05 }}
                  className="mb-8 w-full max-w-md bg-white/70 border border-white/60 backdrop-blur-md rounded-2xl p-4 shadow-sm flex items-center justify-between gap-4 select-none animate-none"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#73a0c8]/10 text-[#73a0c8]">
                      {campaignStatus === "not-started" ? (
                        <Calendar className="h-5 w-5" />
                      ) : campaignStatus === "ended" ? (
                        <Clock className="h-5 w-5 text-rose-500 animate-pulse" />
                      ) : (
                        <Hourglass className="h-5 w-5 text-[#73a0c8] animate-pulse" />
                      )}
                    </div>
                    <div className="text-left">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                        Campaign Timeline
                      </p>
                      <p className="text-xs font-semibold text-slate-600 mt-0.5">
                        {campaignStatus === "not-started" && `Starts: ${startDate} ${startTime || ''}`}
                        {campaignStatus === "active" && `Ends: ${endDate} ${endTime || ''}`}
                        {campaignStatus === "ended" && "Campaign Ended"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <h4 className="font-heading font-black text-xl text-slate-800 tracking-tight">
                      {campaignStatus === "not-started" ? (
                        <span>{daysRemaining} Days Left</span>
                      ) : campaignStatus === "ended" ? (
                        <span className="text-rose-500 font-bold">Ended</span>
                      ) : (
                        <span>{daysRemaining} {daysRemaining === 1 ? 'Day' : 'Days'} Left</span>
                      )}
                    </h4>
                    <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400 mt-0.5">
                      {campaignStatus === "not-started" ? "Until Start" : campaignStatus === "ended" ? "Completed" : "Remaining"}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Centered column stack layout: GoalCard -> Circle -> BalanceCard */}
              <div className="flex flex-col items-center gap-8 w-full max-w-md sm:max-w-lg px-4">
                
                {/* Goal Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="w-full"
                >
                  <GoalCard amount={initialGoal} />
                </motion.div>

                {/* Glowing Circular Progress Card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.15 }}
                  className="flex justify-center w-full"
                >
                  <AmountCircle amount={initialTotalTaskAmount} />
                </motion.div>

                {/* Balance Card (Dynamic Equation Formula display) */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="w-full"
                >
                  <BalanceCard 
                    amount={balance} 
                    goal={initialGoal} 
                    completed={initialTotalTaskAmount} 
                  />
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </main>

      {/* Stay focused quote Footer */}
      <footer className="w-full text-center py-6 select-none mt-6 z-10">
        <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#4a80b0]/80">
          STAY FOCUSED. STAY CONSISTENT. SUCCESS WILL FOLLOW.
        </p>
      </footer>
    </div>
  );
}
