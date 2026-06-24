import { cn } from "@/lib/utils";
import { WifiOff, Inbox } from "lucide-react";

interface EmptyStateProps {
  type: "error" | "empty";
  title?: string;
  description?: string;
  className?: string;
}

export function EmptyState({ type, title, description, className }: EmptyStateProps) {
  const isError = type === "error";

  const defaultTitle  = isError ? "No se pudo conectar al backend" : "Sin datos aún";
  const defaultDesc   = isError
    ? "Inicia el servidor en localhost:8000 y recarga la página."
    : "Cuando haya información aparecerá aquí.";

  return (
    <div className={cn("flex flex-col items-center justify-center py-14 px-6 text-center", className)}>
      <div className={cn(
        "w-12 h-12 rounded-xl flex items-center justify-center mb-4",
        isError ? "bg-red-900/20 border border-red-900/30" : "bg-[#1A1A1A] border border-[#2A2A2A]"
      )}>
        {isError
          ? <WifiOff className="w-5 h-5 text-red-400" />
          : <Inbox className="w-5 h-5 text-[#555555]" />}
      </div>
      <p className={cn("text-sm font-medium mb-1", isError ? "text-red-400" : "text-[#888888]")}>
        {title ?? defaultTitle}
      </p>
      <p className="text-xs text-[#555555] max-w-xs">
        {description ?? defaultDesc}
      </p>
    </div>
  );
}
