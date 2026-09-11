/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        roblox: {
          red: "#e2231a",
          dark: "#181818",
          card: "#232323",
          border: "#2f2f2f",
          hover: "#2a2a2a",
          accent: "#5865f2",
          green: "#23a55a",
          yellow: "#f0b232",
        },
      },
    },
  },
  plugins: [],
};
