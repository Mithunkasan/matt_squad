'use client';

import * as React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full py-6 mt-auto border-t border-white/20 bg-transparent text-center select-none">
      <div className="mx-auto max-w-7xl px-4 text-xs font-semibold text-slate-400 font-heading uppercase tracking-widest">
        &copy; {new Date().getFullYear()} MATT SQUAD. All rights reserved.
      </div>
    </footer>
  );
};
