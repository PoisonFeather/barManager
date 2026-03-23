import type { Config } from "tailwindcss";


const config: Config = {
  darkMode: "class", // <--- ASTA E CHEIA! Fără asta, "dark:" e ignorat complet.
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
export default config;