/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        kick: {
          "0%": { transform: "rotate(0deg) translateY(0)" },
          "30%": { transform: "rotate(-30deg) translateY(-20px)" },
          "60%": { transform: "rotate(0deg) translateY(0)" },
          "100%": { transform: "rotate(0deg)" },
        },
        punch: {
          "0%": { transform: "translateX(0)" },
          "40%": { transform: "translateX(25px)" },
          "70%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(0)" },
        },
        push: {
          "0%": { transform: "scale(1) translateX(0)" },
          "30%": { transform: "scale(1.05) translateX(10px)" },
          "60%": { transform: "scale(1) translateX(0)" },
          "100%": { transform: "scale(1)" },
        },
        sway: {
          "0%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(-5px)" },
          "100%": { transform: "translateX(0)" },
        },
      },
      animation: {
        "kick": "kick 0.5s ease-in-out",
        "punch": "punch 0.3s ease-in-out",
        "push": "push 0.4s ease-in-out",
        "sway": "sway 1s ease-in-out",
      },
    },
  },
  plugins: [],
}