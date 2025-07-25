import { useEffect, useState } from "react"

export type ChogAnim = "idle" | "kick" | "punch" | "push" | "gasping" | "homeAnimation"

interface Props {
  anim: ChogAnim
}

export default function Chog({ anim }: Props) {
  const [eyeExpression, setEyeExpression] = useState("normal")
  const [mouthExpression, setMouthExpression] = useState("neutral")

  useEffect(() => {
    switch (anim) {
      case "kick":
        setEyeExpression("focused")
        setMouthExpression("determined")
        break
      case "punch":
        setEyeExpression("angry")
        setMouthExpression("gritting")
        break
      case "push":
        setEyeExpression("concentrated")
        setMouthExpression("effort")
        break
      case "gasping":
        setEyeExpression("tired")
        setMouthExpression("breathing")
        break
      case "homeAnimation":
        setEyeExpression("confident")
        setMouthExpression("smiling")
        break
      default:
        setEyeExpression("normal")
        setMouthExpression("neutral")
    }
  }, [anim])

  return (
    <div className="absolute left-12 bottom-12 w-48 h-64 select-none">
      <div className={`relative transition-all duration-300 ${
        anim === "idle" || anim === "gasping" ? "animate-sway" :
        anim === "kick" ? "animate-kick" :
        anim === "punch" ? "animate-punch" :
        anim === "push" ? "animate-push" :
        anim === "homeAnimation" ? "animate-home-action" : ""
      }`}>
        
        {/* CHOG Fighter Character */}
        <div className="relative w-full h-full">
          
          {/* Body Base */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-40 bg-gradient-to-b from-orange-400 via-orange-500 to-orange-600 rounded-t-3xl border-4 border-orange-700 shadow-2xl">
            
            {/* CHOG GYM Text on Shirt */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
              <div className="text-white font-black text-xs tracking-wider drop-shadow-lg">CHOG</div>
              <div className="text-white font-black text-xs tracking-wider drop-shadow-lg -mt-1">GYM</div>
            </div>
            
            {/* Muscle Definition */}
            <div className="absolute top-8 left-2 w-4 h-6 bg-orange-600 rounded-full opacity-40"></div>
            <div className="absolute top-8 right-2 w-4 h-6 bg-orange-600 rounded-full opacity-40"></div>
          </div>

          {/* Head */}
          <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-gradient-to-b from-yellow-200 to-yellow-300 rounded-full border-4 border-yellow-400 shadow-xl relative">
            
            {/* Spiky Hair */}
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-24 h-16">
              {/* Individual Hair Spikes */}
              <div className="absolute top-0 left-2 w-3 h-8 bg-gradient-to-t from-purple-800 to-purple-400 transform rotate-12 rounded-t-full border border-purple-900"></div>
              <div className="absolute top-0 left-5 w-3 h-10 bg-gradient-to-t from-purple-800 to-purple-400 transform -rotate-6 rounded-t-full border border-purple-900"></div>
              <div className="absolute top-0 left-8 w-3 h-12 bg-gradient-to-t from-purple-800 to-purple-400 transform rotate-3 rounded-t-full border border-purple-900"></div>
              <div className="absolute top-0 left-11 w-3 h-10 bg-gradient-to-t from-purple-800 to-purple-400 transform -rotate-12 rounded-t-full border border-purple-900"></div>
              <div className="absolute top-0 left-14 w-3 h-8 bg-gradient-to-t from-purple-800 to-purple-400 transform rotate-8 rounded-t-full border border-purple-900"></div>
              <div className="absolute top-0 left-17 w-3 h-9 bg-gradient-to-t from-purple-800 to-purple-400 transform -rotate-3 rounded-t-full border border-purple-900"></div>
            </div>

            {/* Eyes */}
            <div className="absolute top-4 left-3 w-3 h-3 bg-white rounded-full border border-black">
              <div className={`absolute w-2 h-2 bg-black rounded-full transition-all duration-200 ${
                eyeExpression === "angry" ? "top-0 left-0" :
                eyeExpression === "focused" ? "top-0 left-1" :
                eyeExpression === "tired" ? "top-1 left-0.5" :
                eyeExpression === "concentrated" ? "top-0 left-0.5" :
                eyeExpression === "confident" ? "top-0.5 left-1" : "top-0.5 left-0.5"
              }`}></div>
            </div>
            <div className="absolute top-4 right-3 w-3 h-3 bg-white rounded-full border border-black">
              <div className={`absolute w-2 h-2 bg-black rounded-full transition-all duration-200 ${
                eyeExpression === "angry" ? "top-0 right-0" :
                eyeExpression === "focused" ? "top-0 right-1" :
                eyeExpression === "tired" ? "top-1 right-0.5" :
                eyeExpression === "concentrated" ? "top-0 right-0.5" :
                eyeExpression === "confident" ? "top-0.5 right-1" : "top-0.5 right-0.5"
              }`}></div>
            </div>

            {/* Eyebrows */}
            <div className={`absolute top-2 left-2 w-4 h-1 bg-purple-900 transform transition-all duration-200 ${
              eyeExpression === "angry" ? "-rotate-12" :
              eyeExpression === "focused" ? "-rotate-6" :
              eyeExpression === "concentrated" ? "-rotate-3" : "rotate-0"
            }`}></div>
            <div className={`absolute top-2 right-2 w-4 h-1 bg-purple-900 transform transition-all duration-200 ${
              eyeExpression === "angry" ? "rotate-12" :
              eyeExpression === "focused" ? "rotate-6" :
              eyeExpression === "concentrated" ? "rotate-3" : "rotate-0"
            }`}></div>

            {/* Red Cheeks */}
            <div className="absolute top-6 left-0 w-3 h-3 bg-red-400 rounded-full opacity-60"></div>
            <div className="absolute top-6 right-0 w-3 h-3 bg-red-400 rounded-full opacity-60"></div>

            {/* Mouth */}
            <div className={`absolute bottom-3 left-1/2 transform -translate-x-1/2 transition-all duration-200 border-2 border-black ${
              mouthExpression === "determined" ? "w-2 h-1 bg-black rounded-full" :
              mouthExpression === "gritting" ? "w-4 h-1 bg-black" :
              mouthExpression === "effort" ? "w-4 h-3 bg-red-800 rounded-full" :
              mouthExpression === "breathing" ? "w-3 h-4 bg-red-600 rounded-full" :
              mouthExpression === "smiling" ? "w-5 h-2 bg-red-600 rounded-b-full border-t-0" :
              "w-2 h-1 bg-black rounded-full"
            }`}></div>
          </div>

          {/* Arms */}
          <div className="absolute bottom-24 left-4 w-5 h-16 bg-gradient-to-b from-yellow-200 to-yellow-300 rounded-full border-2 border-yellow-400 shadow-lg"></div>
          <div className="absolute bottom-24 right-4 w-5 h-16 bg-gradient-to-b from-yellow-200 to-yellow-300 rounded-full border-2 border-yellow-400 shadow-lg"></div>

          {/* Boxing Gloves */}
          <div className={`absolute bottom-16 left-2 w-8 h-8 bg-gradient-to-b from-pink-400 to-pink-600 rounded-full border-3 border-pink-700 shadow-xl transition-transform duration-300 ${
            anim === "punch" ? "transform scale-125 translate-x-4" :
            anim === "push" ? "transform -translate-x-2 scale-110" : ""
          }`}>
            <div className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full opacity-80"></div>
            <div className="absolute bottom-1 right-1 w-1 h-1 bg-pink-800 rounded-full"></div>
          </div>
          <div className={`absolute bottom-16 right-2 w-8 h-8 bg-gradient-to-b from-pink-400 to-pink-600 rounded-full border-3 border-pink-700 shadow-xl transition-transform duration-300 ${
            anim === "punch" ? "transform scale-125 translate-x-4" :
            anim === "kick" ? "transform -translate-y-2 scale-110" : ""
          }`}>
            <div className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full opacity-80"></div>
            <div className="absolute bottom-1 right-1 w-1 h-1 bg-pink-800 rounded-full"></div>
          </div>

          {/* Legs */}
          <div className="absolute bottom-8 left-6 w-4 h-12 bg-gradient-to-b from-yellow-200 to-yellow-300 rounded-full border-2 border-yellow-400 shadow-lg"></div>
          <div className={`absolute bottom-8 right-6 w-4 h-12 bg-gradient-to-b from-yellow-200 to-yellow-300 rounded-full border-2 border-yellow-400 shadow-lg transition-transform duration-300 ${
            anim === "kick" ? "transform -rotate-45 -translate-y-4 translate-x-6 scale-110" : ""
          }`}></div>

          {/* Boxing Shoes */}
          <div className="absolute bottom-0 left-4 w-6 h-4 bg-gradient-to-b from-pink-400 to-pink-600 rounded-lg border-2 border-pink-700 shadow-lg"></div>
          <div className={`absolute bottom-0 right-4 w-6 h-4 bg-gradient-to-b from-pink-400 to-pink-600 rounded-lg border-2 border-pink-700 shadow-lg transition-transform duration-300 ${
            anim === "kick" ? "transform -translate-y-6 translate-x-6 scale-110" : ""
          }`}></div>

          {/* Power Aura Effect for home animation */}
          {anim === "homeAnimation" && (
            <div className="absolute inset-0 border-4 border-yellow-400 rounded-full opacity-30 animate-pulse"></div>
          )}

          {/* Sweat Drops */}
          {anim === "gasping" && (
            <>
              <div className="absolute top-16 left-8 w-1 h-2 bg-blue-300 rounded-full opacity-80 animate-bounce"></div>
              <div className="absolute top-18 right-10 w-1 h-2 bg-blue-300 rounded-full opacity-80 animate-bounce delay-100"></div>
            </>
          )}

        </div>
      </div>
    </div>
  )
}
