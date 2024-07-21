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
      // prettier-ignore
      fontFamily: {
        'nunito': ['"Nunito"', 'sans-serif'],
        'overlock': ['"Overlock"', 'sans-serif'],
        'roboto': ['"Roboto Serif"', 'serif'],
        'lato': ['"Lato"', 'sans-serif'],
        'karla': ['"Karla"', 'sans-serif'],
        'lora': ['"Lora"', 'serif']
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
  plugins: [],
} satisfies Config;
