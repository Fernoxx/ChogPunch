/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      keyframes: {
        sway: {
        },
        kick: {
        },
        punch: {
          "0%":   { transform: "scale(1)" },
        },
        push: {
          "0%":   { transform: "scale(1)" },
          "100%": { transform: "scale(1)" }
        }
      },
      animation: {
        sway:  "sway 2s ease-in-out infinite",
        kick:  "kick 0.5s ease-in-out
      }
    },
  },
}
