/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx,html}", "./public/index.html"],
  theme: {
    extend: {
      gridTemplateAreas: {
        layout: ["top-bar top-bar", "nav-bar main-view", "now-playing now-playing"],
      },
      gridTemplateColumns: {
        layout: "auto 1fr",
      },
      gridTemplateRows: {
        layout: "auto 1fr auto",
      },
      minWidth: {
        56: "14rem",
        "2/5": "40%",
        "1/2": "50%",
        "1/4": "25%",
        "1/3": "33.333333%",
      },

      animationDelay: {
        50: "50ms",
        75: "75ms",
        100: "100ms",
        250: "250ms",
        500: "500ms",
        750: "750ms",
        1000: "1000ms",
      },

      height: {
        "5/4": "125%",
        "9/4": "225%",
        "13/4": "325%",
      },
      width: {
        "5/4": "125%",
        "9/4": "225%",
        "13/4": "325%",
      },
      keyframes: {
        "zoom-in-check-circle": {
          "0%": {
            transform: "scale(0)",
          },
          "25%": {
            transform: "scale(0.3)",
          },
          "50%": {
            transform: "scale(0.8)",
          },
          "100%": {
            transform: "scale(1)",
          },
        },
        "zoom-in-check-square": {
          "0%": {
            transform: "scale(0) rotate(0deg)",
          },
          "25%": {
            transform: "scale(0.3) rotate(30deg)",
          },
          "50%": {
            transform: "scale(0.8) rotate(45deg)",
          },
          "100%": {
            transform: "scale(1) rotate(45deg)",
          },
        },
      },
      animation: {
        imageFadeInAnimation: "imageFadeInAnimation .25s ease",
        "zoom-in-check-circle": "zoom-in-check-circle 0.3s 1",
        "zoom-in-check-square": "zoom-in-check-square 0.3s 1",
      },

      spacing: {
        "1/8": "12.5%",
        2.5: "0.625rem",
        "1/2": "50%",
      },
      dropShadow: {
        dark: ["0 1px 2px rgb(255 255 255 / 0.1)", "0 1px 1px rgb(255 255 255 / 0.06)"],
        "dark-lg": ["0 10px 8px rgb(255 255 255 / 0.04)", "0 4px 3px rgb(255 255 255 / 0.1)"],
        "2xl-dark": "0 25px 25px rgb(255 255 255 / 0.5)",
      },
      colors: {
        gray: {
          950: "#0C0D0E",
          940: "#0E0F10",
          930: "#101213",
          920: "#111315",
          910: "#131517",
          900: "#15181A",
          890: "#17191C",
          880: "#181C1F",
          870: "#1C1E21",
          860: "#1E2124",
          850: "#212426",
          800: "#2B2F33",
          750: "#363B40",
          700: "#41474D",
          650: "#4C5359",
          600: "#575F66",
          550: "#626B73",
          500: "#6C7680",
          450: "#79838D",
          400: "#879099",
          350: "#959DA6",
          300: "#A3ABB3",
          250: "#B2B9C0",
          240: "#B5BCC3",
          230: "#B8BFC5",
          220: "#BBC1C8",
          210: "#BEC4CA",
          200: "#C1C7CD",
          190: "#C4CACF",
          180: "#C7CDD2",
          170: "#CACFD4",
          160: "#CDD2D7",
          150: "#D0D5D9",
          140: "#D3D8DC",
          130: "#D7DADE",
          120: "#DADDE1",
          110: "#DDE0E3",
          100: "#E0E3E6",
          90: "#E4E6E9",
          80: "#E7E9EB",
          70: "#EAECEE",
          60: "#EEEFF0",
          50: "#F1F2F3",
        },
        green: {
          950: "#04150a",
          900: "#082b14",
          850: "#0d401f",
          800: "#115529",
          750: "#156a33",
          700: "#19803d",
          650: "#1d9547",
          600: "#22aa51",
          550: "#26c05c",
          500: "#2ad566",
          450: "#3fd975",
          400: "#55dd84",
          350: "#6ae294",
          300: "#7fe6a3",
          250: "#95eab2",
          200: "#aaeec2",
          150: "#bff2d1",
          100: "#d4f7e0",
          50: "#eafbf0",
        },
        blue: {
          950: "#070a12",
          900: "#0e1425",
          850: "#151d37",
          800: "#1d2749",
          750: "#24315c",
          700: "#2b3b6e",
          650: "#324481",
          600: "#394e93",
          550: "#4058a5",
          500: "#4762b8",
          450: "#5a71bf",
          400: "#6c81c6",
          350: "#7e91cd",
          300: "#91a1d4",
          250: "#a3b0db",
          200: "#b6c0e2",
          150: "#c8d0ea",
          100: "#dae0f1",
          50: "#edeff8",
        },
      },
    },
  },
  plugins: [
    require("@savvywombat/tailwindcss-grid-areas"),
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          "animation-delay": (value) => ({
            "animation-delay": value,
          }),
        },
        {
          values: theme("animationDelay"),
        }
      );
    }),
  ],
};
