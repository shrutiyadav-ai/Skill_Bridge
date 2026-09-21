"use client";

import React from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function useTheme() {
  return {
    theme: "light" as const,
    toggleTheme: () => {},
    setTheme: () => {},
  };
}
