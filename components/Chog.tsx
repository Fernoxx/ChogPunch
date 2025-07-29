import Image from "next/image"
import { useEffect, useState } from "react"

export type ChogAnim = "idle" | "kick" | "punch" | "push"

interface Props {
  anim: ChogAnim
}

export default function Chog({ anim }: Props) {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (anim !== "idle") {
      setIsAnimating(true)
      const timer = setTimeout(() => {
        setIsAnimating(false)
      }, 600)
      return () => clearTimeout(timer)
    }
  }, [anim])

  return (
    <div className="absolute left-16 bottom-32 w-56 h-56 z-10">
      {/* Character Shadow */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-6 bg-black opacity-30 rounded-full blur-sm"></div>
      
      {/* Character Container with Physics */}
      <div className={`
        relative w-full h-full transition-all duration-150 ease-out
        ${anim === "idle" ? "animate-chog-idle" : ""}
        ${anim === "kick" ? "animate-chog-kick" : ""}
        ${anim === "punch" ? "animate-chog-punch" : ""}
        ${anim === "push" ? "animate-chog-push" : ""}
      `}>
        {/* Fighting Stance Adjustment */}
        <div className={`
          w-full h-full transition-transform duration-200
          ${isAnimating ? "transform scale-105" : ""}
        `}>
          <Image
            src="/chog.png"
            alt="Chog Fighter"
            width={224}
            height={224}
            priority
            className="object-contain"
            style={{
              filter: isAnimating ? "brightness(1.1) contrast(1.1)" : "none"
            }}
          />
        </div>

        {/* Impact Effects */}
        {anim === "punch" && (
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
            <div className="animate-impact-burst w-8 h-8 bg-yellow-400 rounded-full opacity-80"></div>
          </div>
        )}
        
        {anim === "kick" && (
          <div className="absolute right-2 bottom-1/3">
            <div className="animate-impact-burst w-6 h-6 bg-red-400 rounded-full opacity-80"></div>
          </div>
        )}

        {anim === "push" && (
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
            <div className="animate-shockwave w-12 h-2 bg-blue-400 rounded-full opacity-60"></div>
          </div>
        )}
      </div>

      {/* Power Indicator */}
      {isAnimating && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className="animate-power-up text-yellow-300 font-bold text-sm">
            {anim === "punch" ? "PUNCH!" : anim === "kick" ? "KICK!" : "PUSH!"}
          </div>
        </div>
      )}
    </div>
  )
}
