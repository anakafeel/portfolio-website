"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

import HUD, { ThemeButtons } from "@/components/game/HUD";
import { useSound } from "@/components/game/useSound";
import TextRoll from "@/components/ui/text-roll";
import { NAV_LINKS, RESUME_URL, SITE } from "@/lib/site";

interface NavLink {
  label: string;
  href: string;
}

/**
 * The resume is the main thing a recruiter wants, so it is always in the
 * nav: use the NAV_LINKS entry when site.ts has one, otherwise append it.
 */
const NAV_ITEMS: readonly NavLink[] = (NAV_LINKS as readonly NavLink[]).some(
  (link) => link.href === RESUME_URL,
)
  ? NAV_LINKS
  : [...NAV_LINKS, { label: "RESUME", href: RESUME_URL }];

/** Files (the resume PDF) and off-site URLs skip next/link and its prefetch. */
function isFileOrExternal(href: string): boolean {
  return /^https?:\/\//.test(href) || /\.pdf($|[?#])/i.test(href);
}

function isActiveRoute(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

interface NavItemProps {
  href: string;
  label: string;
  index: number;
  active: boolean;
  /** Full-width row with a 44px tap target (mobile menu). */
  block?: boolean;
  onNavigate: () => void;
}

function NavItem({ href, label, index, active, block, onNavigate }: NavItemProps) {
  const className = clsx(
    "flex items-baseline gap-1.5 font-pixel text-xs transition-colors",
    block ? "min-h-11 w-full items-center py-3" : "py-2",
    active
      ? "text-highlight"
      : "text-foreground hover:text-accent focus-visible:text-accent",
  );

  const content = (
    <>
      <span
        aria-hidden
        className={clsx(
          "text-accent transition-opacity",
          active
            ? "opacity-100 motion-safe:animate-pulse"
            : "opacity-0 group-hover:opacity-100",
        )}
      >
        ►
      </span>
      <span aria-hidden className="text-[10px] text-muted">
        {String(index + 1).padStart(2, "0")}
      </span>
      <TextRoll center>{label}</TextRoll>
    </>
  );

  if (isFileOrExternal(href)) {
    const isPdf = /\.pdf($|[?#])/i.test(href);
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onNavigate}
        aria-label={
          isPdf
            ? `${label.charAt(0)}${label.slice(1).toLowerCase()} (PDF, opens in a new tab)`
            : `${label} (opens in a new tab)`
        }
        className={className}
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={className}
    >
      {content}
    </Link>
  );
}

export default function Header() {
  const pathname = usePathname();
  const play = useSound();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the mobile menu whenever navigation happens.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b-2 border-border bg-surface">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-1.5 md:py-3">
        <Link
          href="/"
          onClick={() => play("click")}
          className="py-2 font-pixel text-sm text-highlight transition-colors hover:text-accent focus-visible:text-accent"
        >
          {SITE.handle.toUpperCase()}
        </Link>

        <nav aria-label="Level select" className="hidden md:block">
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-1">
            {NAV_ITEMS.map((link, index) => (
              <li key={link.href} className="group">
                <NavItem
                  href={link.href}
                  label={link.label}
                  index={index}
                  active={isActiveRoute(pathname, link.href)}
                  onNavigate={() => play("click")}
                />
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          onClick={() => {
            play("click");
            setMenuOpen((open) => !open);
          }}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="pixel-border pixel-border-interactive inline-flex min-h-11 min-w-11 items-center justify-center bg-surface font-pixel text-xs text-foreground transition-colors hover:text-accent md:hidden"
        >
          {menuOpen ? "✕" : "≡"}
        </button>
      </div>

      {menuOpen && (
        <nav
          id="mobile-nav"
          aria-label="Level select"
          className="border-t-2 border-border md:hidden"
        >
          <ul className="mx-auto flex max-w-5xl flex-col px-4 py-1">
            {NAV_ITEMS.map((link, index) => (
              <li key={link.href} className="group border-b-2 border-[color:color-mix(in_srgb,var(--color-border)_40%,transparent)] last:border-b-0">
                <NavItem
                  href={link.href}
                  label={link.label}
                  index={index}
                  active={isActiveRoute(pathname, link.href)}
                  block
                  onNavigate={() => play("click")}
                />
              </li>
            ))}
          </ul>
          {/* The HUD drops its theme swatches at phone width; they live here. */}
          <div className="mx-auto flex max-w-5xl items-center gap-3 border-t-2 border-[color:color-mix(in_srgb,var(--color-border)_40%,transparent)] px-4 py-2 sm:hidden">
            <span className="font-pixel text-[10px] text-muted">THEME</span>
            <ThemeButtons />
          </div>
        </nav>
      )}

      <HUD />
    </header>
  );
}
