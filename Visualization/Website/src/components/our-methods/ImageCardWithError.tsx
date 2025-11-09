'use client';

import { useState } from 'react';

type ImageCardProps = {
  src: string;
  alt: string;
  caption: string;
  annotation: string;
};

export function ImageCardWithError({ src, alt, caption, annotation }: ImageCardProps) {
  const [hasError, setHasError] = useState(false);

  return (
    <div className="group flex h-full w-full max-w-full flex-col overflow-hidden rounded-2xl bg-white/[0.02] border border-white/5 transition-all duration-300 hover:bg-white/[0.04] hover:shadow-xl">
      <div className="relative aspect-video w-full max-w-full overflow-hidden bg-gradient-to-br from-white/5 to-white/[0.02]">
        {hasError ? (
          <div className="flex h-full w-full items-center justify-center text-slate-400 text-sm">
            Image not available
          </div>
        ) : (
          <img
            src={src}
            alt={alt}
            className="h-full w-full max-w-full object-contain p-2 transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
            onError={() => setHasError(true)}
          />
        )}
      </div>
      <div className="flex flex-1 flex-col p-5 text-center">
        <h3 className="mb-2 text-lg font-bold text-white">{caption}</h3>
        <p className="text-sm leading-relaxed text-slate-400">{annotation}</p>
      </div>
    </div>
  );
}

