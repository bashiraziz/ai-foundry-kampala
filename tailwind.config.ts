import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "foundry-green":       "#166534",
        "foundry-green-light": "#15803d",
        "foundry-green-dark":  "#14532d",
        "amber-heat":          "#f59e0b",
        "amber-dark":          "#b45309",
        "amber-light":         "#fef3c7",
        "crown-red":           "#dc2626",
        "forge-night":         "#1c1c2e",
        "stone-grey":          "#6b7280",
        "bone-white":          "#f9fafb",
      },
      fontFamily: {
        sans: ["IBM Plex Sans", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
        display: ["Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
