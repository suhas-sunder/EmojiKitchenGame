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
