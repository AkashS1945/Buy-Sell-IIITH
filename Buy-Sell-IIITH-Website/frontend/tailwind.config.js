/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary : "#1D4Ed8"
      }
    },
  },
  plugins: [],
  corePlugins: { //doesnt disturb any other css library
    preflight: false,
  },
}