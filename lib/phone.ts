/**
 * Normalise a phone number to E.164 format where possible.
 * Ugandan numbers (07xx / 03xx / +2567xx) → +256xxxxxxxxx
 * Other numbers → strip spaces and dashes, keep as-is.
 */
export function normalisePhone(raw: string): string {
  const stripped = raw.replace(/[\s\-().]/g, "");

  // Already E.164 Uganda: +2567xxxxxxxx or +2563xxxxxxxx
  if (/^\+256[37]\d{8}$/.test(stripped)) return stripped;

  // Local Uganda format: 07xxxxxxxx or 03xxxxxxxx (10 digits)
  if (/^0[37]\d{8}$/.test(stripped)) return "+256" + stripped.slice(1);

  // International Uganda without +: 2567xxxxxxxx
  if (/^256[37]\d{8}$/.test(stripped)) return "+" + stripped;

  // Anything else — return stripped as-is (Kenya, Rwanda, diaspora, etc.)
  return stripped;
}
