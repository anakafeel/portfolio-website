import Image from "next/image";
import clsx from "clsx";

import { EXPERIENCE, type ExperienceEntry } from "@/lib/about";

const STATUS_STYLES: Record<
  ExperienceEntry["status"],
  { label: string; text: string }
> = {
  active: { label: "▶ IN PROGRESS", text: "text-accent" },
  cleared: { label: "✓ CLEARED", text: "text-muted" },
};

export default function ExperienceLog() {
  return (
    <div className="mt-24">
      <p className="font-pixel text-[10px] text-accent-alt">QUEST LOG</p>
      <h2 className="mt-3 font-pixel text-lg text-highlight">MAIN QUESTS</h2>
      <ol className="mt-8 flex flex-col gap-6">
        {EXPERIENCE.map((entry) => {
          const status = STATUS_STYLES[entry.status];
          return (
            <li key={`${entry.org}-${entry.period}`}>
              <article className="pixel-border group bg-surface p-5 transition-transform motion-safe:hover:-translate-x-1">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="font-pixel text-[10px] text-muted">
                    {entry.period}
                  </span>
                  <span
                    className={clsx(
                      "font-pixel text-[10px]",
                      status.text,
                      entry.status === "active" &&
                        "motion-safe:group-hover:animate-pulse",
                    )}
                  >
                    {status.label}
                  </span>
                </div>
                <div className="mt-4 flex items-start gap-3">
                  {entry.logo && (
                    <div className="relative h-12 w-12 shrink-0 border-2 border-border bg-background p-1">
                      <Image
                        src={entry.logo.src}
                        alt={entry.logo.alt}
                        fill
                        unoptimized
                        sizes="48px"
                        className="object-contain p-0.5"
                      />
                    </div>
                  )}
                  <div className="min-w-0">
                    <h3 className="font-pixel text-sm leading-relaxed text-foreground">
                      {entry.org}
                    </h3>
                    <p className="mt-1 font-pixel text-[10px] text-accent-alt">
                      {entry.role}
                    </p>
                  </div>
                </div>
                <ul className="mt-3 flex flex-col gap-2">
                  {entry.highlights.map((highlight) => (
                    <li
                      key={highlight}
                      className="text-lg leading-snug text-muted"
                    >
                      ◆ {highlight}
                    </li>
                  ))}
                </ul>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {entry.tech.map((tech) => (
                    <li
                      key={tech}
                      className="border border-border px-1.5 py-0.5 font-pixel text-[10px] text-muted"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </article>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
