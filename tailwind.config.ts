import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f2f7f5",
          100: "#dcece5",
          200: "#b8d9cc",
          300: "#8fc1ac",
          400: "#5fa287",
          500: "#3d846b",
          600: "#2c6a55",
          700: "#245546",
          800: "#1e4438",
          900: "#19392f",
        },
      },
      borderRadius: {
        xl: "0.85rem",
      },
    },
  },
  plugins: [],
};

export default config;
