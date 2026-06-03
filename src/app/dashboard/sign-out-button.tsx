"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { signOut } from "@/lib/auth/client";

export function SignOutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleClick() {
    setPending(true);
    await signOut();
    router.replace("/sign-in");
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className="border border-line px-4 py-2 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-ink-soft transition-colors hover:border-ink hover:text-ink disabled:opacity-60"
    >
      {pending ? "Signing out…" : "Sign out"}
    </button>
  );
}
