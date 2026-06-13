/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/app/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ["Orbitron", "sans-serif"],
        rajdhani: ["Rajdhani", "sans-serif"],
      },
    },
  },
  plugins: [],
};
