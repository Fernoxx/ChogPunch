// pages/index.tsx
import { useEffect, useState } from "react"
import { PlatformerGame } from "../components/PlatformerGame"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

export default function Home() {
  const [stage, setSt
  useEffect(() => {
    
      {/* Home Screen */}
      <AnimatePresence>
        {stage === "home" && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-center">
      </AnimatePresence>

      {/* Game Screen */}
      {stage === "play" && (
        <PlatformerGame />
      )}
    </div>
  )
}
