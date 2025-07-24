import Image from "next/image"
import { useEffect, useState } from "react"

export default function ChogFighter({ hits }: { hits: number }) {
  const [animation, setAnimation] = useState("animate-sway")

  useEffect(() => {
    if (hits === 0) return
    const types = ["animate-kick", "animate-punch", "animate-push"]
    const chosen = types[hits % types.length]
    setAnimation(chosen)
    const timer = setTimeout(() => setAnimation("animate-sway"), 800)
    return () => clearTimeout(timer)
  }, [hits])

  return (
    <div className={`absolute bottom-12 left-10 w-48 h-48 ${animation}`}>
      <Image src="/chog.png" alt="Chog Fighter" width={192} height={192} priority />
    </div>
  )
}
