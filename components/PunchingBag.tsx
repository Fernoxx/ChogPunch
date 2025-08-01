import Image from "next/image"
import { ChogAnim } from "./Chog"
import clsx from "clsx"

interface Props {
  anim: ChogAnim
}

export default function PunchingBag({ anim }: Props) {
  return (
    <div className="absolute right-12 top-20 w-32 h-64">
      <div className={clsx(
        anim === "idle"   && "animate-sway",
        anim === "punch"  && "animate-punch",
        anim === "kick"   && "animate-kick",
        anim === "push"   && "animate-push"
      )}>
        <Image
          src="/punching-bag.png"
          alt="Punching Bag"
          width={128}
          height={256}
        />
      </div>
    </div>
  )
}
