import { describe, expect, it } from "bun:test";
import { isAllowedEmail, parseAllowedDomains } from "./allowed-domains";

describe("parseAllowedDomains", () => {
  it("returns empty array for undefined or empty", () => {
    expect(parseAllowedDomains(undefined)).toEqual([]);
    expect(parseAllowedDomains("")).toEqual([]);
    expect(parseAllowedDomains("  ,  ")).toEqual([]);
  });

  it("splits, trims, lowercases, and strips leading @", () => {
    expect(parseAllowedDomains("Acme.com, @Acme.io ,  beta.dev")).toEqual([
      "acme.com",
      "acme.io",
      "beta.dev",
    ]);
  });
});

describe("isAllowedEmail", () => {
  const allowed = ["acme.com", "acme.io"];

  it("rejects when no domains configured", () => {
    expect(isAllowedEmail("a@acme.com", [])).toBe(false);
  });

  it("rejects empty or malformed emails", () => {
    expect(isAllowedEmail(undefined, allowed)).toBe(false);
    expect(isAllowedEmail(null, allowed)).toBe(false);
    expect(isAllowedEmail("no-at-sign", allowed)).toBe(false);
  });

  it("accepts allowlisted domains case-insensitively", () => {
    expect(isAllowedEmail("dev@acme.com", allowed)).toBe(true);
    expect(isAllowedEmail("Dev@ACME.IO", allowed)).toBe(true);
  });

  it("rejects domains not on the allowlist", () => {
    expect(isAllowedEmail("dev@evil.com", allowed)).toBe(false);
  });

  it("matches only the final domain, not subdomain spoofs", () => {
    expect(isAllowedEmail("dev@acme.com.evil.com", allowed)).toBe(false);
    expect(isAllowedEmail("a@b@acme.com", allowed)).toBe(true);
  });
});
