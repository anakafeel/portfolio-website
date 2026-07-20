"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

import HUD from "@/components/game/HUD";
import { useSound } from "@/components/game/useSound";
import { NAV_LINKS, SITE } from "@/lib/site";

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
  onNavigate: () => void;
}

function NavItem({ href, label, index, active, onNavigate }: NavItemProps) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={clsx(
        "flex items-baseline gap-1.5 font-pixel text-xs transition-colors",
        active
          ? "text-highlight"
          : "text-foreground hover:text-accent focus-visible:text-accent",
      )}
    >
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
      <span className="text-[10px] text-muted">
        {String(index + 1).padStart(2, "0")}
      </span>
      {label}
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
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
        <Link
          href="/"
          onClick={() => play("click")}
          className="font-pixel text-sm text-highlight transition-colors hover:text-accent focus-visible:text-accent focus-visible:outline-none"
        >
          {SITE.handle.toUpperCase()}
        </Link>

        <nav aria-label="Level select" className="hidden md:block">
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {NAV_LINKS.map((link, index) => (
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
          className="pixel-border pixel-border-interactive bg-surface px-3 py-2 font-pixel text-xs text-foreground transition-colors hover:text-accent md:hidden"
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
          <ul className="mx-auto flex max-w-5xl flex-col px-4 py-2">
            {NAV_LINKS.map((link, index) => (
              <li key={link.href} className="group border-b-2 border-border/40 py-3 last:border-b-0">
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
      )}

      <HUD />
    </header>
  );
}
