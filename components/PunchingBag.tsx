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
        />
