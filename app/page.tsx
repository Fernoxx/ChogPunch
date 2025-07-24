'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { farcasterMiniApp } from "@farcaster/miniapp-wagmi-connector"
import { WagmiProvider, createConfig, http } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { base } from 'wagmi/chains'

import ClaimButton from '@/components/ClaimButton'
import PunchingBag from '@/components/PunchingBag'

const config = createConfig({
  chains: [base],
  connectors: [farcasterMiniApp()],
  transports: {
    [base.id]: http(),
  },
  ssr: true,
})

const queryClient = new QueryClient()

export default function Home() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <main className="flex flex-col items-center justify-center min-h-screen p-4">
          <h1 className="text-4xl font-bold mb-8 text-purple-800">🥊 ChogPunch</h1>
          <PunchingBag />
          <div className="mt-6">
            <ClaimButton />
          </div>
          
          {/* Instructions */}
          <div className="mt-8 text-center max-w-md">
            <h2 className="text-lg font-bold text-purple-800 mb-2">How to Play</h2>
            <p className="text-purple-600 text-sm">
              Hit the punching bag 20 times using Punch, Kick, or Push moves. 
              Once you reach 20 hits, you can claim 1 MON token (limited to first 100 players).
            </p>
          </div>
        </main>
      </QueryClientProvider>
    </WagmiProvider>
  )
}