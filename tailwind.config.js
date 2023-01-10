/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{html,ts}",
    "./src/components/**/*.{html,ts}",
    "./src/index.html",
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          900: "#16171A",
          800: "#1D1E21",
          700: "#25272B",
          600: "#393D42",
          500: "#6B7280",
          400: "#B6B8BD",
          300: "#CFD1D4",
          200: "#DADCDE",
          100: "#E3E4E6",
        },
        green: {
          900: "#161A0D",
          800: "#1C2111",
          700: "#252B16",
          600: "#384221",
          500: "#6C8040",
          400: "#A0BD5E",
          300: "#B4D46A",
          200: "#BCDE6F",
          100: "#C3E673",
        },
      },
    },
  },
  plugins: [],
};
