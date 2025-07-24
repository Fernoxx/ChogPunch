// components/ui/ChogFighter.tsx
import { useState } from "react"
import Image from "next/image"

type Props = {
  hits: number
  onPunch: () => void
}

export default function ChogFighter({ hits, onPunch }: Props) {
  const [anim, setAnim] = useState<"idle" | "punch" | "kick" | "push">("idle")

  const handleAction = (type: "punch" | "kick" | "push") => {
    setAnim(type)
    onPunch()
    setTimeout(() => setAnim("idle"), 500)
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <Image
        src={`/chog-${anim}.png`}
        alt="Chog Animation"
        width={240}
        height={240}
        priority
      />
      <div className="grid grid-cols-3 gap-3">
        <button onClick={() => handleAction("punch")} className="bg-red-500 px-4 py-2 rounded text-white">
          Punch
        </button>
        <button onClick={() => handleAction("kick")} className="bg-blue-500 px-4 py-2 rounded text-white">
          Kick
        </button>
        <button onClick={() => handleAction("push")} className="bg-purple-500 px-4 py-2 rounded text-white">
          Push
        </button>
      </div>
    </div>
  )
}