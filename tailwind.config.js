/** @type {import('tailwindcss').Config} */
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
      animation: {
        imageFadeInAnimation: "imageFadeInAnimation .25s ease",
      },

      spacing: {
        "1/8": "12.5%",
        2.5: "0.625rem",
      },
      dropShadow: {
        dark: ["0 1px 2px rgb(255 255 255 / 0.1)", "0 1px 1px rgb(255 255 255 / 0.06)"],
        "dark-lg": ["0 10px 8px rgb(255 255 255 / 0.04)", "0 4px 3px rgb(255 255 255 / 0.1)"],
        "2xl-dark": "0 25px 25px rgb(255 255 255 / 0.5)",
      },
      colors: {
        gray: {
          900: "#16171A",
          850: "#181A1C",
          800: "#1D1F21",
          750: "#202124",
          700: "#27292B",
          650: "#303236",
          600: "#3C3F42",
          550: "#54575C",
          500: "#767A80",
          450: "#989CA3",
          400: "#B1B6BD",
          350: "#BFC3C9",
          300: "#CACED4",
          250: "#D3D6DB",
          200: "#D7DADE",
          150: "#DDE0E3",
          100: "#E2E3E6",
          50: "#E6E7E8",
        },
        green: {
          900: "#031A0B",
          850: "#031C0C",
          800: "#04210E",
          750: "#052410",
          700: "#062B13",
          650: "#093618",
          600: "#0B421F",
          550: "#115C2B",
          500: "#19803D",
          450: "#22A34F",
          400: "#29BD5D",
          350: "#2EC965",
          300: "#33D46B",
          250: "#37DB71",
          200: "#3BDE74",
          150: "#3FE378",
          100: "#42E67B",
          50: "#46E87E",
        },
      },
    },
  },
  plugins: [require("@savvywombat/tailwindcss-grid-areas")],
};
