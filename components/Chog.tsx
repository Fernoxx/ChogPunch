import Image from "next/image"
import { useEffect, useState } from "react"

export type ChogAnim = "idle" | "kick" | "punch" | "push"

interface Props {
  anim: ChogAnim
}

export default function Chog({ anim }: Props) {
  // you could swap images per anim if you have separate frames
  return (
      <div className={
      }>
        <Image
          src="/chog.png"
          alt="Chog"
          width={192}
        />
      </div>
    </div>
  )
}
