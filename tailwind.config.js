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
          "0%, 100%": { transform: "translateY(0)" },
          "50%":       { transform: "translateY(-5px)" }
        },
        kick: {
        },
        punch: {
          "0%":   { transform: "scale(1)" },
          "0%":   { transform: "scale(1)" },
        }
      },
      animation:
        push:  "push 0.5s ease-in-out"
      }
    },
  },
  plugins: [],
}
