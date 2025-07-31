import Image from "next/image"
import { useEffect, useState } from "react"

export type ChogAnim = "idle" | "kick" | "punch" | "push"

interface Props {
  anim: ChogAnim
}

export default function Chog({ anim }: Props) {
  // you could swap images per anim if you have separate frames
  return (
    <div className="absolute left-12 bottom-12 w-48 h-48">
      <div className={
        anim === "idle"  ? "animate-sway" :
        anim === "kick"  ? "animate-kick" :
        anim === "punch" ? "animate-punch" :
        "animate-push"
      }>
        <Image
          src="/chog.png"
          alt="Chog"
          width={192}
          height={192}
          priority
        />
      </div>
    </div>
  )
}

