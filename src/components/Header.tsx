import Link from "next/link";

import { NAV_LINKS, SITE } from "@/lib/site";

export default function Header() {
  return (
    <header className="border-b-2 border-border bg-surface">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <Link
          href="/"
          className="font-pixel text-sm text-highlight transition-colors hover:text-accent"
        >
          {SITE.handle.toUpperCase()}
        </Link>
        <nav aria-label="Main navigation">
          <ul className="flex flex-wrap items-center gap-6">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="font-pixel text-xs text-foreground transition-colors hover:text-accent focus-visible:text-accent"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
