"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname() || "/";
  const items = [
    { href: "/", label: "Data Visualizations" },
    { href: "/our-methods", label: "Our Methods" },
  ];

  return (
    <header className="relative mb-8 overflow-visible">
      {/* Animated gradient background - behind text/logo, text will obscure edges */}
      <div className="absolute inset-0 bg-gradient-radial-header animate-pulse-slow pointer-events-none" style={{ zIndex: 0 }} />

      {/* Extended fade-out gradient at bottom to blend seamlessly with page */}
      <div className="absolute -bottom-8 left-0 right-0 h-24 bg-gradient-to-b from-transparent via-[var(--page-bg)]/80 to-[var(--page-bg)] pointer-events-none" style={{ zIndex: 1 }} />

      {/* Content container - positioned above gradient */}
      <div className="relative flex flex-col md:flex-row items-center md:items-end justify-center md:justify-start gap-5 md:gap-10 py-10 md:py-12 px-6 md:px-12" style={{ zIndex: 2 }}>
        
        {/* Logo container - clean and minimal */}
        <div className="relative group flex-shrink-0" style={{ zIndex: 2 }}>
          {/* Subtle glow - minimal and clean */}
          <div className="absolute inset-[-8px] bg-accent/10 rounded-full blur-xl group-hover:bg-accent/15 transition-all duration-300" style={{ zIndex: -1 }} />
          
          {/* Logo container - clean, no glass effects */}
          <div className="relative flex h-24 w-24 md:h-36 md:w-36 items-center justify-center rounded-full border border-accent/40 bg-transparent group-hover:scale-105 group-hover:border-accent/60 transition-all duration-300 overflow-hidden">
            <Image
              src="/image.png"
              alt="The Search for a Second Earth logo"
              width={160}
              height={160}
              className="object-cover w-full h-full rounded-full animate-logo-enter"
              priority
            />
          </div>
        </div>
        
        {/* Text content - clean and clear, no gradient interference */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-2.5 md:space-y-3 min-w-0 flex-1 w-full relative" style={{ zIndex: 2 }}>
          <h1 className="text-5xl md:text-7xl font-bold tracking-[-0.02em] animate-text-enter leading-tight break-words px-2 md:px-0 relative">
            <span className="text-[#7cc7ff] drop-shadow-[0_0_20px_rgba(124,199,255,0.4),0_2px_8px_rgba(0,0,0,0.5)]">
              The Search for a
            </span>
            <span className="text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
              {' '}Second Earth
            </span>
          </h1>
          <div className="flex items-center gap-3 md:gap-4 animate-text-enter flex-wrap justify-center md:justify-start relative" style={{ animationDelay: '0.4s', animationFillMode: 'both', zIndex: 2 }}>
            <div className="h-px w-10 md:w-12 bg-gradient-to-r from-transparent via-[#7cc7ff]/60 to-transparent hidden sm:block" />
            <p className="text-base md:text-lg text-subtext-clr font-medium tracking-wide drop-shadow-[0_1px_4px_rgba(0,0,0,0.2)]">
              Exploring exoplanets with Earth-like characteristics
            </p>
            <div className="h-px w-10 md:w-12 bg-gradient-to-r from-transparent via-[#7cc7ff]/60 to-transparent hidden sm:block" />
          </div>
          

          {/* Navigation - positioned after attribution */}
          <nav 
            aria-label="Primary" 
            className="flex items-center gap-3 md:gap-4 animate-text-enter justify-center md:justify-start mt-4"
            style={{ animationDelay: '0.7s', animationFillMode: 'both', zIndex: 2 }}
          >
            {items.map((it) => {
              const active = pathname === it.href;
              return (
                <Link
                  key={it.href}
                  href={it.href}
                  aria-current={active ? "page" : undefined}
                  role="button"
                  className={`nav-pill ${active ? 'is-active' : ''}`}
                >
                  {it.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
