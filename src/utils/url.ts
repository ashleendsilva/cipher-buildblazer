/**
 * Normalizes user-input URLs to ensure they open external websites properly
 * without relative routing bugs or HTML5 protocol validation errors.
 */
export const normalizeUrl = (rawUrl?: string): string => {
  if (!rawUrl) return '';
  const trimmed = rawUrl.trim();
  if (!trimmed) return '';
  
  // If it already has http://, https://, or is an anchor / relative path
  if (/^(https?:\/\/|mailto:|tel:|\/|#)/i.test(trimmed)) {
    return trimmed;
  }
  
  // If user entered e.g. "github.com" or "www.sjec.ac.in"
  return `https://${trimmed}`;
};
