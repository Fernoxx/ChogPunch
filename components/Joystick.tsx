// components/Joystick.tsx
import React, { useState } from "react"

interface Props {
  onDirection: (dir: "kick" | "punch" | "push") => void
}

export default function Joystick({ onDirection }: Props) {
  const [pos, setPos] = useState({ x: 0, y: 0 })

  const handleMove = (e: React.TouchEvent) => {
    const rc = e.currentTarget.getBoundingClientRect()
    const touch = e.touches[0]
    const x = touch.clientX - rc.left - rc.width / 2
    const y = touch.clientY - rc.top - rc.height / 2
    setPos({ x, y })

    const angle = (Math.atan2(y, x) * 180) / Math.PI
    if (angle >= -135 && angle <= -45) {
      onDirection("kick")
    } else if (angle <= -135 || angle >= 135) {
      onDirection("push")
    } else if (angle >= -45 && angle <= 45) {
      onDirection("punch")
    }
  }

  const handleEnd = () => setPos({ x: 0, y: 0 })

  return (
    <div className="absolute bottom-16 right-16 w-32 h-32 bg-black/20 rounded-full">
      <div
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
        className="w-16 h-16 bg-white rounded-full absolute"
        style={{
          transform: `translate(${pos.x}px, ${pos.y}px)`,
        }}
      />
    </div>
  )
}
