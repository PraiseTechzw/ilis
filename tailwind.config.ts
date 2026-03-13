import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "#0A0A0E", // Deep Space Base
        surface: "#12121A", // Elevated Panel
        signal: {
          healthy: "#00E676", // TRL Growth
          alert: "#FFC107", // Nudge/Warning
          stagnant: "#FF1744", // Kill Risk
          intel: "#00B0FF", // AI Recommendation
        },
        ring: "#00B0FF", // Intelligence Ring
        text: {
          primary: "#FFFFFF",
          muted: "#8F929F",
          dim: "#4A4D59",
        }
      },
      fontFamily: {
        interface: ["var(--font-inter)", "sans-serif"],
        data: ["var(--font-jetbrains-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
