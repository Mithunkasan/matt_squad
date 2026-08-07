import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "secondary" | "danger";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-2xl text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#73a0c8] disabled:pointer-events-none disabled:opacity-50 active:scale-95 cursor-pointer font-heading",
          // Variants
          variant === "default" && "bg-[#73a0c8] text-white hover:bg-[#5e8fb8] shadow-sm shadow-[#73a0c8]/20 hover:shadow-md hover:shadow-[#73a0c8]/30",
          variant === "outline" && "border border-slate-200 bg-white/40 hover:bg-white/80 text-slate-700 backdrop-blur-sm",
          variant === "ghost" && "bg-transparent hover:bg-slate-100/50 text-slate-700",
          variant === "secondary" && "bg-white/80 border border-white/60 text-slate-800 hover:bg-white shadow-sm",
          variant === "danger" && "bg-red-500 text-white hover:bg-red-600 shadow-sm shadow-red-500/20 hover:shadow-md hover:shadow-red-500/30",
          // Sizes
          size === "default" && "h-11 px-5 py-2.5",
          size === "sm" && "h-9 rounded-xl px-3 text-xs",
          size === "lg" && "h-12 rounded-3xl px-8 text-base",
          size === "icon" && "h-10 w-10 p-0 rounded-xl",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
