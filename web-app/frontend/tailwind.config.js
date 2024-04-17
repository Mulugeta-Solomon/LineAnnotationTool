/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        magenta: {
          DEFAULT: "#FF00FF",
          50: "#FFF2FF",
          100: "#FFE6FF",
          200: "#FFB3FF",
          300: "#FF80FF",
          400: "#FF4DFF",
          500: "#FF1AFF",
          600: "#E600E6",
          700: "#B300B3",
          800: "#800080",
          900: "#4D004D",
        },
      },
    },
  },
  plugins: [],
};
