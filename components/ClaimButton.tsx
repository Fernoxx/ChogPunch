import { motion } from "framer-motion"

interface ClaimButtonProps {
  onClaim: () => void
}

export default function ClaimButton({ onClaim }: ClaimButtonProps) {
  return (
    <motion.button
      onClick={onClaim}
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-4 rounded-lg shadow-2xl z-20 text-xl"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      Claim 1 MON
    </motion.button>
  )
}