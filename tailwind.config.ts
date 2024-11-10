import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      primary: "#FF6F3C",
      secondary: "#028090",
      accent: "#FFD166",
      neutral: "#EDEDED",
      text: "333333",
    },
    extend: {},
  },
  plugins: [],
} satisfies Config;
