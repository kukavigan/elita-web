/** Extract a single string from req.params or req.query (which can be string | string[]) */
export function param(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? '';
  return value ?? '';
}

/** Parse a positive integer from a query param */
export function intParam(value: string | string[] | undefined, fallback = 0): number {
  const n = parseInt(param(value), 10);
  return isNaN(n) ? fallback : n;
}

/** Generate a URL-friendly slug from a string */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[äáâàã]/g, 'a')
    .replace(/[ëéêè]/g, 'e')
    .replace(/[ç]/g, 'c')
    .replace(/ë/g, 'e')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}
