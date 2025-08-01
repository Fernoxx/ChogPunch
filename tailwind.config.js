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
          "0%":   { transform: "rotate(0deg)" },
          "50%":  { transform: "rotate(-20deg) scale(1.1)" },
          "100%": { transform: "rotate(0deg)" }
        },
        punch: {
          "0%":   { transform: "scale(1)" },
          "50%":  { transform: "scale(1.2) translateX(10px)" },
          "100%": { transform: "scale(1)" }
        },
        push: {
          "0%":   { transform: "scale(1)" },
          "50%":  { transform: "scale(1.1) translateX(-10px)" },
          "100%": { transform: "scale(1)" }
        }
      },
      animation: {
        sway:  "sway 2s ease-in-out infinite",
        kick:  "kick 0.5s ease-in-out",
        punch: "punch 0.5s ease-in-out",
        push:  "push 0.5s ease-in-out"
      }
    },
  },
}
