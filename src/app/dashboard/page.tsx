import { requireDesigner } from "@/lib/auth/dal";
import { SignOutButton } from "./sign-out-button";

export default async function DashboardPage() {
  const designer = await requireDesigner();

  return (
    <div className="grain flex flex-1 flex-col">
      <header className="flex items-center justify-between border-b border-line bg-paper-raised px-8 py-5">
        <div className="flex items-baseline gap-3">
          <span className="font-display text-2xl tracking-tight">Exo</span>
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.22em] text-ink-soft">
            Designer
          </span>
        </div>
        <SignOutButton />
      </header>

      <main className="mx-auto w-full max-w-3xl px-8 py-16">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-vermilion-deep">
          Signed in
        </p>
        <h1 className="mt-3 font-display text-5xl leading-[1.02] tracking-tight">
          Welcome, {designer.name?.split(" ")[0] || "Designer"}.
        </h1>

        <dl className="mt-12 grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-2">
          <Field label="Name" value={designer.name} />
          <Field label="Email" value={designer.email} />
          <Field label="Designer ID" value={designer.id} mono />
          <Field
            label="Provisioned"
            value={new Date(designer.createdAt).toLocaleDateString()}
          />
        </dl>

        <p className="mt-12 max-w-prose text-sm leading-relaxed text-ink-soft">
          This is your authenticated workspace. Experiment authoring, variant
          generation, and results land here as the platform comes online.
        </p>
      </main>
    </div>
  );
}

function Field({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="bg-paper-raised px-6 py-5">
      <dt className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ink-soft">
        {label}
      </dt>
      <dd
        className={`mt-2 break-words text-ink ${mono ? "font-mono text-xs" : "text-base"}`}
      >
        {value}
      </dd>
    </div>
  );
}
