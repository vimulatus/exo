import Link from "next/link";

export default function Home() {
  return (
    <div className="grain flex flex-1 flex-col">
      <header className="flex items-center justify-between px-8 py-6">
        <span className="font-display text-2xl tracking-tight">Exo</span>
        <Link
          href="/sign-in"
          className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-ink-soft transition-colors hover:text-vermilion-deep"
        >
          Sign in →
        </Link>
      </header>

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center px-8 py-20">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.24em] text-vermilion-deep">
          Usability experiments, measured
        </p>
        <h1 className="mt-5 max-w-3xl font-display text-6xl leading-[0.98] tracking-tight sm:text-7xl">
          Compare UI approaches the way a lab compares samples.
        </h1>
        <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink-soft">
          Define an experiment, let the agent generate component variants, and
          watch real people complete scenarios while Exo records scores, timing,
          and sessions.
        </p>

        <div className="mt-10">
          <Link
            href="/sign-in"
            className="inline-flex items-center gap-3 border border-ink bg-ink px-7 py-4 font-mono text-sm uppercase tracking-[0.18em] text-paper transition-colors hover:border-vermilion-deep hover:bg-vermilion-deep"
          >
            Enter the lab
          </Link>
        </div>
      </main>
    </div>
  );
}
