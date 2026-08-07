'use client';

import * as React from "react";
import { Card, CardContent } from "./card";
import { AnimatedNumber } from "./animated-number";
import { Target, Wallet } from "lucide-react";

interface StatCardProps {
  amount: number;
}

interface BalanceCardProps {
  amount: number;
  goal?: number;
  completed?: number;
}

export const GoalCard: React.FC<StatCardProps> = ({ amount }) => {
  return (
    <Card className="relative overflow-hidden border border-white/70 bg-white/75 shadow-sm p-6 sm:p-8 rounded-[30px] w-full max-w-xl mx-auto select-none">
      {/* Decorative Wave SVG inside card */}
      <div className="absolute inset-0 pointer-events-none opacity-40 select-none">
        <svg className="w-full h-full" viewBox="0 0 500 150" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,80 C150,130 350,30 500,80" stroke="url(#card-wave-grad)" strokeWidth="1.5" />
          <path d="M0,95 C150,145 350,45 500,95" stroke="url(#card-wave-grad)" strokeWidth="1.5" />
          <path d="M0,65 C150,115 350,15 500,65" stroke="url(#card-wave-grad)" strokeWidth="1" strokeDasharray="3 3" />
          <defs>
            <linearGradient id="card-wave-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#73a0c8" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#73a0c8" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#4a80b0" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <CardContent className="relative p-0 z-10 flex flex-col items-center justify-center">
        <div className="flex items-center gap-2 text-slate-500 font-semibold uppercase tracking-widest text-xs sm:text-sm font-heading">
          <Target className="h-5 w-5 text-[#4a80b0] stroke-[2.5]" />
          <span>YOUR GOAL</span>
        </div>
        <h3 className="mt-4 font-heading text-6xl sm:text-7xl font-black tracking-tight text-slate-800 bg-gradient-to-b from-[#2e5d8a] to-[#4a80b0] bg-clip-text text-transparent">
          <AnimatedNumber value={amount} />
        </h3>
      </CardContent>
    </Card>
  );
};

export const BalanceCard: React.FC<BalanceCardProps> = ({ amount, goal = 5000, completed = 1250 }) => {
  return (
    <Card className="relative overflow-hidden border border-white/70 bg-white/75 shadow-sm p-4 sm:p-5 rounded-[24px] w-full max-w-xl mx-auto select-none">
      <CardContent className="p-0 flex flex-row items-center justify-between gap-4 w-full">
        {/* Left Side: Pending Stats */}
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
            <Wallet className="h-5 w-5 stroke-[2.5]" />
          </div>
          <div className="text-left">
            <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-slate-400 font-heading">
              PENDING
            </p>
            <h4 className="font-heading text-2xl sm:text-3xl font-black text-emerald-600 mt-0.5">
              <AnimatedNumber value={amount} />
            </h4>
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="h-10 w-[1.5px] bg-slate-200" />

        {/* Right Side: Equation Formula */}
        <div className="text-right">
          <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400 font-heading font-bold">
            Goal - Completed
          </p>
          <p className="font-heading text-xs sm:text-sm font-bold text-slate-500 mt-1 tracking-tight">
            {goal.toLocaleString()} - {completed.toLocaleString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
