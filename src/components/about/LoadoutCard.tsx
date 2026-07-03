import clsx from "clsx";

import { LOADOUT, type Rarity } from "@/lib/about";

const RARITY_STYLES: Record<Rarity, { label: string; text: string }> = {
  legendary: { label: "LEGENDARY", text: "text-highlight" },
  epic: { label: "EPIC", text: "text-accent" },
  rare: { label: "RARE", text: "text-accent-alt" },
};

export default function LoadoutCard() {
  return (
    <div className="mt-24">
      <p className="font-pixel text-[10px] text-accent-alt">INVENTORY</p>
      <h2 className="mt-3 font-pixel text-lg text-highlight">EQUIPPED GEAR</h2>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {LOADOUT.map((item) => {
          const rarity = RARITY_STYLES[item.rarity];
          return (
            <article
              key={item.slot}
              className="pixel-border group bg-surface p-5 transition-transform motion-safe:hover:-translate-y-1"
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-pixel text-[10px] text-muted">
                  {item.slot}
                </span>
                <span
                  className={clsx(
                    "font-pixel text-[10px]",
                    rarity.text,
                    "motion-safe:group-hover:animate-pulse",
                  )}
                >
                  {rarity.label}
                </span>
              </div>
              <h3 className={clsx("mt-4 font-mono text-xl", rarity.text)}>
                {item.item}
              </h3>
              <p className="mt-3 text-lg leading-snug text-muted">
                {item.flavor}
              </p>
            </article>
          );
        })}
      </div>
    </div>
  );
}
