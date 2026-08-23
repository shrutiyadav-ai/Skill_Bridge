"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { CheckCircle2, AlertCircle, Sparkles, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface ProfileCompletenessProps {
  completeness: number;
  missingSuggestions: string[];
  updatedAt?: string | Date;
  onSuggestionClick?: (suggestion: string) => void;
}

export function ProfileCompletenessCard({
  completeness,
  missingSuggestions,
  updatedAt,
  onSuggestionClick,
}: ProfileCompletenessProps) {
  const getProgressColor = () => {
    if (completeness >= 80) return "bg-emerald-500";
    if (completeness >= 50) return "bg-blue-600";
    return "bg-amber-500";
  };

  const getStatusBadge = () => {
    if (completeness >= 80) {
      return (
        <Badge variant="success" className="gap-1">
          <CheckCircle2 className="h-3 w-3" /> All Set
        </Badge>
      );
    }
    if (completeness >= 50) {
      return (
        <Badge variant="info" className="gap-1">
          <Sparkles className="h-3 w-3" /> In Progress
        </Badge>
      );
    }
    return (
      <Badge variant="warning" className="gap-1">
        <AlertCircle className="h-3 w-3" /> Action Needed
      </Badge>
    );
  };

  return (
    <Card className="border-navy-100 dark:border-slate-800 bg-linear-to-r from-navy-50/50 via-white to-blue-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 shadow-xs">
      <CardContent className="p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Profile Completeness
              </h3>
              {getStatusBadge()}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              A comprehensive profile increases opportunities matching accuracy and institutional discovery.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <span className="text-2xl font-black font-mono text-navy-900 dark:text-blue-400">
                {completeness}%
              </span>
            </div>
            {updatedAt && (
              <div className="hidden md:flex items-center gap-1 text-[11px] text-slate-400 border-l border-slate-200 dark:border-slate-800 pl-3">
                <Clock className="h-3 w-3" />
                <span>Updated {formatDate(updatedAt)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full mt-3 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${getProgressColor()}`}
            style={{ width: `${completeness}%` }}
          />
        </div>

        {/* Actionable Missing Suggestions */}
        {missingSuggestions.length > 0 && (
          <div className="mt-3.5 pt-3 border-t border-slate-200/60 dark:border-slate-800/80 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Quick Suggestions:
            </span>
            {missingSuggestions.slice(0, 4).map((suggestion, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSuggestionClick && onSuggestionClick(suggestion)}
                className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-navy-500 hover:text-navy-600 dark:hover:text-blue-400 transition-colors shadow-2xs cursor-pointer"
              >
                + {suggestion}
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
