/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Avenir Next", "Segoe UI", "Helvetica Neue", "Arial", "sans-serif"],
      },
      colors: {
        romano: {
          bg: "#070B0F",
          surface: "#111820",
          elevated: "rgba(255,255,255,0.06)",
          ink: "#F8FAFC",
          slate: "#A8B3C2",
          mist: "rgba(255,255,255,0.04)",
          line: "rgba(255,255,255,0.12)",
          navy: "#3EF2CF",
          mint: "rgba(62,242,207,0.12)",
          mintText: "#3EF2CF",
          amber: "rgba(255,212,90,0.14)",
          amberText: "#FFD45A",
          rose: "rgba(255,107,107,0.14)",
          roseText: "#FF8F8F",
        },
      },
      boxShadow: {
        soft: "0 32px 80px -42px rgba(0, 0, 0, 0.92), 0 0 0 1px rgba(255,255,255,0.03), 0 0 48px -36px rgba(62,242,207,0.28)",
        glow: "0 18px 50px -24px rgba(62,242,207,0.45)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      backgroundImage: {
        "romano-grid":
          "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
        "romano-primary":
          "linear-gradient(135deg, rgba(62,242,207,1) 0%, rgba(74,214,243,1) 100%)",
        "romano-gold":
          "linear-gradient(135deg, rgba(255,212,90,0.94) 0%, rgba(255,179,71,0.9) 100%)",
      },
    },
  },
  plugins: [],
};
