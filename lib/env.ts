export type EnvSource = Record<string, string | undefined> | undefined;

/**
 * Read environment variable from Next.js process.env or Cloudflare context.env
 * Works with both Next.js (process.env) and Cloudflare Pages Functions (context.env)
 */
export function readEnv(source: EnvSource, key: string): string | undefined {
  // If source is provided and has the key (Cloudflare context.env), use it
  if (source && typeof source === 'object' && key in source) {
    const value = source[key];
    // Only use it if it's not undefined (empty object check)
    if (value !== undefined) {
      return value;
    }
  }
  // Otherwise, fall back to Next.js process.env
  return process.env[key];
}

export function envFlag(source: EnvSource, key: string): boolean {
  const value = readEnv(source, key);
  if (!value) return false;
  return value === "1" || value.toLowerCase() === "true";
}
