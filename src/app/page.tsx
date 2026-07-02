export default function Home() {
  return (
    <section className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-4 py-24 text-center">
      <p className="font-pixel text-xs text-accent-alt">PLAYER 1</p>
      <h1 className="font-pixel text-2xl text-highlight sm:text-4xl">
        SAIM HASHMI
      </h1>
      <p className="max-w-xl text-2xl text-muted">
        Software engineer. This world is under construction — new zones unlock
        with every phase.
      </p>
      <p className="pixel-border animate-pulse bg-surface px-6 py-3 font-pixel text-xs text-foreground">
        PRESS START
      </p>
    </section>
  );
}
