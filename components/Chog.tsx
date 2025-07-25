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
    <div className="absolute left-12 bottom-12 w-64 h-64 select-none">
      <div className={`relative transition-all duration-300 ${
        anim === "idle" || anim === "gasping" ? "animate-sway" :
        anim === "kick" ? "animate-kick" :
        anim === "punch" ? "animate-punch" :
        anim === "push" ? "animate-push" :
        anim === "homeAnimation" ? "animate-home-action" : ""
      }`}>
        {/* Character Body */}
        <div className="relative w-full h-full">
          {/* Spiky Purple Hair */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-32 h-20">
            <div className="relative">
              {/* Hair spikes */}
              <div className="absolute top-0 left-4 w-6 h-12 bg-gradient-to-t from-purple-700 to-purple-500 transform rotate-12 rounded-t-full"></div>
              <div className="absolute top-0 left-8 w-6 h-14 bg-gradient-to-t from-purple-700 to-purple-500 transform -rotate-6 rounded-t-full"></div>
              <div className="absolute top-0 left-12 w-6 h-16 bg-gradient-to-t from-purple-700 to-purple-500 transform rotate-3 rounded-t-full"></div>
              <div className="absolute top-0 left-16 w-6 h-14 bg-gradient-to-t from-purple-700 to-purple-500 transform -rotate-12 rounded-t-full"></div>
              <div className="absolute top-0 left-20 w-6 h-12 bg-gradient-to-t from-purple-700 to-purple-500 transform rotate-8 rounded-t-full"></div>
              {/* Hair base */}
              <div className="absolute top-8 left-2 w-28 h-12 bg-gradient-to-b from-purple-600 to-purple-800 rounded-t-full"></div>
            </div>
          </div>

          {/* Head */}
          <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-gradient-to-b from-yellow-200 to-yellow-300 rounded-full border-2 border-yellow-400">
            {/* Eyes */}
            <div className="absolute top-6 left-4 w-4 h-4 bg-white rounded-full border border-black">
              <div className={`absolute top-1 left-1 w-2 h-2 bg-black rounded-full transition-all duration-200 ${
                eyeExpression === "angry" ? "top-0" :
                eyeExpression === "focused" ? "top-0.5 left-0.5" :
                eyeExpression === "tired" ? "top-1.5" :
                eyeExpression === "concentrated" ? "top-0.5" :
                eyeExpression === "confident" ? "top-1 left-1.5" : "top-1 left-1"
              }`}></div>
            </div>
            <div className="absolute top-6 right-4 w-4 h-4 bg-white rounded-full border border-black">
              <div className={`absolute top-1 left-1 w-2 h-2 bg-black rounded-full transition-all duration-200 ${
                eyeExpression === "angry" ? "top-0" :
                eyeExpression === "focused" ? "top-0.5 left-0.5" :
                eyeExpression === "tired" ? "top-1.5" :
                eyeExpression === "concentrated" ? "top-0.5" :
                eyeExpression === "confident" ? "top-1 left-1.5" : "top-1 left-1"
              }`}></div>
            </div>

            {/* Red cheeks */}
            <div className="absolute top-8 left-1 w-3 h-3 bg-red-400 rounded-full opacity-70"></div>
            <div className="absolute top-8 right-1 w-3 h-3 bg-red-400 rounded-full opacity-70"></div>

            {/* Mouth */}
            <div className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 transition-all duration-200 ${
              mouthExpression === "determined" ? "w-2 h-1 bg-black rounded-full" :
              mouthExpression === "gritting" ? "w-3 h-0.5 bg-black" :
              mouthExpression === "effort" ? "w-4 h-2 bg-black rounded-full" :
              mouthExpression === "breathing" ? "w-3 h-3 bg-black rounded-full" :
              mouthExpression === "smiling" ? "w-4 h-1 bg-black rounded-b-full" :
              "w-2 h-1 bg-black rounded-full"
            }`}></div>
          </div>

          {/* Orange CHOG GYM Shirt */}
          <div className="absolute top-32 left-1/2 transform -translate-x-1/2 w-28 h-20 bg-gradient-to-b from-orange-400 to-orange-600 rounded-lg border-2 border-orange-500">
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-xs font-bold text-white drop-shadow">
              CHOG
            </div>
            <div className="absolute top-5 left-1/2 transform -translate-x-1/2 text-xs font-bold text-white drop-shadow">
              GYM
            </div>
          </div>

          {/* Arms */}
          <div className="absolute top-36 left-2 w-6 h-16 bg-gradient-to-b from-yellow-200 to-yellow-300 rounded-full border border-yellow-400"></div>
          <div className="absolute top-36 right-2 w-6 h-16 bg-gradient-to-b from-yellow-200 to-yellow-300 rounded-full border border-yellow-400"></div>

          {/* Pink Boxing Gloves */}
          <div className={`absolute top-48 left-0 w-8 h-8 bg-gradient-to-b from-pink-400 to-pink-600 rounded-full border-2 border-pink-500 transition-transform duration-300 ${
            anim === "punch" ? "transform scale-125 translate-x-4" :
            anim === "push" ? "transform -translate-x-2" : ""
          }`}>
            <div className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full opacity-60"></div>
          </div>
          <div className={`absolute top-48 right-0 w-8 h-8 bg-gradient-to-b from-pink-400 to-pink-600 rounded-full border-2 border-pink-500 transition-transform duration-300 ${
            anim === "punch" ? "transform scale-125 translate-x-4" :
            anim === "kick" ? "transform -translate-y-2" : ""
          }`}>
            <div className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full opacity-60"></div>
          </div>

          {/* Black Shorts */}
          <div className="absolute top-52 left-1/2 transform -translate-x-1/2 w-20 h-12 bg-gradient-to-b from-gray-800 to-black rounded-lg border border-gray-700"></div>

          {/* Legs */}
          <div className="absolute top-64 left-6 w-5 h-12 bg-gradient-to-b from-yellow-200 to-yellow-300 rounded-full border border-yellow-400"></div>
          <div className={`absolute top-64 right-6 w-5 h-12 bg-gradient-to-b from-yellow-200 to-yellow-300 rounded-full border border-yellow-400 transition-transform duration-300 ${
            anim === "kick" ? "transform -rotate-45 -translate-y-4 translate-x-8" : ""
          }`}></div>

          {/* Pink Boxing Shoes */}
          <div className="absolute bottom-0 left-4 w-6 h-4 bg-gradient-to-b from-pink-400 to-pink-600 rounded-lg border border-pink-500"></div>
          <div className={`absolute bottom-0 right-4 w-6 h-4 bg-gradient-to-b from-pink-400 to-pink-600 rounded-lg border border-pink-500 transition-transform duration-300 ${
            anim === "kick" ? "transform -translate-y-8 translate-x-8" : ""
          }`}></div>
        </div>
      </div>
    </div>
  )
}
