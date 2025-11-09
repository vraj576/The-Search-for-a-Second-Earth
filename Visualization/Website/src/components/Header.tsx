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
          
          {/* Attribution and links - no underlines */}
          <div className="flex items-center gap-3 md:gap-4 animate-text-enter justify-center md:justify-start relative mt-2" style={{ animationDelay: '0.6s', animationFillMode: 'both', zIndex: 2 }}>
            <span className="text-xs md:text-sm text-subtext-clr/70 font-normal">
              Made by{' '}
              <a 
                href="https://jasonindata.vercel.app" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-accent/80 hover:text-accent transition-colors duration-200 no-underline"
              >
                Jason Charwin
              </a>
            </span>
            <span className="text-subtext-clr/40">•</span>
            <a 
              href="https://github.com/Thespaceblade/The-Search-for-a-Second-Earth" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs md:text-sm text-subtext-clr/70 hover:text-accent/90 transition-all duration-200 group no-underline"
              aria-label="View on GitHub"
            >
              <svg 
                className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" 
                fill="currentColor" 
                viewBox="0 0 24 24" 
                aria-hidden="true"
              >
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              <span className="transition-colors duration-200">
                Source
              </span>
            </a>
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
