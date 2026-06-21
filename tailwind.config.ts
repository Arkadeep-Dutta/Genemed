import typography from "@tailwindcss/typography";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Reserved palette for clinical-tool tone: calm, neutral, no
        // "alarm red" associations that could imply diagnostic severity.
        brand: {
          50: "#f0f5fb",
          100: "#dbe7f5",
          500: "#2f6690",
          600: "#26516f",
          700: "#1d3d55",
        },
        warning: {
          50: "#fff8e6",
          100: "#ffedb3",
          500: "#b8860b",
          700: "#7a5a07",
        },
      },
    },
  },
  // Used by the long-form documentation pages (about, methodology,
  // data-sources, privacy, disclaimer) via the `prose` class.
  plugins: [typography],
};

export default config;
