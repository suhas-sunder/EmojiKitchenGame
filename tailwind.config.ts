import type { Config } from "tailwindcss";

export default {
  mode: "jit",
  content: [
    "./index.html",
    "./app/**/*.{js,ts,jsx,tsx,}",
    "assets/fonts/.**.ttf",
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        // Simple 16 column grid
        "24": "repeat(24, minmax(0, 1fr))",
        "20": "repeat(20, minmax(0, 1fr))",
        "16": "repeat(16, minmax(0, 1fr))",
        "15": "repeat(15, minmax(0, 1fr))",
        "18": "repeat(18, minmax(0, 1fr))",
      },
      gridColumn: {
        // Custom column spans
        "span-16": "span 16 / span 16",
        "span-20": "span 20 / span 20",
        "span-24": "span 24 / span 24",
        "span-15": "span 15 / span 15",
        "span-18": "span 18 / span 18",
      },
      // prettier-ignore
      fontFamily: {
        'nunito': ['"Nunito"', 'sans-serif'],
        'overlock': ['"Overlock"', 'sans-serif'],
        'roboto': ['"Roboto Serif"', 'serif'],
        'lato': ['"Lato"', 'sans-serif'],
        'karla': ['"Karla"', 'sans-serif'],
        'lora': ['"Lora"', 'serif'],
      },
      colors: {
        defaultblue: "#09427d",
        defaultgreen: "#79fac5",
        "default-light-sky-blue": "rgb(73, 160, 214)",
        "default-sky-blue": "#2b6ab3",
        "start-btn-green": "#4db538",
      },
    },
  },
  plugins: [
    // ...
    require("tailwind-scrollbar"),
  ],
} satisfies Config;
