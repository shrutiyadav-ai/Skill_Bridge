import React from "react";
import { cn } from "@/lib/utils";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  target?: number; // Optional benchmark target level
  variant?: "default" | "success" | "warning" | "danger" | "dynamic";
  showLabel?: boolean;
}

export function Progress({
  className,
  value,
  target,
  variant = "dynamic",
  showLabel = false,
  ...props
}: ProgressProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  let barColor = "bg-navy-800";
  if (variant === "dynamic") {
    if (clampedValue >= 80) barColor = "bg-emerald-600";
    else if (clampedValue >= 60) barColor = "bg-blue-600";
    else if (clampedValue >= 40) barColor = "bg-amber-500";
    else barColor = "bg-rose-500";
  } else if (variant === "success") {
    barColor = "bg-emerald-600";
  } else if (variant === "warning") {
    barColor = "bg-amber-500";
  } else if (variant === "danger") {
    barColor = "bg-rose-500";
  }

  return (
    <div className={cn("w-full space-y-1", className)} {...props}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-medium text-slate-600">
          <span>Current: {clampedValue}%</span>
          {target !== undefined && <span className="text-slate-400">Target: {target}%</span>}
        </div>
      )}
      <div className="relative h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <div
          className={cn("h-full transition-all duration-500 rounded-full", barColor)}
          style={{ width: `${clampedValue}%` }}
        />
        {target !== undefined && (
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-slate-900/60 z-10"
            style={{ left: `${Math.min(100, Math.max(0, target))}%` }}
            title={`Required Benchmark: ${target}%`}
          />
        )}
      </div>
    </div>
  );
}
