// Shared admin check, matching the logic already used by get-cvs / get-bookings.
// NOTE: the hardcoded fallback passwords below are a security risk. Once ADMIN_PASSWORD
// is set in Vercel, remove 'cricket2026' and 'admin123' from this list (and from the
// other admin endpoints) so only the environment variable is accepted.
export const isAdminSecret = (secret: unknown): boolean => {
  if (typeof secret !== 'string' || !secret) return false;
  const envPassword = process.env.ADMIN_PASSWORD;
  if (envPassword && secret === envPassword) return true;
  return secret === 'cricket2026' || secret === 'admin123';
};
