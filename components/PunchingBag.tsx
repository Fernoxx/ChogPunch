import { ChogAnim } from "./Chog"
import clsx from "clsx"
import { useEffect, useState } from "react"

interface Props {
  anim: ChogAnim
}

export default function PunchingBag({ anim }: Props) {
  const [isHit, setIsHit] = useState(false)

  useEffect(() => {
    if (anim !== "idle") {
      setIsHit(true)
      const timer = setTimeout(() => {
        setIsHit(false)
      }, 600)
      return () => clearTimeout(timer)
    }
  }, [anim])

  return (
    <div className="absolute right-16 top-20 w-24 h-80 z-10">
      {/* Punching Bag Chain */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-8 bg-gray-600"></div>
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-500 rounded-full"></div>
      
      {/* Punching Bag Body */}
      <div className={clsx(
        "relative w-24 h-72 mt-10 transition-all duration-300 ease-out",
        anim === "idle" && "animate-bag-idle",
        anim === "punch" && "animate-bag-punch",
        anim === "kick" && "animate-bag-kick", 
        anim === "push" && "animate-bag-push"
      )}>
        {/* Main Bag Body */}
        <div className="w-full h-full bg-gradient-to-b from-red-600 via-red-700 to-red-800 rounded-t-xl rounded-b-lg shadow-2xl relative overflow-hidden">
          {/* Bag Texture Lines */}
          <div className="absolute top-4 left-0 w-full h-px bg-red-500 opacity-50"></div>
          <div className="absolute top-8 left-0 w-full h-px bg-red-500 opacity-50"></div>
          <div className="absolute top-12 left-0 w-full h-px bg-red-500 opacity-50"></div>
          <div className="absolute bottom-8 left-0 w-full h-px bg-red-500 opacity-50"></div>
          <div className="absolute bottom-4 left-0 w-full h-px bg-red-500 opacity-50"></div>
          
          {/* Bag Highlight */}
          <div className="absolute top-0 left-2 w-4 h-full bg-gradient-to-r from-red-400 to-transparent opacity-30 rounded-tl-xl"></div>
          
          {/* Impact Effect */}
          {isHit && (
            <div className={clsx(
              "absolute inset-0 rounded-xl transition-all duration-200",
              anim === "punch" && "bg-yellow-300 opacity-20",
              anim === "kick" && "bg-red-300 opacity-20", 
              anim === "push" && "bg-blue-300 opacity-20"
            )}></div>
          )}
        </div>

        {/* Bag Bottom Cap */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-6 bg-red-900 rounded-full"></div>
      </div>

      {/* Impact Particles */}
      {anim === "punch" && (
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2">
          <div className="animate-particles">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-particle-1"></div>
            <div className="w-1 h-1 bg-yellow-300 rounded-full animate-particle-2"></div>
            <div className="w-1 h-1 bg-orange-400 rounded-full animate-particle-3"></div>
          </div>
        </div>
      )}

      {anim === "kick" && (
        <div className="absolute left-0 bottom-1/3">
          <div className="animate-particles">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-particle-1"></div>
            <div className="w-1 h-1 bg-red-300 rounded-full animate-particle-2"></div>
            <div className="w-1 h-1 bg-pink-400 rounded-full animate-particle-3"></div>
          </div>
        </div>
      )}

      {anim === "push" && (
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2">
          <div className="animate-shockwave-rings">
            <div className="w-8 h-8 border-2 border-blue-400 rounded-full animate-ring-1"></div>
            <div className="w-12 h-12 border border-blue-300 rounded-full animate-ring-2"></div>
          </div>
        </div>
      )}

      {/* Bag Shadow */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-4 w-16 h-4 bg-black opacity-20 rounded-full blur-sm"></div>
    </div>
  )
}
