"use client";

import { useEffect, useState } from "react";

interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface ContributionWeek {
  days: ContributionDay[];
}

interface GitHubContributionsProps {
  username: string;
  year?: number;
}

export default function GitHubContributions({
  username,
  year = new Date().getFullYear(),
}: GitHubContributionsProps) {
  const [weeks, setWeeks] = useState<ContributionWeek[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchContributions() {
      try {
        const response = await fetch(
          `https://github-contributions-api.jogruber.de/v4/${username}?y=${year}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch contributions");
        }

        const data = await response.json();

        // Transform the data into weeks
        const contributionWeeks: ContributionWeek[] = [];
        let currentWeek: ContributionDay[] = [];

        data.contributions.forEach((day: ContributionDay) => {
          currentWeek.push(day);

          if (currentWeek.length === 7) {
            contributionWeeks.push({ days: currentWeek });
            currentWeek = [];
          }
        });

        if (currentWeek.length > 0) {
          contributionWeeks.push({ days: currentWeek });
        }

        setWeeks(contributionWeeks);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchContributions();
  }, [username, year]);

  const profileUrl = `https://github.com/${username}`;
  const total = weeks.reduce(
    (sum, week) => sum + week.days.reduce((s, d) => s + d.count, 0),
    0,
  );

  // Same min-height in every state so the graph arriving doesn't shift
  // the page below it.
  const shell = "pixel-border min-h-[190px] bg-surface p-4";

  const header = (
    <div className="mb-3 flex items-baseline justify-between gap-4">
      <h2 className="font-pixel text-sm text-foreground">
        GitHub Activity {year}
      </h2>
      <a
        href={profileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="font-pixel text-[10px] text-muted transition-colors hover:text-accent"
      >
        @{username} ↗
      </a>
    </div>
  );

  if (loading || error) {
    return (
      <div className={shell}>
        {header}
        <p className="text-lg text-muted" role={error ? "status" : undefined}>
          {error ? (
            <>
              Couldn&apos;t load the contribution graph right now.{" "}
              <a
                href={profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline underline-offset-4"
              >
                See activity on GitHub
              </a>
              .
            </>
          ) : (
            "Loading contributions..."
          )}
        </p>
      </div>
    );
  }

  return (
    <div className={shell}>
      {header}

      <div className="overflow-x-auto">
        <div
          className="inline-flex gap-[2px]"
          role="img"
          aria-label={`${total} GitHub contributions in ${year}`}
        >
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-[2px]">
              {week.days.map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  className="contribution-cell"
                  data-level={day.level}
                  title={`${day.date}: ${day.count} contributions`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-end gap-2">
        <span className="font-pixel text-[10px] text-muted">Less</span>
        <div className="flex gap-[2px]">
          {[0, 1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className="contribution-cell"
              data-level={level}
            />
          ))}
        </div>
        <span className="font-pixel text-[10px] text-muted">More</span>
      </div>
    </div>
  );
}
