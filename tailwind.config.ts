import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: "#0B0E16",
        porcelain: "#ECEEF3",
        azure: "#4571F4",
        vermilion: "#F06A45",
        ink: "#121212",
        snow: "#FAFAFA",
      },
      fontFamily: {
        display: ["var(--font-schibsted)", "system-ui", "sans-serif"],
        mono: ["var(--font-plex-mono)", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
