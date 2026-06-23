"use client";

import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import * as React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "gold" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "gold", size = "md", asChild = false, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none whitespace-nowrap",
          {
            "bg-gold text-[#0A0A0A] hover:bg-gold-light active:scale-[0.98]":
              variant === "gold",
            "border border-gold text-gold hover:bg-gold/10 active:scale-[0.98]":
              variant === "outline",
            "text-[#F5F5F5] hover:bg-[#1A1A1A] active:scale-[0.98]":
              variant === "ghost",
            "bg-red-900/40 text-red-400 border border-red-900 hover:bg-red-900/60":
              variant === "destructive",
            "px-3 py-1.5 text-sm": size === "sm",
            "px-4 py-2.5 text-sm": size === "md",
            "px-6 py-3 text-base": size === "lg",
          },
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
