const {
  iconsPlugin,
  getIconCollections,
} = require("@egoist/tailwindcss-icons")

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      sm: "500px",
      md: "846px",
      lg: "976px",
      xl: "1440px",
    },
    extend: {
      keyframes: {
        bounce: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
      },
      animation: {
        bounce: "bounce 1s infinite",
      },
    },
  },
  plugins: [
    iconsPlugin({
      collections: getIconCollections(["tabler", "lucide"]),
    }),
  ],
}
