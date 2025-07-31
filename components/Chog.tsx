import Image from "next/image"
import { useEffect, useState } from "react"

export type ChogAnim = "idle" | "kick" | "punch" | "push"

interface Props {
  anim: ChogAnim
}

export default function Chog({ anim }: Props) {
  return (
      <div className={
      }>
  )
}
