"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../components/ui/tooltip";

type CtaRowProps = {
  hasSelectedCsv: boolean;
  hasRawCsv: boolean;
};

export function CtaRow({ hasSelectedCsv, hasRawCsv }: CtaRowProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <ModernCtaCard
        title="Explore Featured Planets"
        description="Browse our curated collection of potentially habitable exoplanets with detailed metrics and synthetic variations."
        href="/planets"
        label="Browse Planets"
        variant="primary"
      />
      <ModernCtaCard
        title="Download Data"
        description="Access our datasets to validate screening thresholds or conduct your own analysis."
        hasSelectedCsv={hasSelectedCsv}
        hasRawCsv={hasRawCsv}
        variant="secondary"
      />
    </div>
  );
}

function ModernCtaCard({
  title,
  description,
  href,
  label,
  variant,
  hasSelectedCsv,
  hasRawCsv,
}: {
  title: string;
  description: string;
  href?: string;
  label?: string;
  variant: "primary" | "secondary";
  hasSelectedCsv?: boolean;
  hasRawCsv?: boolean;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      whileHover={shouldReduceMotion ? undefined : { scale: 1.02, y: -4 }}
      transition={shouldReduceMotion ? undefined : { type: "spring", stiffness: 300, damping: 25 }}
      className="group relative overflow-hidden rounded-2xl bg-white/[0.02] p-8 transition-all duration-300 hover:bg-white/[0.04] hover:shadow-2xl"
    >
      <h3 className="mb-3 text-2xl font-bold text-white">{title}</h3>
      <p className="mb-6 text-base leading-relaxed text-slate-300">{description}</p>
      <div className="flex flex-wrap gap-3">
        {href && label && (
          <Link
            href={href}
            prefetch={false}
            className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-all duration-200 hover:bg-white/90 hover:shadow-lg"
          >
            {label}
          </Link>
        )}
        {variant === "secondary" && (
          <>
            <DownloadButton
              href="/data/selected_planets_full.csv"
              label="Featured CSV"
              enabled={hasSelectedCsv ?? false}
            />
            <DownloadButton href="/data/rawdata.csv" label="Raw Archive" enabled={hasRawCsv ?? false} />
          </>
        )}
      </div>
    </motion.div>
  );
}


type DownloadButtonProps = {
  href: string;
  label: string;
  enabled: boolean;
};

function DownloadButton({ href, label, enabled }: DownloadButtonProps) {
  if (enabled) {
    return (
      <Link
        href={href}
        prefetch={false}
        className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/10 hover:border-white/30"
      >
        {label}
      </Link>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger>
        <button
          disabled
          className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white/40 opacity-60 cursor-not-allowed"
        >
          {label}
        </button>
      </TooltipTrigger>
      <TooltipContent side="top">Add CSVs to /public/data</TooltipContent>
    </Tooltip>
  );
}
