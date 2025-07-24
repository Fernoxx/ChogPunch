import { useEffect, useState } from "react"
import { useAccount, useConnect, useDisconnect } from "wagmi"
import { farcasterMiniApp } from "@farcaster/miniapp-wagmi-connector"
import { createConfig, WagmiProvider, http } from "wagmi"
import { base } from "wagmi/chains"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import Image from "next/image"

const queryClient = new QueryClient()

const config = createConfig({
  chains: [base],
  connectors: [farcasterMiniApp()],
  transports: {
    [base.id]: http(),
  },
  ssr: true,
})

export default function Page() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Main />
      </QueryClientProvider>
    </WagmiProvider>
  )
}

function Main() {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()

  const [eligible, setEligible] = useState(false)
  const [claimed, setClaimed] = useState(false)

  useEffect(() => {
    const checkEligibility = async () => {
      if (!address) return

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/health`)
      const data = await res.json()

      // simulate: use real endpoint to check if wallet is eligible
      const check = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/check-claim?address=${address}`)
      const result = await check.json()

      if (result?.eligible && !result?.alreadyClaimed) {
        setEligible(true)
      } else {
        setEligible(false)
        setClaimed(result?.alreadyClaimed)
      }
    }

    checkEligibility()
  }, [address])

  const handleClaim = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/claim`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address }),
    })

    const data = await res.json()
    if (data?.success) {
      setClaimed(true)
      alert("✅ MON sent to your wallet!")
    } else {
      alert("❌ Claim failed. Try again.")
    }
  }

  return (
    <div className="min-h-screen bg-[#f3e8ff] text-black flex flex-col items-center justify-center p-4 space-y-6">
      <h1 className="text-3xl font-bold">🥊 ChogPunch Miniapp</h1>

      {!isConnected && (
        <div className="space-y-3">
          {connectors.map((connector) => (
            <button
              key={connector.id}
              onClick={() => connect({ connector })}
              disabled={isPending}
              className="px-4 py-2 bg-purple-600 text-white rounded"
            >
              Connect with {connector.name}
            </button>
          ))}
        </div>
      )}

      {isConnected && (
        <>
          <p>Connected as {address}</p>
          <button
            onClick={() => disconnect()}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Disconnect
          </button>

          <div className="w-[180px] mt-6">
            <Image src="/chog.png" alt="Chog" width={180} height={180} />
          </div>

          {claimed ? (
            <p className="text-green-700 font-semibold">✅ MON Already Claimed</p>
          ) : eligible ? (
            <button
              onClick={handleClaim}
              className="mt-4 px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Claim 1 MON
            </button>
          ) : (
            <p className="text-gray-700">Punch the bag 20 times to be eligible</p>
          )}
        </>
      )}
    </div>
  )
}