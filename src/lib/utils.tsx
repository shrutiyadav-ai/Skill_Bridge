import React from "react";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Badge } from "@/components/ui/Badge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | null | undefined): string {
  if (amount == null) return "Unpaid / N/A";
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)} LPA`;
  }
  return `₹${amount.toLocaleString("en-IN")}/mo`;
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "N/A";
  const d = new Date(date);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function getRelativeTime(date: string | Date | null | undefined): string {
  if (!date) return "";
  const now = new Date();
  const past = new Date(date);
  const diffInSec = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSec < 60) return "Just now";
  const diffInMin = Math.floor(diffInSec / 60);
  if (diffInMin < 60) return `${diffInMin}m ago`;
  const diffInHour = Math.floor(diffInMin / 60);
  if (diffInHour < 24) return `${diffInHour}h ago`;
  const diffInDay = Math.floor(diffInHour / 24);
  if (diffInDay < 30) return `${diffInDay}d ago`;
  return formatDate(date);
}

export function getScoreColor(score: number): {
  bg: string;
  text: string;
  border: string;
  badge: string;
} {
  if (score >= 80) {
    return {
      bg: "bg-emerald-50 text-emerald-700",
      text: "text-emerald-700",
      border: "border-emerald-200",
      badge: "bg-emerald-100 text-emerald-800 border-emerald-300",
    };
  }
  if (score >= 60) {
    return {
      bg: "bg-blue-50 text-blue-700",
      text: "text-blue-700",
      border: "border-blue-200",
      badge: "bg-blue-100 text-blue-800 border-blue-300",
    };
  }
  if (score >= 40) {
    return {
      bg: "bg-amber-50 text-amber-700",
      text: "text-amber-700",
      border: "border-amber-200",
      badge: "bg-amber-100 text-amber-800 border-amber-300",
    };
  }
  return {
    bg: "bg-rose-50 text-rose-700",
    text: "text-rose-700",
    border: "border-rose-200",
    badge: "bg-rose-100 text-rose-800 border-rose-300",
  };
}

export function getStatusBadge(status: string): React.ReactNode {
  switch (status?.toUpperCase()) {
    case "APPLIED":
      return <Badge variant="default">Applied</Badge>;
    case "UNDER_REVIEW":
      return <Badge variant="warning">Under Review</Badge>;
    case "SHORTLISTED":
      return <Badge variant="info">Shortlisted</Badge>;
    case "INTERVIEW":
      return <Badge variant="secondary">Interview Scheduled</Badge>;
    case "SELECTED":
      return <Badge variant="success">Selected</Badge>;
    case "REJECTED":
      return <Badge variant="danger">Rejected</Badge>;
    case "OPEN":
      return <Badge variant="success">Active</Badge>;
    case "CLOSED":
      return <Badge variant="default">Closed</Badge>;
    case "ACTIVE":
      return <Badge variant="info">In Progress</Badge>;
    case "COMPLETED":
      return <Badge variant="success">Completed</Badge>;
    default:
      return <Badge variant="default">{status || "Pending"}</Badge>;
  }
}
