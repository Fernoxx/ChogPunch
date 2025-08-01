// pages/_app.tsx
import "../styles/globals.css"
import type { AppProps } from "next/app"
import { useEffect } from "react"
import { WagmiConfig, createConfig } from "wagmi"
import { base } from "wagmi/chains"
import { InjectedConnector } from "wagmi/connectors/injected"
import { createPublicClient, http } from "viem"

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    ;(async () => {
      try {
        const { sdk } = await import("@farcaster/miniapp-sdk")
        await sdk.actions.ready()
      } catch (e) {
        console.error("Farcaster SDK ready error:", e)
      }
    })()
  }, [])

  const publicClient = createPublicClient({
    chain: base,
    transport: http(process.env.NEXT_PUBLIC_ALCHEMY_URL!),
  })

  const farcasterConnector = new InjectedConnector({
    chains: [base],
    options: {
      name: "Farcaster",
      getProvider: () =>
        typeof window !== "undefined" ? (window as any).farcaster : null,
    },
  })

  const config = createConfig({
    autoConnect: true,
    publicClient,
  })

  return (
    <WagmiConfig config={config}>
      <Component {...pageProps} />
    </WagmiConfig>
  )
}
