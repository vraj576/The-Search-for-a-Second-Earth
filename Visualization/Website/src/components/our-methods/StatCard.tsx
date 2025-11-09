"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../components/ui/tooltip";
import { cn } from "../../lib/utils";
import { useSpotlight } from "./useSpotlight";

type StatCardProps = {
  name: string;
  code: string;
  description: string;
  units: string;
  range: string;
  rationale: string;
  className?: string;
};

export function StatCard({ name, code, description, units, range, rationale, className }: StatCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const { ref, handleMove, reset, style } = useSpotlight<HTMLDivElement>();

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={style}
      whileHover={shouldReduceMotion ? undefined : { scale: 1.02, y: -3 }}
      transition={shouldReduceMotion ? undefined : { type: "spring", stiffness: 250, damping: 18 }}
      className={cn(
        "group relative h-full",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(280px circle at var(--x) var(--y), rgba(99,102,241,0.25), transparent 70%)",
        }}
      />
      <Card className="relative flex h-full flex-col justify-between overflow-hidden border-white/10 bg-white/[0.04] backdrop-blur-sm">
        <CardHeader className="space-y-4 pb-0 p-5">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="text-lg font-bold text-white leading-tight">{name}</h3>
            <Badge className="bg-indigo-500/20 text-indigo-200 text-xs font-medium px-2 py-1">{code}</Badge>
          </div>
          <p className="text-base text-slate-300 leading-7">{description}</p>
        </CardHeader>
        <CardContent className="mt-2 flex flex-col gap-4 p-5 pt-0">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wide text-slate-400 font-medium">Units</span>
              <Badge className="bg-white/10 text-white text-xs px-2 py-1">{units}</Badge>
            </div>
            <Tooltip>
              <TooltipTrigger>
                <div className="flex cursor-help items-center gap-2">
                  <span className="text-xs uppercase tracking-wide text-slate-400 font-medium">Range</span>
                  <Badge className="bg-indigo-500/20 text-indigo-200 text-xs px-2 py-1">{range}</Badge>
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-sm text-sm leading-6" side="top">
                <p>{rationale}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
