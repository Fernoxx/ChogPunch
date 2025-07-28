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
        "sway-bag": {
          "0%, 100%": { transform: "rotate(0deg) translateY(0px)" },
          "50%":       { transform: "rotate(2deg) translateY(-3px)" }
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
        },
        "punch-impact": {
          "0%":   { transform: "rotate(0deg)" },
          "25%":  { transform: "rotate(15deg) translateX(20px)" },
          "50%":  { transform: "rotate(8deg) translateX(10px)" },
          "100%": { transform: "rotate(0deg)" }
        },
        "kick-impact": {
          "0%":   { transform: "rotate(0deg)" },
          "25%":  { transform: "rotate(-25deg) translateY(10px)" },
          "50%":  { transform: "rotate(-12deg) translateY(5px)" },
          "100%": { transform: "rotate(0deg)" }
        },
        "push-impact": {
          "0%":   { transform: "rotate(0deg)" },
          "25%":  { transform: "rotate(-20deg) translateX(-15px)" },
          "50%":  { transform: "rotate(-10deg) translateX(-8px)" },
          "100%": { transform: "rotate(0deg)" }
        },
        "home-action": {
          "0%":   { transform: "scale(1) rotate(0deg)" },
          "25%":  { transform: "scale(1.05) rotate(-2deg)" },
          "50%":  { transform: "scale(1.1) rotate(0deg) translateX(5px)" },
          "75%":  { transform: "scale(1.05) rotate(2deg)" },
          "100%": { transform: "scale(1) rotate(0deg)" }
        }
      },
      animation: {
        sway:  "sway 2s ease-in-out infinite",
        "sway-bag": "sway-bag 2.5s ease-in-out infinite",
        kick:  "kick 0.5s ease-in-out",
        punch: "punch 0.5s ease-in-out",
        push:  "push 0.5s ease-in-out",
        "punch-impact": "punch-impact 0.6s ease-out",
        "kick-impact": "kick-impact 0.6s ease-out",
        "push-impact": "push-impact 0.6s ease-out",
        "home-action": "home-action 3s ease-in-out infinite"
      }
    },
  },
  plugins: [],
}
