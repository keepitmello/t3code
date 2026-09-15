/**
 * Which provider glyph a row shows.
 *
 * A driver we ship a glyph for keeps that glyph, so an instance always reads
 * as its own harness. Rows coming from a driver we do not recognize fall back
 * to the vendor named by the model slug, and show nothing when that vendor is
 * unknown as well.
 */
export type ProviderGlyph = "antigravity" | "claude" | "codex" | "cursor" | "grok" | "opencode";

const GLYPH_BY_DRIVER: Record<string, ProviderGlyph> = {
  antigravity: "antigravity",
  claudeagent: "claude",
  codex: "codex",
  cursor: "cursor",
  grok: "grok",
  opencode: "opencode",
};

const GLYPH_BY_VENDOR: Record<string, ProviderGlyph> = {
  anthropic: "claude",
  cursor: "cursor",
  "google-antigravity": "antigravity",
  openai: "codex",
  "openai-codex": "codex",
  opencode: "opencode",
  xai: "grok",
};

const normalize = (value: string | null | undefined): string => value?.trim().toLowerCase() ?? "";

export function resolveProviderGlyph(input: {
  readonly driver?: string | null | undefined;
  readonly modelSlug?: string | null | undefined;
}): ProviderGlyph | null {
  const driverGlyph = GLYPH_BY_DRIVER[normalize(input.driver)];
  if (driverGlyph) {
    return driverGlyph;
  }

  const slug = normalize(input.modelSlug);
  const separator = slug.indexOf("/");
  return GLYPH_BY_VENDOR[separator > 0 ? slug.slice(0, separator) : ""] ?? null;
}
