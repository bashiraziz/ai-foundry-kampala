import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // ── Design system v2 (Claude Design handoff) ──
        "cream":         "#F4ECDD",
        "cream-2":       "#EBE0CD",
        "ink":           "#1A1410",
        "ink-2":         "#221A13",
        "line-lt":       "#DCCFB8",
        "line-dk":       "#382A1E",
        "muted-lt":      "#6A5F4D",
        "muted-dk":      "#B3A488",
        "clay":          "#D8542B",
        "clay-deep":     "#B5421E",
        "forest":        "#1F5E45",
        "marigold":      "#F2B23E",
        "plum":          "#6B3A52",
        "kampala-green": "#23CB87",
        // ── Legacy tokens (app UI) ──
        "foundry-green":       "#166534",
        "foundry-green-light": "#15803d",
        "foundry-green-dark":  "#14532d",
        "amber-heat":          "#f59e0b",
        "forge-night":         "#1c1c2e",
        "forge-deep":          "#0f1117",
        "stone-grey":          "#6b7280",
        "bone-white":          "#f9fafb",
      },
      fontFamily: {
        sans:        ["IBM Plex Sans", "sans-serif"],
        mono:        ["IBM Plex Mono", "monospace"],
        display:     ["Georgia", "serif"],
        bricolage:   ['"Bricolage Grotesque"', "sans-serif"],
        archivo:     ["Archivo", "sans-serif"],
        "space-mono": ['"Space Mono"', "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
