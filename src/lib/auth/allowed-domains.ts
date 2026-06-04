export function parseAllowedDomains(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((d) => d.trim().toLowerCase().replace(/^@/, ""))
    .filter((d) => d.length > 0);
}

export function isAllowedEmail(
  email: string | undefined | null,
  allowedDomains: string[] = parseAllowedDomains(
    process.env.AUTH_ALLOWED_EMAIL_DOMAINS,
  ),
): boolean {
  if (!email) return false;
  if (allowedDomains.length === 0) return false;
  const at = email.lastIndexOf("@");
  if (at === -1) return false;
  const domain = email.slice(at + 1).toLowerCase();
  return allowedDomains.includes(domain);
}
