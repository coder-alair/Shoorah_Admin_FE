/** @type {import('tailwindcss').Config} */
const tailwindOverwrites = require("./src/utils/tailwind-overwrites.json");

module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: tailwindOverwrites,
  },
  plugins: [],
};
