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
        },
        push: {
        }
      },
      animation: {
        sway:  "sway 2s ease-in-out infinite",
        kick:  "kick 0.5s ease-in-out
      }
    },
  },
}
