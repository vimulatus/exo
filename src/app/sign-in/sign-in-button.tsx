"use client";

import { useState } from "react";
import { signIn } from "@/lib/auth/client";

export function SignInButton({ next }: { next: string }) {
  const [pending, setPending] = useState(false);

  async function handleClick() {
    setPending(true);
    await signIn.social({
      provider: "google",
      callbackURL: next,
      errorCallbackURL: "/sign-in",
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className="group relative flex w-full items-center justify-center gap-3 border border-ink bg-ink px-6 py-4 font-mono text-sm uppercase tracking-[0.18em] text-paper transition-all hover:bg-vermilion-deep hover:border-vermilion-deep disabled:cursor-wait disabled:opacity-60"
    >
      <span className="flex h-5 w-5 items-center justify-center bg-paper text-ink transition-colors group-hover:text-vermilion-deep">
        <GoogleMark />
      </span>
      {pending ? "Connecting…" : "Continue with Google"}
    </button>
  );
}

function GoogleMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-3.5 w-3.5"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 11v2.8h3.9c-.16 1-1.18 2.93-3.9 2.93a4.5 4.5 0 1 1 0-9 4 4 0 0 1 2.83 1.1l1.93-1.86A7 7 0 1 0 12 19c4.04 0 6.7-2.84 6.7-6.84 0-.46-.05-.81-.11-1.16H12Z" />
    </svg>
  );
}
