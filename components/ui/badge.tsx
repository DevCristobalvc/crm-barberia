import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "gold" | "green" | "gray" | "red" | "blue";
}

export function Badge({ className, variant = "gray", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
        {
          "bg-gold/15 text-gold border border-gold/30": variant === "gold",
          "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30":
            variant === "green",
          "bg-[#2A2A2A] text-[#888888] border border-[#333]":
            variant === "gray",
          "bg-red-500/15 text-red-400 border border-red-500/30":
            variant === "red",
          "bg-blue-500/15 text-blue-400 border border-blue-500/30":
            variant === "blue",
        },
        className
      )}
      {...props}
    />
  );
}
