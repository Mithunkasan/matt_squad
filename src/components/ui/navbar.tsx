'use client';

import * as React from "react";
import Link from "next/link";
import { Logo } from "./logo";
import { Button } from "./button";
import { Input } from "./input";
import { LogOut, LayoutDashboard, Target } from "lucide-react";
import { updateGoal } from "@/app/actions";

interface NavbarProps {
  isAdmin?: boolean;
  goalAmount?: number;
  onGoalUpdate?: (amount: number) => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isAdmin = false,
  goalAmount = 5000,
  onGoalUpdate,
  onLogout,
}) => {
  const [localGoal, setLocalGoal] = React.useState(goalAmount.toString());
  const [isUpdating, setIsUpdating] = React.useState(false);

  React.useEffect(() => {
    setLocalGoal(goalAmount.toString());
  }, [goalAmount]);

  const handleGoalBlurOrSubmit = async () => {
    const parsed = parseFloat(localGoal);
    if (!isNaN(parsed) && parsed > 0 && parsed !== goalAmount) {
      setIsUpdating(true);
      if (onGoalUpdate) {
        onGoalUpdate(parsed);
      } else {
        await updateGoal(parsed);
      }
      setIsUpdating(false);
    } else {
      setLocalGoal(goalAmount.toString());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/40 bg-white/40 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Side: Logo */}
        <Link href="/" className="transition-opacity hover:opacity-90">
          <Logo />
        </Link>

        {/* Center/Right Side: Dynamic Actions */}
        <div className="flex items-center gap-4">
          {isAdmin ? (
            <>
              {/* Dashboard Title - Visible on larger screens */}
              <span className="hidden md:inline-flex items-center gap-2 text-sm font-bold font-heading text-slate-700 bg-slate-100/50 border border-slate-200/50 px-3 py-1.5 rounded-xl">
                <LayoutDashboard className="h-4 w-4 text-[#73a0c8]" />
                Admin Dashboard
              </span>

              {/* Editable Goal Amount */}
              <div className="flex items-center gap-2 bg-white/60 border border-slate-200/60 rounded-2xl pl-3 pr-1 py-1">
                <span className="flex items-center gap-1 text-xs font-semibold text-slate-500 font-heading">
                  <Target className="h-3.5 w-3.5 text-[#73a0c8]" />
                  Goal:
                </span>
                <input
                  type="number"
                  value={localGoal}
                  onChange={(e) => setLocalGoal(e.target.value)}
                  onBlur={handleGoalBlurOrSubmit}
                  onKeyDown={handleKeyDown}
                  disabled={isUpdating}
                  className="w-20 md:w-24 bg-transparent border-none text-sm font-black font-heading text-slate-800 focus:outline-none focus:ring-0 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>

              {/* Logout Button */}
              {onLogout && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onLogout}
                  className="h-9 gap-2 rounded-xl text-xs font-semibold hover:border-red-200 hover:bg-red-50/50 hover:text-red-600 transition-colors duration-300"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              )}
            </>
          ) : (
            <Link href="/admin">
              <Button
                variant="outline"
                size="sm"
                className="h-9 gap-2 rounded-xl text-xs font-semibold border-slate-200 bg-white/40 hover:bg-white hover:border-[#73a0c8] text-slate-600 hover:text-[#73a0c8]"
              >
                Admin Area
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
