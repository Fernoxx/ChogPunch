// components/PunchingBag.tsx
import React from "react"
import clsx from "clsx"
import { ChogAnim } from "./Chog"

interface Props {
  anim: ChogAnim
}

export default function PunchingBag({ anim }: Props) {
  const cls = clsx(
    "absolute right-12 top-20 w-32 h-64",
    {
      "animate-sway": anim === "idle",
      "animate-punch": anim === "punch",
      "animate-kick": anim === "kick",
      "animate-push": anim === "push",
    }
  )

  return <img src="/punching-bag.png" alt="Bag" className={cls} />
}
