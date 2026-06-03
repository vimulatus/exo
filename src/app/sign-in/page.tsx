import { redirect } from "next/navigation";
import { getDesigner } from "@/lib/auth/dal";
import { SignInButton } from "./sign-in-button";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const designer = await getDesigner();
  if (designer) redirect("/dashboard");

  const { next, error } = await searchParams;
  const target = next?.startsWith("/") ? next : "/dashboard";

  return (
    <div className="grain flex flex-1 items-center justify-center px-6 py-16">
      <main className="w-full max-w-md border border-line bg-paper-raised shadow-[8px_8px_0_0_var(--color-ink)]">
        <div className="flex items-center justify-between border-b border-line px-7 py-4 font-mono text-[0.7rem] uppercase tracking-[0.22em] text-ink-soft">
          <span>Exo</span>
          <span>Designer access</span>
        </div>

        <div className="px-7 py-10">
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-vermilion-deep">
            Sign in
          </p>
          <h1 className="mt-3 font-display text-4xl leading-[1.05] tracking-tight">
            Step into the lab.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-ink-soft">
            Exo is invite-only. Sign in with your approved workspace account —
            there is no public signup. First sign-in provisions your Designer
            profile.
          </p>

          {error ? (
            <div className="mt-6 border-l-2 border-vermilion bg-vermilion/5 px-4 py-3 text-sm text-vermilion-deep">
              Access denied. Your account isn&apos;t on the allowlist for this
              workspace.
            </div>
          ) : null}

          <div className="mt-8">
            <SignInButton next={target} />
          </div>
        </div>

        <div className="border-t border-line px-7 py-4 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ink-soft">
          Restricted to allowlisted email domains
        </div>
      </main>
    </div>
  );
}
