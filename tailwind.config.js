/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      keyframes: {
        punch: {
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
