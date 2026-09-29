import { EDUCATION, SKILLS } from "@/lib/about";

/**
 * Plain education + skills block for /about. Server-rendered, no motion,
 * so the facts a recruiter scans for are in the HTML on every browser.
 */
export default function CharacterSheet() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <section
        aria-labelledby="education-heading"
        className="pixel-border bg-surface p-5"
      >
        <p className="font-pixel text-[10px] text-accent-alt">SPAWN POINT</p>
        <h2
          id="education-heading"
          className="mt-3 font-pixel text-lg text-highlight"
        >
          EDUCATION
        </h2>
        <h3 className="mt-5 font-pixel text-sm leading-relaxed text-foreground">
          {EDUCATION.school}
        </h3>
        <p className="mt-2 text-lg leading-snug text-foreground">
          {EDUCATION.degree}
        </p>
        <p className="mt-1 text-lg leading-snug text-muted">
          {EDUCATION.standing} · {EDUCATION.graduation} · {EDUCATION.location}
        </p>
        <p className="mt-4 font-pixel text-[10px] text-accent-alt">
          COURSEWORK
        </p>
        <ul className="mt-2 flex flex-wrap gap-2">
          {EDUCATION.coursework.map((course) => (
            <li
              key={course}
              className="border border-border px-1.5 py-0.5 text-base text-muted"
            >
              {course}
            </li>
          ))}
        </ul>
      </section>

      <section
        aria-labelledby="skills-heading"
        className="pixel-border bg-surface p-5"
      >
        <p className="font-pixel text-[10px] text-accent-alt">SKILL TREE</p>
        <h2
          id="skills-heading"
          className="mt-3 font-pixel text-lg text-highlight"
        >
          SKILLS
        </h2>
        <dl className="mt-5 flex flex-col gap-4">
          {SKILLS.map(({ label, items }) => (
            <div key={label}>
              <dt className="font-pixel text-[10px] text-foreground">
                {label.toUpperCase()}
              </dt>
              <dd className="mt-2">
                <ul className="flex flex-wrap gap-2">
                  {items.map((item) => (
                    <li
                      key={item}
                      className="border border-border px-1.5 py-0.5 text-base text-muted"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
