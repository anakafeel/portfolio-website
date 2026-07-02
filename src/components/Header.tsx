"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

import { NAV_LINKS, SITE } from "@/lib/site";

function isActiveRoute(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="border-b-2 border-border bg-surface">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <Link
          href="/"
          className="font-pixel text-sm text-highlight transition-colors hover:text-accent"
        >
          {SITE.handle.toUpperCase()}
        </Link>
        <nav aria-label="Level select">
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {NAV_LINKS.map((link, index) => {
              const active = isActiveRoute(pathname, link.href);
              return (
                <li key={link.href} className="group">
                  <Link
                    href={link.href}
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
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
