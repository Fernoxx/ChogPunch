// components/Chog.tsx
import React from "react"

export type ChogAnim = "idle" | "kick" | "punch" | "push"

interface Props {
  anim: ChogAnim
}

export default function Chog({ anim }: Props) {
  const cls =
    anim === "idle"
      ? "animate-sway"
      : anim === "kick"
      ? "animate-kick"
      : anim === "punch"
      ? "animate-punch"
      : "animate-push"

  return (
    <img
      src="/chog.png"
      alt="Chog Fighter"
      className={`absolute left-12 bottom-12 w-48 h-48 ${cls}`}
    />
  )
}
