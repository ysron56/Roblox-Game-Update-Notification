/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        roblox: {
          red: "#e2231a",
          dark: "#0f0f13",
          card: "#1a1a24",
          border: "#2a2a3a",
          hover: "#252535",
          accent: "#3b82f6",
          green: "#22c55e",
          yellow: "#eab308",
        },
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};
