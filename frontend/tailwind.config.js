const {nextui} = require('@nextui-org/theme');
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/dashboard/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        bleuspat: "#1d71b8",
        redspat: "#e30613",
        greenspat: "#006633",
        blackspat: " #1d1d1b"
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};
