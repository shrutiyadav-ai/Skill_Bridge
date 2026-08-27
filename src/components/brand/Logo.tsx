import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  imgClassName?: string;
  showBorder?: boolean;
}

const sizeMap = {
  xs: { box: "h-6 w-6", px: 24 },
  sm: { box: "h-8 w-8", px: 32 },
  md: { box: "h-10 w-10", px: 40 },
  lg: { box: "h-16 w-16", px: 64 },
  xl: { box: "h-24 w-24", px: 96 },
};

export function Logo({
  size = "md",
  className,
  imgClassName,
  showBorder = false,
  ...props
}: LogoProps) {
  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div
      className={cn(
        "relative flex items-center justify-center shrink-0 rounded-lg overflow-hidden bg-white transition-transform duration-150",
        currentSize.box,
        showBorder && "ring-1 ring-slate-200/80 dark:ring-slate-700/80 shadow-xs",
        className
      )}
      {...props}
    >
      <Image
        src="/brand/skillbridge-logo.png"
        alt="SkillBridge Official Logo"
        width={currentSize.px}
        height={currentSize.px}
        className={cn(
          "h-full w-full object-contain p-0.5 select-none",
          imgClassName
        )}
        priority
      />
    </div>
  );
}

export default Logo;
