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
          bg: "var(--flowlo-bg)",
          surface: "var(--flowlo-bg-subtle)",
          elevated: "var(--flowlo-surface-muted)",
          ink: "var(--flowlo-text)",
          slate: "var(--flowlo-text-muted)",
          mist: "var(--flowlo-surface-muted)",
          line: "var(--flowlo-border)",
          navy: "var(--flowlo-mint)",
          mint: "var(--flowlo-success-bg)",
          mintText: "var(--flowlo-success)",
          amber: "var(--flowlo-warning-bg)",
          amberText: "var(--flowlo-warning)",
          rose: "var(--flowlo-danger-bg)",
          roseText: "var(--flowlo-danger)",
        },
      },
      boxShadow: {
        soft: "var(--flowlo-shadow-card)",
        glow: "0 18px 50px -24px rgba(0, 196, 154, 0.45)",
      },
      borderRadius: {
        "4xl": "var(--flowlo-radius-2xl)",
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
