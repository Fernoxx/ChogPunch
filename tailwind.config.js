/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      keyframes: {
        // Character Animations - Shadow Fight Style
        "chog-idle": {
          "0%, 100%": { 
            transform: "translateY(0) scale(1)" 
          },
          "50%": { 
            transform: "translateY(-2px) scale(1.01)" 
          }
        },
        "chog-punch": {
          "0%": { 
            transform: "translateX(0) rotate(0deg) scale(1)" 
          },
          "20%": { 
            transform: "translateX(-5px) rotate(-2deg) scale(1.05)" 
          },
          "50%": { 
            transform: "translateX(15px) rotate(3deg) scale(1.15)" 
          },
          "70%": { 
            transform: "translateX(12px) rotate(2deg) scale(1.1)" 
          },
          "100%": { 
            transform: "translateX(0) rotate(0deg) scale(1)" 
          }
        },
        "chog-kick": {
          "0%": { 
            transform: "translateY(0) rotate(0deg) scale(1)" 
          },
          "30%": { 
            transform: "translateY(-8px) rotate(-5deg) scale(1.1)" 
          },
          "60%": { 
            transform: "translateY(-4px) rotate(8deg) scale(1.15)" 
          },
          "80%": { 
            transform: "translateY(-2px) rotate(3deg) scale(1.05)" 
          },
          "100%": { 
            transform: "translateY(0) rotate(0deg) scale(1)" 
          }
        },
        "chog-push": {
          "0%": { 
            transform: "translateX(0) scale(1)" 
          },
          "25%": { 
            transform: "translateX(-8px) scale(1.08)" 
          },
          "50%": { 
            transform: "translateX(10px) scale(1.12)" 
          },
          "75%": { 
            transform: "translateX(5px) scale(1.05)" 
          },
          "100%": { 
            transform: "translateX(0) scale(1)" 
          }
        },

        // Punching Bag Animations
        "bag-idle": {
          "0%, 100%": { 
            transform: "rotate(0deg) translateY(0)" 
          },
          "50%": { 
            transform: "rotate(1deg) translateY(-1px)" 
          }
        },
        "bag-punch": {
          "0%": { 
            transform: "rotate(0deg) scale(1)" 
          },
          "30%": { 
            transform: "rotate(-8deg) scale(0.98)" 
          },
          "60%": { 
            transform: "rotate(-12deg) scale(0.95)" 
          },
          "80%": { 
            transform: "rotate(-6deg) scale(0.97)" 
          },
          "100%": { 
            transform: "rotate(0deg) scale(1)" 
          }
        },
        "bag-kick": {
          "0%": { 
            transform: "rotate(0deg) translateY(0) scale(1)" 
          },
          "40%": { 
            transform: "rotate(-15deg) translateY(3px) scale(0.92)" 
          },
          "70%": { 
            transform: "rotate(-20deg) translateY(5px) scale(0.88)" 
          },
          "90%": { 
            transform: "rotate(-8deg) translateY(2px) scale(0.95)" 
          },
          "100%": { 
            transform: "rotate(0deg) translateY(0) scale(1)" 
          }
        },
        "bag-push": {
          "0%": { 
            transform: "rotate(0deg) translateX(0)" 
          },
          "50%": { 
            transform: "rotate(-25deg) translateX(8px)" 
          },
          "80%": { 
            transform: "rotate(-15deg) translateX(4px)" 
          },
          "100%": { 
            transform: "rotate(0deg) translateX(0)" 
          }
        },

        // Impact and Particle Effects
        "impact-burst": {
          "0%": { 
            transform: "scale(0) rotate(0deg)", 
            opacity: "1" 
          },
          "50%": { 
            transform: "scale(1.5) rotate(180deg)", 
            opacity: "0.8" 
          },
          "100%": { 
            transform: "scale(2) rotate(360deg)", 
            opacity: "0" 
          }
        },
        "particle-1": {
          "0%": { 
            transform: "translate(0, 0) scale(1)", 
            opacity: "1" 
          },
          "100%": { 
            transform: "translate(-20px, -15px) scale(0)", 
            opacity: "0" 
          }
        },
        "particle-2": {
          "0%": { 
            transform: "translate(0, 0) scale(1)", 
            opacity: "1" 
          },
          "100%": { 
            transform: "translate(-15px, -25px) scale(0)", 
            opacity: "0" 
          }
        },
        "particle-3": {
          "0%": { 
            transform: "translate(0, 0) scale(1)", 
            opacity: "1" 
          },
          "100%": { 
            transform: "translate(-25px, -10px) scale(0)", 
            opacity: "0" 
          }
        },
        "shockwave": {
          "0%": { 
            transform: "scaleX(0) scaleY(1)", 
            opacity: "1" 
          },
          "50%": { 
            transform: "scaleX(2) scaleY(0.5)", 
            opacity: "0.6" 
          },
          "100%": { 
            transform: "scaleX(4) scaleY(0.2)", 
            opacity: "0" 
          }
        },
        "ring-1": {
          "0%": { 
            transform: "scale(0)", 
            opacity: "1" 
          },
          "100%": { 
            transform: "scale(2)", 
            opacity: "0" 
          }
        },
        "ring-2": {
          "0%": { 
            transform: "scale(0)", 
            opacity: "0.7" 
          },
          "100%": { 
            transform: "scale(3)", 
            opacity: "0" 
          }
        },
        "power-up": {
          "0%": { 
            transform: "translateY(0) scale(0.8)", 
            opacity: "1" 
          },
          "50%": { 
            transform: "translateY(-10px) scale(1.2)", 
            opacity: "0.8" 
          },
          "100%": { 
            transform: "translateY(-20px) scale(0.6)", 
            opacity: "0" 
          }
        }
      },
      animation: {
        // Character Animations
        "chog-idle": "chog-idle 3s ease-in-out infinite",
        "chog-punch": "chog-punch 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        "chog-kick": "chog-kick 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        "chog-push": "chog-push 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",

        // Bag Animations
        "bag-idle": "bag-idle 4s ease-in-out infinite",
        "bag-punch": "bag-punch 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        "bag-kick": "bag-kick 1s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        "bag-push": "bag-push 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55)",

        // Effect Animations
        "impact-burst": "impact-burst 0.4s ease-out",
        "particle-1": "particle-1 0.6s ease-out",
        "particle-2": "particle-2 0.7s ease-out 0.1s",
        "particle-3": "particle-3 0.5s ease-out 0.2s",
        "shockwave": "shockwave 0.6s ease-out",
        "ring-1": "ring-1 0.8s ease-out",
        "ring-2": "ring-2 1s ease-out 0.2s",
        "power-up": "power-up 0.6s ease-out"
      }
    },
  },
  plugins: [],
}
