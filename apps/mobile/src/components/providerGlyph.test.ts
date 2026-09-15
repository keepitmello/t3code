import { describe, expect, it } from "vite-plus/test";

import { resolveProviderGlyph } from "./providerGlyph";

describe("provider glyph", () => {
  it("keeps the driver glyph when we ship one for that driver", () => {
    expect(
      resolveProviderGlyph({ driver: "opencode", modelSlug: "anthropic/claude-sonnet-4-5" }),
    ).toBe("opencode");
    expect(resolveProviderGlyph({ driver: "claudeAgent" })).toBe("claude");
    expect(resolveProviderGlyph({ driver: "codex" })).toBe("codex");
  });

  it("names the model vendor for a driver we do not know", () => {
    expect(resolveProviderGlyph({ driver: "acme-harness", modelSlug: "xai/grok-4.6" })).toBe(
      "grok",
    );
    expect(
      resolveProviderGlyph({ driver: "acme-harness", modelSlug: "anthropic/claude-sonnet-4-5" }),
    ).toBe("claude");
  });

  it("shows nothing rather than guessing a vendor", () => {
    expect(
      resolveProviderGlyph({ driver: "acme-harness", modelSlug: "mystery/model-1" }),
    ).toBeNull();
    expect(resolveProviderGlyph({ driver: "acme-harness" })).toBeNull();
    expect(resolveProviderGlyph({})).toBeNull();
  });
});
